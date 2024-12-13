import React, { useState, useEffect, useCallback } from 'react';
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


const OnSchedule = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [memberId, setMemberId] = useState(null);
    const scheduleData = useSelector(state => state.schedule?.schedule || []);
    const { isSwapped, todayIndex } = useCurrentWeekAndDay();
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
    const [selectedWeekType, setSelectedWeekType] = useState();
    const [selectedDay, setSelectedDay] = useState();
    const [selectedExercise, setSelectedExercise] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reorderedExercises, setReorderedExercises] = useState([]); // 순서 변경된 운동 리스트
    

    const [exerciseSets, setExerciseSets] = useState({}); // 모든 운동의 세트 정보를 저장

      // 운동 세트 상태 업데이트 함수
    const updateExerciseSets = (exerciseId, updatedSets) => {
        setExerciseSets((prev) => ({
            ...prev,
            [exerciseId]: updatedSets,
        }));
    };

    // 날짜가 변경되었을때 세트 상태 초기화
    useEffect(() => {
        const resetAllSets = () => {
            setExerciseSets(() => {
                const resetSets = {};
                reorderedExercises.forEach((exercise) => {
                    resetSets[exercise.id] = [
                        { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                        { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                        { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                    ];
                });
                return resetSets;
            });
        };
    
        resetAllSets(); // 초기화 실행
    }, [todayIndex]); // `todayIndex`가 바뀔 때마다 실행
    
    
    

     // 초기화 - 운동 목록이 바뀔 때 기본 세트 추가
    useEffect(() => {
        setExerciseSets((prev) => {
            const updated = { ...prev };
            reorderedExercises.forEach((exercise) => {
                if (!updated[exercise.id]) {
                    updated[exercise.id] = [
                        { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                        { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                        { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                    ];
                }
            });
            return updated;
        });

    }, [reorderedExercises]);

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
            const updated = [...newExercises];
            return updated.filter(
                (exercise, index, self) =>
                    index === self.findIndex((ex) => ex.id === exercise.id) // 중복 제거
            );
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

    // 스케쥴에서 순서 변경시 적용
    useFocusEffect(
        React.useCallback(() => {            
            if (selectedWeekType && selectedDay) {
                // console.log("작동하니?")
                const initializeReorderedExercises = async () => {
                    try {
                        const savedData = await AsyncStorage.getItem('reorderedExercises');
                        console.log(savedData)
                        if (savedData) {
                            const parsedData = JSON.parse(savedData);
                            if (
                                parsedData.weekType === selectedWeekType &&
                                parsedData.day === selectedDay
                            ) {
                                setReorderedExercises(parsedData.exercises);
                            }
                        }
                    } catch (error) {
                        console.error("운동 목록 초기화 중 오류 발생:", error);
                    }
                };
    
                initializeReorderedExercises();
            }
        }, [selectedWeekType, selectedDay]) // `selectedWeekType`과 `selectedDay`를 의존성에 추가
    );
    

    const loadReorderedExercises = useCallback(async (retryCount = 0) => {

        try {
            const savedData = await AsyncStorage.getItem('reorderedExercises');
            // console.log("스토리지에 저장된 데이터"+ savedData)
    
            // 저장된 데이터가 없거나 운동 배열이 비어있을 경우
            if ((!savedData || JSON.parse(savedData).exercises.length === 0) && retryCount < 3) {
                // console.log("스토리지에 저장된 데이터가 없습니다.")
                setTimeout(() => loadReorderedExercises(retryCount + 1), 500); // 500ms 대기 후 재시도
                return;
            }
    
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                    
                // 예상치 못한 데이터 형식을 처리
                if (!parsedData || !Array.isArray(parsedData.exercises)) {
                    setReorderedExercises([]);
                    return;
                }
    
                const { exercises, weekType, day } = parsedData;
                if (weekType === selectedWeekType && day === selectedDay) {

                    // console.log("스토리지에 데이터가 있습니다.")
                    setReorderedExercises(exercises);
                }
            } else {
                // console.log('저장된 데이터가 없습니다.');
                setReorderedExercises([]); // 기본값 설정
            }
        } catch (error) {
            console.error('운동 목록 로드 중 오류 발생:', error);
            setReorderedExercises([]); // 오류 발생 시 빈 배열로 초기화
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
                    return;
                }
            }
    
            await AsyncStorage.setItem('reorderedExercises', JSON.stringify(dataToSave));
            console.log('운동 목록 저장 완료');
        } catch (error) {
            console.error('운동 목록 저장 중 오류 발생:', error);
        }
    }, [reorderedExercises, selectedWeekType, selectedDay]);
    
    
    // 상태가 변경될 때만 저장
    useEffect(() => {
        saveReorderedExercises(); // 빈 배열 포함 모든 경우 저장
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

    useEffect(() => {
        const fetchMemberId = async () => {
            try {
                const id = await AsyncStorage.getItem('memberId');
                if (id) setMemberId(id);
            } catch (error) {
                console.error('Error fetching memberId:', error);
            }
        };
        fetchMemberId();
    }, []);

    useEffect(() => {
        const currentWeekType = isSwapped ? 'twoWeek' : 'oneWeek';
        const today = ['Su', 'Mn', 'Tu', 'Ws', 'Th', 'Fr', 'Sa'][todayIndex];
        setSelectedWeekType(currentWeekType);
        setSelectedDay(today);
    }, [isSwapped, todayIndex]);


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

    const renderExerciseList = (part) => {
        const exercises = exerciseMap[part];
        if (!Array.isArray(exercises) || exercises.length === 0) return null;
        return exercises.map((exercise, index) => (
            <EachExercise key={exercise.id || index} exercise={exercise} />
        ));
    };

    const todaySchedules = React.useMemo(() => {
        const currentWeekType = isSwapped ? 'twoWeek' : 'oneWeek';
        return scheduleData.filter(item => item.day === today && item.weekType === currentWeekType);
    }, [scheduleData, today, isSwapped, refreshKey]);

    const handleRefresh = () => setRefreshKey(prevKey => prevKey + 1);

    const toggleVisibility = () => {
        setIsVisible(prevState => !prevState);
        Animated.timing(animationHeight, {
            toValue: isVisible ? 0 : 75,
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
                Alert.alert(`${part} 운동 등록 필요`, `먼저 ${part} 운동을 등록해주세요.`, [
                    { text: "확인", onPress: () => openModal(part) },
                ]);
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
            Alert.alert('회원 ID를 찾을 수 없습니다.');
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
    

    return (
        
        
        <View style={[styles.container, { minHeight: scheduleHeight + 250 }]}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Pressable style={styles.refreshButton} onPress={handleRefresh}>
                        <View style={styles.refreshInner}>
                            <Text style={styles.refreshText}>{todayKorean}</Text>
                            <Icon name="rotate-cw" size={15} color="white" style={styles.refreshIcon} />
                        </View>
                        <Text style={styles.refreshLabel}>맞춤운동</Text>
                    </Pressable>
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
                                        {part}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </Animated.View>
            </View>

            {reorderedExercises.length > 0 ? (
                <View style={styles.schedule} onLayout={(event) => setScheduleHeight(event.nativeEvent.layout.height)}>
                    {reorderedExercises.map((exercise, index) => (
                        <View style={{ position: 'relative' }} key={index}>

                    <EachExercise
                        key={`${exercise.id}-${index}`} // 고유 key로 설정
                        exercise={exercise}
                        sets={exerciseSets[exercise.id] || []}
                        updateSets={(updatedSets) => updateExerciseSets(exercise.id, updatedSets)}
                    />
                                                

                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.noSchedule}>
                    <Text style={styles.noScheduleText}>현재 스케쥴에 등록된 운동이 없습니다.</Text>
                    <Pressable style={styles.noScheduleButton} onPress={() => navigation.navigate('Schedule')}>
                        <Text style={styles.noScheduleButtonText}>스케쥴 등록하러 가기</Text>
                    </Pressable>
                </View>
            )}

            <RegistExerciseModal isVisible={isModalVisible} onClose={closeModal} exercise={selectedExercise} />
        </View>
    );
};


export default OnSchedule;

