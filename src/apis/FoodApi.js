import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveFoodData = async (memberId, id, recipeName, foodItems, accessToken = null) => {
    try {
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }


        const response = await fetch('http://localhost:8080/management/saveFoodData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                memberId: memberId,
                recipeId: id,
                recipeName: recipeName,
                foodItems: foodItems,
            }),
        });

        if (response.status === 200) {
            console.log("성공");
            return true; // 요청 성공
        } else if (response.status === 401) {
            console.warn('토큰 만료: 새로운 토큰을 요청 중...');
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새로 발급받은 토큰으로 재귀 호출
                return await saveFoodData(memberId, foodData, newAccessToken);
            } else {
                console.error('새로운 토큰을 가져오지 못했습니다.');
                throw new Error('Unable to refresh token');
            }
        } else {
            const errorMessage = `Unexpected error occurred: ${response.statusText}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('요청 실패:', error);
        throw error; // 오류를 호출한 쪽으로 전달
    }
};
