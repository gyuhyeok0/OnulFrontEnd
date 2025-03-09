import React, { useState, useEffect, useCallback, useRef} from 'react';
import { View, StyleSheet, Text, Pressable, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useCurrentWeekAndDay } from '../../src/hooks/useCurrentWeekAndDay';
import { 
    selectChestExercises, 
    selectBackExercises, 
    selectLowerBodyExercises, 
    selectShouldersExercises, 
    selectAbsExercises, 
    selectArmsExercises, 
    selectAerobicExercises, 
    selectCustomExercises 
} from '../../src/selectors/selectors';

import EachExercise from './EachExercise';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import styles from './OnSchedule.module';


import { deleteDataFromServer, sendDataToServer } from '../../src/apis/ScheduleAPI'; 
import { callFetchScheduleAPI } from '../../src/apis/ScheduleAPI';

import AsyncStorage from '@react-native-async-storage/async-storage'; 
import RegistExerciseModal from '../../src/screens/modal/scheduleModal/RegistExerciseModal';
import { useFocusEffect } from '@react-navigation/native';
import { addDefaultSetsToRedux, resetState } from '../../src/modules/StateExerciseSlice'; // Redux 액션
import _ from 'lodash';
// import {callVolumeExerciseRecord} from '../../src/apis/ExerciseRecordAPI'
import { useTranslation } from 'react-i18next';


const OnSchedule = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    // const [memberId, setMemberId] = useState(null);
    // selectors.js 또는 memberSlice.js 안에 추가
    const memberId = useSelector((state) => state.member?.userInfo?.memberId);


    // const memberId = useSelector(state => state.memberId?.schedule || []);
    const scheduleData = useSelector(state => state.schedule?.schedule || []);

    // const { isSwapped, todayIndex } = useSelector((state) => state.week);
    const { isSwapped, todayIndex, isDateChanged } = useCurrentWeekAndDay();

    const [selectedWeekType, setSelectedWeekType] = useState();
    const [selectedDay, setSelectedDay] = useState();
    const today = ['Su', 'Mn', 'Tu', 'Ws', 'Th', 'Fr', 'Sa'][todayIndex];
    const todayKorean = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][todayIndex];

    const chestExercises = useSelector(selectChestExercises);
    const backExercises = useSelector(selectBackExercises);
    const lowerBodyExercises = useSelector(selectLowerBodyExercises);
    const shouldersExercises = useSelector(selectShouldersExercises);
    const absExercises = useSelector(selectAbsExercises);
    const armsExercises = useSelector(selectArmsExercises);
    const aerobicExercises = useSelector(selectAerobicExercises);
    const customExercises = useSelector(selectCustomExercises);

    const [scheduleHeight, setScheduleHeight] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [animationHeight] = useState(new Animated.Value(0));

    const [selectedParts, setSelectedParts] = useState({});
    const [selectedExercise, setSelectedExercise] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    // const [reorderedExercises, setReorderedExercises] = useState([]); // 순서 변경된 운동 리스트
    const [reorderedExercises, setReorderedExercises] = useState([]); // **상위에서 관리**

        // 운동 단위 기본값 지정
    const [weightUnit, setWeightUnit] = useState(null); 
    const [kmUnit, setKmUnit] = useState(null); 

    const [isReadyWeight, setIsReadyWeight] = useState(false); // 로딩 상태 추가
    const [isReadyKm, setIsReadyKm] = useState(false); // 로딩 상태 추가


    const prevExercises = useRef(reorderedExercises);

    const [mostRecordExercise, setMostRecordExercise] = useState();

    useEffect(() => {
        let addedExercises = []; // 상위 스코프에 선언
    
        if (reorderedExercises.length > 0) {
            // 추가된 항목
            addedExercises = reorderedExercises.filter(
                (exercise) => !prevExercises.current.some((prev) => prev.id === exercise.id)
            );
    
            if (addedExercises.length > 0) {
                // console.log("추가된 운동:", addedExercises.map((exercise) => exercise.id));
            }
        }
    
        // addedExercises를 기반으로 상태 업데이트
        setMostRecordExercise(addedExercises.map((exercise) => exercise.id));
    
        // 현재 상태를 이전 상태로 저장
        prevExercises.current = reorderedExercises;
    }, [reorderedExercises]);


    useEffect(() => {
        // 날짜가 변경되었을 때만 실행
        if (isDateChanged) {
            dispatch(resetState());
        }
      }, [isDateChanged]); // isDateChanged가 true일 때만 실행
    

    useEffect(() => {
        const currentWeekType = isSwapped ? 'twoWeek' : 'oneWeek';
        const today = ['Su', 'Mn', 'Tu', 'Ws', 'Th', 'Fr', 'Sa'][todayIndex];

        setSelectedWeekType(currentWeekType);
        setSelectedDay(today);
    }, [isSwapped, todayIndex]);

    // reorderedExercises가 변경될 때 Redux에 기본 세트 추가
    useEffect(() => {
        if (reorderedExercises.length > 0) {
            const exercisesWithId = reorderedExercises.map((exercise) => ({
                id: exercise.exerciseId, // exerciseId 포함
                exerciseServiceNumber: 1,
                ...exercise,
            }));
            dispatch(addDefaultSetsToRedux(exercisesWithId));
        }
    }, [reorderedExercises, dispatch]);
    


    // 스케쥴에서 운동 제거 또는 추가시 reorderedExercises 갱신
    useEffect(() => {
        const activeParts = Object.keys(selectedParts).filter((part) => selectedParts[part]);

        const newExercises = activeParts.reduce((acc, part) => {
            switch (part) {
                case '가슴':
                    return [...acc, ...chestExercises];
                case '등':
                    return [...acc, ...backExercises];
                case '하체':
                    return [...acc, ...lowerBodyExercises];
                case '어깨':
                    return [...acc, ...shouldersExercises];
                case '복근':
                    return [...acc, ...absExercises];
                case '팔':
                    return [...acc, ...armsExercises];
                case '기타':
                    return [...acc, ...aerobicExercises];
                case '커스텀':
                    return [...acc, ...customExercises];
                default:
                    return acc;
            }
        }, []);

        setReorderedExercises((prev) => {
            const updated = [...newExercises].filter(
                (exercise, index, self) =>
                    index === self.findIndex((ex) => ex.id === exercise.id) // 중복 제거
            );
        
            if (_.isEqual(prev, updated)) {
                return prev; // 상태 변경 불필요
            }
        
            return updated;
        });

    }, [
        chestExercises,
        backExercises,
        lowerBodyExercises,
        shouldersExercises,
        absExercises,
        armsExercises,
        aerobicExercises,
        customExercises,
        selectedParts,
    ]);


    const initializeReorderedExercises = async (retryCount = 0) => {

        try {
            const savedData = await AsyncStorage.getItem('reorderedExercises');
    
            if (savedData) {
                const parsedData = JSON.parse(savedData);
    
                if (
                    parsedData.weekType === selectedWeekType &&
                    parsedData.day === selectedDay
                ) {
                    if (parsedData.exercises && parsedData.exercises.length > 0) {
                        setReorderedExercises(parsedData.exercises);
                        return; // 성공적으로 데이터를 가져왔으면 종료
                    } else {
                        // console.log("exercises가 빈 배열임. 다시 시도.");
                    }
                } else {
                    setReorderedExercises([]);
                    return;
                }
            } else {
                // console.log("저장된 데이터가 없음. 다시 시도.");
            }
    
            // 최대 10번 재시도
            if (retryCount < 3) {
                setTimeout(() => initializeReorderedExercises(retryCount + 1), 500); // 500ms 후 재시도
            } else {
                // console.error("최대 재시도 횟수를 초과했습니다. 데이터를 가져오지 못했습니다.");
            }
        } catch (error) {
            console.error("운동 목록 초기화 중 오류 발생:", error);
            setReorderedExercises([]);
        }
    };
    
    // useFocusEffect에서 호출
    useFocusEffect(
        React.useCallback(() => {
            if (selectedWeekType && selectedDay) {
                initializeReorderedExercises();
            }
        }, [selectedWeekType, selectedDay])
    );
    

    const loadReorderedExercises = useCallback(async (retryCount = 0) => {
        try {
            const savedData = await AsyncStorage.getItem('reorderedExercises');
    
            // 저장된 데이터가 없거나 배열이 비어 있으면 재시도
            if ((!savedData || JSON.parse(savedData).exercises.length === 0) && retryCount < 3) {
                setTimeout(() => loadReorderedExercises(retryCount + 1), 500);
                return;
            }
    
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                const { exercises, weekType, day } = parsedData;
    
    
                // 조건이 일치하면 운동 목록 업데이트
                if (weekType === selectedWeekType && day === selectedDay) {
                    setReorderedExercises(exercises);
                } else {
                }

            } else {
                setReorderedExercises([]);
            }
        } catch (error) {
            console.error('운동 목록 로드 중 오류 발생:', error);
            setReorderedExercises([]);
        }
    }, [selectedWeekType, selectedDay]);
    


    //스토리지 저장
    const saveReorderedExercises = useCallback(async () => {
        try {
            const uniqueExercises = reorderedExercises.filter(
                (exercise, index, self) =>
                    index === self.findIndex((ex) => ex.id === exercise.id)
            );
    
            const dataToSave = {
                exercises: uniqueExercises,
                weekType: selectedWeekType,
                day: selectedDay,
            };
    
            const currentData = await AsyncStorage.getItem('reorderedExercises');
            if (currentData) {
                const parsedData = JSON.parse(currentData);
                if (JSON.stringify(parsedData) === JSON.stringify(dataToSave)) {
                    // console.log("데이터 동일, 저장 안함.");
                    return; // 저장 불필요
                }
            }
    
            await AsyncStorage.setItem('reorderedExercises', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('운동 목록 저장 중 오류 발생:', error);
        }
    }, [reorderedExercises, selectedWeekType, selectedDay]);
    
    
    // 상태가 변경될 때만 저장
    useEffect(() => {
        if (reorderedExercises.length > 0) {
            saveReorderedExercises();
        }
    }, [reorderedExercises, saveReorderedExercises]);

    useEffect(() => {
        if (!scheduleData || scheduleData.needsUpdate) {
            dispatch(callFetchScheduleAPI());
        }
    
        if (Array.isArray(scheduleData)) {
            const currentWeekType = isSwapped ? 'twoWeek' : 'oneWeek';
            const initialSelectedParts = scheduleData.reduce((acc, item) => {
                if (item.day === today && item.weekType === currentWeekType) {
                    acc[item.part] = true;
                }
                return acc;
            }, {});
            setSelectedParts(initialSelectedParts);
        } else {
            console.warn('scheduleData is not an array');
        }
    }, [dispatch, scheduleData, today, isSwapped]);

    //키보드에서 unit 변경시 스토리지 저장
    useEffect(() => {
        const updateStorage = async () => {

            try {
                if (kmUnit) {
    
                    // kmUnit에 따라 heightUnit 값 설정
                    const heightUnit = kmUnit === 'km' ? 'cm' : 'feet';
    
                    // AsyncStorage에 저장
                    await AsyncStorage.setItem('heightUnit', heightUnit);
                }
    
                if (weightUnit) {
    
                    // weightUnit 값 설정
                    const unitToSave = weightUnit === 'kg' ? 'kg' : 'lbs';
    
                    // AsyncStorage에 저장
                    await AsyncStorage.setItem('weightUnit', unitToSave);
                }
            } catch (error) {
                console.error('Error updating AsyncStorage:', error);
            }
        };
    
        updateStorage();
    }, [kmUnit, weightUnit]);
    

    //무게 단위 로드
    useEffect(() => {
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
    }, []);

    const exerciseMap = {
        '가슴': chestExercises,
        '등': backExercises,
        '하체': lowerBodyExercises,
        '어깨': shouldersExercises,
        '복근': absExercises,
        '팔': armsExercises,
        '기타': aerobicExercises,
        '커스텀': customExercises,
    };

    // 안쓰는코드

    // const renderExerciseList = (part) => {
    //     const exercises = exerciseMap[part];
    //     if (!Array.isArray(exercises) || exercises.length === 0) return null;
    //     return exercises.map((exercise, index) => (
    //         <EachExercise key={exercise.id || index} exercise={exercise} />
    //     ));
    // };

    // const todaySchedules = React.useMemo(() => {
    //     const currentWeekType = isSwapped ? 'twoWeek' : 'oneWeek';
    //     return scheduleData.filter(item => item.day === today && item.weekType === currentWeekType);
    // }, [scheduleData, today, isSwapped, refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1); // 상태값 업데이트로 강제 재렌더링 트리거
        initializeReorderedExercises(); // 추가 작업 실행
    };

    const toggleVisibility = () => {
        setIsVisible(prevState => !prevState);
        Animated.timing(animationHeight, {
            toValue: isVisible ? 0 : 85,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handlePress = useCallback(async (part) => {
        const isPartSelected = selectedParts[part];
        const updatedParts = { ...selectedParts, [part]: !isPartSelected };
        setSelectedParts(updatedParts);
    
        const exercises = exerciseMap[part];
        const hasExercisesForPart = Array.isArray(exercises) && exercises.length > 0;
    
        if (!isPartSelected) {
            // 운동 추가
            if (hasExercisesForPart) {
                setReorderedExercises((prev) => [
                    ...prev,
                    ...exercises.map((exercise) => ({
                        ...exercise,
                        part,
                    })),
                ]);
            } else {
                Alert.alert(
                    t('onSchedule.exerciseRegistrationRequired', { part: t(`bodyParts.${part}`) }),
                    t('onSchedule.pleaseRegisterExercise', { part: t(`bodyParts.${part}`) }),
                    [{ text: t('onSchedule.confirm'), onPress: () => openModal(part) }]
                );
                

                
                setSelectedParts((prevParts) => ({ ...prevParts, [part]: false }));

                return;
            }
        } else {

            if (part === "커스텀") {
                setReorderedExercises([]); // "커스텀"일 경우 배열 초기화
            } else {
                setReorderedExercises((prev) =>
                    prev.filter((exercise) => exercise.mainMuscleGroup !== part)
                );
            }
        }
    
        if (memberId) {
            try {
                if (!isPartSelected) {
                    await sendDataToServer(part, memberId, selectedWeekType, selectedDay);
                } else {
                    await deleteDataFromServer(part, memberId, selectedWeekType, selectedDay);
                    // setReorderedExercises([])
                }
                dispatch(callFetchScheduleAPI());
            } catch (error) {
                console.error('Error communicating with the server:', error);
            }
        } else {
            // Alert.alert('회원 ID를 찾을 수 없습니다.');
        }
    }, [selectedParts, memberId, selectedWeekType, selectedDay, dispatch, exerciseMap]);

    
    const openModal = useCallback((exercise) => {
        setSelectedExercise(exercise);
        setIsModalVisible(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setSelectedExercise('');
    }, []);
    

    if (!isReadyWeight || !isReadyKm) {
        return <Text>Loading...</Text>;
    }

    
    return (
        
        
        <View style={[styles.container, { minHeight: scheduleHeight + 250 }]}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.refreshButton}>
                        <Pressable
                            onPress={handleRefresh}
                            style={({ pressed }) => [
                                styles.refreshInner, // 기본 스타일
                                pressed && styles.refreshInnerPressed // 눌렀을 때 스타일 추가
                            ]}
                        >
                                <Text style={styles.refreshText}>{t(`days.${todayKorean}`)}</Text>
                            <Icon name="rotate-cw" size={15} color="white" style={styles.refreshIcon} />
                        </Pressable>
                        <Text style={styles.refreshLabel}>{t("onSchedule.customWorkout")}</Text>
                    </View>
                    <Pressable style={styles.caretButton} onPress={toggleVisibility}>
                        <Icon2 name={isVisible ? "caret-up" : "caret-down"} size={28} color="white" />
                    </Pressable>
                </View>
                
                <Animated.View style={[styles.hiddenContent, { height: animationHeight }]}>
                    {isVisible && (
                        <View style={styles.buttonContainer}>
                            {['가슴', '등', '하체', '어깨', '복근', '팔', '기타', '커스텀'].map(part => (
                                <Pressable
                                    key={part}
                                    style={[styles.button, selectedParts[part] && styles.selectedButton]}
                                    onPress={() => handlePress(part)}
                                >
                                    <Text style={[styles.buttonText, selectedParts[part] && styles.selectedButtonText]}>
                                        {t(`bodyParts.${part}`)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </Animated.View>
            </View>
            <Text style={{color:'#999999', marginLeft: 10, marginBottom: 10, fontSize: 12}}>{t("onSchedule.refreshHint")}</Text>


            {reorderedExercises.length > 0 ? (
                <View style={styles.schedule} onLayout={(event) => setScheduleHeight(event.nativeEvent.layout.height)}>
                    {reorderedExercises.map((exercise, index) => (
                        <View style={{ position: 'relative' }} key={`${exercise.id}-${index}`}>

                    <EachExercise
                        key={`${exercise.id}-${index}`} // 고유 key로 설정
                        exercise={exercise}
                        exerciseServiceNumber = {1}
                        weightUnit = {weightUnit}
                        setWeightUnit ={setWeightUnit}
                        kmUnit = {kmUnit}
                        setKmUnit ={setKmUnit}
                    />
                                                

                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.noSchedule}>
                    <Text style={styles.noScheduleText}>{t("onSchedule.noSchedule")}</Text>
                    <Pressable style={styles.noScheduleButton} onPress={() => navigation.navigate('Schedule')}>
                        <Text style={styles.noScheduleButtonText}>{t("onSchedule.goToSchedule")}</Text>
                    </Pressable>
                </View>
            )}

            <RegistExerciseModal isVisible={isModalVisible} onClose={closeModal} exercise={selectedExercise} />
        </View>
    );
};


export default OnSchedule;