import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import initializeI18n from './locales/i18n'; // i18n 초기화 함수 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 추가
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store'; 
import { setToken, setIsLoggedIn } from './modules/AuthSlice';  // Redux 액션 가져오기
import Timer from '../components/header/Timer';  // Timer 컴포넌트 가져오기
import { View} from 'react-native';
import Header from './screens/common/Header';
import InitializationWrapper from './InitializationWrapper';  // 초기화 컴포넌트 가져오기


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
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // 로그인 상태 확인
  const [timerTime, setTimerTime] = useState(0); // 타이머 시간 상태
  const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 실행 상태
  const [initializationComplete, setInitializationComplete] = useState(false);

  
  if (!initializationComplete) {
    return (
      <InitializationWrapper
        onInitializationComplete={() => setInitializationComplete(true)}
        setTimerTime={setTimerTime}
        setIsTimerRunning={setIsTimerRunning}
      />
    );
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

        {/* 운동페이지 */}
        <Stack.Screen
          name="Exercise"
          component={Exercise}
          options={({ navigation }) => ({
            headerShown: true,
            header: () => (
              <>
                <Header title="Exercise" navigation={navigation} />

                <View>
                  <Timer
                    timerTime={timerTime}
                    isTimerRunning={isTimerRunning}
                    setTimerTime={setTimerTime}
                    setIsTimerRunning={setIsTimerRunning}
                  />
                </View>
              </>
            ),
            animation: 'none',
          })}
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
