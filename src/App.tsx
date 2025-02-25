import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';

import React, { useEffect, useState } from 'react';
import { Alert, Animated, Text, StyleSheet, View } from 'react-native';
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
import Header from './screens/common/Header';
import InitializationWrapper from './InitializationWrapper';  // 초기화 컴포넌트 가져오기
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//Screens
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


import LoadingOverlay from '../components/LoadingOverlay'; // 추가
import NetInfo from '@react-native-community/netinfo';

import ExerciseVolumeGraph from '../components/analysis/volume/ExerciseVolumeGraph';
import WeightAndDietGraph from '../components/analysis/bodyAndFood/WeightAndDietGraph';
import MuscleFatigue from '../components/analysis/faigue/MuscleFaigue';

import {
  RewardedAd,
  RewardedAdEventType, // ★ RewardedAdEventType 임포트
  TestIds,
  AdEventType,
  InterstitialAd, // ★ 전면 광고 추가
} from 'react-native-google-mobile-ads';

import { NativeModules } from 'react-native';

console.log('NativeModules:', NativeModules);

import { AppState } from 'react-native';
import useLifecycleTracking from './TrackAppLifecycle';

import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import { fetchSubscriptionStatus } from './modules/SubscriptionSlice';


// (1) 전역 또는 상단에 RewardedAd 인스턴스 생성
const rewardedAd = RewardedAd.createForAdRequest(TestIds.REWARDED);

const interstitialAd = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL); // ★ 전면 광고 추가

// QueryClient 생성
const queryClient = new QueryClient();

// RevenueCat Public API Key 
const REVENUECAT_PUBLIC_API_KEY = Platform.OS === "ios"
? "appl_uSTTOKJNVKqRDdHQicAQPIzbfam"  // iOS 키
: "goog_some_google_api_key"; // Android 키 (Google Play는 다름)

  

const Stack = createNativeStackNavigator();

function MainApp() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // 로그인 상태 확인
  const [timerTime, setTimerTime] = useState(0); // 타이머 시간 상태
  const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 실행 상태
  const [initializationComplete, setInitializationComplete] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const [isConnected, setIsConnected] = useState(true); // 네트워크 상태 관리
  const [fadeAnim] = useState(new Animated.Value(0)); // 애니메이션 값

  useEffect(() => {
    // ✅ RevenueCat 초기화 및 구독 상태 업데이트
    const setupRevenueCat = async () => {
      try {
        Purchases.configure({ apiKey: REVENUECAT_PUBLIC_API_KEY });
      } catch (error) {
        console.error("RevenueCat 설정 오류:", error);
      }
    };

    setupRevenueCat();
  }, []);

  useEffect(() => {
    // ✅ Redux Persist가 복원된 후 `fetchSubscriptionStatus()` 실행
    const unsubscribe = persistor.subscribe(() => {
        if (persistor.getState().bootstrapped) {
            store.dispatch(fetchSubscriptionStatus()); // ✅ Redux Store에서 직접 실행
            unsubscribe(); // ✅ 한 번만 실행되도록 구독 해제
        }
    });

      return () => {
          unsubscribe();
      };
  }, []);

  useEffect(() => {
    console.log("🚀 App 시작 - RevenueCat 구독 상태 감지 시작");
  
    // 리스너 함수를 변수에 저장
    const listener = () => {
      console.log("🛒 구독 상태 변경 감지됨 - 최신 상태 가져오기!");
      store.dispatch(fetchSubscriptionStatus());
    };
  
    // 리스너 등록
    Purchases.addCustomerInfoUpdateListener(listener);
  
    return () => {
      console.log("🛑 RevenueCat 구독 리스너 해제");
      // 등록한 리스너를 전달해서 제거
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);
  




  
  //firebase 애널리틱스
  useLifecycleTracking(); 

  //영상광고 로드
  useEffect(() => {
    if (!rewardedAd) return;
  
    // (2) 앱 실행 시 광고 로드
    rewardedAd.load();
  
    // (3) 이벤트 리스너 등록
    const unsubscribeLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        console.log('📢 RewardedAd Loaded in App.js');
        console.log('✅ 로드 준비 완료');
      }
    );
  
    const unsubscribeClosed = rewardedAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (!rewardedAd.loaded) {  // `loaded` 프로퍼티로 체크
          rewardedAd.load();
        }
      }
    );
  
    // 언마운트 시 리스너 정리
    return () => {
      unsubscribeLoaded?.();
      unsubscribeClosed?.();
    };
  }, []);
  
  
  useEffect(() => {
    if (!interstitialAd) return;

    // 전면 광고 로드
    interstitialAd.load();

    const unsubscribeInterstitialLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => console.log('✅ 전면 광고 로드 완료')
    );

    const unsubscribeInterstitialClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (!interstitialAd.loaded) {
          interstitialAd.load();
        }
      }
    );

    return () => {
      unsubscribeInterstitialLoaded?.();
      unsubscribeInterstitialClosed?.();
    };
  }, []);



  const handleRetry = () => {
    setErrorMessage(null);
    queryClient.refetchQueries(); // 모든 쿼리를 다시 요청
  };
  
  // 네트워크 상태 변경을 감지
  useEffect(() => {

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false); // null 값은 false로 처리
    });

    return () => unsubscribe(); // 리스너 해제
  }, []);

  // 네트워크 연결이 끊겼을 때만 경고 메시지 애니메이션 실행
  useEffect(() => {
    if (!isConnected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200, // 천천히 페이드 인
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1200, // 천천히 페이드 아웃
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(0); // 네트워크가 연결되면 애니메이션 초기화
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
          options={{ headerShown: false, animation: 'none' }}
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

        {/* 분석 페이지 */}
        <Stack.Screen
          name="Analysis"
          component={Analysis}
          options={{ headerShown: false, animation: 'none' }}
        />

        {/* 메뉴 페이지 */}
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{
            title: 'Menu',
            headerShown: false, // 헤더 보이기 설정
            ...DefaultHeaderStyles, // 스타일 적용
          }}
        />

        {/* 메뉴 번역 페이지 */}
        <Stack.Screen
          name="MenuTranslation"
          component={MenuTranslation}
          options={{
            title: 'MenuTranslation',
            headerShown: false, // 헤더 보이기 설정
            ...DefaultHeaderStyles, // 스타일 적용
          }}
        />

        {/* 메뉴 계정정보 페이지 */}
        <Stack.Screen
          name="AcountInfo"
          component={AcountInfo}
          options={{
            title: 'AcountInfo',
            headerShown: false, // 헤더 보이기 설정
            ...DefaultHeaderStyles, // 스타일 적용
          }}
        />

        {/* 메뉴 스토리지 페이지 */}
        <Stack.Screen
          name="AsyncStorage2"
          component={AsyncStorage2}
          options={{
            title: 'AsyncStorage2',
            headerShown: false, // 헤더 보이기 설정
            ...DefaultHeaderStyles, // 스타일 적용
          }}
        />

         {/* 메뉴 실험 페이지 */}
         <Stack.Screen
          name="Page"
          component={Page}
          options={{
            title: 'Page',
            headerShown: false, // 헤더 보이기 설정
            ...DefaultHeaderStyles, // 스타일 적용
          }}
        />

        {/* 운동 등록 가슴 페이지 */}
        <Stack.Screen
          name="RegistChest"
          component={RegistChest}
          // options={{ headerShown: "ture" }} // 헤더 숨김 옵션
        />



        <Stack.Screen
          name="ExerciseVolumeGraph"
          component={ExerciseVolumeGraph}
          options={{ headerShown: false, animation: 'none'}}
        />

        <Stack.Screen
          name="WeightAndDietGraph"
          component={WeightAndDietGraph}
          options={{ headerShown: false, animation: 'none'}}
        />

        <Stack.Screen
          name="MuscleFatigue"
          component={MuscleFatigue}
          options={{ headerShown: false, animation: 'none'}}
        />


        








      </Stack.Navigator>
    </NavigationContainer>
      <LoadingOverlay
          visible={false} // 기본값 false
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
      { translateX: -115 }, // width의 절반
      { translateY: -20 }, // height의 절반
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
