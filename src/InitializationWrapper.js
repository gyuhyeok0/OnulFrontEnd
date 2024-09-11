import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import SplashScreen from 'react-native-splash-screen';
import { useDispatch } from 'react-redux';
import { setToken, setIsLoggedIn } from './modules/AuthSlice';  // Redux 액션 가져오기
import initializeI18n from './locales/i18n'; // i18n 초기화 함수 가져오기


// 앱시작시 시작 
const InitializationWrapper = ({ onInitializationComplete, setTimerTime, setIsTimerRunning }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const initialize = async () => {
        try {
            // i18n 초기화가 완료될 때까지 대기
            await initializeI18n();

            // AsyncStorage에서 토큰 불러오기
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
            dispatch(setToken(token)); // 토큰을 저장
            dispatch(setIsLoggedIn(true)); // 로그인 상태로 설정
            } else {
            dispatch(setIsLoggedIn(false)); // 비로그인 상태로 설정
            }

            // AsyncStorage에서 타이머 상태 복원
            const [storedTimerTime, storedTimerRunning] = await Promise.all([
            AsyncStorage.getItem('timerTime'),
            AsyncStorage.getItem('timerRunning')
            ]);

            // 타이머 데이터가 존재할 경우에만 복원
            if (storedTimerTime && storedTimerRunning) {
            setTimerTime(parseInt(storedTimerTime, 10)); // 타이머 시간 복원
            setIsTimerRunning(storedTimerRunning === 'true'); // 타이머 실행 상태 복원
            } else {
            // 타이머 데이터가 없으면 초기화 상태로 설정
            setTimerTime(0);
            setIsTimerRunning(false);
            }

            // 초기화 완료 후 렌더링 허용
            setIsInitialized(true);
            SplashScreen.hide(); // 스플래시 화면 숨기기

            // 초기화 완료 시 콜백 호출
            if (onInitializationComplete) {
            onInitializationComplete();
            }
        } catch (error) {
            console.error("Initialization failed:", error);
        }
        };

        initialize();
    }, [dispatch, setTimerTime, setIsTimerRunning, onInitializationComplete]);

    // 초기화가 완료되지 않은 상태에서는 아무것도 렌더링하지 않음
    if (!isInitialized) {
        return null;
    }

    return null; // 초기화가 완료되면 렌더링할 내용 없음
};

export default InitializationWrapper;
