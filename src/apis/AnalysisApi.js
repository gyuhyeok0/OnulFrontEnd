import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import { API_URL } from '@env';

// ExerciseAPICalls.js
export const analysisUpdateAPI = async (memberId, accessToken = null) => {
    try {


        let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
        const response = await fetch(`${API_URL}/analysis/update?memberId=${memberId}`, {
            method: 'POST', // POST 요청
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                // 상태 코드가 401일 경우 액세스 토큰 갱신
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await analysisUpdateAPI(memberId, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('네트워크 오류');
            }
        }

    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};



export const analysisExerciseVolume = async (memberId, accessToken = null) => {
    try {

        let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
        const response = await fetch(`${API_URL}/analysis/findExerciseVolume?memberId=${memberId}`, {
            method: 'GET', // POST 요청
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                // 상태 코드가 401일 경우 액세스 토큰 갱신
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await analysisExerciseVolume(memberId, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('네트워크 오류');
            }
        }

        return response.json(); // 정상적인 응답이면 JSON으로 반환

    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};


