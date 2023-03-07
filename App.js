import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [pressVal, setPressVal] = useState(0)
  const [scaleVal, setScaleVal] = useState(2)

  let counter = 0;
  let timerinterval = useRef(null);

  const timer = (start) => {
    console.log('tick tock');
    console.log(start);
    if (start === true && counter >= .01) {
      timerinterval.current = setInterval(() => {
        console.log(counter);
        setPressVal(counter);
        setScaleVal(2-counter)
        if (counter < 1){
        counter += .05;
        }
        //@ts-ignore
      }, 50);
    } else {
      setPressVal(0);
    }
  };

  const pressingDown = (e) => {
    console.log('start');
    e.preventDefault();
    counter = .01;
    timer(true);
  };

  const notPressingDown = (e) => {
    console.log('stop');
    e.preventDefault();
    timer(false);
    setPressVal(0);
    clearInterval(timerinterval.current);
  };

  return (
    <View style={styles.container}>
      <View style={{width: "55%",
       justifyContent: "center", 
       alignItems: "center", 
       backgroundColor: `rgba(50,110,200,${pressVal})`, 
       aspectRatio: 1, 
       overflow: "hidden", 
       borderRadius: 10000, 
       transform: `scale(${scaleVal})`,
       position: "absolute"}}>
      </View>
      <TouchableOpacity style={{width: "50%", 
      backgroundColor: "#0F57B3", 
      aspectRatio: 1, 
      overflow: "hidden",
      borderRadius: 1000000,
      justifyContent: "center",
      alignItems: "center", shadowOpacity: 0.2, shadowRadius: 30, shadowColor: 'white', elevation: 10}}
      onPressIn = {pressingDown}
      onPressOut = {notPressingDown}>
        <Text style= {{fontSize: 30,color: "white", }}>Press</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display:'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#20232A"
  },
});
