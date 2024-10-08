import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


// 내 운동 조회
export const fetchMyExercises = async (memberId, muscleGroup) => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
        const response = await axios.get(`http://localhost:8080/myExercises/${memberId}/${muscleGroup}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`, // 액세스 토큰을 사용한 인증 헤더
            },
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // 상태 코드가 401인 경우 토큰 갱신
            console.warn('토큰이 만료되었습니다. 새로운 토큰을 가져오는 중입니다.');
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새 토큰을 AsyncStorage에 저장
                await AsyncStorage.setItem('accessToken', newAccessToken);
                // 새 토큰으로 다시 시도
                return await fetchMyExercises(memberId, muscleGroup);
            } else {
                console.error('새로운 토큰을 가져오지 못했습니다.');
                throw new Error('토큰 갱신 실패');
            }
        } else {
            console.error('내 운동 조회 중 오류 발생:', error);
            throw error;
        }
    }
};


// 서버로 운동 등록 데이터를 전송하는 함수
export const sendExerciseToServer = async (newExercises, muscleGroup, memberId) => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기

        const response = await fetch('http://localhost:8080/myExercises/RegistMyExercise', { // URL 수정
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // 액세스 토큰을 사용한 인증 헤더
            },
            body: JSON.stringify({
                memberId: memberId,  // 사용자 ID 전송
                exerciseIds: newExercises,  // 선택한 운동 목록 전송
                muscleGroup: muscleGroup,
            }),
        });

        if (response.status === 200) {
            const data = await response.json();
            console.log('서버 응답:', data);
        } else if (response.status === 401) {
            // 상태 코드가 401일 경우 액세스 토큰 갱신
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새 토큰으로 다시 시도
                await sendExerciseToServer(newExercises);
            } else {
                console.error('새로운 토큰을 가져오지 못했습니다.');
            }
        } else {
            console.error('서버 요청 실패:', response.status);
        }
    } catch (error) {
        console.error('서버 요청 중 오류 발생:', error);
    }
};

// 내 운동 삭제
export const deleteExerciseFromServer = async (exerciseId, muscleGroup, memberId) => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
        
        const response = await axios.delete(`http://localhost:8080/myExercises/DeleteMyExercise/${exerciseId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`, // 액세스 토큰을 사용한 인증 헤더
                'Content-Type': 'application/json', // JSON 형식의 데이터 전송
            },
            data: {
                memberId: memberId,
                muscleGroup: muscleGroup,
            }
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // 상태 코드가 401인 경우 토큰 갱신
            console.warn('토큰이 만료되었습니다. 새로운 토큰을 가져오는 중입니다.');
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새 토큰을 AsyncStorage에 저장
                await AsyncStorage.setItem('accessToken', newAccessToken);
                // 새 토큰으로 다시 시도
                return await deleteExerciseFromServer(exerciseId, muscleGroup, memberId);
            } else {
                console.error('새로운 토큰을 가져오지 못했습니다.');
                throw new Error('토큰 갱신 실패');
            }
        } else {
            console.error('운동 삭제 중 오류 발생:', error);
            throw error;
        }
    }
};
