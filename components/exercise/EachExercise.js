import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기
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
import moment from 'moment'; // 날짜 형식화를 위한 moment 라이브러리

import { updateExerciseSetsInRedux, resetState } from '../../src/modules/StateExerciseSlice'; // Redux 액션


const EachExercise = ({ exercise, isSelected, exerciseServiceNumber, weightUnit, setWeightUnit, kmUnit, setKmUnit, onPress }) => {


    const [memberId, setMemberId] = useState(null);

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

    const [exerciseService, setExerciseService] = useState();

    
    // Redux의 dispatch를 가져오기
    const dispatch = useDispatch();

    const sets = useSelector((state) =>
        state.stateExercise.exerciseSets[exercise.id]?.sets || []
    );

    // 운동 세트 상태 업데이트
    const updateSets = (updatedSets) => {
        // console.log("뭐로 보내니?", JSON.stringify(updatedSets, null, 2));

        
        dispatch(updateExerciseSetsInRedux({ exerciseId: exercise.id, updatedSets }));
    };

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

    useEffect(() => {            
        setExerciseService(exerciseServiceNumber);
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
    
                // console.log("여기"+timeFormat)
    
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

                // console.log(`Weight-based volume (${weightUnit}): ${weight}`);
                setVolume(calculatedVolume); // 시간일 경우 MM:SS 형식, 나머지는 숫자로 저장
                setExerciseType(3)

            }
        });
    
    }, [sets, exercise?.id, number, time, kmAndTime]);

    

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


    // 운동 정보 버튼
    const handleExerciseInfoPress = () => {

        // console.log(sets);

        // dispatch(resetState({ exerciseId: 25 }));
        setIsInfoButtonPressed((prev) => !prev);
        setShowExerciseInfo((prev) => !prev); // 상태를 토글
    
        if (!isInfoButtonPressed) {
            // 다른 버튼 상태 초기화
            setIsPreviousRecordButtonPressed(false);
            setShowPreviousRecord(false);
        }

        console.log(sets);

    };

    // 버튼 상태 토글
    const toggleExerciseIcon = () => {
        setShowExerciseIcon((prev) => !prev); // 상태 변경
    };

    // 이전 기록 버튼
    const handlePreviousRecordPress = () => {

        // console.log(sets)

        setIsPreviousRecordButtonPressed((prev) => !prev);
        setShowPreviousRecord((prev) => !prev); // 상태를 토글

        if (!isPreviousRecordButtonPressed) {
            // 다른 버튼 상태 초기화
            setIsInfoButtonPressed(false);
            setShowExerciseInfo(false);
        }
    };
    


   
    const handleCompletePress = (index) => {
        // 현재 세트를 복사합니다
        const newSets = [...sets];
    
        // 완료 버튼을 다시 누를 경우 완료 상태를 해제
        if (newSets[index].completed) {
            // 마지막으로 완료된 세트를 찾고 완료 상태를 해제
            for (let i = sets.length - 1; i >= 0; i--) {
                if (newSets[i].completed) {
                    // 완료 상태를 해제
                    newSets[i] = { ...newSets[i], completed: false }; 
                    updateSets(newSets); // 부모 상태 업데이트
    
                    // 마지막 완료된 세트 번호와 데이터를 전달
                    deleteExerciseFilter(newSets[i], i + 1);
                    return; // 함수 종료
                }
            }
        } else {
            // 완료 버튼 누를 때 완료 상태 추가
            if (index === 0 || newSets[index - 1].completed) {
                // 완료 상태로 설정
                newSets[index] = { ...newSets[index], completed: true }; 
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

        const setNumber = index;
        
        submitExerciseRecord(memberId, exerciseService, setNumber, set, exercise, exerciseType, volume, weightUnit, kmUnit)
    };


    const deleteExerciseFilter = (set, index) => {
        console.log("deleteExerciseFilter 호출됨", { set, index });
    
        // 기존 로직 유지
        const setNumber = index;
        const today = moment().format('YYYY-MM-DD');
    
        deleteExerciseRecord(memberId, setNumber, { ...exercise, recordDate: today }, exerciseService, null, dispatch)
            .then(() => {
                // console.log(`세트 번호 ${setNumber}가 성공적으로 삭제되었습니다.`);
            })
            .catch((error) => {
                console.error('운동 기록 삭제 중 오류 발생:', error);
            });
    };
    

    // 모든 세트를 완료로 설정하고 submitExerciseFilter 호출
    const completeAllSets = () => {
        // 모든 세트를 완료 상태로 설정
        const updatedSets = sets.map((set) => ({
            ...set, // 기존 데이터를 복사
            completed: true, // completed 상태를 true로 설정
        }));
    
        // 상태를 먼저 업데이트
        updateSets(updatedSets);
    
        // 완료된 세트를 순차적으로 처리
        updatedSets.forEach((set, index) => {
            if (set.completed) {
                submitExerciseFilter(set, index + 1); // 세트 번호는 1부터 시작
            }
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
                        <PreviousRecordComponent exercise={exercise} memberId={memberId} exerciseService={exerciseService}/>
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
                                                    updateSets(newSets);
                                                }}
                                                deleteExerciseFilter={deleteExerciseFilter}
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
                                                    updateSets(newSets);
                                                }}
                                                deleteExerciseFilter={deleteExerciseFilter}                                           
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
                                                        updateSets(newSets);
                                                    }}
                                                    deleteExerciseFilter={deleteExerciseFilter}
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
                                                        updateSets(newSets);
                                                    }}
                                                    deleteExerciseFilter={deleteExerciseFilter}
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
                                                        updateSets(newSets);
                                                    }}
                                                    deleteExerciseFilter={deleteExerciseFilter}
                                                    style={styles.input}
                                                    selectedIndex={selectedIndex}
                                                    weightUnit={weightUnit} // unitKm 추가 전달
                                                    setWeightUnit={setWeightUnit}
                                                    setSelectedIndex={setSelectedIndex} // 상위 상태를 전달
                                                />
                                                
                                                <NumberInput
                                                    index={index}
                                                    set={set}
                                                    sets={sets}
                                                    setSets={(newSets) => {                                    
                                                        updateSets(newSets);
                                                    }}
                                                    deleteExerciseFilter={deleteExerciseFilter}
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
