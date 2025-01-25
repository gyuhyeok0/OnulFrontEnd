import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTotalFoodSuccess, fetchTotalFoodFailure, resetFoodStatus } from '../modules/TotalFoodSlice'; // 경로 확인
import { API_URL } from '@env';

export const saveFoodData = async (memberId, id, recipeName, foodItems, accessToken = null) => {
    try {
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }


        const response = await fetch(`${API_URL}/management/saveFoodData`, {
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
                return await saveFoodData(memberId, id, recipeName, foodItems, newAccessToken);
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


export const deleteFoodData = async (memberId, id, accessToken = null) => {
    try {
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const url = `${API_URL}/management/deleteFoodData?memberId=${memberId}&recipeId=${id}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (response.status === 200) {
            console.log("성공");
            return true; // 요청 성공
        } else if (response.status === 401) {
            console.warn('토큰 만료: 새로운 토큰을 요청 중...');
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새로 발급받은 토큰으로 재귀 호출
                return await deleteFoodData(memberId, id, newAccessToken);
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

export const getAllFoodData = async (memberId, accessToken = null) => {
    try {
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const url = `${API_URL}/management/getAllFoodData?memberId=${memberId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (response.status === 200) {
            const data = await response.json(); // JSON 데이터를 파싱
            
            return data; // 요청 성공 시 데이터를 반환
        } else if (response.status === 401) {
            console.warn('토큰 만료: 새로운 토큰을 요청 중...');
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새로 발급받은 토큰으로 재귀 호출
                return await getAllFoodData(memberId, newAccessToken);
            } else {
                console.error('새로운 토큰을 가져오지 못했습니다.');
                throw new Error('Unable to refresh token');
            }
        } else if (response.status === 404) {
            console.log('서버 오류: 데이터가 존재하지 않음.');
            return []; // 빈 배열을 반환하여 데이터를 없다고 표시
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



export const saveTotalFoodData = async (memberId, mealType, formattedDate, totalNutrition, recipeNames, accessToken = null, dispatch) => {
    try {
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const response = await fetch(`${API_URL}/management/saveTotalFoodData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                memberId: memberId,
                mealType: mealType,            // mealType 추가
                date: formattedDate,           // 날짜 추가
                totalNutrition: totalNutrition, // totalNutrition 추가
                recipeNames: recipeNames
            }),
        });

        if (response.status === 200) {
            const responseData = await response.json();
            console.log("성공:", responseData);

            const { date: rawDate, mealType, totalNutrition, recipeNames } = responseData;

            // 날짜를 "0000-00-00" 형식으로 변환
            const date = `${rawDate[0]}-${String(rawDate[1]).padStart(2, '0')}-${String(rawDate[2]).padStart(2, '0')}`;

            console.log(recipeNames);

            dispatch(fetchTotalFoodSuccess({
                date, 
                mealType, 
                totalNutrition,
                recipeNames
            }));

            return responseData; // 요청 성공 시 응답 데이터 반환
        } else if (response.status === 401) {
            console.warn('토큰 만료: 새로운 토큰을 요청 중...');
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새로 발급받은 토큰으로 재귀 호출
                return await saveTotalFoodData(memberId, mealType, formattedDate, totalNutrition, recipeNames, newAccessToken, dispatch);
            } else {
                console.error('새로운 토큰을 가져오지 못했습니다.');
                throw new Error('Unable to refresh token');
            }
        } else {
            const errorMessage = `Unexpected error occurred: ${response.statusText}`;
            console.error(errorMessage);
            dispatch(fetchTotalFoodFailure(errorMessage)); // 실패 상태 디스패치
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('요청 실패:', error);
        dispatch(fetchTotalFoodFailure(errorMessage)); // 실패 상태 디스패치
        throw error; // 오류를 호출한 쪽으로 전달
    }
};
