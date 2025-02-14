// SubmitExerciseRecordApi.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { refreshAccessToken } from '../apis/Token';
import moment from 'moment'; // moment 가져오기
import { API_URL } from '@env';




// 서버로 데이터를 전송하는 함수
export const submitExerciseRecord = async (memberId, exerciseService, setNumber, set, exercise,  exerciseType, volume, weightUnit, kmUnit, accessToken = null, dispatch) => {
    try {

        // 토큰이 없을 경우 AsyncStorage에서 가져오기
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const getCurrentDate = () => {
            const now = new Date();
            return now.toLocaleDateString('en-CA'); // "YYYY-MM-DD" 형식 반환
        };
        
        const date = getCurrentDate();
        console.log (date)

        if (set.time) {
            // console.log("time 값이 존재합니다:", set.time);
        
            // 00:00 또는 00:00:00 형태면 아무 작업도 하지 않음
            const timeRegex = /^(?:\d{2}:\d{2}|\d{2}:\d{2}:\d{2})$/;
            if (timeRegex.test(set.time)) {
                console.log("이미 올바른 형식의 time 값입니다:", set.time);
                // 아무것도 하지 않음
                console.log(volume);

            } else {
                // 잘못된 형태의 time 값을 올바른 형식으로 변환
                const formattedTime = formatTime(set.time);

                console.log(volume);
                // console.log("변환된 time 값:", formattedTime);
        
                // 변환된 time 값을 기존 set 객체에 업데이트
                set.time = formattedTime;
            }
        }


        const response = await fetch(`${API_URL}/submitExercises/regist?date=${date}`, {
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

        const getCurrentDate = () => {
            const now = new Date();
            return now.toLocaleDateString('en-CA'); // "YYYY-MM-DD" 형식 반환
        };
        
        const date = getCurrentDate();
        console.log (date)


        const response = await fetch(`${API_URL}/submitExercises/delete?date=${date}`, {
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