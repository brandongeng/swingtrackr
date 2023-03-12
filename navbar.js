import "react-native-gesture-handler";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Button,
	Image,
} from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import { createStackNavigator } from "@react-navigation/stack";

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#B2F2BB",
	},

	row: {
		flexDirection: "row",
	},

    column: {
        flexDirection: "column",
        width: "40%",
        height: "75%",
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
		backgroundColor: "#B2F2BB",
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

const navigation = createStackNavigator();

function Navbar({ navigation }) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "8%",
                paddingLeft: 30,
                paddingRight: 30,
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#D9D9D9",
            }}
        >
            <View
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate("Home")}
                >
                    <Image
                        source={require("./assets/home_icon.png")}
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <Text>Home</Text>
            </View>
            <View
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate("Tracker")}
                >
                    <Image
                        source={require("./assets/tracker_icon.png")}
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <Text>Tracker</Text>
            </View>
            <View
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Image
                    source={require("./assets/pie_chart_icon.png")}
                    style={styles.icon}
                />
                <Text>Stats</Text>
            </View>
            <View
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Image
                    source={require("./assets/profile_icon.png")}
                    style={styles.icon}
                />
                <Text>Profile</Text>
            </View>
        </View>
    );
}

export default Navbar; 