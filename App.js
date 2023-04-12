import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Image,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Accelerometer, Gyroscope, Magnetometer } from "expo-sensors";
import HomeScreen from "./screens/home";
import Navbar from "./navbar";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const navigation = createStackNavigator();

// External style. This came with the template but I tend not to use it.
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
  },

  row: {
    flexDirection: "row",
  },

  column: {
    flexDirection: "column",
    width: "auto",
    height: "90%",
  },

  cell: {
    flex: 1,
    alignItems: "center",
    borderRadius: 20,
    aspectRatio: 1,
    borderWidth: 10,
    borderColor: "#1e1e1e",
    backgroundColor: "#575757",
    color: "white",
    position: "relative",
  },

  logo: {
    width: 400,
    height: 400,
  },

  icon: {
    width: 40,
    height: 40,
  },

  screen: {
    backgroundColor: "#1e1e1e",
  },

  golf_ball_icon: {
    width: 60,
    height: 60,
    transform: [{ rotate: "30deg" }],
  },

  appName: {
    position: "relative",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 40,
    lineHeight: 48,
    textAlign: "center",
    paddingTop: 5,
    color: "#2F9E44",
  },
});

function TrackerScreen({ navigation }) {
  // useState sets a variable that is tracked by React. When a state variable is changed the app rerenders
  // to update a state variable use the set state function, NOT "=" operator as this might cause issues
  // For example to update pressVal write setPressVal(123) instead of pressVal = 123
  // the value in the useState declerations below are the values given at the start of the app
  const [pressVal, setPressVal] = useState(0);
  const [scaleVal, setScaleVal] = useState(2);

  const [gyroscopeData, setGyroscopeData] = useState({});
  const [accelerometerData, setAccelerometerData] = useState({});
  const [magnetometerData, setMagnetometerData] = useState({});
  const [orientation, setOrientation] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    Accelerometer.setUpdateInterval(16);
    Gyroscope.setUpdateInterval(16);
    Magnetometer.setUpdateInterval(16);
    return () => {
      _unsubscribe();
    };
  }, []);

  const _subscribe = () => {
    setSubscription(true);
    console.log("HELLO");
    Gyroscope.addListener((gyroscopeData) => {
      setGyroscopeData(gyroscopeData);
    });

    Accelerometer.addListener((accelerometerData) => {
      setAccelerometerData(accelerometerData);
    });

    Magnetometer.addListener((magnetometerData) => {
      setMagnetometerData(magnetometerData);
    });
  };

  const _unsubscribe = () => {
    setSubscription(false);
    Gyroscope.removeAllListeners();
    Accelerometer.removeAllListeners();
    Magnetometer.removeAllListeners();
  };

  useEffect(() => {
    const { x: gx, y: gy, z: gz } = gyroscopeData;
    const { x: ax, y: ay, z: az } = accelerometerData;
    const { x: mx, y: my, z: mz } = magnetometerData;
    if (gx && gy && gz && ax && ay && az && mx && my && mz) {
      const orientation = calculateOrientation(
        ax,
        ay,
        az,
        gx,
        gy,
        gz,
        mx,
        my,
        mz
      );

      setOrientation(orientation);
      //console.log(orientation);
    }
  }, [gyroscopeData, accelerometerData, magnetometerData]);

  const calculateOrientation = (ax, ay, az, gx, gy, gz, mx, my, mz) => {
    const pitch = Math.atan2(ax, Math.sqrt(ay * ay + az * az));
    const roll = Math.atan2(ay, Math.sqrt(ax * ax + az * az));
    let heading = Math.atan2(-my, mx);
    const declination = 0.22; // declination at my location
    heading += declination;

    let x = gx * 0.1 + orientation.x;
    let y = gy * 0.1 + orientation.y;
    let z = gz * 0.1 + orientation.z;

    const norm = Math.sqrt(x * x + y * y + z * z);
    x /= norm;
    y /= norm;
    z /= norm;

    const quaternion = calculateQuaternion(pitch, roll, heading);
    const rotated = rotateVector(
      x,
      y,
      z,
      quaternion[0],
      quaternion[1],
      quaternion[2],
      quaternion[3]
    );

    return {
      x: rotated[0],
      y: rotated[1],
      z: rotated[2],
    };
  };

  const calculateQuaternion = (pitch, roll, heading) => {
    const cy = Math.cos(heading * 0.5);
    const sy = Math.sin(heading * 0.5);
    const cp = Math.cos(pitch * 0.5);
    const sp = Math.sin(pitch * 0.5);
    const cr = Math.cos(roll * 0.5);
    const sr = Math.sin(roll * 0.5);

    const qw = cy * cp * cr + sy * sp * sr;
    const qx = cy * cp * sr - sy * sp * cr;
    const qy = sy * cp * sr + cy * sp * cr;
    const qz = sy * cp * cr - cy * sp * sr;

    return [qw, qx, qy, qz];
  };

  const rotateVector = (x, y, z, qw, qx, qy, qz) => {
    // Create a quaternion from the vector
    const vq = [0, x, y, z];

    // Calculate the conjugate of the quaternion
    const cq = [qw, -qx, -qy, -qz];

    // Multiply the quaternion and the vector
    const vqRotated = multiplyQuaternions(
      multiplyQuaternions([qw, qx, qy, qz], vq),
      cq
    );

    // Extract the x, y, and z components of the rotated vector
    const [_, xRotated, yRotated, zRotated] = vqRotated;

    return [xRotated, yRotated, zRotated];
  };

  // Helper function to multiply two quaternions
  const multiplyQuaternions = ([w1, x1, y1, z1], [w2, x2, y2, z2]) => [
    w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
    w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
    w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
    w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2,
  ];

  const imageStyle = StyleSheet.create({
    image: {
      position: "absolute",
      width: "100%",
      aspectRatio: 1,
      resizeMode: "contain",
      opacity: pressVal,
    },
  });

  // This section, from counter to not pressing down is just a visual effect when holding the button
  let counter = 0;
  let timerinterval = useRef(null);

  const timer = (start) => {
    if (start === true && counter >= 0.01) {
      timerinterval.current = setInterval(() => {
        setPressVal(counter);
        setScaleVal(2 - counter);
        if (counter < 1) {
          counter += 0.05;
        }
      }, 50);
    } else {
      setPressVal(0);
    }
  };

  const pressingDown = (e) => {
    console.log("start");
    e.preventDefault();
    counter = 0.01;
    timer(true);
  };

  const notPressingDown = (e) => {
    console.log("stop");
    e.preventDefault();
    timer(false);
    setPressVal(0);
    clearInterval(timerinterval.current);
    navigation.navigate("Feedback");
  };

  // This is what is actually rendered on the app
  return (
    // Views are essentially divs or containers that store other elements
    // note that this view uses a style defined elsewhere, I usuall use inline styles which you can see everywhere else
    <View style={styles.container}>
      <View style={styles.container}>
        {/*Text renders text 🤯*/}
        <Text
          style={{
            color: "white",
            fontSize: 40,
            margin: 15,
            textAlign: "center",
            position: "absolute",
            fontWeight: 700,
            top: 50,
          }}
        >
          Hold the button below when ready to swing!
        </Text>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 150,
          }}
        >
          <Image
            style={imageStyle.image}
            source={require("./assets/light.png")}
          ></Image>
          <Image
            style={{
              position: "absolute",
              width: "100%",
              aspectRatio: 1,
              resizeMode: "contain",
            }}
            source={require("./assets/overlay.png")}
          ></Image>
          <View
            style={{
              width: "55%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: `rgba(87, 71, 92,${pressVal})`,
              aspectRatio: 1,
              overflow: "hidden",
              borderRadius: 10000,
              transform: `scale(${scaleVal})`,
              position: "absolute",
            }}
          />
          {/*Touchable opacities are essentially buttons
          onPressIn triggers when you tap the button and starts recording data
          onPressOut triggers when you leave the finger and stops recording the data
          */}
          <TouchableOpacity
            style={{
              width: "50%",
              backgroundColor: "#57475C",
              borderWidth: 1,
              border: "#000000",
              aspectRatio: 1,
              overflow: "hidden",
              borderRadius: 1000000,
              justifyContent: "center",
              alignItems: "center",
              shadowOpacity: 0.2,
              shadowRadius: 30,
              shadowColor: "white",
              elevation: 10,
              color: "white",
            }}
            onPressIn={(e) => {
              pressingDown(e);
              _subscribe();
            }}
            onPressOut={(e) => {
              notPressingDown(e);
              _unsubscribe();
            }}
          >
            <Text style={{ fontSize: 30, color: "white" }}>Press!</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Navbar navigation={navigation}></Navbar>
    </View>
  );
}

//added feedback sreen
function FeedbackScreen({ route, navigation }) {
  const [showGraph, setShowGraph] = useState(false);
  const [feedbackData, setFeedbackData] = useState(["", 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    let temp = [...feedbackData];
    temp[0] = ["Good", "Decent", "Needs Work"][Math.floor(Math.random() * 2)];
    temp[1] = Math.floor(Math.random() * 4) + 5;
    temp[2] = Math.floor(Math.random() * 50) + 125;
    temp[3] = Math.floor(Math.random() * 20) + 70;
    temp[4] = Math.floor(Math.random() * 3) - 5;
    temp[5] = Math.floor(Math.random() * 5) + 14;
    temp[6] = Math.floor(Math.random() * 30) + 90;
    temp[7] = Math.floor(Math.random() * 20) + 80;
    setFeedbackData(temp);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: "80%",
          alignItems: "center",
          justifyContent: "center",
          display: showGraph ? "none" : "flex",
        }}
      >
        <View style={styles.column}>
          <View style={styles.cell}>
            <Text style={{ color: "white", marginTop: 2, fontWeight: "bold" }}>
              Swing Path
            </Text>
            <Text
              style={{
                position: "absolute",
                bottom: "30%",
                color: "white",
                fontSize: 24,
                margin: 0,
                padding: 0,
              }}
            >
              {feedbackData[0]}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ color: "white", marginTop: 2, fontWeight: "bold" }}>
              Face Angle
            </Text>
            <Text
              style={{
                position: "absolute",
                top: "25%",
                color: "white",
                fontSize: 48,
              }}
            >
              {feedbackData[1]}&deg;
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ color: "white", marginTop: 2, fontWeight: "bold" }}>
              Distance
            </Text>
            <Text
              style={{
                position: "absolute",
                top: "25%",
                color: "white",
                fontSize: 48,
              }}
            >
              {feedbackData[2]}'
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ color: "white", marginTop: 2, fontWeight: "bold" }}>
              Accuracy
            </Text>
            <Text
              style={{
                position: "absolute",
                top: "25%",
                color: "white",
                fontSize: 48,
              }}
            >
              {feedbackData[3]}%
            </Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.cell}>
            <Text style={{ color: "white", marginTop: 2, fontWeight: "bold" }}>
              Attack Angle
            </Text>
            <Text
              style={{
                position: "absolute",
                top: "25%",
                color: "white",
                fontSize: 48,
              }}
            >
              {feedbackData[4]}&deg;
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ color: "white", marginTop: 2, fontWeight: "bold" }}>
              Launch Angle
            </Text>
            <Text
              style={{
                position: "absolute",
                top: "25%",
                color: "white",
                fontSize: 48,
              }}
            >
              {feedbackData[5]}&deg;
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ color: "white", marginTop: 2, fontWeight: "bold" }}>
              Ball Speed
            </Text>
            <Text
              style={{
                position: "absolute",
                top: "40%",
                color: "white",
                fontSize: 24,
              }}
            >
              {feedbackData[6]} mph
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ color: "white", marginTop: 2, fontWeight: "bold" }}>
              Clubhead Speed
            </Text>
            <Text
              style={{
                position: "absolute",
                top: "40%",
                color: "white",
                fontSize: 24,
              }}
            >
              {feedbackData[7]} mph
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          height: "80%",
          width: "100%",
          display: showGraph ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "50%",
            width: "90%",
            borderWidth: 1,
            borderColor: "white",
            position: "relative",
          }}
        >
          {[[1, 2]].map(function (x) {
            return (
              <View
                style={{
                  position: "absolute",
                  width: 10,
                  height: 10,
                  backgroundColor: "blue",
                  borderRadius: 10000,
                  left: `${x[0] * 95}%`,
                  bottom: `${x[1] * 95}%`,
                }}
              ></View>
            );
          })}
        </View>
      </View>
      <TouchableOpacity
        style={{
          height: "7%",
          backgroundColor: "#57475C",
          marginBottom: "10%",
          width: "60%",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          borderRadius: 1000000000,
        }}
        onPress={() => {
          setShowGraph(!showGraph);
        }}
      >
        <Text style={{ color: "white", fontSize: 24 }}>
          {showGraph ? "Show Results" : "Show Graph"}
        </Text>
      </TouchableOpacity>
      <Navbar navigation={navigation}></Navbar>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <navigation.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <navigation.Screen name="Home" component={HomeScreen} />
        <navigation.Screen name="Tracker" component={TrackerScreen} />
        <navigation.Screen name="Feedback" component={FeedbackScreen} />
      </navigation.Navigator>
    </NavigationContainer>
  );
}
