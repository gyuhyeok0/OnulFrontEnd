import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, TextInput } from 'react-native';
import styles from './EachExercise.module';

// 각각의 운동 기록 코드 
const EachExercise = ({ exercise, isSelected, onPress }) => {
    const [sets, setSets] = useState([
        { kg: '', reps: '', completed: false },
        { kg: '', reps: '', completed: false },
        { kg: '', reps: '', completed: false }
    ]);

    useEffect(() => {
        console.log(exercise.mainMuscleGroup, exercise.detailMuscleGroup, exercise.exerciseType);
    }, [exercise]);

    const handleExerciseInfoPress = () => {
        console.log("운동 정보 버튼 클릭:", exercise.exerciseName);
    };

    const handlePreviousRecordPress = () => {
        console.log("이전 기록 버튼 클릭:", exercise.exerciseName);
    };

    const addSet = () => {
        setSets([...sets, { kg: '', reps: '', completed: false }]);
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
            // 해제 시 역순으로 진행
            for (let i = sets.length - 1; i >= 0; i--) {
                if (newSets[i].completed) {
                    newSets[i].completed = false; // 완료 상태 해제
                    setSets(newSets);
                    console.log(`SET ${i + 1} 완료 해제`);
                    return; // 함수 종료
                }
            }
        } else {
            // 완료 상태가 아닐 때, 정상 순서로 진행
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
                        <Text style={styles.volumeUnit}> kg</Text>
                    </View>

                    <View style={styles.weightChangeContainer}>
                        <Text style={styles.weightChangeText}>up</Text>
                        <Text style={styles.weightChangeValue}>--</Text>
                        <Text style={styles.weightChangeUnit}>kg</Text>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.infoButton} onPress={handleExerciseInfoPress}>
                            <Text style={styles.buttonText}>운동 정보</Text>
                        </Pressable>

                        <Pressable style={styles.infoButton} onPress={handlePreviousRecordPress}>
                            <Text style={styles.buttonText}>이전 기록</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.exerciseRecord}>
                    <View style={styles.record}>
                        <Text style={styles.recordTitle}>record</Text>
                        
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3}}>
                            <Text style={{color:'white', fontWeight:'bold', fontSize: 11, width: 30, textAlign:'center', marginRight: 5}}>SET</Text>
                            <Text style={{color:'white', fontWeight:'bold', fontSize: 11, width: 60, textAlign:'center', flex: 1, marginHorizontal: 5}}>KG</Text>
                            <Text style={{color:'white', fontWeight:'bold', fontSize: 11, width: 60, textAlign:'center', flex: 1, marginHorizontal: 5}}>횟수</Text>
                            <Text style={{color:'white', fontWeight:'bold', fontSize: 11, width: 60, textAlign:'center', flex: 1, marginHorizontal: 5}}>완료</Text>
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
                                    
                                    <TextInput 
                                        style={[styles.input, { 
                                            backgroundColor: set.completed ? '#4BA262' : '#525E77', 
                                            color: set.completed ? '#96D3A6' : 'white' 
                                        }]} 
                                        placeholder="KG" 
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
                </View>
            </View>
        </Pressable>
    );
};


export default EachExercise;
