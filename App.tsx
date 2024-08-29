import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import LoginScreen from './src/screens/Login';
import Exercise from './src/screens/Exercise';
import Schedule from './src/screens/Schedule';
import Management from './src/screens/Management';
import Record from './src/screens/Record';
import Menu from './src/screens/Menu';
import { DefaultHeaderStyles } from './src/screens/common/DefaultHeaderStyles.module'; // 확인 후 수정

const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    // 스플래시 화면을 1초 후에 숨김
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []); 

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        {/* 로그인 페이지 */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* 운동 페이지 */}
        <Stack.Screen 
          name="Exercise" 
          component={Exercise} 
          options={{ headerShown: false }} 
        />
        
        {/* 스케쥴 페이지 */}
        <Stack.Screen 
          name="Schedule" 
          component={Schedule} 
          options={{ headerShown: false }} 
        />

        {/* 관리, 분석 페이지 */}
        <Stack.Screen 
          name="Management" 
          component={Management} 
          options={{ headerShown: false }} 
        />

        {/* 기록 페이지 */}
        <Stack.Screen 
          name="Record" 
          component={Record} 
          options={{ headerShown: false }} 
        />

        {/* 메뉴 페이지 */}
        <Stack.Screen 
          name="Menu" 
          component={Menu} 
          options={{ 
            title: 'Menu',
            headerShown: true, // 헤더 보이기 설정
            ...DefaultHeaderStyles, // 스타일 적용
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
