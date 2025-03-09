import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchIntensitySuccess, fetchIntensityFailure } from '../modules/IntensitySlice'
import { API_URL } from '@env';

export const sendIntensityToServer = (userId, intensity, accessToken = null) => {
    return async (dispatch) => {

        try {
            if (!accessToken) {
                accessToken = await AsyncStorage.getItem('accessToken');
            }

            const response = await fetch(`${API_URL}/intensity/intensity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    memberId: userId,
                    intensity: intensity,
                }),
            });

            if (response.status === 200) {
                const data = await response.json();

                dispatch(fetchIntensitySuccess(data));
                return data;
            } else if (response.status === 401) {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    return await dispatch(sendIntensityToServer(userId, intensity, newAccessToken));
                } else {
                    console.error('새로운 토큰을 가져오지 못했습니다.');
                    dispatch(fetchIntensityFailure('Unable to refresh token'));
                    throw new Error('Unable to refresh token');
                }
            } else {
                const errorMessage = 'Unexpected error occurred';
                dispatch(fetchIntensityFailure(errorMessage));
                throw new Error(errorMessage);
            }
        } catch (error) {
            dispatch(fetchIntensityFailure(error.message || 'Network error'));
            throw error;
        }
    };
};
