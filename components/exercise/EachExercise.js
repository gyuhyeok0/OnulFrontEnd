import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기
import { View, StyleSheet, Image, Text, Pressable, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity} from 'react-native';
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
import { useQuery } from '@tanstack/react-query';
import { selectExerciseRecordByDetails } from '../../src/modules/ExerciseRecordSlice';
import { selectLatestPreVolume, updateExerciseVolume } from '../../src/modules/VolumeSlice';
import Icon from 'react-native-vector-icons/Feather'; // Feather 아이콘 사용
import { Alert } from 'react-native'; // 예제에서는 Alert로 광고 표시 (광고 SDK로 변경 가능)
import analytics from '@react-native-firebase/analytics';
import { AppState } from 'react-native';

import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const interstitialAd = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

const EachExercise = ({ exercise, isSelected, exerciseServiceNumber, weightUnit, setWeightUnit, kmUnit, setKmUnit, onPress }) => {

    const isPremium = useSelector(state => state.subscription.isPremium);

    const memberId = useSelector((state) => state.member?.userInfo?.memberId);
    const memberSignupDate = useSelector((state) => state.member.userInfo.memberSignupDate);

    const [volume, setVolume] = useState(0); // volume을 상태로 관리
    // const [preVolume, setPreVolume] = useState(0); // volume을 상태로 관리

    const [volumeDifference, setVolumeDifference] = useState(null); // 볼륨 차이


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
        state.stateExercise.exerciseSets[`${exercise.id}-${exerciseServiceNumber}`]?.sets || []
    );


    const exerciseId = useMemo(() => exercise.id, [exercise.id]);

    // ✅ `useSelector`에서 `exerciseId` 사용
    const latestPreVolume = useSelector((state) => selectLatestPreVolume(state, exerciseId));

    const MAX_ADS_PER_DAY = 5;

    const today = new Date();
    const signupDate = new Date(memberSignupDate);
    const diffTime = today.getTime() - signupDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const resetDailyAdCount = async () => {
        const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD)
        const lastResetDate = await AsyncStorage.getItem('lastAdResetDate');
    
        if (lastResetDate !== today) {
            await AsyncStorage.setItem('adCount', '0'); // 광고 카운트 초기화
            await AsyncStorage.setItem('lastAdResetDate', today);
        }
    };

    // 광고 표시 함수 (하루 5번 제한)
    const showAd = async () => {
        await resetDailyAdCount(); // 하루 제한 체크

        let adCount = await AsyncStorage.getItem('adCount');
        adCount = adCount ? parseInt(adCount) : 0;

        // 하루 5번 카운트
        if (adCount >= MAX_ADS_PER_DAY || diffDays < 5) {
            console.log("오늘 광고 제한 초과 (5번)");
            return; // 광고 실행 안 함
        }

        // 광고 시작 시간 저장 (닫는 속도 분석)
        const adStartTime = new Date().getTime();

        if (interstitialAd.loaded) {
            // 광고 실행
            interstitialAd.show();
            
            // 기존 리스너 제거 (중복 실행 방지)
            interstitialAd.removeAllListeners();

            // 광고 닫힌 후 이벤트 리스너
            interstitialAd.addAdEventListener(AdEventType.CLOSED, async () => {
                const adCloseTime = new Date().getTime();
                const adDuration = (adCloseTime - adStartTime) / 1000; // 광고 시청 시간 (초)

                console.log(`📢 전면 광고 닫힘 (광고 본 시간: ${adDuration}초)`);

                // 유저 이탈 여부 체크 (비동기 처리)
                const userRetention = await checkUserRetention();

                await analytics().logEvent("ad_interstitial_closed", {
                    ad_type: "interstitial",
                    duration: adDuration, // 광고 본 시간 기록
                    user_retention: userRetention, // 광고 후 앱 이탈 여부
                });

                interstitialAd.load(); // 광고 닫힌 후 다시 로드
            });

    
            // 광고 클릭 이벤트 리스너 (CTR 분석)
            interstitialAd.addAdEventListener(AdEventType.CLICKED, async () => {
                console.log("📢 전면 광고 클릭됨");

                await analytics().logEvent("ad_interstitial_clicked", {
                    ad_type: "interstitial",
                });
            });

            // 광고 카운트 증가
            await AsyncStorage.setItem('adCount', (adCount + 1).toString());
    
            // 광고 본 후 exerciseSubmitCount 초기화
            await AsyncStorage.setItem('exerciseSubmitCount', '0');
        } else {            
            // 광고가 로드되지 않았으면 다시 로드 시도
            interstitialAd.load();
        }

    };

    // 광고 후 유저가 앱에 머무르는지 체크 (5초 후 앱 상태 확인)
    const checkUserRetention = () => {
        setTimeout(() => {
            const isAppStillOpen = AppState.currentState === "active";
            return isAppStillOpen ? "retained" : "exited"; // 앱에 머물렀는지 여부 반환
        }, 5000);
    };

    useEffect(() => {
        // 초기 상태는 volumeDifference를 0으로 설정

        // console.log(latestPreVolume);
        if (volumeDifference === null) {
            setVolumeDifference(0);
        }
    
        let difference;
    
        // 오늘 볼륨과 어제 볼륨 값이 모두 유효한지 확인
        if (latestPreVolume !== null && volume !== null) {
            // volume이 시간 형식이라면, timeToSeconds 함수로 변환하여 차이 계산
            if (typeof volume === "string" && typeof latestPreVolume === "string") {
                difference = timeToSeconds(volume) - timeToSeconds(latestPreVolume);
            } else {
                // 숫자 형식이라면 그냥 차이 계산
                difference = volume - latestPreVolume;
            }
    
            // console.log(difference);
    
            // 차이가 음수일 경우 0으로 설정
            if (difference < 0) {
                difference = 0;
            }
        } else {
            // latestPreVolume 또는 volume이 null인 경우 기존 volume 값을 사용
            // 만약 latestPreVolume이 null이면, difference를 0으로 설정
            difference = volume || 0; // volume이 null일 경우 0으로 처리

            // console.log("null 이에요")
        }
    
        setVolumeDifference(difference);
    
    }, [latestPreVolume, volume]);
    
    
    

    // 볼륨이 달라질때마다 계산
    // 리듀서에 볼륨 저장
    useEffect(() => {            

        if (volume) {
            const preVolume = volume;
            const date = new Date().toISOString().split('T')[0]; // 현재 날짜 (YYYY-MM-DD 형식)
            // Redux 상태 업데이트
            dispatch(updateExerciseVolume({ exerciseId, date, preVolume }));
        }
    }, [volume]);
    
    // 볼륨 차이 계산 및 상태 업데이트
    useEffect(() => {
        // console.log("가장 최근 볼륨 (오늘 제외):", latestPreVolume);
        if (latestPreVolume !== null && volume !== null) {
            const difference =
                typeof volume === "string" && typeof latestPreVolume === "string"
                    ? timeToSeconds(volume) - timeToSeconds(latestPreVolume)
                    : volume - latestPreVolume;

            setVolumeDifference(difference); // 볼륨 차이 상태 업데이트
        }
    }, [latestPreVolume, volume]);

    // 시간 → 초 변환 함수
    const timeToSeconds = (timeString) => {
        const [minutes, seconds] = timeString.split(":").map(Number);
        return minutes * 60 + seconds;
    };
    
    // 운동 세트 상태 업데이트
    const updateSets = (updatedSets) => {
        // console.log("뭐로 보내니?", JSON.stringify(updatedSets, null, 2));
        dispatch(updateExerciseSetsInRedux({ 
            exerciseId: exercise.id, 
            exerciseServiceNumber,
            updatedSets
        }));
    };

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
    
    // today 볼륨 계산 
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

                // console.log("여기띠용"+set.time);

                if (set.time) {
                    // console.log("time 값이 존재합니다:", set.time);
                
                    // 00:00 또는 00:00:00 형태면 아무 작업도 하지 않음
                    const timeRegex = /^(?:\d{2}:\d{2}|\d{2}:\d{2}:\d{2})$/;
                    if (timeRegex.test(set.time)) {
                        // console.log("이미 올바른 형식의 time 값입니다:", set.time);
        
                    } else {
                        return;

                    }
                }

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
            // 무게와 횟수 기반으로 볼륨 계산
            else if (set.kg || set.lbs) {
                let weight = 0; // 기본 무게 초기화
                let reps = parseInt(set.reps || 0); // 반복 횟수 (없으면 0으로 처리)

                // 단위에 따라 무게 선택
                if (weightUnit === "kg") {
                    weight = parseFloat(set.kg || 0); // kg 값 사용
                } else if (weightUnit === "lbs") {
                    weight = parseFloat(set.lbs || 0); // lbs 값 사용
                }

                // 무게와 반복 횟수를 곱해 볼륨 계산
                let volume = weight * reps;

                // 계산된 볼륨을 누적하고 소수점 2자리까지 반올림
                calculatedVolume += volume;
                calculatedVolume = parseFloat(calculatedVolume.toFixed(2)); // 소수점 2자리까지 반올림

                // console.log(`Volume (${weightUnit}): ${weight} x ${reps} = ${volume}`);
                setVolume(calculatedVolume); // 최종 볼륨 저장
                setExerciseType(3); // 운동 타입 설정 (예: 3번 타입)
            }
        });
    
    }, [sets, exercise?.id, number, time, kmAndTime]);

    
    // formatTime 함수
    const formatTime = (value = '') => {
        if (!value || isNaN(Number(value))) return '00:00';
        if (value.length === 1) return `00:0${value}`;
        if (value.length === 2) return `00:${value}`;
        if (value.length === 3) return `0${value[0]}:${value.slice(1)}`;
        if (value.length === 4) return `${value.slice(0, 2)}:${value.slice(2)}`;
        if (value.length === 5) return `0${value[0]}:${value.slice(1, 3)}:${value.slice(3)}`;
        if (value.length === 6) return `${value.slice(0, 2)}:${value.slice(2, 4)}:${value.slice(4)}`;
        return '00:00';
    };

    const addSet = () => {
        updateSets([
            ...sets,
            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
        ]);
    };

    const removeSet = () => {
        if (sets.length > 1) {
            // 완료 상태가 아닌 세트만 삭제 가능
            const lastSet = sets[sets.length - 1];
            if (!lastSet.completed) {
                updateSets(sets.slice(0, -1));
            } else {
                console.log("완료 상태인 세트는 삭제할 수 없습니다.");
            }
        } else {
            console.log("더 이상 세트를 삭제할 수 없습니다.");
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

        // console.log(sets);

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


    // -===================================

    const [currentSetNumber, setCurrentSetNumber] = useState(false);
    const [currentSet, setCurrentSet] = useState(false);


    const { refetch: refetchSubmit  } = useQuery({
        queryKey: ['submitExercise'],
        queryFn: async () => {


            if (currentSet && currentSetNumber !== null) {
                const result = await submitExerciseRecord(
                    memberId,
                    exerciseService,
                    currentSetNumber,
                    currentSet,
                    exercise,
                    exerciseType,
                    volume,
                    weightUnit,
                    kmUnit
                );
                return result; // 서버 응답 반환
            }
    
            // 기본 반환값 보장
            return { success: false, message: 'Invalid parameters' }; // 기본값 반환
        },
        enabled: false,
    });
    
    
    
    // submitExerciseFilter 함수 수정
    const submitExerciseFilter = async (set, index) => {
        setCurrentSetNumber(index); // 상태 업데이트
        setCurrentSet(set);


        let count = await AsyncStorage.getItem('exerciseSubmitCount');
        count = count ? parseInt(count) + 1 : 1; // 기존 값이 있으면 +1, 없으면 1부터 시작
        await AsyncStorage.setItem('exerciseSubmitCount', count.toString());
    
        console.log(count);
        // 15회마다 광고 표시
        if (count >= 15) {
            if(!isPremium){
                await showAd();
            }
        }

        setTimeout(async () => {
            try {
                const { data } = await refetchSubmit();
                if (data && data.success === false) {
                    // 특정 세트만 상태 해제
                    const updatedSets = sets.map((item, idx) => 
                        idx === index - 1 // index는 1부터 시작하므로 -1
                            ? { ...item, completed: false } // 해당 세트 상태 해제
                            : item // 나머지는 유지
                    );
                    updateSets(updatedSets);
    
                    console.log(`세트 ${index} 상태가 해제되었습니다.`);
                } else {
                    // console.log('Data successfully submitted:', data);
                }
            } catch (error) {
                console.error("Unexpected error during refetch:", error);
            }
        }, 0); // 상태 업데이트 후 실행
    };
    
    
    // -===================================

    
    // // 완료 누를시 데이터 가공
    // const submitExerciseFilter = (set, index) => {

    //     const setNumber = index;
        
    //     submitExerciseRecord(memberId, exerciseService, setNumber, set, exercise, exerciseType, volume, weightUnit, kmUnit)
    // };


    const { refetch: refetchDelete  } = useQuery({
        queryKey: ['DeleteExercise'],
        queryFn: async () => {

            console.log("삭제 쿼리 호출합니다.")


            // console.log(currentSet, currentSetNumber);

            if (currentSet && currentSetNumber !== null) {

                console.log("api 호출준비")
                const result = await deleteExerciseRecord(
                    memberId, currentSetNumber, exercise, exerciseService, null, dispatch,
                );
                return result; // 서버 응답 반환
            }
    
            // 기본 반환값 보장
            return { success: false, message: 'Invalid parameters' }; // 기본값 반환
        },
        enabled: false,
    });

    const deleteExerciseFilter = (set, index) => {
    
        // 기존 로직 유지
        setCurrentSetNumber(index); // 상태 업데이트
        setCurrentSet(set);

        setTimeout(async () => {
            try {
                const { data } = await refetchDelete();
                if (data && data.success === false) {
                    console.log("실패한거 아냐?")
                } else {
                    // console.log('Data successfully submitted:', data);
                }
            } catch (error) {
                console.error("Unexpected error during refetch:", error);
            }
        }, 0); 
    }; 


    // const deleteExerciseFilter = (set, index) => {
    //     console.log("deleteExerciseFilter 호출됨", { set, index });
    
    //     // 기존 로직 유지
    //     const setNumber = index;
    //     const today = moment().format('YYYY-MM-DD');
    
    //     deleteExerciseRecord(memberId, setNumber, { ...exercise, recordDate: today }, exerciseService, null, dispatch)
    //         .then(() => {
    //             // console.log(`세트 번호 ${setNumber}가 성공적으로 삭제되었습니다.`);
    //         })
    //         .catch((error) => {
    //             console.error('운동 기록 삭제 중 오류 발생:', error);
    //         });
    // };
    

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
        const processSet = (index) => {
            if (index >= updatedSets.length) return; // 모든 세트 처리 완료
    
            const set = updatedSets[index];
            if (set.completed) {
                submitExerciseFilter(set, index + 1); // 현재 세트를 처리
                setTimeout(() => processSet(index + 1), 50); // 다음 세트로 이동
            }
        };
    
        processSet(0); // 첫 번째 세트부터 처리 시작
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
        

                            <Icon name="slash" size={35} color="#787A7F" style={{opacity:0.5}} />

                            
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
                            <Text style={styles.weightChangeValue}>
                                {isNaN(volumeDifference) 
                                    ? 0 
                                    : Math.max(volumeDifference, 0).toFixed(2)} {/* NaN은 0으로, 음수는 0으로, 양수는 소숫점 2자리까지 */}
                            </Text>

                            <Text style={styles.weightChangeUnit}>
                                {kmAndTime 
                                    ? kmUnit
                                    : time 
                                    ? '초' 
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
                        <PreviousRecordComponent exercise={exercise} memberId={memberId} exerciseService={exerciseService} kmUnit={kmUnit} weightUnit={weightUnit}/>
                    ) : (
                        <View style={styles.record}>
                            <Text style={styles.recordTitle}>record</Text>
                            
                            <View style={{ flexDirection: 'row', marginBottom: 3 , marginRight:5, justifyContent:'space-between'}}>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 11,
                                        width: 30,
                                        textAlign: 'center',
                                        // backgroundColor:'red'
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
                                            // backgroundColor:'blue'
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
                                            // backgroundColor:'blue'                                  
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
                                            // backgroundColor:'red',
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
                                            style={[styles.setButton, { backgroundColor: set.completed ? '#1EAE98' : '#525E77' }]}
                                        >
                                            <Text 
                                                style={{ 
                                                    color: set.completed ? '#55E3C1' : '#B0B0B0', 
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
                                                backgroundColor: set.completed ? '#1EAE98' : '#525E77' 
                                            }]} 
                                            onPress={() => handleCompletePress(index)}
                                        >
                                            <Text style={{ 
                                                color: set.completed ? '#55E3C1' : '#B0B0B0', 
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
