// src/screens/common/DefaultHeaderStyles.module.js

import { Dimensions } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const { width, height } = Dimensions.get('window');

export const DefaultHeaderStyles = {
    headerStyle: {
      backgroundColor: '#1F1F1F', // 예시 색상
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 10,
      height: height * 0.115
    },

    headerTintColor:{
      color: 'white'
    } 

};
    