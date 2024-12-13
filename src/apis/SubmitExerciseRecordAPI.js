// SubmitExerciseRecordApi.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { refreshAccessToken } from '../apis/Token';



// 서버로 데이터를 전송하는 함수
export const submitExerciseRecord = async (memberId, exerciseService, setNumber, set, exercise,  exerciseType, volume, weightUnit, kmUnit, accessToken = null) => {
    try {
        // 토큰이 없을 경우 AsyncStorage에서 가져오기
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        console.log(memberId, exerciseService, setNumber, set, exercise,  exerciseType, volume, weightUnit, kmUnit);


        const response = await fetch('http://localhost:8080/submitExercises/regist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
            },
            body: JSON.stringify({
                memberId: memberId,          // 회원 ID
                exerciseService: exerciseService, // 운동 서비스
                setNumber: setNumber,       // 세트 번호
                set: set,
                exercise: exercise,  // 추가된 운동 정보
                exerciseType: exerciseType,
                volume: volume,
                weightUnit: weightUnit,
                kmUnit: kmUnit
            }),
        });

        if (!response.ok) {
            if (response.status === 401) { // 상태 코드가 401 (Unauthorized)일 경우
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await submitExerciseRecord(memberId, exerciseService, setNumber, set, exercise, exerciseType, volume, weightUnit, kmUnit, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('서버 요청이 실패했습니다.');
            }
        }

    } catch (error) {
        Alert.alert('서버와 통신 중 오류가 발생했습니다.');
        console.error('Error sending data to server:', error);
    }
};



// 서버로 데이터를 전송하는 함수
export const deleteExerciseRecord = async (memberId, setNumber, exercise, exerciseService, accessToken = null) => {
    try {
        // 토큰이 없을 경우 AsyncStorage에서 가져오기
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        // console.log("삭제 서비스넘버"+  exerciseService);

        const response = await fetch('http://localhost:8080/submitExercises/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
            },
            body: JSON.stringify({
                memberId: memberId,          // 회원 ID
                setNumber: setNumber,       // 세트 번호
                exercise: exercise,  // 추가된 운동 정보
                exerciseService: exerciseService
            }),
        });

        if (!response.ok) {
            if (response.status === 401) { // 상태 코드가 401 (Unauthorized)일 경우
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await submitExerciseRecord(memberId, setNumber, exercise, exerciseService, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('서버 요청이 실패했습니다.');
            }
        }

    } catch (error) {
        Alert.alert('서버와 통신 중 오류가 발생했습니다.');
        console.error('Error sending data to server:', error);
    }
};
