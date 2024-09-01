// import React, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import SplashScreen from 'react-native-splash-screen';
// import LoginScreen from './src/screens/Login';
// import Exercise from './src/screens/Exercise';
// import Schedule from './src/screens/Schedule';
// import Management from './src/screens/Management';
// import Record from './src/screens/Record';
// import Menu from './src/screens/Menu';
// import SignIn from './src/screens/SignIn';
// import Signup from './src/screens/Signup';
// import SignupStep1 from './src/screens/SignupStep1';
// import SignupStep2 from './src/screens/SignupStep2';
// import SignupStep3 from './src/screens/SignupStep3';
// import { DefaultHeaderStyles } from './src/screens/common/DefaultHeaderStyles.module';

// import i18n from './src/locales/i18n';


// const Stack = createNativeStackNavigator();

// function App() {
  
//   useEffect(() => {

//     setTimeout(() => {
//       SplashScreen.hide();
//     }, 1000);
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
        
//         {/* 로그인 페이지 */}
//         <Stack.Screen 
//           name="Login" 
//           component={LoginScreen} 
//           options={{ headerShown: false, animation: 'none' }} 
//         />

//         {/* 로그인 실행 페이지 */}
//         <Stack.Screen 
//           name="SignIn" 
//           component={SignIn} 
//           options={{ headerShown: true, ...DefaultHeaderStyles}} 
//         />

//         {/* 회원가입 단계 페이지 */}
//         <Stack.Screen 
//           name="Signup" 
//           component={Signup} 
//           options={{ headerShown: false }} 
//         />
//         <Stack.Screen 
//           name="SignupStep1" 
//           component={SignupStep1} 
//           options={{ headerShown: true, title: 'Step 1', ...DefaultHeaderStyles }} 
//         />
//         <Stack.Screen 
//           name="SignupStep2" 
//           component={SignupStep2} 
//           options={{ headerShown: true, title: 'Step 2', ...DefaultHeaderStyles }} 
//         />
//         <Stack.Screen 
//           name="SignupStep3" 
//           component={SignupStep3} 
//           options={{ headerShown: true, title: 'Step 3', ...DefaultHeaderStyles }} 
//         />

//         {/* 운동 페이지 */}
//         <Stack.Screen 
//           name="Exercise" 
//           component={Exercise} 
//           options={{ headerShown: false, animation: 'none' }} 
//         />
        
//         {/* 스케쥴 페이지 */}
//         <Stack.Screen 
//           name="Schedule" 
//           component={Schedule} 
//           options={{ headerShown: false, animation: 'none' }} 
//         />

//         {/* 관리, 분석 페이지 */}
//         <Stack.Screen 
//           name="Management" 
//           component={Management} 
//           options={{ headerShown: false, animation: 'none' }} 
//         />

//         {/* 기록 페이지 */}
//         <Stack.Screen 
//           name="Record" 
//           component={Record} 
//           options={{ headerShown: false, animation: 'none' }} 
//         />

//         {/* 메뉴 페이지 */}
//         <Stack.Screen 
//           name="Menu" 
//           component={Menu} 
//           options={{ 
//             title: 'Menu',
//             headerShown: true, // 헤더 보이기 설정
//             ...DefaultHeaderStyles, // 스타일 적용
//           }}
//         />

//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;

import 'intl-pluralrules'; // 폴리필을 가장 먼저 임포트합니다.
import React from 'react';
import { Text, View, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import './src/locales/i18n'; // i18n 설정을 임포트합니다.
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';


function App() {

  useEffect(() => {

    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  const { t, i18n } = useTranslation(); // useTranslation 훅을 사용하여 번역 기능을 가져옵니다.

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // 사용자가 선택한 언어로 변경합니다.
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        {t('welcome_message')} {/* 다국어 텍스트를 표시합니다. */}
      </Text>
      <Button title="English" onPress={() => changeLanguage('en')} />
      <Button title="한국어" onPress={() => changeLanguage('ko')} style={{ marginTop: 10 }} />
    </View>
  );
}

export default App;


