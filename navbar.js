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
    backgroundColor: "#424242",
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
    width: 30,
    height: 30,
    marginLeft: 5,
    tintColor: "#ffffff",
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
    color: "white",
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
        backgroundColor: "#424242",
        color: "white",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          color: "white",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image
            source={require("./assets/home_icon.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={{ color: "white" }}>Home</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Tracker")}>
          <Image
            source={require("./assets/tracker_icon.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={{ color: "white" }}>Tracker</Text>
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
        <Text style={{ color: "white" }}>Stats</Text>
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
        <Text style={{ color: "white" }}>Profile</Text>
      </View>
    </View>
  );
}

export default Navbar;
