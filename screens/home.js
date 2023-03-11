import "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Image,
} from "react-native";
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
    backgroundColor: '#B2F2BB',
    position: 'relative',
    width: 390,
    height: 844
  },

  logo: {
    width: 400,
    height: 400,
  },

  golf_ball_icon: {
    position: 'relative',
    width: 60,
    height: 60,
    transform: [{ rotate: '30deg' }]
  },

  appName: {
    position: 'relative',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 40,
    lineHeight: 48,
    textAlign: 'center',

    color: '#2F9E44'
  },

  loginText: {
    // position: 'absolute',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 24,
    /* identical to box height */

    textAlign: 'center',

    color: '#000000'
  },
});

function HomeScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <View>
         {/* NEED TO CENTER THIS*/}
        <Image 
          style={styles.golf_ball_icon}
          source={require("../assets/golf-ball.png")}/>
        <Text style={styles.appName}>SwingTracker</Text>
      </View>
      <Text style={styles.loginText}>Golf on the fly</Text>
      <Image
        style={styles.logo}
        source={require("../assets/logo.png")}
      />
      <Button
        title="Go to Tracker Screen"
        style={styles.loginButton}
        onPress={() => navigation.navigate("Tracker")}
      />
    </View>
  );
}

export default HomeScreen;
