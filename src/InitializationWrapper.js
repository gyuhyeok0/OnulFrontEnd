import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setIsLoggedIn } from './modules/AuthSlice';  // Redux 액션 가져오기
import initializeI18n from './locales/i18n'; // i18n 초기화 함수 가져오기
// import { deleteExpiredRecords } from './modules/ExerciseRecordSlice'; // Redux 액션 가져오기
import { deleteBodyData } from './modules/BodySlice'; // Redux 액션 가져오기
import { deleteFoodData } from './modules/TotalFoodSlice';
import { analysisUpdateAPI } from './apis/AnalysisApi';
import { inspection } from './apis/Inspection';
import { Alert, BackHandler, Platform, Linking } from 'react-native';


const InitializationWrapper = ({ onInitializationComplete, setTimerTime, setIsTimerRunning }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const dispatch = useDispatch();

    const bodyData = useSelector((state) => state.body);
    const foodData = useSelector((state) => state.totalFood);
    // const exerciseData = useSelector((state)=>state.exerciseRecord)
    const memberId = useSelector((state) => state.member?.userInfo?.memberId);

    useEffect(() => {
        const initialize = async () => {
            try {
                console.log('초기화 시작');
                const cutoffDate = new Date();
                cutoffDate.setMonth(new Date().getMonth() - 6);
    
                // 1. i18n 초기화
                try {
                    console.log('i18n 초기화 시작');
                    await initializeI18n();
                    console.log('i18n 초기화 완료');
                } catch (error) {
                    console.error('i18n 초기화 오류:', error);
                }
    
        // 서버로 점검 중인지 확인
        try {
            const result = await inspection();  // ✅ 단 한 번만 호출

            console.log(result);

            
            if (result?.status === "MAINTENANCE") {
                console.log("점검 중:", result);

                // maintenanceEnd 값이 배열 형태로 들어오므로 변환
                const maintenanceEndDate = new Date(
                    result.maintenanceEnd[0], // 년
                    result.maintenanceEnd[1] - 1, // 월 (0부터 시작)
                    result.maintenanceEnd[2], // 일
                    result.maintenanceEnd[3], // 시
                    result.maintenanceEnd[4]  // 분
                );

                // 종료 시간 포맷팅 (예: 2025-01-30 05:41)
                const formattedEndTime = maintenanceEndDate.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });

                setTimeout(() => {
                    Alert.alert(
                        "점검 중",
                        `현재 서버 점검 중입니다.\n종료 시간: ${formattedEndTime}\n \n불편을 드려 죄송합니다.` +
                        (Platform.OS === "ios" ? "\n앱을 종료해주세요." : ""),  // ✅ iOS일 때 추가 메시지 표시
                        [{ 
                            text: "확인", 
                            onPress: () => {
                                if (Platform.OS === "android") {
                                    BackHandler.exitApp();  // ✅ 안드로이드에서는 앱 종료
                                } else if (Platform.OS === "ios") {
                                    // console.log("iOS에서는 사용자가 직접 앱을 종료해야 합니다.");
                                }
                            }
                        }]
                    );
                }, 0);
                

                return null;
            }

            if (result === "networkError") {
                
                    Alert.alert(
                        "점검 중",
                        `현재 서버에 문제가 있습니다. \n 잠시후에 다시 이용해주세요 \n\n 앱을 종료해주세요`,
                        [{ 
                            text: "확인", 
                            onPress: () => {
                                if (Platform.OS === "android") {
                                    BackHandler.exitApp();  // ✅ 안드로이드에서는 앱 종료
                                } else if (Platform.OS === "ios") {
                                    // console.log("iOS에서는 사용자가 직접 앱을 종료해야 합니다.");
                                }
                            }
                        }]
                    );

                return null;
            }

        } catch (error) {
            return null;
        }




                // 2. AsyncStorage에서 토큰 불러오기
                try {
                    console.log('AsyncStorage에서 토큰 불러오기 시작');
                    const token = await AsyncStorage.getItem('accessToken');
                    if (token) {
                        console.log('토큰이 존재, 로그인 상태 설정');
                        dispatch(setToken(token));
                        dispatch(setIsLoggedIn(true));
                    } else {
                        console.log('토큰이 없음, 비로그인 상태 설정');
                        dispatch(setIsLoggedIn(false));
                    }
                } catch (error) {
                    console.error('토큰 불러오기 오류:', error);
                }
    
                // 3. AsyncStorage에서 타이머 상태 복원
                try {
                    console.log('AsyncStorage에서 타이머 상태 복원 시작');
                    const [storedTimerTime, storedTimerRunning] = await Promise.all([
                        AsyncStorage.getItem('timerTime'),
                        AsyncStorage.getItem('timerRunning')
                    ]);
    
                    if (storedTimerTime && storedTimerRunning) {
                        setTimerTime(parseInt(storedTimerTime, 10));
                        setIsTimerRunning(storedTimerRunning === 'true');
                        console.log('타이머 상태 복원 완료');
                    } else {
                        setTimerTime(0);
                        setIsTimerRunning(false);
                        console.log('타이머 상태 초기화 완료');
                    }
                } catch (error) {
                    console.error('타이머 복원 오류:', error);
                }
    
                // 4. 오래된 Body 데이터 삭제
                try {
                    console.log('오래된 Body 데이터 삭제 시작');
    
                    const bodyDataEntries = Object.entries(bodyData.bodyData || {});
                    const oldKeys = bodyDataEntries
                        .filter(([dateKey]) => {
                            const [year, month, day] = dateKey.split('-').map(Number);
                            const recordDate = new Date(Date.UTC(year, month - 1, day));
                            return recordDate < cutoffDate;
                        })
                        .map(([dateKey]) => dateKey);
    
                    if (oldKeys.length > 0) {
                        dispatch(deleteBodyData({ dates: oldKeys }));
                        console.log('오래된 Body 데이터 삭제 완료:', oldKeys);
                    }
                } catch (error) {
                    console.error('Body 데이터 삭제 오류:', error);
                }
    
                // 5. 오래된 Food 데이터 삭제
                try {
                    console.log('오래된 Food 데이터 삭제 시작');
                    const foodDataEntries = Object.entries(foodData.foodRecords || {});
                    const oldFoodKeys = foodDataEntries
                        .filter(([dateKey]) => {
                            const [year, month, day] = dateKey.split('-').map(Number);
                            const recordDate = new Date(Date.UTC(year, month - 1, day));
                            return recordDate < cutoffDate;
                        })
                        .map(([dateKey]) => dateKey);
    
                    if (oldFoodKeys.length > 0) {
                        dispatch(deleteFoodData(oldFoodKeys));
                        console.log('오래된 Food 데이터 삭제 완료:', oldFoodKeys);
                    }
                } catch (error) {
                    console.error('Food 데이터 삭제 오류:', error);
                }

                if (memberId) {
                    console.log(memberId);
                    analysisUpdateAPI(memberId);
                } else {
                    // console.warn('memberId가 null이거나 undefined입니다. API 호출이 중단되었습니다.');
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
