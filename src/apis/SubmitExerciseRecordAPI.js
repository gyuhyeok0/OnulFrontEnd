// SubmitExerciseRecordApi.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { refreshAccessToken } from '../apis/Token';
import moment from 'moment'; // moment 가져오기

import { API_URL_JP, API_URL_US } from '@env'; // 환경변수에서 실제 URL 가져오기

// 로컬 스토리지에서 저장된 API_URL을 가져와 실제 API URL을 반환하는 함수
const getStoredAPIURL = async () => {
    const storedAPI = await AsyncStorage.getItem('API_URL'); // 'API_URL' 문자열을 가져옴

    // 'API_URL_JP' 또는 'API_URL_US' 문자열에 맞는 실제 API URL을 반환
    if (storedAPI === 'API_URL_JP') {
        return API_URL_JP;
    } else if (storedAPI === 'API_URL_US') {
        return API_URL_US;
    } else {
        return API_URL_US; // 기본값으로 미국 서버를 사용
    }
};



// 서버로 데이터를 전송하는 함수
export const submitExerciseRecord = async (memberId, exerciseService, setNumber, set, exercise,  exerciseType, volume, weightUnit, kmUnit, accessToken = null, dispatch) => {
    try {
        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.


        // 토큰이 없을 경우 AsyncStorage에서 가져오기
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const getCurrentDate = () => {
            const now = new Date();
            return now.toLocaleDateString('en-CA'); // "YYYY-MM-DD" 형식 반환
        };
        
        const date = getCurrentDate();

        if (set.time) {
        
            // 00:00 또는 00:00:00 형태면 아무 작업도 하지 않음
            const timeRegex = /^(?:\d{2}:\d{2}|\d{2}:\d{2}:\d{2})$/;
            if (timeRegex.test(set.time)) {
                // 아무것도 하지 않음

            } else {
                // 잘못된 형태의 time 값을 올바른 형식으로 변환
                const formattedTime = formatTime(set.time);

        
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

        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

        // 토큰이 없을 경우 AsyncStorage에서 가져오기
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const getCurrentDate = () => {
            const now = new Date();
            return now.toLocaleDateString('en-CA'); // "YYYY-MM-DD" 형식 반환
        };
        
        const date = getCurrentDate();


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