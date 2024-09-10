import 'intl-pluralrules';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import initializeI18n from './locales/i18n'; // i18n 초기화 함수 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 추가

// Redux 관련 import
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store'; 
import { setToken, setIsLoggedIn } from './modules/AuthSlice';  // Redux 액션 가져오기

//Screens

// Common
import { DefaultHeaderStyles } from './screens/common/DefaultHeaderStyles.module';

// Start
import LoginScreen from './screens/start/Login';
import Signin from './screens/start/Signin';
import Signup from './screens/start/Signup';
import SignupStep1 from './screens/start/SignupStep1';

// Main
import Exercise from './screens/exercise/Exercise';
import Schedule from './screens/schedule/Schedule';
import Management from './screens/management/Management';
import Record from './screens/record/Record';
import Menu from './screens/menu/Menu';

//Subpage
import MenuTranslation from './screens/menu/MenuTranslation';
import AcountInfo from './screens/menu/AcountInfo';

const Stack = createNativeStackNavigator();

function MainApp() {
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // 로그인 상태 확인

  useEffect(() => {
    const initialize = async () => {
      await initializeI18n(); // i18n 초기화가 완료될 때까지 대기

      // AsyncStorage에서 토큰 불러오기
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        // 토큰이 있으면 Redux에 저장하고 로그인 상태 true로 설정
        console.log("토큰있어요")
        dispatch(setToken(token));
        dispatch(setIsLoggedIn(true));
      } else {
        // 토큰이 없으면 로그인 상태 false로 설정
        console.log("토큰없어요")
        dispatch(setIsLoggedIn(false));
      }

      setIsInitialized(true); // 초기화 완료 후 렌더링을 허용
      SplashScreen.hide(); // 스플래시 화면 숨기기
    };
    initialize();
  }, [dispatch]);

  if (!isInitialized) {
    return null; // 초기화가 완료되지 않은 상태에서는 아무것도 렌더링하지 않음
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Exercise" : "Login"}>
        {/* 로그인 페이지 */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false, animation: 'none' }}
        />

        {/* 로그인 실행 페이지 */}
        <Stack.Screen
          name="Signin"
          component={Signin}
          options={{ headerShown: false }}
        />

        {/* 회원가입 단계 페이지 */}
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignupStep1"
          component={SignupStep1}
          options={{ headerShown: false }}
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

        {/* 메뉴 번역 페이지 */}
        <Stack.Screen
          name="MenuTranslation"
          component={MenuTranslation}
          options={{
            title: 'MenuTranslation',
            headerShown: true, // 헤더 보이기 설정
            ...DefaultHeaderStyles, // 스타일 적용
          }}
        />

        {/* 메뉴 계정정보 페이지 */}
        <Stack.Screen
          name="AcountInfo"
          component={AcountInfo}
          options={{
            title: 'AcountInfo',
            headerShown: true, // 헤더 보이기 설정
            ...DefaultHeaderStyles, // 스타일 적용
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainApp />
      </PersistGate>
    </Provider>
  );
}

export default App;
