// SubmitExerciseRecordApi.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { refreshAccessToken } from '../apis/Token';
import moment from 'moment'; // moment 가져오기


// 서버로 데이터를 전송하는 함수
export const submitExerciseRecord = async (memberId, exerciseService, setNumber, set, exercise,  exerciseType, volume, weightUnit, kmUnit, accessToken = null, dispatch) => {
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
                    return await submitExerciseRecord(memberId, exerciseService, setNumber, set, exercise, exerciseType, volume, weightUnit, kmUnit, newAccessToken, dispatch);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('서버 요청이 실패했습니다.');
            }
        }

        // 서버 응답 데이터 반환
        const data = await response.json();
        return data; // 반환값 추가

    } catch (error) {
        return { success: false, message: 'Unexpected error occurred' }; // 기본값 반환
    }
};

// 서버로 데이터를 전송하는 함수
export const deleteExerciseRecord = async (memberId, setNumber, exercise, exerciseService, accessToken = null, dispatch) => {
    try {

        // 토큰이 없을 경우 AsyncStorage에서 가져오기
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const response = await fetch('http://localhost:8080/submitExercises/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                memberId,
                setNumber,
                exercise,
                exerciseService,
            }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    return await deleteExerciseRecord(memberId, setNumber, exercise, exerciseService, newAccessToken, dispatch);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('서버 요청이 실패했습니다.');
            }
        }

        // 서버 응답 데이터 반환
        const data = await response.json();
        return data; // 반환값 추가
        
    } catch (error) {
        return { success: false, message: 'Unexpected error occurred' }; // 기본값 반환
    }
};
