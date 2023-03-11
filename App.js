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
import { Accelerometer, Gyroscope } from "expo-sensors";
import HomeScreen from "./screens/home";

const navigation = createStackNavigator();

// External style. This came with the template but I tend not to use it.
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B2F2BB",
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
    backgroundColor: '#B2F2BB',
  },

  golf_ball_icon: {
    width: 60,
    height: 60,
    transform: [{ rotate: '30deg' }]
  },

  appName: {
    // position: 'absolute',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 40,
    lineHeight: 48,
    /* identical to box height */

    textAlign: 'center',

    color: '#2F9E44'
  },
});

function TrackerScreen({ navigation }) {
  // useState sets a variable that is tracked by React. When a state variable is changed the app rerenders
  // to update a state variable use the set state function, NOT "=" operator as this might cause issues
  // For example to update pressVal write setPressVal(123) instead of pressVal = 123
  // the value in the useState declerations below are the values given at the start of the app
  const [pressVal, setPressVal] = useState(0);
  const [scaleVal, setScaleVal] = useState(2);
  const [swingData, setSwingData] = useState([]);
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [{ Ax, Ay, Az }, setAData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);
  const [asubscription, setASubscription] = useState(null);

  // Set how fast the sensors take in data
  const _slow = () => Gyroscope.setUpdateInterval(1000);
  const _fast = () => {
    Gyroscope.setUpdateInterval(16);
    Accelerometer.setUpdateInterval(16);
  };

  // Start gyroscope listener and get gyroscope data
  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener((gyroscopeData) => {
        setSwingData([...swingData, gyroscopeData]);
        console.log("gyro: ", gyroscopeData);
        setData(gyroscopeData);
      })
    );
    setASubscription(
      Accelerometer.addListener((accelData) => {
        console.log("accel: ", accelData);
        setAData(accelData);
      })
    );
  };

  // End a gyroscope listener
  const _unsubscribe = () => {
    subscription && subscription.remove();
    asubscription && asubscription.remove();
    console.log(swingData);
    setSubscription(null);
    setASubscription(null);
  };

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
            fontSize: 30,
            margin: 15,
            textAlign: "center",
            position: "absolute",
            top: 50,
          }}
        >
          Press To Start Recording!
        </Text>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "55%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: `rgba(50,110,200,${pressVal})`,
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
              backgroundColor: "#0F57B3",
              aspectRatio: 1,
              overflow: "hidden",
              borderRadius: 1000000,
              justifyContent: "center",
              alignItems: "center",
              shadowOpacity: 0.2,
              shadowRadius: 30,
              shadowColor: "white",
              elevation: 10,
            }}
            onPressIn={(e) => {
              pressingDown(e);
              _fast();
              _subscribe();
            }}
            onPressOut={(e) => {
              notPressingDown(e);
              _unsubscribe();
            }}
          >
            <Text style={{ fontSize: 30, color: "white" }}>{x}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "8%",
        justifyContent: "left",
        alignItems: "center",
        backgroundColor: "#D9D9D9",
      }}>
        <Image
          source={require("./assets/home_icon.png")}
          style={styles.icon}/>
        <Image 
          source={require("./assets/tracker_icon.png")}
          style={styles.icon}/>
        <Image 
          source={require("./assets/pie_chart_icon.png")}
          style={styles.icon}/>
        <Image 
          source={require("./assets/profile_icon.png")}
          style={styles.icon}/>
      </View>
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
      </navigation.Navigator>
    </NavigationContainer>
  );
}
