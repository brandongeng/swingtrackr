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
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import ExpoTHREE, { THREE, Renderer } from "expo-three";
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
			paramkey: { sdata: swingData, sdatag: swingDataG },
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
						<Text style={{ fontSize: 30, color: "white" }}>
							Press!
						</Text>
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
	const [metric, setMetric] = useState(0);

	useEffect(() => {
		let temp = [...feedbackData];
		temp[0] = 5 - Math.floor(Math.random() * 10);
		temp[1] = 5 - Math.floor(Math.random() * 9);
		temp[2] = 100 + Math.floor(Math.random() * 50);
		temp[3] = Math.floor(Math.random() * 40);
		temp[4] = Math.floor(Math.random() * 3) - 5;
		temp[5] = Math.floor(Math.random() * 5) + 14;
		temp[6] = Math.floor(Math.random() * 30) + 60;
		temp[7] = 1.5 * temp[6];
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

	const onContextCreateAsync = (gl) => {
		console.log(gl);
		// Create a WebGLRenderer without a DOM element
		const renderer = new Renderer({ gl });
		renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
		const sceneColor = 0x1e1e1e;
		renderer.setClearColor(sceneColor);

		const scene = new THREE.Scene();
		scene.fog = new THREE.Fog(sceneColor, 1, 10000);
		scene.add(new THREE.GridHelper(10, 10, 0xfff));

		// Define the points of the line
		const points = [];
		let x_min = 1000;
		let x_max = -1000;
		let y_min = 1000;
		let y_max = -1000;
		let z_min = 1000;
		let z_max = -1000;
		let lowest_y_ind = 0;

		for (let i = 0; i < pData.length; i++) {
			x_min = pData[i][0] < x_min ? pData[i][0] : x_min;
			x_max = pData[i][0] > x_max ? pData[i][0] : x_max;
			if (pData[i][1] < y_min) {
				y_min = pData[i][1];
				lowest_y_ind = i;
			}
			y_max = pData[i][1] > y_max ? pData[i][1] : y_max;
			z_min = pData[i][2] < z_min ? pData[i][2] : z_min;
			z_max = pData[i][2] > z_max ? pData[i][2] : z_max;
			points.push(
				new THREE.Vector3(pData[i][0], pData[i][1], pData[i][2])
			);
		}
		x_range = x_max - x_min;
		y_range = y_max - y_min;
		z_range = z_max - z_min;

		for (let i = 0; i < points.length; i++) {
			points[i][0] = (pData[i][0] - x_min) / x_range;
			points[i][1] = (pData[i][1] - y_min) / y_range;
			points[i][2] = (pData[i][2] - z_min) / z_range;
		}
		console.log(points);

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
		const scaleFactorZ = 5 / z_max;
		for (let i = 0; i < points.length; i++) {
			const projection = new THREE.Vector3();
			plane2d.projectPoint(points[i], projection);
			// The projection is a 3D point, so we need to convert it to 2D
			const projectionLine = new THREE.Vector3(
				0,
				projection.y,
				projection.z * scaleFactorZ
			);
			projection2d.push(projectionLine);
		}

		camera.position.set(3, 2, 10);
		camera.lookAt(0, 5, 0);

		var upswing = true;
		const upswing_points = [];
		const downswing_points = [];
		for (let i = 1; i < projection2d.length; i++) {
			if (projection2d[i].y < projection2d[i - 1].y) {
				upswing = false;
			}
			if (upswing) {
				upswing_points.push(
					new THREE.Vector3(
						projection2d[i].x,
						projection2d[i].y,
						projection2d[i].z
					)
				);
			} else {
				downswing_points.push(
					new THREE.Vector3(
						projection2d[i].x,
						projection2d[i].y,
						projection2d[i].z
					)
				);
			}
		}
		// console.log(upswing_points);
		// console.log("SPLIT");
		// console.log(downswing_points)

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
		const geometry = new THREE.BufferGeometry().setFromPoints(
			upswing_parabola_points
		);
		const down_geo = new THREE.BufferGeometry().setFromPoints(
			downswing_parabola_points
		);

		// Create a material for the line
		const material = new THREE.LineBasicMaterial({ color: 0xffffff });

		// Create the line object and add it to the scene
		const upline = new THREE.Line(geometry, material);
		const downline = new THREE.Line(down_geo, material);

		scene.add(upline);
		scene.add(downline);

		//ball flight to go in graph
		const flightData = [];
		var fpx = 0;
		var fpy = 0;
		var fpz = 0;
		for (let i = 0; i < 100; i++) {
			fpx = -5 + Math.abs(50 - i) * 0.1;
			fpy = 1.5 * i;
			fpz = -0.005 * (i - 75) * (i - 75) + 28.125;
			flightData[(fpx, fpy, fpz)];
		}

		// Render the scene
		const render = () => {
			renderer.render(scene, camera);
			gl.endFrameEXP();
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);
	};

	const metricArr = [
		"YOU SHOULD NOT BE SEEING THIS",
		"Swing Path",
		"Face Angle",
		"Distance",
		" Accuracy",
		"Attack Angle",
		"Launch Angle",
		"Ball Speed",
		"Clubhead Speed",
	];

	const metricArrSummary = [
		"N/A", // Placeholder for an undefined metric
		"Swing Path: The path your club takes during your swing. A good swing path is one that stays on-plane, which means the club follows a consistent path back and through the ball. Unit: Degrees.",
		"Face Angle: The angle of your clubface at impact. A good face angle is one that is square to the target line, or slightly open for a fade and slightly closed for a draw. Unit: Degrees.",
		"Distance: How far the ball travels. A good distance will depend on the club being used, but generally, the farther the better. Unit: Yards.",
		"Accuracy: How closely the ball goes to your intended target. Unit: Feet.",
		"Attack Angle: The angle at which the clubhead strikes the ball. A positive attack angle means the clubhead is moving upward at impact, while a negative attack angle means it's moving downward. Unit: Degrees.",
		"Launch Angle: The angle at which the ball leaves the clubface. Unit: Degrees.",
		"Ball Speed: The speed at which the ball is traveling after impact. Unit: Miles per hour.",
		"Clubhead Speed: The speed at which the clubhead is moving during your swing. Unit: Miles per hour.",
	];

	return (
		<View style={styles.container}>
			<View
				style={{
					flexDirection: "row",
					width: "100%",
					height: "80%",
					alignItems: "center",
					justifyContent: "center",
					display: showGraph ? "flex" : "none",
					position: "relative",
				}}
			>
				<TouchableOpacity
					style={{
						height: "100%",
						width: "100%",
						position: "absolute",
						display: metric === 0 ? "none" : "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 10,
					}}
					onPress={() => {
						setMetric(0);
					}}
				>
					<View
						style={{
							width: "80%",
							height: "90%",
							backgroundColor: "grey",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							borderRadius: 20,
							display: metric === 0 ? "none" : "flex",
						}}
					>
						<View style={{ margin: 10 }}>
							<Text style={{ fontSize: 36, textAlign: "center" }}>
								{metricArr[metric]}
								{"\n"}
							</Text>
							<Text style={{ fontSize: 24 }}>
								{metricArrSummary[metric]}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
				<View style={styles.column}>
					<View style={styles.cell}>
						<Text
							style={{
								color: "white",
								marginTop: 2,
								fontWeight: "bold",
							}}
							onPress={() => {
								setMetric(1);
							}}
						>
							Swing Path
						</Text>
						<Text
							style={{
								position: "absolute",
								top: "25%",
								color: "white",
								fontSize: 48,
							}}
							onPress={() => {
								setMetric(1);
							}}
						>
							{feedbackData[0]}&deg;
						</Text>
					</View>
					<View style={styles.cell}>
						<Text
							style={{
								color: "white",
								marginTop: 2,
								fontWeight: "bold",
							}}
							onPress={() => {
								setMetric(2);
							}}
						>
							Face Angle
						</Text>
						<Text
							style={{
								position: "absolute",
								top: "25%",
								color: "white",
								fontSize: 48,
							}}
							onPress={() => {
								setMetric(2);
							}}
						>
							{feedbackData[1]}&deg;
						</Text>
					</View>
					<View style={styles.cell}>
						<Text
							style={{
								color: "white",
								marginTop: 2,
								fontWeight: "bold",
							}}
							onPress={() => {
								setMetric(3);
							}}
						>
							Distance
						</Text>
						<Text
							style={{
								position: "absolute",
								top: "40%",
								color: "white",
								fontSize: 24,
							}}
							onPress={() => {
								setMetric(3);
							}}
						>
							{feedbackData[2]} yds
						</Text>
					</View>
					<View style={styles.cell}>
						<Text
							style={{
								color: "white",
								marginTop: 2,
								fontWeight: "bold",
							}}
							onPress={() => {
								setMetric(4);
							}}
						>
							Accuracy
						</Text>
						<Text
							style={{
								position: "absolute",
								top: "40%",
								color: "white",
								fontSize: 24,
							}}
							onPress={() => {
								setMetric(4);
							}}
						>
							{feedbackData[3]} ft
						</Text>
					</View>
				</View>
				<View style={styles.column}>
					<View style={styles.cell}>
						<Text
							style={{
								color: "white",
								marginTop: 2,
								fontWeight: "bold",
							}}
							onPress={() => {
								setMetric(5);
							}}
						>
							Attack Angle
						</Text>
						<Text
							style={{
								position: "absolute",
								top: "25%",
								color: "white",
								fontSize: 48,
							}}
							onPress={() => {
								setMetric(5);
							}}
						>
							{feedbackData[4]}&deg;
						</Text>
					</View>
					<View style={styles.cell}>
						<Text
							style={{
								color: "white",
								marginTop: 2,
								fontWeight: "bold",
							}}
							onPress={() => {
								setMetric(6);
							}}
						>
							Launch Angle
						</Text>
						<Text
							style={{
								position: "absolute",
								top: "25%",
								color: "white",
								fontSize: 48,
							}}
							onPress={() => {
								setMetric(6);
							}}
						>
							{feedbackData[5]}&deg;
						</Text>
					</View>
					<View style={styles.cell}>
						<Text
							style={{
								color: "white",
								marginTop: 2,
								fontWeight: "bold",
							}}
							onPress={() => {
								setMetric(7);
							}}
						>
							Ball Speed
						</Text>
						<Text
							style={{
								position: "absolute",
								top: "40%",
								color: "white",
								fontSize: 24,
							}}
							onPress={() => {
								setMetric(7);
							}}
						>
							{feedbackData[6]} mph
						</Text>
					</View>
					<View style={styles.cell}>
						<Text
							style={{
								color: "white",
								marginTop: 2,
								fontWeight: "bold",
							}}
							onPress={() => {
								setMetric(8);
							}}
						>
							Clubhead Speed
						</Text>
						<Text
							style={{
								position: "absolute",
								top: "40%",
								color: "white",
								fontSize: 24,
							}}
							onPress={() => {
								setMetric(8);
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
					display: showGraph ? "none" : "flex",
				}}
			>
				<GLView
					style={{
						flex: 1,
						display: showGraph ? "none" : "flex",
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
					{showGraph ? "Show Graph" : "Show Results"}
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
