import 'intl-pluralrules';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import LoginScreen from './src/screens/start/Login';
import Exercise from './src/screens/exercise/Exercise';
import Schedule from './src/screens/schedule/Schedule';
import Management from './src/screens/management/Management';
import Record from './src/screens/record/Record';
import Menu from './src/screens/menu/Menu';
import SignIn from './src/screens/start/SignIn';
import Signup from './src/screens/start/Signup';
import SignupStep1 from './src/screens/start/SignupStep1';
import SignupStep2 from './src/screens/start/SignupStep2';
import SignupStep3 from './src/screens/start/SignupStep3';
import { DefaultHeaderStyles } from './src/screens/common/DefaultHeaderStyles.module';
import MenuTranslation from './src/screens/menu/MenuTranslation';
import initializeI18n from './src/locales/i18n';  // i18n 초기화 함수 가져오기

const Stack = createNativeStackNavigator();

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initializeI18n();  // i18n 초기화가 완료될 때까지 대기
      setIsInitialized(true);  // 초기화 완료 후 렌더링을 허용
      SplashScreen.hide();  // 스플래시 화면 숨기기
    };
    initialize();
  }, []);

  if (!isInitialized) {
    return null;  // 초기화가 완료되지 않은 상태에서는 아무것도 렌더링하지 않음
  }

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
          options={{ headerShown: true, ...DefaultHeaderStyles}} 
        />

        {/* 회원가입 단계 페이지 */}
        <Stack.Screen 
          name="Signup" 
          component={Signup} 
          options={{ headerShown: false, animation: 'none' }} 
        />
        <Stack.Screen 
          name="SignupStep1" 
          component={SignupStep1} 
          options={{ headerShown: true, title: 'Step 1', ...DefaultHeaderStyles }} 
        />
        <Stack.Screen 
          name="SignupStep2" 
          component={SignupStep2} 
          options={{ headerShown: true, title: 'Step 2', ...DefaultHeaderStyles }} 
        />
        <Stack.Screen 
          name="SignupStep3" 
          component={SignupStep3} 
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

        <Stack.Screen 
          name="MenuTranslation" 
          component={ MenuTranslation } 
          options={{ 
            title: 'MenuTranslation',
            headerShown: true, // 헤더 보이기 설정
            ...DefaultHeaderStyles, // 스타일 적용
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
