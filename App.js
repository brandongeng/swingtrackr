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
import Navbar from "./navbar";
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import ExpoTHREE, { THREE, Renderer } from 'expo-three'
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

global.THREE = global.THREE || THREE;

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
  const [swingData, setSwingData] = useState([]);
  const [swingDataG, setSwingDataG] = useState([]);

  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [ax, setAx] = useState(0);
  const [ay, setAy] = useState(0);
  const [az, setAz] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [asubscription, setASubscription] = useState(null);

  const imageStyle = StyleSheet.create({
    image: {
      position: "absolute",
      width: "100%",
      aspectRatio: 1,
      resizeMode: "contain",
      opacity: pressVal,
    },
  });

  // Set how fast the sensors take in data
  const _slow = () => Gyroscope.setUpdateInterval(100);
  const _fast = () => {
    Gyroscope.setUpdateInterval(100);
    Accelerometer.setUpdateInterval(100);
  };

  // Start gyroscope listener and get gyroscope data
  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener((gyroscopeData) => {
        setData(gyroscopeData);
      })
    );
    setASubscription(
      Accelerometer.addListener((accelData) => {
        setAx(accelData.x);
        setAy(accelData.y);
        setAz(accelData.z);
      })
    );
  };

  useEffect(() => {
    setSwingData([...swingData, { x: ax, y: ay, z: az }]);
  }, [ax]);

  useEffect(() => {
    setSwingDataG([...swingDataG, { x: x, y: y, z: z }]);
  }, [x]);

  // End a gyroscope listener
  const _unsubscribe = () => {
    subscription && subscription.remove();
    asubscription && asubscription.remove();
    navigation.navigate("Feedback", {
      paramkey: {sdata: swingData, sdatag: swingDataG}
    });
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
              setSwingData([]);
              pressingDown(e);
              _fast();
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
  const [pData, setPdata] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [feedbackData, setFeedbackData] = useState(["", 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    let temp = [...feedbackData];
    temp[0] = 5-Math.floor(Math.random() * 10);
    temp[1] = 5-Math.floor(Math.random() * 9) ;
    temp[2] = 100+Math.floor(Math.random() * 50);
    temp[3] = Math.floor(Math.random() * 40);
    temp[4] = Math.floor(Math.random() * 3) - 5;
    temp[5] = Math.floor(Math.random() * 5) + 14;
    temp[6] = Math.floor(Math.random() * 30) + 60;
    temp[7] = 1.5*temp[6];
    setFeedbackData(temp);
  }, []);

  const swingData = route.params.paramkey.sdata;
	const swingDataG = route.params.paramkey.sdatag;

  useEffect(() => {
    const veloData = [];
    const posData = [];
    var dt = 0.1;
    veloData.push([0, 0, 0]);
    posData.push([0, 0, 0]);

    for (let i = 0; i < swingData.length; i++) {
      var Ax = swingData[i].x;
      var Ay = swingData[i].y;
      var Az = swingData[i].z;
      var Vx = veloData[i][0] + Ax * dt;
      var Vy = veloData[i][1] + Ay * dt;
      var Vz = veloData[i][2] + Az * dt;
      veloData.push([Vx, Vy, Vz]);
      var Px = posData[i][0] + Vx * dt;
      var Py = posData[i][1] + Vy * dt;
      var Pz = posData[i][2] + Vz * dt;
      posData.push([Px, Py, Pz]);
    }
    let arr1 = [].concat(...posData);
    let min = Math.min(...arr1);
    let max = Math.max(...arr1);
    for (let i = 0; i < posData.length; i++) {
      posData[i][0] = (posData[i][0] - min) / (max - min);
      posData[i][1] = (posData[i][1] - min) / (max - min);
      posData[i][2] = (posData[i][2] - min) / (max - min);
    }
    setPdata(posData);
  }, [swingData]);

  // const onContextCreate = async (gl) => {
  //   console.log(gl)
  //   const scene = new THREE.Scene();
  //   console.log(scene)
  //   const camera = new PerspectiveCamera(
  //     75,
  //     gl.drawingBufferWidth/gl.drawingBufferHeight,
  //     0.1,
  //     1000
  //   )

  //   gl.canvas = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight }
  //   camera.position.z = 2

  //   const renderer = new Renderer({gl})
  //   renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)

  //   const geometry = new BoxGeometry(1, 1, 1)
  //   const material = new MeshBasicMaterial({
  //     color: 'blue'
  //   })

  //   const cube = new Mesh(geometry, material)
  //   scene.add(cube)

  //   const render = ()=> {
  //     requestAnimationFrame(render)
  //     cube.rotation.x += 0.01
  //     cube.rotation.y += 0.01
  //     renderer.render(scene, camera)
  //     gl.endFrameEXP()
  //   }

  //   render()
  // };
  const onContextCreateAsync = (gl) => {
    console.log(gl)
    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    const sceneColor = 0x1e1e1e;
    renderer.setClearColor(sceneColor);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(sceneColor, 1, 10000);
    scene.add(new THREE.GridHelper(10, 10, 0xfff));

    // Define the points of the line
    const points = []
    let x_min = 1000
    let x_max = -1000
    let y_min = 1000
    let y_max = -1000
    let z_min = 1000
    let z_max = -1000
    let lowest_y_ind = 0

    for (let i = 0; i < pData.length; i++) {
      x_min = (pData[i][0] < x_min) ? pData[i][0] : x_min
      x_max = (pData[i][0] > x_max) ? pData[i][0] : x_max
      if (pData[i][1] < y_min) {
        y_min = pData[i][1]
        lowest_y_ind = i
      }
      y_max = (pData[i][1] > y_max) ? pData[i][1] : y_max
      z_min = (pData[i][2] < z_min) ? pData[i][2] : z_min
      z_max = (pData[i][2] > z_max) ? pData[i][2] : z_max
      points.push(new THREE.Vector3(pData[i][0], pData[i][1], pData[i][2]))
    }
    x_range = x_max - x_min
    y_range = y_max - y_min
    z_range = z_max - z_min

    for (let i = 0; i < points.length; i++) {
      points[i][0] = ((pData[i][0] - x_min) / x_range) 
      points[i][1] = ((pData[i][1] - y_min) / y_range) 
      points[i][2] = ((pData[i][2] - z_min) / z_range)
    }
    console.log(points)

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );

    // Create a 2D plane
    const plane2d = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);

    // Project the line onto the plane
    const projection2d = [];
    //const scaleFactorY = 2 / y_max
    const scaleFactorZ = 5 / z_max
    for (let i = 0; i < points.length; i++) {
      const projection = new THREE.Vector3();
      plane2d.projectPoint(points[i], projection); 
      // The projection is a 3D point, so we need to convert it to 2D
      const projectionLine = new THREE.Vector3(0, projection.y, projection.z * scaleFactorZ);
      projection2d.push(projectionLine)
    }

    camera.position.set(3, 2, 10);
    camera.lookAt(0, 5, 0);

    var upswing = true;
    const upswing_points = [];
    const downswing_points = [];
    for (let i = 1; i < projection2d.length; i++) {
      if (projection2d[i].y < projection2d[i-1].y) {
        upswing = false;
      }
      if (upswing) {
        upswing_points.push(new THREE.Vector3(projection2d[i].x, projection2d[i].y, projection2d[i].z));
      }
      else {
        downswing_points.push(new THREE.Vector3(projection2d[i].x, projection2d[i].y, projection2d[i].z));
      }
    }
    console.log(upswing_points);
    console.log("SPLIT");
    console.log(downswing_points)

    const upswing_curve = new THREE.QuadraticBezierCurve3(
      upswing_points[0],
      upswing_points[upswing_points.length / 2],
      upswing_points[upswing_points.length - 1]
    );

    const downswing_curve = new THREE.QuadraticBezierCurve3(
      downswing_points[0],
      downswing_points[downswing_points.length / 2],
      downswing_points[downswing_points.length - 1]
    );

    const upswing_parabola_points = upswing_curve.getPoints(50);
    const downswing_parabola_points = downswing_curve.getPoints(50);

    // Create a geometry object from the points
    const geometry = new THREE.BufferGeometry().setFromPoints(upswing_parabola_points);
    const down_geo = new THREE.BufferGeometry().setFromPoints(downswing_parabola_points);

    // Create a material for the line
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    // Create the line object and add it to the scene
    const upline = new THREE.Line(geometry, material);
    const downline = new THREE.Line(down_geo, material);

    scene.add(upline);
    scene.add(downline)

    // Render the scene
    const render = () => {
      renderer.render(scene, camera);
      gl.endFrameEXP();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  return (
    <View style={styles.container}>
      {/* <View
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
                top: "25%",
                color: "white",
                fontSize: 48,
              }}
            >
              {feedbackData[0]}&deg;
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
                top: "40%",
                color: "white",
                fontSize: 24,
              }}
            >
              {feedbackData[2]} yds
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ color: "white", marginTop: 2, fontWeight: "bold" }}>
              Accuracy
            </Text>
            <Text
              style={{
                position: "absolute",
                top: "40%",
                color: "white",
                fontSize: 24,
              }}
            >
              {feedbackData[3]} ft
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
      </View> */}
      <View
        style={{
          height: "80%",
          width: "100%",
        }}
      >
        <GLView
          style={{
            flex: 1,
          }}
          onContextCreate={onContextCreateAsync}
        />
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

