import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './EachExercise.module';
import { isKmAndTime, isTime, isNumber } from './settings-components/ExerciseClassification';

import ExerciseInfoComponent from './settings-components/ExerciseInfoComponent';
import PreviousRecordComponent from './settings-components/PreviousRecordComponent';
import ExerciseIcon from './settings-components/ExerciseIcon';


import TimeInput from './keyboard/TimeInput'; // 추가된 컴포넌트 import
import KmInput from './keyboard/KmInput';
import NumberInput from './keyboard/NumberInput';
import KgInput from './keyboard/KgInput';

import { submitExerciseRecord, deleteExerciseRecord } from '../../src/apis/SubmitExerciseRecordAPI';


const EachExercise = ({ exercise, isSelected, sets, updateSets, onPress}) => {


    const [memberId, setMemberId] = useState(null);

    // 운동 단위 기본값 지정
    const [weightUnit, setWeightUnit] = useState('kg'); // 기본값 'kg'
    const [kmUnit, setKmUnit] = useState('km'); // 기본값 'km
    const [volume, setVolume] = useState(0); // volume을 상태로 관리


    //운동 정보 토글
    const [showExerciseInfo, setShowExerciseInfo] = useState(false);
    const [showPreviousRecord, setShowPreviousRecord] = useState(false);

    //버튼 상태
    const [isInfoButtonPressed, setIsInfoButtonPressed] = useState(false);
    const [isPreviousRecordButtonPressed, setIsPreviousRecordButtonPressed] = useState(false);
    const [showExerciseIcon, setShowExerciseIcon] = useState(false); // 아이콘 표시 상태


    // 선택한 textInput
    const [selectedIndex, setSelectedIndex] = useState(null); // 선택된 TextInput의 인덱스

    const [exerciseType, setExerciseType] = useState(1);

    // 회원아이디 가지고 오기
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

    // 볼륨 시간 인트로 변환
    const convertTimeToSeconds = (timeString) => {
        if (!timeString) return 0;
    
        const parts = timeString.split(":");
        const minutes = parseInt(parts[0] || "0", 10);
        const seconds = parseInt(parts[1] || "0", 10);
    
        return minutes * 60 + seconds;
    };

    // 볼륨 다시 00:00 형태로 변환
    const convertSecondsToTime = (seconds) => {
        if (isNaN(seconds) || seconds <= 0) return "00:00";  // NaN 또는 0 이하 처리
    
        const minutes = Math.floor(seconds / 60);         // 분 계산
        const remainingSeconds = seconds % 60;           // 남은 초 계산
    
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    };
    
    // 볼륨 계산 
    useEffect(() => {
        // console.log("EachExercise 세트가 변경되었습니다.");
    
        let calculatedVolume = 0; // 로컬 변수로 계산
    
        sets.forEach((set, index) => {
            // console.log(`Processing set ${index + 1}:`, set);
    
            // 횟수만 있는 경우
            if (number && set.reps) {
                const reps = parseInt(set.reps || 0, 10);
                calculatedVolume += reps;
                // console.log(`Reps-based volume: ${reps}`);
                setVolume(calculatedVolume); // 시간일 경우 MM:SS 형식, 나머지는 숫자로 저장
                setExerciseType(1)
            }
            // kmAndTime: km 값만 계산 (time 제외)
            if (kmAndTime) {
                const distanceKm = parseFloat(set.km || 0); // km 값
                const distanceMi = parseFloat(set.mi || 0); // mi 값

                let distance = 0;

                // 단위에 따라 계산
                if (kmUnit === "km") {
                    distance = distanceKm; // km 값 사용
                } else if (kmUnit === "mi") {
                    distance = distanceMi; // mi 값 사용
                }

                // 계산 후 소수점 2자리까지 제한
                calculatedVolume += distance;
                calculatedVolume = parseFloat(calculatedVolume.toFixed(2));  // 소수점 둘째 자리까지 반올림

                // console.log(`Distance-based volume (${kmUnit}): ${distance}`);
                setVolume(calculatedVolume); // 시간일 경우 MM:SS 형식, 나머지는 숫자로 저장
                setExerciseType(2)
            }

            // 시간만 있는 경우
            else if (!kmAndTime && set.time) {

                // int 형식으로 변환한다.
                const timeInSeconds = convertTimeToSeconds(set.time);
    
                  // 계산된 시간(초)을 누적 계산한다.
                calculatedVolume += timeInSeconds;

                // 누적 계산한것을 다시 00:00 형태로 변환한다.
                const timeFormat = convertSecondsToTime(calculatedVolume);
    
                console.log("여기"+timeFormat)
    
                // 이후 timeFormat 이걸 volume에 넣어야 한다.
                setVolume(timeFormat); // timeFormat을 상태에 저장
                setExerciseType(4)


            }
          // 무게만 계산 (횟수 무시)
            else if (set.kg || set.lbs) {
                let weight = 0;

                // 단위에 따라 무게 선택
                if (weightUnit === "kg") {
                    weight = parseFloat(set.kg || 0); // kg 값 사용
                } else if (weightUnit === "lbs") {
                    weight = parseFloat(set.lbs || 0); // lbs 값 사용
                }

                // 계산된 무게를 누적하고 소수점 2자리까지 반올림
                calculatedVolume += weight;
                calculatedVolume = parseFloat(calculatedVolume.toFixed(2));  // 소수점 2자리까지 반올림

                console.log(`Weight-based volume (${weightUnit}): ${weight}`);
                setVolume(calculatedVolume); // 시간일 경우 MM:SS 형식, 나머지는 숫자로 저장
                setExerciseType(3)

            }
        });
    
    }, [sets, exercise?.id, number, time, kmAndTime]);

    
    //키보드에서 unit 변경시 스토리지 저장
    useEffect(() => {
        const updateStorage = async () => {
            try {
                if (kmUnit) {
                    console.log("kmUnit 변경됨 = " + kmUnit);
    
                    // kmUnit에 따라 heightUnit 값 설정
                    const heightUnit = kmUnit === 'km' ? 'cm' : 'feet';
    
                    // AsyncStorage에 저장
                    await AsyncStorage.setItem('heightUnit', heightUnit);
                    console.log("heightUnit 저장됨: " + heightUnit);
                }
    
                if (weightUnit) {
                    console.log("weightUnit 변경됨 = " + weightUnit);
    
                    // weightUnit 값 설정
                    const unitToSave = weightUnit === 'kg' ? 'kg' : 'lbs';
    
                    // AsyncStorage에 저장
                    await AsyncStorage.setItem('weightUnit', unitToSave);
                    console.log("weightUnit 저장됨: " + unitToSave);
                }
            } catch (error) {
                console.error('Error updating AsyncStorage:', error);
            }
        };
    
        updateStorage();
    }, [kmUnit, weightUnit]);
    

    const addSet = () => {
        updateSets([
            ...sets,
            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
        ]);
    };

    const removeSet = () => {
        if (sets.length > 1) {
            updateSets(sets.slice(0, -1));
        }
    };


    // 무게 단위 가져오기
    useEffect(() => {
        const fetchWeightUnit = async () => {
            try {
                const unitKg = await AsyncStorage.getItem('weightUnit');
                const unitKm = await AsyncStorage.getItem('heightUnit');
                setWeightUnit(unitKg || 'kg'); // 저장된 값이 없으면 기본값 'kg'

               // heightUnit이 feet인 경우 MI로 저장, cm인 경우 KM로 저장
                if (unitKm === 'feet') {
                    setKmUnit('mi');
                } else if (unitKm === 'cm') {
                    setKmUnit('km');
                } else {
                    setKmUnit(unitKm || 'km');
                }


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

    // 버튼 상태 토글
    const toggleExerciseIcon = () => {
        setShowExerciseIcon((prev) => !prev); // 상태 변경
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

    // 완료 상태에 숫자 입력시 해제
    const resetCompleteState = (index) => {
        const newSets = [...sets];
        if (newSets[index].completed) {
            newSets[index].completed = false; // 완료 상태 해제
            updateSets(newSets); // 부모 상태 업데이트
            console.log(`SET ${index + 1} 완료 해제`);
        }
    };

    // 완료 또는 해제 버튼시 기능
    const handleCompletePress = (index) => {
        const newSets = [...sets];
    
        // 완료 버튼 다시 누를 시 해제
        if (newSets[index].completed) {
            // 마지막 완료된 세트 찾기
            for (let i = sets.length - 1; i >= 0; i--) {
                if (newSets[i].completed) {
                    newSets[i].completed = false; // 완료 상태 해제
                    updateSets(newSets); // 부모 상태 업데이트
                    console.log(`SET ${i + 1} 완료 해제`);

                    // 마지막 완료된 세트 번호와 데이터를 전달
                    deleteExerciseFilter(newSets[i], i + 1); 
                    return; // 함수 종료
                }
            }
        } else {
            // 완료 버튼 누를 시 완료 추가
            if (index === 0 || newSets[index - 1].completed) {
                newSets[index].completed = true; // 완료 상태로 설정
                updateSets(newSets); // 부모 상태 업데이트

                // 완료된 세트만 넘기기
                submitExerciseFilter(newSets[index], index + 1); // index + 1을 세트 번호로 전달
            } else {
                console.log(`SET ${index + 1}을 완료하기 위해서는 이전 세트를 완료해야 합니다.`);
            }
        }
    };
    
    // 완료 누를시 데이터 가공
    const submitExerciseFilter = (set, index) => {
        
        // db "맞춤일정" 저장 목적
        const exerciseService = 1;

        const setNumber = index;

        console.log("전송할 세트 번호" + setNumber)

        
        submitExerciseRecord(memberId, exerciseService, setNumber, set, exercise, exerciseType, volume, weightUnit, kmUnit)
    };

    // 완료 누를시 데이터 가공
    const deleteExerciseFilter = (set, index) => {

        const setNumber = index;

        const exerciseService = 1;

        console.log("전송할 세트 번호" + setNumber)
        deleteExerciseRecord(memberId, setNumber, exercise, exerciseService)
    };
    
    // 모든 세트를 완료로 설정하고 submitExerciseFilter 호출
    const completeAllSets = () => {
        // 새로운 배열 생성 (불변성 유지)
        const newSets = sets.map((set) => ({
            ...set,  // 기존 데이터를 복사
            completed: true,  // completed 상태를 true로 설정
        }));

        // 상태를 먼저 업데이트
        updateSets(newSets);

        // 상태가 업데이트된 후 submitExerciseFilter 호출
        newSets.forEach((set, index) => {
            submitExerciseFilter(set, index+1);
        });
    };

    // 조건 평가
    const kmAndTime = isKmAndTime(exercise.exerciseName || '');
    const time = isTime(exercise.exerciseName || '');
    const number = isNumber(exercise.exerciseName || '');
    
    return (
            <Pressable onPress={() => { 
                Keyboard.dismiss(); 
            }}>

                <View style={[styles.exerciseContainer, isSelected && styles.selectedContainer]}>
            
                {showExerciseIcon ? (
                    // ExerciseIcon만 표시
                    <ExerciseIcon
                        mainMuscleGroup={exercise.mainMuscleGroup}
                        detailMuscleGroup={exercise.detailMuscleGroup}
                        exerciseType={exercise.exerciseType}
                        isIconVisible={showExerciseIcon} // 상태 전달
                        toggleVisibility={toggleExerciseIcon} // 토글 함수 전달
                    />
                ) : ( 
                    
                    <View style={styles.exerciseInformation}>



                        <TouchableOpacity style={styles.exerciseIcon} onPress={toggleExerciseIcon}>
                            {/* 아이콘 추가 시 사용 */}
                        </TouchableOpacity>

                        <Text style={styles.exerciseText}>{exercise.exerciseName}</Text>
                        
                        <View style={styles.volumeContainer}>
                            <Text style={styles.volumeText}>볼륨</Text>
                            <Text style={styles.volumeSeparator}> {volume}</Text>
                            <Text style={styles.volumeUnit}>
                                {kmAndTime 
                                    ? kmUnit
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
                                    ? kmUnit
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

                )}

                {!showExerciseIcon && (
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
                                        {kmAndTime ? kmUnit : weightUnit}
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

                            {/* 종류에 따라 다른 키보드 랜더링 */}
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

                                        {/* 횟수만 있는 경우 */}
                                            {number ? (
                                                <NumberInput
                                                set={set}
                                                index={index}
                                                sets={sets}
                                                setSets={(newSets) => {
                                                    resetCompleteState(index); // 완료 상태 해제
                                                    updateSets(newSets);
                                                }}
                                                style={styles.input}
                                                selectedIndex={selectedIndex}
                                                setSelectedIndex={setSelectedIndex} // 상위 상태를 전달
                                            />
                                        )   : time ? (
                                            // 시간만 있는 경우 ex 매달리기
                                            <TimeInput
                                                key={`time-input-${set.id || index}-${selectedIndex === index ? 'focused' : 'unfocused'}`} // 포커스 상태 반영
                                                set={set}
                                                index={index}
                                                sets={sets}
                                                setSets={(newSets) => {
                                                    resetCompleteState(index); // 완료 상태 해제
                                                    updateSets(newSets);
                                                }}
                                                style={styles.input}
                                                selectedIndex={selectedIndex}
                                                setSelectedIndex={setSelectedIndex} // 상위 상태를 전달
                                            />
                                        ) : kmAndTime ? (
                                            // km 와 시간 인 경우 ex) 러닝머신
                                            <>
                                                <KmInput
                                                    set={set}
                                                    index={index}
                                                    sets={sets}
                                                    setSets={(newSets) => {
                                                        resetCompleteState(index); // 완료 상태 해제
                                                        updateSets(newSets);
                                                    }}
                                                    style={styles.input}
                                                    selectedIndex={selectedIndex}
                                                    kmUnit={kmUnit} // unitKm 추가 전달
                                                    setKmUnit={setKmUnit}
                                                    setSelectedIndex={setSelectedIndex} // 상위 상태를 전달
                                                />
                                                
                                                <TimeInput
                                                    key={`time-input-${set.id || index}-${selectedIndex === index ? 'focused' : 'unfocused'}`} // 포커스 상태 반영
                                                    set={set}
                                                    index={index}
                                                    sets={sets}
                                                    setSets={(newSets) => {
                                                        resetCompleteState(index); // 완료 상태 해제
                                                        updateSets(newSets);
                                                    }}
                                                    style={styles.input}
                                                    selectedIndex={selectedIndex}
                                                    setSelectedIndex={setSelectedIndex} // 상위 상태를 전달
                                                />
                                            </>
                                        ) : (
                                            // 그외 모든 경우 (무게+ 횟수) ex 벤치프레스
                                            <>
                                                <KgInput
                                                    set={set}
                                                    index={index}
                                                    sets={sets}
                                                    setSets={(newSets) => {
                                                        resetCompleteState(index); // 완료 상태 해제
                                                        updateSets(newSets);
                                                    }}
                                                    style={styles.input}
                                                    selectedIndex={selectedIndex}
                                                    weightUnit={weightUnit} // unitKm 추가 전달
                                                    setWeightUnit={setWeightUnit}
                                                    setSelectedIndex={setSelectedIndex} // 상위 상태를 전달
                                                />
                                                
                                                <NumberInput
                                                    set={set}
                                                    index={index}
                                                    sets={sets}
                                                    setSets={(newSets) => {
                                                        resetCompleteState(index); // 완료 상태 해제
                                                        updateSets(newSets);
                                                    }}
                                                    style={styles.input}
                                                    selectedIndex={selectedIndex}
                                                    setSelectedIndex={setSelectedIndex} // 상위 상태를 전달
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
                )}
            </View>
        </Pressable>
    );
};

export default EachExercise;
