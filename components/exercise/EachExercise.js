import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './EachExercise.module';
import { isKmAndTime, isTime, isNumber } from './ExerciseClassification';
import ExerciseInfoComponent from './ExerciseInfoComponent';
import PreviousRecordComponent from './PreviousRecordComponent';
import TimeInput from './keyboard/TimeInput'; // 추가된 컴포넌트 import
import ScheduleSelection from '../schedule/ScheduleSelection';


const EachExercise = ({ exercise, isSelected, onPress }) => {

    // 운동 세트 기본 3개 지정
    const [sets, setSets] = useState([
        { kg: '', reps: '', km: '', time: '', completed: false },
        { kg: '', reps: '', km: '', time: '', completed: false },
        { kg: '', reps: '', km: '', time: '', completed: false }
    ]);

    // 운동 단위 기본값 지정
    const [weightUnit, setWeightUnit] = useState('kg'); // 기본값 'kg'
    //운동 정보 토글
    const [showExerciseInfo, setShowExerciseInfo] = useState(false);
    const [showPreviousRecord, setShowPreviousRecord] = useState(false);

    //버튼 상태
    const [isInfoButtonPressed, setIsInfoButtonPressed] = useState(false);
    const [isPreviousRecordButtonPressed, setIsPreviousRecordButtonPressed] = useState(false);




    // 무게 단위 가져오기
    useEffect(() => {
        const fetchWeightUnit = async () => {
            try {
                const unit = await AsyncStorage.getItem('weightUnit');
                setWeightUnit(unit || 'kg'); // 저장된 값이 없으면 기본값 'kg'
            } catch (error) {
                console.error('Error fetching weight unit:', error);
            }
        };

        fetchWeightUnit();
    }, []);

    useEffect(() => {
        console.log(exercise.mainMuscleGroup, exercise.detailMuscleGroup, exercise.exerciseType);
    }, [exercise]);

    // 운동 정보 버튼
    const handleExerciseInfoPress = () => {
        setIsInfoButtonPressed((prev) => !prev);
        setShowExerciseInfo((prev) => !prev); // 상태를 토글
    
        if (!isInfoButtonPressed) {
            // 다른 버튼 상태 초기화
            setIsPreviousRecordButtonPressed(false);
            setShowPreviousRecord(false);
        }
    };

    // 이전 기록 버튼
    const handlePreviousRecordPress = () => {
        setIsPreviousRecordButtonPressed((prev) => !prev);
        setShowPreviousRecord((prev) => !prev); // 상태를 토글

        if (!isPreviousRecordButtonPressed) {
            // 다른 버튼 상태 초기화
            setIsInfoButtonPressed(false);
            setShowExerciseInfo(false);
        }
    };


    const addSet = () => {
        setSets([...sets, { kg: '', reps: '', km: '', time: '', completed: false }]);
    };

    const removeSet = () => {
        if (sets.length > 1) {
            const newSets = sets.slice(0, -1); // 마지막 세트 삭제
            setSets(newSets);
        }
    };

    const handleCompletePress = (index) => {
        const newSets = [...sets];
        if (newSets[index].completed) {
            for (let i = sets.length - 1; i >= 0; i--) {
                if (newSets[i].completed) {
                    newSets[i].completed = false; // 완료 상태 해제
                    setSets(newSets);
                    console.log(`SET ${i + 1} 완료 해제`);
                    return; // 함수 종료
                }
            }
        } else {
            if (index === 0 || newSets[index - 1].completed) {
                newSets[index].completed = true; // 완료 상태로 설정
                setSets(newSets);
                console.log(`SET ${index + 1} 완료`);
            } else {
                console.log(`SET ${index + 1}을 완료하기 위해서는 이전 세트를 완료해야 합니다.`);
            }
        }
    };

    const completeAllSets = () => {
        const newSets = sets.map(set => ({ ...set, completed: true })); // 모든 세트를 완료로 설정
        setSets(newSets);
    };

    // 조건 평가
    const kmAndTime = isKmAndTime(exercise.exerciseName || '');
    const time = isTime(exercise.exerciseName || '');
    const number = isNumber(exercise.exerciseName || '');
    
    return (
        <Pressable onPress={onPress}>
            <View style={[styles.exerciseContainer, isSelected && styles.selectedContainer]}>
                <View style={styles.exerciseInformation}>
                    <View style={styles.exerciseIcon}>
                        {/* 아이콘 추가 시 사용 */}
                    </View>

                    <Text style={styles.exerciseText}>{exercise.exerciseName}</Text>
                    
                    <View style={styles.volumeContainer}>
                        <Text style={styles.volumeText}>볼륨</Text>
                        <Text style={styles.volumeSeparator}> --</Text>
                        <Text style={styles.volumeUnit}>
                            {kmAndTime 
                                ? 'km' 
                                : time 
                                ? '시간' 
                                : number 
                                ? '회' 
                                : weightUnit}
                        </Text>
                    </View>

                    <View style={styles.weightChangeContainer}>
                        <Text style={styles.weightChangeText}>up</Text>
                        <Text style={styles.weightChangeValue}>--</Text>
                        <Text style={styles.weightChangeUnit}>
                            {kmAndTime 
                                ? 'km' 
                                : time 
                                ? '시간' 
                                : number 
                                ? '회' 
                                : weightUnit}
                        </Text>
                    </View>

                    
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[
                                styles.infoButton,
                                isInfoButtonPressed && styles.infoButtonPressed, // 눌렸을 때 스타일
                            ]}
                            onPress={handleExerciseInfoPress}
                        >
                            <Text style={styles.buttonText}>운동 정보</Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.infoButton,
                                isPreviousRecordButtonPressed && styles.infoButtonPressed, // 눌렸을 때 스타일
                            ]}
                            onPress={handlePreviousRecordPress}
                        >
                            <Text style={styles.buttonText}>이전 기록</Text>
                        </Pressable>
                    </View>

                </View>

                <View style={styles.exerciseRecord}>
                {showExerciseInfo ? (
                    // 운동 정보 컴포넌트
                    <ExerciseInfoComponent exercise={exercise} />
                ) : showPreviousRecord ? (
                    // 이전 기록 컴포넌트
                    <PreviousRecordComponent previousRecords={exercise.previousRecords || []} />
                ) : (
                    <View style={styles.record}>
                        <Text style={styles.recordTitle}>record</Text>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: 11,
                                    width: 30,
                                    textAlign: 'center',
                                    marginRight: 5,
                                }}
                            >
                                SET
                            </Text>
                            {!time && !number &&(
                                <Text
                                    style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 11,
                                        width: 60,
                                        textAlign: 'center',
                                        flex: 1,
                                        marginHorizontal: 5,
                                    }}
                                >
                                    {kmAndTime ? 'km' : weightUnit}
                                </Text>
                            )}
                            <View>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 11,
                                        width: 60,
                                        textAlign: 'center',
                                        flex: 1,
                                        marginHorizontal: 5,
                                    }}
                                >
                                {time || kmAndTime ? '시간' : '횟수'}
                                </Text>
                            </View>
                        
                            <View>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 11,
                                        width: 60,
                                        textAlign: 'center',
                                        flex: 1,
                                        marginHorizontal: 5,
                                    }}
                                >
                                    완료
                                </Text>
                            </View>
                    
                        </View>

                        <View style={styles.recordInputs}>
                            {sets.map((set, index) => (
                                <View key={index} style={styles.setSection}>
                                    <Pressable 
                                        style={[styles.setButton, { backgroundColor: set.completed ? '#4BA262' : '#525E77' }]}
                                    >
                                        <Text 
                                            style={{ 
                                                color: set.completed ? '#96D3A6' : '#B0B0B0', 
                                                textAlign: 'center', 
                                                fontWeight: 'bold' 
                                            }}
                                        >
                                            {index + 1}
                                        </Text>
                                    </Pressable>

                                    {number ? (
                                        <TextInput 
                                            style={[styles.input, { 
                                                backgroundColor: set.completed ? '#4BA262' : '#525E77', 
                                                color: set.completed ? '#96D3A6' : 'white' 
                                            }]} 
                                            placeholder="횟수" 
                                            placeholderTextColor="#B0B0B0" 
                                            keyboardType="numeric" 
                                            value={set.reps}
                                            onChangeText={(text) => {
                                                const newSets = [...sets];
                                                newSets[index].reps = text;
                                                setSets(newSets);
                                            }} 
                                        />
                                    )   : time ? (
                                        <TimeInput
                                            set={set}
                                            index={index}
                                            sets={sets}
                                            setSets={setSets}
                                            style={styles.input}
                                        />

                                    ) : kmAndTime ? (
                                        <>
                                            <TextInput 
                                                style={[styles.input, { 
                                                    backgroundColor: set.completed ? '#4BA262' : '#525E77', 
                                                    color: set.completed ? '#96D3A6' : 'white' 
                                                }]} 
                                                placeholder="km" 
                                                placeholderTextColor="#B0B0B0" 
                                                keyboardType="numeric" 
                                                value={set.km}
                                                onChangeText={(text) => {
                                                    const newSets = [...sets];
                                                    newSets[index].km = text;
                                                    setSets(newSets);
                                                }} 
                                            />
                                            <TextInput 
                                                style={[styles.input, { 
                                                    backgroundColor: set.completed ? '#4BA262' : '#525E77', 
                                                    color: set.completed ? '#96D3A6' : 'white' 
                                                }]} 
                                                placeholder="시간" 
                                                placeholderTextColor="#B0B0B0" 
                                                keyboardType="numeric" 
                                                value={set.time}
                                                onChangeText={(text) => {
                                                    const newSets = [...sets];
                                                    newSets[index].time = text;
                                                    setSets(newSets);
                                                }} 
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <TextInput 
                                                style={[styles.input, { 
                                                    backgroundColor: set.completed ? '#4BA262' : '#525E77', 
                                                    color: set.completed ? '#96D3A6' : 'white' 
                                                }]} 
                                                placeholder={weightUnit} 
                                                placeholderTextColor="#B0B0B0" 
                                                keyboardType="numeric" 
                                                value={set.kg}
                                                onChangeText={(text) => {
                                                    const newSets = [...sets];
                                                    newSets[index].kg = text;
                                                    setSets(newSets);
                                                }} 
                                            />
                                            <TextInput 
                                                style={[styles.input, { 
                                                    backgroundColor: set.completed ? '#4BA262' : '#525E77', 
                                                    color: set.completed ? '#96D3A6' : 'white' 
                                                }]} 
                                                placeholder="횟수" 
                                                placeholderTextColor="#B0B0B0" 
                                                keyboardType="numeric" 
                                                value={set.reps}
                                                onChangeText={(text) => {
                                                    const newSets = [...sets];
                                                    newSets[index].reps = text;
                                                    setSets(newSets);
                                                }} 
                                            />
                                        </>
                                    )}

                                    <Pressable 
                                        style={[styles.input, styles.completeButton, { 
                                            backgroundColor: set.completed ? '#4BA262' : '#525E77' 
                                        }]} 
                                        onPress={() => handleCompletePress(index)}
                                    >
                                        <Text style={{ 
                                            color: set.completed ? '#96D3A6' : '#B0B0B0', 
                                            fontWeight: 'bold', 
                                            textAlign: 'center' 
                                        }}>완료</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
                    {!showExerciseInfo && !showPreviousRecord && (                        
                        <View style={styles.setting}>
                            <Text style={styles.settingTitle}>세트 설정</Text>
                            <View style={styles.settingButtonsContainer}>
                                <Pressable style={styles.settingButton} onPress={addSet}>
                                    <Text style={styles.buttonText}>세트 추가</Text>
                                </Pressable>

                                <Pressable style={styles.settingButton} onPress={removeSet}>
                                    <Text style={styles.buttonText}>세트 삭제</Text>
                                </Pressable>

                                <Pressable style={styles.settingButton} onPress={completeAllSets}>
                                    <Text style={styles.buttonText}>모든 세트완료</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}

                </View>
            </View>
        </Pressable>
    );
};

export default EachExercise;
