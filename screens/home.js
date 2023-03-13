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

const navigation = createStackNavigator();

// External style. This came with the template but I tend not to use it.
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#20232A",
  },

  screen: {
    backgroundColor: "#B2F2BB",
    position: "relative",
    width: 390,
    height: 844,
  },

  logo: {
    width: 400,
    height: 400,
  },

  golf_ball_icon: {
    position: "relative",
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

  loginText: {
    // position: 'absolute',
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 24,
    /* identical to box height */

    textAlign: "center",

    color: "#000000",
  },
});

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Video
        style={{ flex: 1, backgroundColor: "grey" }}
        source={require("../assets/golf.mp4")}
        resizeMode="cover"
        isLooping={true}
        shouldPlay={true}
        isMuted={true}
      ></Video>
      <View
        style={{
          position: "absolute",
          backgroundColor: "rgba(30,30,30,.53)",
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
          Swingtrackr
          {"\n"}
          <Text style={{ fontSize: 20, fontWeight: "300" }}>
            Swing Feedback on your Phone{" "}
          </Text>
        </Text>
        <View
          style={{
            height: "30%",
            width: "80%",
            justifyContent: "space-around",
            marginTop: "80%",
          }}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              height: "25%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#57475C",
              borderRadius: 100000,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "100%",
              height: "25%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#57475C",
              borderRadius: 100000,
            }}
            onPress={() => {
              navigation.navigate("Tracker");
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
              }}
            >
              Start Swinging
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "100%",
              height: "25%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#5C5C5C",
              borderRadius: 100000,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;
