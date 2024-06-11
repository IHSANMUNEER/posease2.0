import React from 'react';
import Lottie from 'lottie-react-native';
import {View, Dimensions, Text} from 'react-native';
import colours from './colors';


const Subscription = () => {
  return(
    <View
    style={{
      justifyContent: 'center',
      height: 150,
      width: 150,
      alignItems: 'center',
      backgroundColor: 'white',
      marginHorizontal: 110,
      marginVertical: 40
    }}>
    <View>
      <Lottie
        style={{width: 150, height: 150}}
        source={require('../assets/subscribe.json')}
        autoPlay
        loop
      />
    </View>
  </View>
  )
};

export default Subscription;
