import React, { useEffect, useState } from 'react';
import { Alert, Animated, Text, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store'; 
import { RootState } from "./store"; 
import Timer from '../components/header/Timer';  
import Header from './screens/common/Header';
import InitializationWrapper from './InitializationWrapper';  
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Common
import { DefaultHeaderStyles } from './screens/common/DefaultHeaderStyles.module';

// Start
import LoginScreen from './screens/start/Login';
import Signin from './screens/start/Signin';
import Signup from './screens/start/Signup';
import SignupStep1 from './screens/start/SignupStep1';
import Inquiry from './screens/start/Inquiry';

// Main
import Exercise from './screens/exercise/Exercise';
import Schedule from './screens/schedule/Schedule';
import Management from './screens/management/Management';
import Record from './screens/record/Record';
import Menu from './screens/menu/Menu';
import Analysis from './screens/analysis/Analysis';

//Subpage
import MenuTranslation from './screens/menu/MenuTranslation';
import AcountInfo from './screens/menu/AcountInfo';
import Onboarding from './screens/start/onboarding/Onboarding';
import AsyncStorage2 from './screens/menu/AsyncStorage2';
import Onboarding2 from './screens/start/onboarding/Onboarding2';
import Onboarding3 from './screens/start/onboarding/Onboarding3';
import Onboarding4 from './screens/start/onboarding/Onboarding4';

//실험페이지
import Page from './screens/menu/Page';

// 운동등록 
import RegistChest from '../components/schedule/InModalComponent/RegistChest';

import LoadingOverlay from '../components/LoadingOverlay'; 
import NetInfo from '@react-native-community/netinfo';
import ExerciseVolumeGraph from '../components/analysis/volume/ExerciseVolumeGraph';
import WeightAndDietGraph from '../components/analysis/bodyAndFood/WeightAndDietGraph';
import MuscleFatigue from '../components/analysis/faigue/MuscleFaigue';

import {
  RewardedAd,
  RewardedAdEventType, 
  TestIds,
  AdEventType,
  InterstitialAd, 
} from 'react-native-google-mobile-ads';

import useLifecycleTracking from './TrackAppLifecycle';
import rewardedAd from './ads/rewardedAdInstance';
import interstitialAd from './ads/interstitialAdInstance'; 
import analytics from '@react-native-firebase/analytics';
import { AppState } from 'react-native';

// QueryClient 생성
const queryClient = new QueryClient();



const Stack = createNativeStackNavigator();

function MainApp() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [timerTime, setTimerTime] = useState(0); 
  const [isTimerRunning, setIsTimerRunning] = useState(false); 
  const [initializationComplete, setInitializationComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(true); // 네트워크 상태 관리
  const [fadeAnim] = useState(new Animated.Value(0)); // 애니메이션 값

  console.log("실행은해?")

  //firebase 애널리틱스
  useLifecycleTracking(); 

  //영상광고 로드
  useEffect(() => {
    console.log('[App.js] 광고 초기 로딩 시도');
    rewardedAd.load();
  
    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('[App.js] 보상형 광고 로딩 완료');
    });
  
    const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('[App.js] 광고 닫힘 → 재로드 시도');
      rewardedAd.load();
    });
  
    return () => {
      unsubscribeLoaded?.();
      unsubscribeClosed?.();
    };
  }, []);
  
  
  useEffect(() => {
    interstitialAd.load();
  
    const unsubscribeLoaded = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('[App.js] 전면 광고 로딩 완료');
    });
  
    const unsubscribeClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, async () => {
      const adCloseTime = new Date().getTime();
      const adDuration = (adCloseTime - (global.__interstitialAdStart || adCloseTime)) / 1000;
  
      const userRetention = await checkUserRetention();
  
      await analytics().logEvent("ad_interstitial_closed", {
        ad_type: "interstitial",
        duration: adDuration,
        user_retention: userRetention,
      });
  
      interstitialAd.load();
    });
  
    const unsubscribeClicked = interstitialAd.addAdEventListener(AdEventType.CLICKED, async () => {
      await analytics().logEvent("ad_interstitial_clicked", {
        ad_type: "interstitial",
      });
    });
  
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeClicked();
    };
  }, []);

      // 광고 후 유저가 앱에 머무르는지 체크 (5초 후 앱 상태 확인)
      const checkUserRetention = (): Promise<"retained" | "exited"> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const isAppStillOpen = AppState.currentState === "active";
            resolve(isAppStillOpen ? "retained" : "exited");
          }, 5000);
        });
      };
      

  const handleRetry = () => {
    setErrorMessage(null);
    queryClient.refetchQueries(); 
  };
  
  // 네트워크 상태 변경을 감지
  useEffect(() => {

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false); 
    });

    return () => unsubscribe(); 
  }, []);

  // 네트워크 연결이 끊겼을 때만 경고 메시지 애니메이션 실행
  useEffect(() => {
    if (!isConnected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200, 
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1200, 
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [isConnected, fadeAnim]);

  
  // 초기화가 완료되지 않은 경우 `InitializationWrapper` 렌더링
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
    <>

    {/* 네트워크 연결 상태가 끊겼을 때만 경고 메시지 표시 */}
    {!isConnected && (
      <Animated.View style={[styles.warningContainer, { opacity: fadeAnim }]}>
          <Text style={styles.warningText}>Please Connect to a Network</Text>
      </Animated.View>
    )}

    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Exercise" : "Login"}>
        {/* 로그인 페이지 */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false, animation: 'none' }}
        />

        {/* 문의 페이지 */}
        <Stack.Screen
          name="Inquiry"
          component={Inquiry}
          options={{
            title: 'Inquiry',
            headerShown: false, // 헤더 보이기 설정
            ...DefaultHeaderStyles, // 스타일 적용
          }}
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

        {/* 온보딩 페이지 */}
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />

        {/* 온보딩 페이지 */}
        <Stack.Screen
          name="Onboarding2"
          component={Onboarding2}
          options={{ headerShown: false}}
        />

        {/* 온보딩 페이지 */}
        <Stack.Screen
          name="Onboarding3"
          component={Onboarding3}
          options={{ headerShown: false }}
        />

        {/* 온보딩 페이지 */}
        <Stack.Screen
          name="Onboarding4"
          component={Onboarding4}
          options={{ headerShown: false }}
        />

        {/* 스케쥴 페이지 */}
        <Stack.Screen
          name="Schedule"
          component={Schedule}
          options={{ headerShown: false}}
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

        {/* 분석 페이지 */}
        <Stack.Screen
          name="Analysis"
          component={Analysis}
          options={{ headerShown: false }}
        />

        {/* 메뉴 페이지 */}
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{
            title: 'Menu',
            headerShown: false, 
            ...DefaultHeaderStyles, 
          }}
        />

        {/* 메뉴 번역 페이지 */}
        <Stack.Screen
          name="MenuTranslation"
          component={MenuTranslation}
          options={{
            title: 'MenuTranslation',
            headerShown: false, 
            ...DefaultHeaderStyles, 
          }}
        />

        {/* 메뉴 계정정보 페이지 */}
        <Stack.Screen
          name="AcountInfo"
          component={AcountInfo}
          options={{
            title: 'AcountInfo',
            headerShown: false, 
            ...DefaultHeaderStyles, 
          }}
        />

        <Stack.Screen
          name="AsyncStorage2"
          component={AsyncStorage2}
          options={{
            title: 'AsyncStorage2',
            headerShown: false, 
            ...DefaultHeaderStyles, 
          }}
        />

         <Stack.Screen
          name="Page"
          component={Page}
          options={{
            title: 'Page',
            headerShown: false, 
            ...DefaultHeaderStyles, 
          }}
        />

        {/* 운동 등록 가슴 페이지 */}
        <Stack.Screen
          name="RegistChest"
          component={RegistChest}
        />

        <Stack.Screen
          name="ExerciseVolumeGraph"
          component={ExerciseVolumeGraph}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="WeightAndDietGraph"
          component={WeightAndDietGraph}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MuscleFatigue"
          component={MuscleFatigue}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
      <LoadingOverlay
          visible={false} 
        />
    </> 
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MainApp />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  warningContainer: {
    position: 'absolute',
    top: '13%',
    left: '50%',
    backgroundColor: '#070710',
    padding: 10,
    alignItems: 'center',
    zIndex: 9999,
    width: 220,
    height: 35,
    borderRadius: 30,
    transform: [
      { translateX: -115 }, 
      { translateY: -20 }, 
    ],
  },
  warningText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
