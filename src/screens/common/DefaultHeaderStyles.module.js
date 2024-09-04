// src/screens/common/DefaultHeaderStyles.module.js

import { Dimensions, Platform } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const { width, height } = Dimensions.get('window');

export const DefaultHeaderStyles = {
    headerStyle: {
      backgroundColor: '#191D22', // 예시 색상
      flexDirection: 'row', 
      alignItems: 'flex-end', // 여기 쉼표 추가


      ...Platform.select({
        android: {
          height: height * 0.08,
        },
        ios: {
          height: height * 0.12,
        },
      }),
    },

    headerContainer:{

      flexDirection: 'row', 
      alignItems: 'center',
      // backgroundColor:'red'
    },

    icon:{
      color: 'white',
      paddingLeft: 10,
      paddingBottom: 10

    },

    headerText: {
      color: 'white',
      fontSize: 22,
      paddingLeft: 10,
      paddingBottom: 10
    }

};
    