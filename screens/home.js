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

  logo: {
    width: 400,
    height: 400,
  },
});

function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>SwingTracker</Text>
      <Text>Golf on the fly</Text>
      <Image
        style={styles.logo}
        source={require("../assets/logo.png")} // not sure why the image isn't loading https://docs.expo.dev/guides/assets/
      />
      <Button
        title="Go to Tracker Screen"
        onPress={() => navigation.navigate("Tracker")}
      />
    </View>
  );
}

export default HomeScreen;
