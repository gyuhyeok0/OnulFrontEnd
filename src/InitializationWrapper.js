import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setIsLoggedIn } from './modules/AuthSlice';  // Redux 액션 가져오기
import initializeI18n from './locales/i18n'; // i18n 초기화 함수 가져오기
import { deleteExpiredRecords } from './modules/ExerciseRecordSlice'; // Redux 액션 가져오기
import { deleteBodyData } from './modules/BodySlice'; // Redux 액션 가져오기
import { deleteFoodData } from './modules/TotalFoodSlice';

const InitializationWrapper = ({ onInitializationComplete, setTimerTime, setIsTimerRunning }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const dispatch = useDispatch();

    // 새로운 방식: YYYY-M-D 형식
    const dateKey = new Date()
        .toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' }); // YYYY-M-D 형식

    const bodyData = useSelector((state) => state.body);
    const foodData = useSelector((state) => state.totalFood);

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

                // 모든 키 가져오기
                const allKeys = await AsyncStorage.getAllKeys();
                console.log('전체 키:', allKeys);

                // 숫자_숫자_날짜 형식에서 만료된 데이터만 필터링
                const currentDate = new Date();
                const expiredKeys = (
                    await Promise.all(
                        allKeys.map(async (key) => {
                            if (!key.match(/^\d+_\d+_\d{4}-\d{2}-\d{2}$/)) {
                                return null; // 형식이 맞지 않는 키는 제외
                            }

                            const storedData = await AsyncStorage.getItem(key);
                            if (storedData) {
                                try {
                                    const parsedData = JSON.parse(storedData);

                                    // expirationDate 확인
                                    if (parsedData.expirationDate) {
                                        const expirationDate = new Date(parsedData.expirationDate);
                                        if (expirationDate < currentDate) {
                                            return key; // 만료된 키 반환
                                        }
                                    }
                                } catch (error) {
                                    console.error(`키 ${key}의 JSON 파싱 오류:`, error);
                                }
                            }
                            return null; // 유효하지 않거나 만료되지 않은 키는 제외
                        })
                    )
                ).filter(Boolean); // null 값을 제거

                console.log('만료된 키 목록:', expiredKeys);

                // Redux에서 만료된 데이터 삭제
                if (expiredKeys.length > 0) {
                    console.log('Redux 상태에서 만료된 데이터 삭제 시작');
                    dispatch(deleteExpiredRecords(expiredKeys));
                    console.log('Redux 상태 업데이트 완료');
                }

                // AsyncStorage에서 만료된 데이터 삭제
                await Promise.all(
                    expiredKeys.map(async (key) => {
                        try {
                            console.log(`AsyncStorage에서 데이터 삭제: ${key}`);
                            await AsyncStorage.removeItem(key);
                        } catch (error) {
                            console.error(`키 ${key} 삭제 중 오류 발생:`, error);
                        }
                    })
                );            
                
                // console.log(bodyData);

                // cutoffDate 정의
                const cutoffDate = new Date();
                cutoffDate.setMonth(currentDate.getMonth() - 6); // 6개월 전 기준 날짜 계산
            
                // console.log('기준 날짜:', cutoffDate.toISOString().split('T')[0]);

                const bodyDataEntries = Object.entries(bodyData.bodyData || {}); // bodyData 엔트리 가져오기

                const oldKeys = bodyDataEntries
                    .filter(([dateKey]) => {
                        const [year, month, day] = dateKey.split('-').map(Number); // 키를 YYYY-MM-DD로 분리
                        const recordDate = new Date(Date.UTC(year, month - 1, day)); // UTC 기준 Date 객체 생성

                        console.log('dateKey:', dateKey, 'recordDate:', recordDate, 'isOld:', recordDate < cutoffDate);

                        return recordDate < cutoffDate; // 기준 날짜와 비교
                    })
                    .map(([dateKey]) => dateKey); // 오래된 키만 추출

                // console.log('삭제할 오래된 키:', oldKeys);

                // Redux 에서 삭제
                if (oldKeys.length > 0) {
                    dispatch(deleteBodyData({ dates: oldKeys })); // Redux에서 삭제
                    console.log('Redux 상태 업데이트 완료');
                }


                // foodData 오래된 데이터 삭제
                const foodDataEntries = Object.entries(foodData.foodRecords || {});

                // 필터링 전에 현재 상태 확인
                console.log('현재 foodRecords:', foodData.foodRecords);

                const oldFoodKeys = (
                    foodDataEntries
                        .filter(([dateKey]) => {
                            const [year, month, day] = dateKey.split('-').map(Number);
                            const recordDate = new Date(Date.UTC(year, month - 1, day));
                            return recordDate < cutoffDate; // 기준 날짜 이전 데이터
                        })
                        .map(([dateKey]) => dateKey)
                ) || []; // 기본값 빈 배열
                
                console.log('삭제 대상 날짜:', oldFoodKeys);
                
                if (oldFoodKeys.length > 0) {
                    dispatch(deleteFoodData(oldFoodKeys));
                    console.log('Food data에서 오래된 데이터 삭제:', oldFoodKeys);
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
