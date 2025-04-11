import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Animated } from 'react-native';
import { sendIntensityToServer } from '../../../src/hooks/Intensity'; // 함수 가져오기
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기
import { isSameDay } from 'date-fns'; // 날짜 비교를 위한 라이브러리
import DefaltSetting from './DefaltSetting.js';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { aiRequset, autoAdaptExercises, changePriorityPartsSetting } from '../../../src/apis/AutoAdapt.js';
import { useCurrentWeekAndDay } from '../../../src/hooks/useCurrentWeekAndDay.js';
import { setWeekState } from '../../../src/modules/WeekReducer.js';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { ActivityIndicator } from 'react-native';
import { store } from '../../../src/store.js';
import { addDefaultSetsToRedux } from '../../../src/modules/StateExerciseSlice.js';
import EachExercise from '../EachExercise.js';
import AutoAdaptLoading from './AutoAdaptLoading.js';
import { useTranslation } from 'react-i18next';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import useCheckDateChange from '../../../src/hooks/useCheckDateChange.js';

// 운동 메뉴의 자동적응 코드
const AutoAdapt = () => {
    const { isDateChangedReducer } = useCheckDateChange();

    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = useState(false);
    const [updateCount, setUpdateCount] = useState(0); 
    const memberId = useSelector((state) => state.member?.userInfo?.memberId);
    const isDateTriggered = useRef(false); // ✅ 날짜 변경으로 실행되었는지 여부 저장
    const [isLoading, setIsLoading] = useState(false);
    const [reorderedExercises, setReorderedExercises] = useState([]);

    const [weightUnit, setWeightUnit] = useState(null); 
    const [kmUnit, setKmUnit] = useState(null); 

    const [scheduleHeight, setScheduleHeight] = useState(0);

    const [isReadyWeight, setIsReadyWeight] = useState(false); // 로딩 상태 추가
    const [isReadyKm, setIsReadyKm] = useState(false); // 로딩 상태 추가
    const { t } = useTranslation();
    const isMounted = useRef(false); // 컴포넌트 마운트 상태 추적

    useFocusEffect(
        useCallback(() => {
            isDateChangedReducer;
        }, [])
    );

    // ✅ 운동 세팅을 바꿨을 때 실행 (단, isDateChanged로 인해 실행된 경우 제외)
    useEffect(() => {

        if (!isMounted.current) {
            isMounted.current = true; // 첫 번째 마운트 후 실행되지 않도록 설정
            return;
        }

        // 시작시 동작 아님
        // 날짜 확인해야함
        const checkDate = false;
        const initialization = false;
        
        // ✅ 날짜 변경(`isDateChanged`)으로 실행된 경우, 실행하지 않음
        if (updateCount === 0 || isDateTriggered.current) {
            isDateTriggered.current = false; // ✅ 다음 updateCount 변화부터는 실행 가능
            return;
        }
    
        // 요청 시작 -> 로딩 상태로 변경
        setIsLoading(true);

        aiRequset(memberId, checkDate, initialization)
            .then((result) => {
                // console.log("📌 AI 요청 결과:", result);
            })
            .catch((error) => {
                console.error("❌ AI 요청 실패:", error);
            })

            
        .finally(async () => {
            // 요청이 끝났으면 로딩 상태 해제
            setIsLoading(false);
            // ✅ autoAdaptExercises가 비동기 함수라면, async/await 사용
            try {
                const data = await autoAdaptExercises(memberId);
                setReorderedExercises([]);  // 기존 데이터 초기화
                setReorderedExercises(data); // 새로운 데이터 설정

            } catch (error) {
                console.error("❌ autoAdaptExercises 실패:", error);
            }
        });
    }, [updateCount]);


    // 애니메이션 값 설정 (초기값: 0 → 안 보이게 설정)
    const animationHeight = useRef(new Animated.Value(0)).current;

    // 토글 시 애니메이션 실행
    const toggleVisibility = () => {
        setIsVisible((prev) => !prev); // 상태 변경

        Animated.timing(animationHeight, {
            toValue: isVisible ? 0 : 450, // 애니메이션 길이 조정 (100은 예제, 필요에 따라 조정)
            duration: 300, 
            useNativeDriver: false, 
        }).start();
    };

    // -------------------------------------

    useEffect(() => {
        let timer = null;  // 타이머를 저장할 변수 선언

        const fetchData = async () => {

            try {
                const lastRun = await AsyncStorage.getItem('initialLastAiRequestTime');
                const now = Date.now();
                
                if (lastRun && now - parseInt(lastRun, 10) < 30000) {
                    console.log("⏳ 30초 이내 재실행 방지됨!");
                    return; 
                }
    
                console.log("ai 요청함")


                const data = await autoAdaptExercises(memberId);
                console.log("자동 적응 운동 데이터:", data);
                setReorderedExercises(data);

                if (!data || data.length === 0) {

                    const checkDate = true;
                    const initialization = true;
            
                    // 초기 로딩 디자인을 위해 2초 지연
                    timer = setTimeout(async () => {
                        // AI 요청 실행
                        await aiRequset(memberId, checkDate, initialization);
            
                        // AI 요청 후 다시 데이터 가져오기
                        const newData = await autoAdaptExercises(memberId);
                        setReorderedExercises(newData);
                        await AsyncStorage.setItem('initialLastAiRequestTime', now.toString());
                    }, 2000);
                } else {
                    // console.log("✅ 자동 적응 운동 데이터:", data);
                    setReorderedExercises(data);
                }
                
            } catch (error) {
                console.error("데이터 불러오기 오류:", error);
            }
        };
    
        fetchData();

        return () => {
            if (timer) {
                clearTimeout(timer);  // 컴포넌트 언마운트 시 타이머 정리
            }
        };
    }, []);

    // reorderedExercises가 변경될 때 Redux에 기본 세트 추가
    useEffect(() => {
        if (reorderedExercises.length > 0) {
            const exercisesWithId = reorderedExercises.map((exercise) => ({
                id: exercise.exerciseId, // exerciseId 포함
                exerciseServiceNumber: 3,
                ...exercise,
            }));
            dispatch(addDefaultSetsToRedux(exercisesWithId));
        }
    }, [reorderedExercises, dispatch]);
    
    //키보드에서 unit 변경시 스토리지 저장
        useEffect(() => {
            const updateStorage = async () => {
                try {
                    if (kmUnit) {
                        // console.log("kmUnit 변경됨 = " + kmUnit);
        
                        // kmUnit에 따라 heightUnit 값 설정
                        const heightUnit = kmUnit === 'km' ? 'cm' : 'feet';
        
                        // AsyncStorage에 저장
                        await AsyncStorage.setItem('heightUnit', heightUnit);
                        // console.log("heightUnit 저장됨: " + heightUnit);
                    }
        
                    if (weightUnit) {
                        // console.log("weightUnit 변경됨 = " + weightUnit);
        
                        // weightUnit 값 설정
                        const unitToSave = weightUnit === 'kg' ? 'kg' : 'lbs';
        
                        // AsyncStorage에 저장
                        await AsyncStorage.setItem('weightUnit', unitToSave);
                        // console.log("weightUnit 저장됨: " + unitToSave);
                    }
                } catch (error) {
                    console.error('Error updating AsyncStorage:', error);
                }
            };
        
            updateStorage();
        }, [kmUnit, weightUnit]);
        
        

        // 무게 단위 및 거리 단위 로드 (화면 진입 시마다 실행됨)
        useFocusEffect(
            useCallback(() => {
            const fetchUnits = async () => {
                try {
                // 무게 단위 로드
                const unitKg = await AsyncStorage.getItem('weightUnit');
                setWeightUnit(unitKg || 'kg');
                setIsReadyWeight(true); // 무게 단위 로딩 완료
        
                // 거리 단위 로드
                const unitKm = await AsyncStorage.getItem('heightUnit');
                if (unitKm === 'feet') {
                    setKmUnit('mi');
                } else if (unitKm === 'cm') {
                    setKmUnit('km');
                } else {
                    setKmUnit(unitKm || 'km');
                }
                setIsReadyKm(true); // 거리 단위 로딩 완료
                } catch (error) {
                console.error('Error fetching units:', error);
                }
            };
        
            fetchUnits();
            }, [])
        );

    return (
        <View style={{ width: '100%', backgroundColor: '#15181C', padding: 10 }}>
            
            {/* 헤더 - 클릭하면 애니메이션 실행 */}
            <Pressable 
                style={[
                    styles.headerContent,
                    isVisible 
                        ? { borderTopLeftRadius: 10, borderTopRightRadius: 10 } // "caret-up" 상태 → 모든 모서리 둥글게
                        : { borderRadius: 10 } // "caret-down" 상태 → 위쪽만 둥글게
                ]}
                onPress={toggleVisibility}
            >   
                <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={styles.refreshLabel}>{t('autoAdapt.todayWorkout')}</Text>
                {isLoading && (
                    <View style={{marginLeft: 10, flexDirection:'row', alignItems:'center'}}>
                        <ActivityIndicator size="small" color="white" />
                        <Text style={{ color: 'white', marginLeft: 5 }}>{t('autoAdapt.waitMessage')}</Text>
                    </View>
                    )}
                </View>
                <Icon2 name={isVisible ? "caret-up" : "caret-down"} size={28} color="white" />
            </Pressable>


            {/* 애니메이션이 적용된 영역 (caret-down 상태일 때만 렌더링) */}
            {isVisible && (
                <Animated.View style={[styles.animatedContainer, { height: animationHeight }]}>
                    <DefaltSetting setUpdateCount={setUpdateCount} isLoading={isLoading}/>
                </Animated.View>
            )}

            <View style={{height:15}}></View>

            {reorderedExercises.length > 0 ? (
                <View style={styles.schedule}>
                    {reorderedExercises.map((exercise, index) => (
                        <View style={{ position: 'relative' }} key={`${exercise.id}-${index}`}>

                    <EachExercise
                        key={`${exercise.id}-${index}`} // 고유 key로 설정
                        exercise={exercise}
                        exerciseServiceNumber = {3}
                        weightUnit = {weightUnit}
                        setWeightUnit ={setWeightUnit}
                        kmUnit = {kmUnit}
                        setKmUnit ={setKmUnit}
                    />
                                                

                        </View>
                    ))}
                </View>
            ) : (
                <AutoAdaptLoading/>
            )}

            <View style={{height: 300}}></View>


        </View>
    );
};

const styles = StyleSheet.create({
    animatedContainer: {
        overflow: 'hidden', // 높이 조정 시 자연스럽게 숨기기
    },
    intensityContainer: {
        marginTop: 20
    },
    intensityWrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 15,
    },
    
    intensityButton: {
        paddingVertical: 9,
        paddingHorizontal: 25,
        backgroundColor: '#1A1C22',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#4E5157',
    },
    selectedButton: {
        borderColor: 'white',
    },
    intensityText: {
        color: '#9E9E9E',
        fontSize: 13,
        fontWeight: 'bold',
    },
    selectedText: {
        color: '#FFFFFF', // 선택된 버튼의 텍스트 색상
    },

    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        minHeight: 40,
        backgroundColor: '#222732',
        padding: 8,
        alignItems: 'center',
    },
    

    refreshLabel: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 2,
    },
});

export default AutoAdapt;