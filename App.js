import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gyroscope } from 'expo-sensors';


export default function App() {
  const [pressVal, setPressVal] = useState(0)
  const [scaleVal, setScaleVal] = useState(2)
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);
  const _slow = () => Gyroscope.setUpdateInterval(1000);
  const _fast = () => Gyroscope.setUpdateInterval(16);
  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        console.log(gyroscopeData)
        setData(gyroscopeData);
      })
    );
  };
  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  let counter = 0;
  let timerinterval = useRef(null);

  const timer = (start) => {
    if (start === true && counter >= .01) {
      timerinterval.current = setInterval(() => {
        setPressVal(counter);
        setScaleVal(2-counter)
        if (counter < 1){
        counter += .05;
        }
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
      onPressIn = {(e)=>{pressingDown(e); _slow(); _subscribe();} }
      onPressOut = {(e)=>{notPressingDown(e); _unsubscribe();}}
      >
        <Text style= {{fontSize: 30,color: "white", }}>{x}</Text>
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
