import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import SplashScreen from 'react-native-splash-screen';
import { useDispatch } from 'react-redux';
import { setToken, setIsLoggedIn } from './modules/AuthSlice';  // Redux 액션 가져오기
import initializeI18n from './locales/i18n'; // i18n 초기화 함수 가져오기

const InitializationWrapper = ({ onInitializationComplete, setTimerTime, setIsTimerRunning }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const initialize = async () => {
            try {
                console.log('i18n 초기화 시작');
                // i18n 초기화가 완료될 때까지 대기
                await initializeI18n();
                console.log('i18n 초기화 완료');

                console.log('AsyncStorage에서 토큰 불러오기 시작');
                // AsyncStorage에서 토큰 불러오기
                const token = await AsyncStorage.getItem('accessToken');
                if (token) {
                    console.log('토큰이 존재, 로그인 상태 설정');
                    dispatch(setToken(token)); // 토큰을 저장
                    dispatch(setIsLoggedIn(true)); // 로그인 상태로 설정
                } else {
                    console.log('토큰이 없음, 비로그인 상태 설정');
                    dispatch(setIsLoggedIn(false)); // 비로그인 상태로 설정
                }

                console.log('AsyncStorage에서 타이머 상태 복원 시작');
                // AsyncStorage에서 타이머 상태 복원
                const [storedTimerTime, storedTimerRunning] = await Promise.all([
                    AsyncStorage.getItem('timerTime'),
                    AsyncStorage.getItem('timerRunning')
                ]);

                if (storedTimerTime && storedTimerRunning) {
                    console.log('타이머 상태 복원');
                    setTimerTime(parseInt(storedTimerTime, 10)); // 타이머 시간 복원
                    setIsTimerRunning(storedTimerRunning === 'true'); // 타이머 실행 상태 복원
                } else {
                    console.log('타이머 상태가 없으므로 초기화');
                    setTimerTime(0); // 타이머 시간 초기화
                    setIsTimerRunning(false); // 타이머 실행 상태 초기화
                }

        
                // 만료된 스토리지 삭제 (기간 1년)
                // AsyncStorage에서 모든 키 가져오기
                const allKeys = await AsyncStorage.getAllKeys();

                // exerciseId, memberId, exerciseService, recordDate와 관련된 키들만 필터링
                const exerciseRecordKeys = allKeys.filter((key) => key.match(/^\d+_\w+_\d+_\d{4}-\d{2}-\d{2}$/));
                console.log('exerciseRecord 키들만 필터링:', exerciseRecordKeys);

                // 필터된 키들만 순회하며 만료된 데이터 삭제
                for (const key of exerciseRecordKeys) {
                    const storedData = await AsyncStorage.getItem(key);
                    if (storedData) {
                        const parsedData = JSON.parse(storedData);
                        const expirationDate = new Date(parsedData.expirationDate);
                        const currentDate = new Date();
                        
                        if (expirationDate < currentDate) {
                            console.log(`스토리지 데이터 만료, 삭제합니다: ${key}`);
                            await AsyncStorage.removeItem(key);
                        }
                    }
                }

                console.log('초기화 완료');
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
