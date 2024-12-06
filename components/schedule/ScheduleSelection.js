import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './ScheduleSelection.module';
import { deleteDataFromServer, sendDataToServer } from '../../src/apis/ScheduleAPI';
import { useDispatch, useSelector } from 'react-redux';
import { callFetchScheduleAPI } from '../../src/apis/ScheduleAPI';
import RegistExerciseModal from '../../src/screens/modal/scheduleModal/RegistExerciseModal';
import { PanGestureHandler } from 'react-native-gesture-handler';

// DraggableItem 컴포넌트 수정: 텍스트를 <Text> 컴포넌트로 감쌈
const DraggableItem = ({ item, index, activeIndex, translateY, onDragStart, onDragEnd }) => {

    // 드래그 관련
    const handleGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        { useNativeDriver: false }
    );

    const handleGestureEnd = () => {
        translateY.flattenOffset(); // 드래그 애니메이션 값 초기화
        onDragEnd(index, translateY); // 드래그 종료 후 순서 변경
    };

    return (
        <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onBegan={() => onDragStart(index)} // 드래그 시작 시
            onEnded={handleGestureEnd} // 드래그 종료 시
        >
            <Animated.View
                style={[
                    styles.exerciseButton,
                    activeIndex === index && styles.activeItem, // 드래그 중 스타일
                    {
                        transform: [{ translateY }], // Y축으로 이동
                        zIndex: activeIndex === index ? 1 : 0, // 드래그 중 zIndex 설정
                        elevation: activeIndex === index ? 5 : 1, // 안드로이드 elevation 추가
                        opacity: activeIndex === index ? 0.7 : 1, // 드래그 중 반투명 효과
                    },
                ]}
            >   
            
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>

                <View style={{ width: '20%', height: 30, marginTop: -5, justifyContent: 'center', alignItems: 'center' }}>
                    {Array.from({ length: 3 }).map((_, rowIndex) => (
                            <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 3.5,  marginLeft: -5 }}>
                                {Array.from({ length: 4 }).map((_, colIndex) => (
                                    <View
                                        key={colIndex}
                                        style={{
                                            width: 3.5,
                                            height: 3.5,
                                            borderRadius: 4,
                                            backgroundColor: '#191717',
                                            marginHorizontal: 2.5,
                                        }}
                                    />
                                ))}
                            </View>
                    ))}
                </View>

                <Text style={styles.exerciseButtonText}>{item.exerciseName}</Text>
                
                <View style={{ width: '20%', height: 30, marginTop: -5, justifyContent: 'center', alignItems: 'center', marginRight: -5 }}>
                    {Array.from({ length: 3 }).map((_, rowIndex) => (
                            <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 3.5 }}>
                                {Array.from({ length: 4 }).map((_, colIndex) => (
                                    <View
                                        key={colIndex}
                                        style={{
                                            width: 3.5,
                                            height: 3.5,
                                            borderRadius: 4,
                                            backgroundColor: '#191717',
                                            marginHorizontal: 2.5,
                                        }}
                                    />
                                ))}
                            </View>
                    ))}
                </View>

            </View>

            </Animated.View>
        </PanGestureHandler>
    );
};

const ScheduleSelection = ({ selectedWeekType, selectedDay, weekInfo }) => {
    const [memberId, setMemberId] = useState(null);
    const [selectedParts, setSelectedParts] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [activeIndex, setActiveIndex] = useState(null); // 드래그 중 활성화된 아이템 인덱스
    const [reorderedExercises, setReorderedExercises] = useState([]); // 순서 변경된 운동 리스트

    const dispatch = useDispatch();
    const scheduleData = useSelector((state) => state.schedule || {});

    const chestExercises = useSelector((state) => state.chestExercises.myExercises || []);
    const backExercises = useSelector((state) => state.backExercises.myExercises || []);
    const lowerBodyExercises = useSelector((state) => state.lowerBodyExercises.myExercises || []);
    const shouldersExercises = useSelector((state) => state.shouldersExercises.myExercises || []);
    const absExercises = useSelector((state) => state.absExercises.myExercises || []);
    const armsExercises = useSelector((state) => state.armsExercises.myExercises || []);
    const aerobicExercises = useSelector((state) => state.etcExercises.myExercises || []);
    const customExercises = useSelector((state) => state.customExercises.myExercises || []);

    const bodyParts = ['가슴', '등', '하체', '어깨', '복근', '팔', '기타', '커스텀'];
    
    // 운동 제거시 reorderedExercises
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
            // 중복 제거 및 기존 데이터 유지
            const updated = [...prev, ...newExercises];
            return updated.filter(
                (exercise, index, self) =>
                    index === self.findIndex((ex) => ex.id === exercise.id)
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
        } catch (error) {
            console.error('운동 목록 저장 중 오류 발생:', error);
        }
    }, [reorderedExercises, selectedWeekType, selectedDay]);
    
    
    // 상태가 변경될 때만 저장
    useEffect(() => {
        saveReorderedExercises(); // 빈 배열 포함 모든 경우 저장
    }, [reorderedExercises, saveReorderedExercises]);
    
    const loadReorderedExercises = useCallback(async (retryCount = 0) => {
        try {
            const savedData = await AsyncStorage.getItem('reorderedExercises');
            console.log('저장된 데이터 확인:', savedData);
    
            // 저장된 데이터가 없거나 운동 배열이 비어있을 경우
            if ((!savedData || JSON.parse(savedData).exercises.length === 0) && retryCount < 3) {
                // console.log('데이터가 없거나 비어 있음. 재시도:', retryCount + 1);
                setTimeout(() => loadReorderedExercises(retryCount + 1), 500); // 500ms 대기 후 재시도
                return;
            }
    
            if (savedData) {
                const parsedData = JSON.parse(savedData);
    
                // 예상치 못한 데이터 형식을 처리
                if (!parsedData || !Array.isArray(parsedData.exercises)) {
                    // console.log('예상치 못한 데이터 형식입니다. 빈 배열로 초기화합니다.');
                    setReorderedExercises([]);
                    return;
                }
    
                const { exercises, weekType, day } = parsedData;
                if (weekType === selectedWeekType && day === selectedDay) {
                    // console.log('로드된 운동:', exercises);
                    setReorderedExercises(exercises);
                }
            } else {
                console.log('저장된 데이터가 없습니다.');
                setReorderedExercises([]); // 기본값 설정
            }
        } catch (error) {
            console.error('운동 목록 로드 중 오류 발생:', error);
            setReorderedExercises([]); // 오류 발생 시 빈 배열로 초기화
        }
    }, [selectedWeekType, selectedDay]);
    
    
    
    
    // 초기 데이터 로드
    useEffect(() => {
        loadReorderedExercises();
    }, [loadReorderedExercises]);
    

    // 회원 ID 가져오기
    useEffect(() => {

        const fetchMemberId = async () => {
            try {
                const id = await AsyncStorage.getItem('memberId');
                if (id) setMemberId(id);
            } catch (error) {
                console.error('회원 ID를 가져오는 중 오류가 발생했습니다.', error);
            }
        };
        fetchMemberId();
    }, []);

    // 주차와 날짜에 따른 운동 부위 설정
    useEffect(() => {

        if (scheduleData.schedule) {
            const partsForSelectedDay = scheduleData.schedule
                .filter(item => item.day === selectedDay && item.weekType === selectedWeekType)
                .map(item => item.part);

            const updatedSelectedParts = bodyParts.reduce((acc, part) => {
                acc[part] = partsForSelectedDay.includes(part);
                return acc;
            }, {});

            setSelectedParts(updatedSelectedParts);
        }
    }, [scheduleData, selectedDay, selectedWeekType]);

    // 모달 열기
    const openModal = useCallback((exercise) => {
        setSelectedExercise(exercise);
        setIsModalVisible(true);
    }, []);
    

    // 모달 닫기
    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setSelectedExercise('');
    }, []);

    // 운동 부위 클릭 처리
    const handlePress = useCallback(async (part) => {
        const isPartSelected = selectedParts[part];
        const updatedParts = { ...selectedParts, [part]: !isPartSelected };

        setSelectedParts(updatedParts);

        let hasExercisesForPart = false;

        switch (part) {
            case '가슴':
                hasExercisesForPart = Array.isArray(chestExercises) && chestExercises.length > 0;
                break;
            case '등':
                hasExercisesForPart = Array.isArray(backExercises) && backExercises.length > 0;
                break;
            case '하체':
                hasExercisesForPart = Array.isArray(lowerBodyExercises) && lowerBodyExercises.length > 0;
                break;
            case '어깨':
                hasExercisesForPart = Array.isArray(shouldersExercises) && shouldersExercises.length > 0;
                break;
            case '복근':
                hasExercisesForPart = Array.isArray(absExercises) && absExercises.length > 0;
                break;
            case '팔':
                hasExercisesForPart = Array.isArray(armsExercises) && armsExercises.length > 0;
                break;
            case '기타':
                hasExercisesForPart = Array.isArray(aerobicExercises) && aerobicExercises.length > 0;
                break;
            case '커스텀':
                hasExercisesForPart = Array.isArray(customExercises) && customExercises.length > 0;
                break;
            default:
                hasExercisesForPart = false;
        }

        if (memberId) {
            try {
                if (!isPartSelected) {
                    if (!hasExercisesForPart) {
                        Alert.alert(`${part} 운동 등록 필요`, `먼저 ${part} 운동을 등록해주세요.`, [
                            { text: "확인", onPress: () => console.log("확인 버튼 눌림") }
                        ]);
                        openModal(part);
                        setSelectedParts((prevParts) => ({ ...prevParts, [part]: false }));
                        return;
                    }
                    await sendDataToServer(part, memberId, selectedWeekType, selectedDay);
                } else {
                    await deleteDataFromServer(part, memberId, selectedWeekType, selectedDay);
                    
                    if (part === "커스텀") {
                        setReorderedExercises([]); // "커스텀"일 경우 배열 초기화
                    } else {
                        setReorderedExercises((prev) =>
                            prev.filter((exercise) => exercise.mainMuscleGroup !== part)
                        );
                    }
                }
                dispatch(callFetchScheduleAPI());
            } catch (error) {
                console.error('서버와의 통신 중 오류 발생:', error);
            }
        } else {
            Alert.alert('회원 ID를 찾을 수 없습니다.');
        }
    }, [selectedParts, memberId, chestExercises, backExercises, lowerBodyExercises, shouldersExercises, absExercises, armsExercises, aerobicExercises, customExercises, selectedWeekType, selectedDay, dispatch, openModal]);

    // 운동 항목 순서 변경
    const handleDragStart = (index) => {
        setActiveIndex(index);
    };

    const translateYs = useMemo(
        () => reorderedExercises.map(() => new Animated.Value(0)),
        [reorderedExercises]
    );
    
    const handleDragEnd = (draggedIndex, translateY) => {
        const itemHeight = 30;
        const draggedOffset = Math.round(translateY._value / itemHeight);
    
        translateY.setValue(0); // 애니메이션 값 초기화
    
        const newIndex = draggedIndex + draggedOffset;
    
        if (newIndex >= 0 && newIndex < reorderedExercises.length && newIndex !== draggedIndex) {
            const updatedExercises = [...reorderedExercises];
            const [removedItem] = updatedExercises.splice(draggedIndex, 1);
            updatedExercises.splice(newIndex, 0, removedItem);
    
            setReorderedExercises(updatedExercises);
        }
        setActiveIndex(null); // 드래그 완료 후 초기화
    };

    
    return (
        <View style={styles.registration}>
            <Text style={styles.title}>{weekInfo} {selectedDay} 에 운동할 부위를 선택해 주세요.</Text>
            <View style={styles.buttonContainer}>
                {bodyParts.map((part) => (
                    <Pressable
                        key={part}
                        style={[
                            styles.button,
                            selectedParts[part] && styles.selectedButton
                        ]}
                        onPress={() => handlePress(part)}
                    >
                        <Text style={[
                            styles.buttonText,
                            selectedParts[part] && styles.selectedButtonText
                        ]}>
                            {part}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {reorderedExercises.length > 0 && (
                <View style={styles.detailedType}>
                    <Text style={styles.detailTitle}>
                        등록된 운동목록입니다. ({reorderedExercises.length}개)
                    </Text>

                    <View style={styles.detailExerciseList}>
                        {reorderedExercises.map((item, index) => {
                            const translateY = new Animated.Value(0);

                            return (


                                <DraggableItem
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    activeIndex={activeIndex}
                                    translateY={translateY}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                />
                            );
                        })}

                    </View>

                    <Text style={{color:'#E6E2E2', fontWeight: '600', fontSize: 11, marginTop:2, marginLeft:4}}>
                        운동 순서를 변경해주세요
                    </Text>
                </View>
            )}

            <RegistExerciseModal isVisible={isModalVisible} onClose={closeModal} exercise={selectedExercise} />
        </View>
    );
};

export default ScheduleSelection;
