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
import SignIn from './src/screens/SignIn';
import SignupScreen from './src/screens/Signup';
import SignupStep1Screen from './src/screens/SignupStep1';
import SignupStep2Screen from './src/screens/SignupStep2';
import SignupStep3Screen from './src/screens/SignupStep3';
import { DefaultHeaderStyles } from './src/screens/common/DefaultHeaderStyles.module';

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
          options={{ headerShown: false, animation: 'none' }} 
        />

        {/* 로그인 실행 페이지 */}
        <Stack.Screen 
          name="SignIn" 
          component={SignIn} 
          options={{ headerShown: true, animation: 'none', ...DefaultHeaderStyles}} 
        />

        {/* 회원가입 단계 페이지 */}
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ headerShown: true, animation: 'none', ...DefaultHeaderStyles }} 
        />
        <Stack.Screen 
          name="SignupStep1" 
          component={SignupStep1Screen} 
          options={{ headerShown: true, title: 'Step 1', ...DefaultHeaderStyles }} 
        />
        <Stack.Screen 
          name="SignupStep2" 
          component={SignupStep2Screen} 
          options={{ headerShown: true, title: 'Step 2', ...DefaultHeaderStyles }} 
        />
        <Stack.Screen 
          name="SignupStep3" 
          component={SignupStep3Screen} 
          options={{ headerShown: true, title: 'Step 3', ...DefaultHeaderStyles }} 
        />

        {/* 운동 페이지 */}
        <Stack.Screen 
          name="Exercise" 
          component={Exercise} 
          options={{ headerShown: false, animation: 'none' }} 
        />
        
        {/* 스케쥴 페이지 */}
        <Stack.Screen 
          name="Schedule" 
          component={Schedule} 
          options={{ headerShown: false, animation: 'none' }} 
        />

        {/* 관리, 분석 페이지 */}
        <Stack.Screen 
          name="Management" 
          component={Management} 
          options={{ headerShown: false, animation: 'none' }} 
        />

        {/* 기록 페이지 */}
        <Stack.Screen 
          name="Record" 
          component={Record} 
          options={{ headerShown: false, animation: 'none' }} 
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
