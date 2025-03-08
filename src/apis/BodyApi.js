import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setBodyData, setBodyDataFailure} from '../modules/BodySlice'
import { API_URL_JP, API_URL_US } from '@env'; // 환경변수에서 실제 URL 가져오기

// 로컬 스토리지에서 저장된 API_URL을 가져와 실제 API URL을 반환하는 함수
const getStoredAPIURL = async () => {
    const storedAPI = await AsyncStorage.getItem('API_URL'); // 'API_URL' 문자열을 가져옴
    console.log("Stored API URL:", storedAPI);

    // 'API_URL_JP' 또는 'API_URL_US' 문자열에 맞는 실제 API URL을 반환
    if (storedAPI === 'API_URL_JP') {
        return API_URL_JP;
    } else if (storedAPI === 'API_URL_US') {
        return API_URL_US;
    } else {
        return API_URL_US; // 기본값으로 미국 서버를 사용
    }
};

export const saveBodyData = (memberId, bodyData, accessToken = null) => {
    return async (dispatch) => {

        try {
            const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

            if (!accessToken) {
                accessToken = await AsyncStorage.getItem('accessToken');
            }

            const response = await fetch(`${API_URL}/management/saveBodyData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    memberId: memberId,
                    bodyData: bodyData,
                }),
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log("성공");
            
                // date 필드를 "YYYY-MM-DD" 형식으로 변환
                const formattedData = {
                    date: data.date.map(num => String(num).padStart(2, "0")).join("-"),
                };

                const dateKey = formattedData.date;

                const { date, ...restOfData } = data;

                const bodyData = restOfData;

                console.log(dateKey);
                console.log(bodyData);

            
                dispatch(setBodyData({
                    dateKey,
                    bodyData,
                }));
            
                return formattedData;

            } else if (response.status === 401) {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    return await dispatch(saveBodyData(memberId, bodyData, newAccessToken));
                } else {
                    console.error('새로운 토큰을 가져오지 못했습니다.');

                    dispatch(setBodyDataFailure('Unable to refresh token'));
                    throw new Error('Unable to refresh token');
                }
            } else {
                const errorMessage = 'Unexpected error occurred';
                dispatch(setBodyDataFailure(errorMessage));
                throw new Error(errorMessage);
            }
        } catch (error) {
            dispatch(setBodyDataFailure(error.message || 'Network error'));
            throw error;
        }
    };
};
