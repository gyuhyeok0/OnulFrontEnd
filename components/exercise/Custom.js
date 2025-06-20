import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import RegistExerciseModal from '../../src/screens/modal/scheduleModal/RegistExerciseModal';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
// import RegistFree from '../../src'

import styles from './Custom.module';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import EachExercise from './EachExercise';

import { addDefaultSetsToRedux, resetState } from '../../src/modules/StateExerciseSlice'; // Redux 액션

import {reorderMyFreeExercises} from '../../src/modules/MyExerciseSclice'
import DraggableItem from './settings-components/DraggableItem'; // 파일 경로를 실제 파일 위치에 맞게 설정

import { useCurrentWeekAndDay } from '../../src/hooks/useCurrentWeekAndDay';
import { useTranslation } from 'react-i18next';

import { useFocusEffect } from '@react-navigation/native';
import useCheckDateChange from '../../src/hooks/useCheckDateChange';

// 운동 메뉴의 커스텀 코드
const Custom = () => {
    const { isDateChangedReducer } = useCheckDateChange();

    const { t } = useTranslation();
    const freeExercises = useSelector((state) => state.freeExercises?.myExercises || []);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState('');

    const [reorderedExercises, setReorderedExercises] = useState([]);

    const [isVisible, setIsVisible] = useState(false);
    const [animationHeight] = useState(new Animated.Value(0));
    
    const [activeIndex, setActiveIndex] = useState(null); // 드래그 중 활성화된 아이템 인덱스
    const [minHeight, setMinHeight] = useState(0);

    useFocusEffect(
        useCallback(() => {
            isDateChangedReducer;
        }, [])
    );

    // Update minHeight based on reorderedExercises length
    useEffect(() => {
        const calculatedHeight = reorderedExercises.length * 42; // 50은 각 아이템의 높이
        setMinHeight(calculatedHeight);
    }, [reorderedExercises]);

    useEffect(() => {
        if (Array.isArray(freeExercises)) {
            setReorderedExercises(freeExercises);
        } else {
            setReorderedExercises([]);
        }
    }, [freeExercises]);
    
    const translateYs = useMemo(() => 
        Array.isArray(reorderedExercises) 
            ? reorderedExercises.map(() => new Animated.Value(0)) 
            : [], 
        [reorderedExercises]
    );

    
    const handleDragStart = (index) => {
        setActiveIndex(index);
    };

    const handleDragEnd = (draggedIndex, draggedOffset) => {
        const newIndex = draggedIndex + draggedOffset;
    
        if (
            newIndex >= 0 &&
            newIndex < reorderedExercises.length &&
            newIndex !== draggedIndex
        ) {
            const updatedExercises = [...reorderedExercises];
            const [removedItem] = updatedExercises.splice(draggedIndex, 1);
            updatedExercises.splice(newIndex, 0, removedItem);
    
    
            dispatch(
                reorderMyFreeExercises({
                    sourceIndex: draggedIndex,
                    destinationIndex: newIndex,
                })
            ); // Redux 상태 업데이트
        }
        setActiveIndex(null);
    };
    

    // ============== 운동단위
        const dispatch = useDispatch();
        const [weightUnit, setWeightUnit] = useState(null); 
        const [kmUnit, setKmUnit] = useState(null); 

        const [scheduleHeight, setScheduleHeight] = useState(0);

        const [isReadyWeight, setIsReadyWeight] = useState(false); // 로딩 상태 추가
        const [isReadyKm, setIsReadyKm] = useState(false); // 로딩 상태 추가

        const { isDateChanged } = useCurrentWeekAndDay();


        useEffect(() => {
            // 날짜가 변경되었을 때만 실행
            if (isDateChanged) {
                dispatch(resetState());
            }
          }, [isDateChanged]); // isDateChanged가 true일 때만 실행

        // reorderedExercises가 변경될 때 Redux에 기본 세트 추가
        useEffect(() => {
            if (Array.isArray(freeExercises) && freeExercises.length > 0) {
                const exercisesWithId = freeExercises.map((exercise) => ({
                    id: exercise.exerciseId, // exerciseId 포함
                    exerciseServiceNumber: 2,
                    ...exercise,
                }));
                dispatch(addDefaultSetsToRedux(exercisesWithId));
            }
        }, [freeExercises, dispatch]);

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
        
    // ============


    const openModal = useCallback(() => {
        setSelectedExercise("자유"); // 모달에서 사용할 운동 이름 설정
        setIsModalVisible(true); // 모달 열기
    }, []);

    const closeModal = useCallback(() => {
        setIsModalVisible(false); // 모달 닫기
        setSelectedExercise(''); // 선택된 운동 이름 초기화
    
        if (freeExercises.length > 0) {
            setIsVisible(true);
            Animated.timing(animationHeight, {
                toValue: minHeight + 30,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [freeExercises, minHeight, animationHeight]);

    const [itemHeights, setItemHeights] = useState({});

    // 개별 아이템 높이를 저장하는 함수
    const handleItemLayout = (index, height) => {
        setItemHeights(prevHeights => ({
            ...prevHeights,
            [index]: height,
        }));
    };

    // 모든 아이템의 높이 합산하여 animationHeight 설정
    useEffect(() => {
        const totalHeight = Object.values(itemHeights).reduce((sum, h) => sum + h, 0) + 32;

        Animated.timing(animationHeight, {
            toValue: isVisible ? totalHeight : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [itemHeights, isVisible]);

    // 버튼 클릭 시 `isVisible` 상태만 변경 (애니메이션은 useEffect에서 실행)
    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
    };



    // =================
        if (!isReadyWeight || !isReadyKm) {
            return <Text>Loading...</Text>;
        }
    // =================

    return (
        <View style={[styles.container ,{ minHeight: scheduleHeight + 600 }]}>

            <View contentContainerStyle={styles.customContainer}>

                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Pressable style={styles.refreshInner} onPress={openModal}>
            
                            <Text style={styles.refreshLabel}>{t('customWorkout.register')}</Text>
                        </Pressable>
                        
                        <Pressable style={styles.caretButton} onPress={toggleVisibility}>
                            <Icon2 name={isVisible ? "caret-up" : "caret-down"} size={28} color="white" />
                        </Pressable>
                    </View>
                    <Animated.View style={[styles.hiddenContent, { height: animationHeight }]}>
                        {isVisible && (
                            <View style={styles.buttonContainer}>

                                <Text style={{color:'white', fontWeight:'bold', fontSize: 12, marginBottom: 5, zIndex:10}}>{t('customWorkout.changeOrder')}</Text>

                                {reorderedExercises.map((item, index) => (
                            <View 
                                key={item.id || index} 
                                onLayout={(event) => handleItemLayout(index, event.nativeEvent.layout.height)} 
                            >
                                <DraggableItem
                                    item={item}
                                    index={index}
                                    activeIndex={activeIndex}
                                    translateY={translateYs[index]}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    styles={styles}
                                />
                            </View>
                        ))}

                            </View>
                        )}
                    </Animated.View>
                </View>

                
                {Array.isArray(freeExercises) && freeExercises.length > 0 ? (
                    <View style={styles.schedule} onLayout={(event) => setScheduleHeight(event.nativeEvent.layout.height)}>
                        {freeExercises.map((exercise, index) => (
                            <View style={{ position: 'relative' }} key={`${exercise.id}-${index}`}>
                                <EachExercise
                                    exercise={exercise}
                                    exerciseServiceNumber={2}
                                    weightUnit={weightUnit}
                                    setWeightUnit={setWeightUnit}
                                    kmUnit={kmUnit}
                                    setKmUnit ={setKmUnit}
                                />
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={{}}>
                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, fontWeight: '500' }}>
                            {t('customWorkout.pleaseRegister')}
                        </Text>
                    </View>
                )}


            </View>

            {/* RegistExerciseModal 모달 컴포넌트 */}
            <RegistExerciseModal 
                isVisible={isModalVisible} 
                onClose={closeModal} 
                exercise={selectedExercise} 
            />
        </View>
    );
};
    

export default Custom;
