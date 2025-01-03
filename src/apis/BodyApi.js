import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setBodyData, setBodyDataFailure} from '../modules/BodySlice'

export const saveBodyData = (memberId, bodyData, accessToken = null) => {
    return async (dispatch) => {

        try {
            if (!accessToken) {
                accessToken = await AsyncStorage.getItem('accessToken');
            }

            const response = await fetch('http://localhost:8080/management/saveBodyData', {
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
