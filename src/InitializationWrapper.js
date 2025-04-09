import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setIsLoggedIn } from './modules/AuthSlice';  
import initializeI18n from './locales/i18n'; 
import { deleteBodyData } from './modules/BodySlice'; 
import { deleteFoodData } from './modules/TotalFoodSlice';
import { lastLoginRunDateAPI } from './apis/AnalysisApi';
import { inspection } from './apis/Inspection';
import { Alert, BackHandler, Platform } from 'react-native';
import { checkAppVersion } from './CheckAppVersion';
import i18n from 'i18next';


const InitializationWrapper = ({ onInitializationComplete, setTimerTime, setIsTimerRunning }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const dispatch = useDispatch();

    const bodyData = useSelector((state) => state.body);
    const foodData = useSelector((state) => state.totalFood);
    const memberId = useSelector((state) => state.member?.userInfo?.memberId);

    useEffect(() => {
        const initialize = async () => {

            try {
                const cutoffDate = new Date();
                cutoffDate.setMonth(new Date().getMonth() - 3);
    
                try {
                    await initializeI18n();
                    
                } catch (error) {
                    console.error('i18n 초기화 오류:', error);
                }


            try {
                const result = await inspection();  

                
                if (result?.status === "MAINTENANCE") {

                    const maintenanceEndDate = new Date(
                        result.maintenanceEnd[0], // 년
                        result.maintenanceEnd[1] - 1, // 월 
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
                            i18n.t('maintenance.title'),
                            `${i18n.t('maintenance.message')}\n${i18n.t('maintenance.end_time')} ${formattedEndTime}\n\n${i18n.t('maintenance.apology')}` +
                            (Platform.OS === "ios" ? `\n${i18n.t('maintenance.ios_notice')}` : ""),  // ✅ iOS일 때 추가 메시지 표시
                            [{ 
                                text: i18n.t('maintenance.confirm'), 
                                onPress: () => {
                                    if (Platform.OS === "android") {
                                        BackHandler.exitApp();  
                                    }
                                }
                            }]
                        );
                    }, 0);
                    
                    

                    return null;
                }

                if (result === "networkError") {
                    
                    Alert.alert(
                        i18n.t('server_error.title'),
                        `${i18n.t('server_error.message')}\n\n${i18n.t('server_error.close_app')}`,
                        [{ 
                            text: i18n.t('server_error.confirm'), 
                            onPress: () => {
                                if (Platform.OS === "android") {
                                    BackHandler.exitApp();  
                                }
                            }
                        }]
                    );
                    

                    return null;
                }

            } catch (error) {
                return null;
            }


            try {
                const isVersionValid = await checkAppVersion(); 
                
                if (!isVersionValid) {
                    return null; 
                }
            } catch (error) {
                console.error("버전 체크 중 오류 발생:", error);
                return null; 
            }


            // 2. AsyncStorage에서 토큰 불러오기
            try {
                const token = await AsyncStorage.getItem('accessToken');
                if (token) {
                    dispatch(setToken(token));
                    dispatch(setIsLoggedIn(true));
                } else {
                    dispatch(setIsLoggedIn(false));
                }
            } catch (error) {
                console.error('토큰 불러오기 오류:', error);
            }
    
            // 3. AsyncStorage에서 타이머 상태 복원
            try {
                const [storedTimerTime, storedTimerRunning] = await Promise.all([
                    AsyncStorage.getItem('timerTime'),
                    AsyncStorage.getItem('timerRunning')
                ]);
    
                if (storedTimerTime && storedTimerRunning) {
                    setTimerTime(parseInt(storedTimerTime, 10));
                    setIsTimerRunning(storedTimerRunning === 'true');
                } else {
                    setTimerTime(0);
                    setIsTimerRunning(false);
                }
            } catch (error) {
                console.error('타이머 복원 오류:', error);
            }
    
            // 4. 오래된 Body 데이터 삭제
            try {
    
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
                }
            } catch (error) {
                console.error('Body 데이터 삭제 오류:', error);
            }
    
            // 5. 오래된 Food 데이터 삭제
            try {
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
                }
            } catch (error) {
                console.error('Food 데이터 삭제 오류:', error);
            }

            const storedAPI = await AsyncStorage.getItem('API_URL'); 

            async function lastLoginDateForAnalysis() {
                try {
                    const lastRunDate = await AsyncStorage.getItem('lastLoginRunDate');
                    const currentDate = new Date().toISOString().split('T')[0];
            

                    if (lastRunDate !== currentDate) {
                        if (storedAPI && memberId) {
                            await lastLoginRunDateAPI(memberId); // 분석을 위한 로그인 체크 요청
                            await AsyncStorage.setItem('lastLoginRunDate', currentDate); // 날짜 저장
                        } else {
                            console.log("Missing storedAPI or memberId. Skipping analysis update.");
                        }
                    } else {
                        console.log("하루에 한 번만 실행됩니다. 이번에는 실행하지 않습니다.");
                    }
                } catch (error) {
                    console.error("분석 업데이트 중 에러 발생:", error);
                }
            }
            
            await lastLoginDateForAnalysis();


    
            setIsInitialized(true);
    
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
    
    // 초기화가 완료되면 스플래시 화면 숨기기
    useEffect(() => {
        if (isInitialized) {
            SplashScreen.hide();
        }
    }, [isInitialized]);

    // 초기화가 완료되지 않은 상태에서는 아무것도 렌더링하지 않음
    if (!isInitialized) {
        return null;
    }

    return null; // 초기화가 완료되면 렌더링할 내용 없음
};

export default InitializationWrapper;