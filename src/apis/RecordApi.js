import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTotalFoodFailure, fetchTotalFoodSuccess } from '../modules/TotalFoodSlice';
import { fetchBodyDataFailure, setBodyData } from '../modules/BodySlice';
import { API_URL } from '@env';


export const isMonthDataExist = async (memberId, mountMonth, accessToken = null) => {
    try {

        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const response = await fetch(`${API_URL}/record/isMonthDataExist`, { // 템플릿 리터럴 사용
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                memberId: memberId,
                mountMonth: mountMonth,
            }),
        });

        if (response.status === 200) {
            const data = await response.json();

            console.log("안녕")
            return data;
        } else if (response.status === 401) {
            console.warn('토큰 만료: 새로운 토큰을 요청 중...');
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새로 발급받은 토큰으로 재귀 호출
                return await isMonthDataExist(memberId, mountMonth, newAccessToken);
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




// memberId 와 recordDate 으로 기록조회
export const loadFoodRecordsForDate = (memberId, recordDate) => {
    return async (dispatch) => { 

        try {
            return fetchData();

            async function fetchData() {
                const requestURL = `${API_URL}/management/foodRecordsForDate`;
                const accessToken = await AsyncStorage.getItem('accessToken');

                const response = await fetch(requestURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ memberId, date : recordDate }),
                });

                if (response.ok) {
                    const result = await response.json();

                    result.forEach((item) => {
                        const rawDate = item.date; // item에서 date를 가져옴
                        const date = `${rawDate[0]}-${String(rawDate[1]).padStart(2, '0')}-${String(rawDate[2]).padStart(2, '0')}`;
                        const mealType = item.mealType;
                        const totalNutrition = item.totalNutrition;
                        const recipeNames = item.recipeNames;
                    
                        // 각 item을 순회하면서 dispatch 호출
                        dispatch(fetchTotalFoodSuccess({
                            date, 
                            mealType, 
                            totalNutrition,
                            recipeNames
                        }));
                    });

                    return result;
                } else {
                    if (response.status === 401) {
                        try {
                            const newAccessToken = await refreshAccessToken();
                            if (newAccessToken) {
                                console.log('새로운 토큰 발급:', newAccessToken);
                                await AsyncStorage.setItem('accessToken', newAccessToken);
                                return dispatch(loadFoodRecordsForDate(memberId, recordDate));
                            } else {
                                console.error('토큰 갱신 실패');
                                throw new Error('Failed to refresh access token');
                            }
                        } catch (refreshError) {
                            console.error('토큰 갱신 중 오류 발생:', refreshError);
                            throw refreshError;
                        }
                    }
                }
            }
        } catch (error) {
            
                console.error('식단 기록 조회 중 오류 발생:', error);
                dispatch(fetchTotalFoodFailure(errorMessage)); // 실패 상태 디스패치
                throw error;
        
        }
    };

    
};



// memberId 와 recordDate 으로 기록조회
export const loadBodyRecordsForDate = (memberId, recordDate) => {
    return async (dispatch) => { 

        try {
            return fetchData();

            async function fetchData() {
                const requestURL = `${API_URL}/management/bodyRecordsForDate`;
                const accessToken = await AsyncStorage.getItem('accessToken');

                const response = await fetch(requestURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ memberId, date : recordDate }),
                });

                if (response.ok) {
                    const result = await response.json();

                    // console.log(result);

                    // 1. 날짜를 "0000-00-00" 형식으로 변환
                    const formattedDate = `${result.date[0]}-${String(result.date[1]).padStart(2, '0')}-${String(result.date[2]).padStart(2, '0')}`;

                    // 2. dateKey에 변환된 날짜 저장
                    const dateKey = formattedDate;

                    // 3. 나머지 데이터를 추출하여 bodyData로 묶기
                    const { date, ...restOfData } = result;
                    const bodyData = restOfData;

                    dispatch(setBodyData({
                        dateKey,
                        bodyData,
                    }));

                    return result;
                } else {
                    if (response.status === 401) {
                        try {
                            const newAccessToken = await refreshAccessToken();
                            if (newAccessToken) {
                                console.log('새로운 토큰 발급:', newAccessToken);
                                await AsyncStorage.setItem('accessToken', newAccessToken);
                                return dispatch(loadBodyRecordsForDate(memberId, recordDate));
                            } else {
                                console.error('토큰 갱신 실패');
                                throw new Error('Failed to refresh access token');
                            }
                        } catch (refreshError) {
                            console.error('토큰 갱신 중 오류 발생:', refreshError);
                            throw refreshError;
                        }
                    }
                }
            }
        } catch (error) {
            
                console.error('신체 기록 조회 중 오류 발생:', error);
                dispatch(fetchBodyDataFailure(errorMessage)); // 실패 상태 디스패치
                throw error;
        
        }
    };

    
};