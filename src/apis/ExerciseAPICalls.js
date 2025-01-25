import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchExercisesSuccess, fetchExercisesFailure } from '../modules/ExerciseSlice'; // 경로 확인
import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import { API_URL } from '@env';

// 운동 데이터를 서버에서 가져오는 API 호출 함수
export const callFetchExercisesAPI = () => {
    return async (dispatch) => {
        
        try {
            const requestURL = `${API_URL}/exercises/selectList`;
            const accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기

            console.log('Access Token:', accessToken); // 액세스 토큰 확인
            console.log('Request URL:', requestURL);   // API URL 확인

            const response = await fetch(requestURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
                },
            });

            console.log('Response status:', response.status); // 응답 상태 확인
            if (response.ok) {
                const result = await response.json();

                console.log('[ExerciseAPICalls] callFetchExercisesAPI RESULT : ', result);

                // 성공 시 데이터를 리듀서에 전달
                dispatch(fetchExercisesSuccess(result));
            } else {
                throw new Error(`Failed to fetch exercises: ${response.statusText}`);
            }

        } catch (error) {
            console.error('[ExerciseAPICalls] callFetchExercisesAPI ERROR : ', error.message);
            dispatch(fetchExercisesFailure(error.message));
        }
    };
};


// ExerciseAPICalls.js
export const callToggleLikeAPI = async (exerciseId, isLiked) => {
    try {
        let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
        const response = await fetch(`${API_URL}/exercises/${exerciseId}/isLiked`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
            },
            body: JSON.stringify({ liked: isLiked }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                // 상태 코드가 401일 경우 액세스 토큰 갱신
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await callToggleLikeAPI(exerciseId, isLiked, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('네트워크 오류');
            }
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};