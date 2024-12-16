import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshAccessToken } from '../apis/Token'; // 토큰 갱신 API 호출

import { fetchExerciseRecordSuccess, fetchExercisesRecordFailure } from '../modules/ExerciseRecordSlice'; // 경로 확인


export const callFetchExercisesRecordAPI = (exerciseId, memberId, exerciseService, recordDate) => {
    return async (dispatch, getState) => { // getState 추가
        console.log('API 호출 파라미터:', exerciseId, memberId, exerciseService, recordDate);

        const storageKey = `${exerciseId}_${memberId}_${exerciseService}_${recordDate}`;

        try {
            const storedData = await AsyncStorage.getItem(storageKey);
            if (storedData) {
                console.log('AsyncStorage에서 데이터 가져옴:', JSON.parse(storedData));
                dispatch(fetchExerciseRecordSuccess(JSON.parse(storedData)));
                return JSON.parse(storedData);
            }

            const requestURL = 'http://localhost:8080/exercisesRecord/searchRecord';
            const accessToken = await AsyncStorage.getItem('accessToken');

            const response = await fetch(requestURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ exerciseId, memberId, exerciseService, recordDate }),
            });

            if (response.status === 204) {
                console.log('No content available for the given filters.');
                return [];
            }

            if (response.ok) {
                const result = await response.json();
                console.log('[ExerciseAPICalls] API 결과:', result);

                dispatch(fetchExerciseRecordSuccess(result));

                // **여기서 Redux 상태 확인**
                const state = getState();
                // console.log('Redux 상태 확인:', state.exerciseRecord);

                await AsyncStorage.setItem(storageKey, JSON.stringify(result));
                console.log('데이터가 AsyncStorage에 저장되었습니다.');

                return result;
            } else {
                if (response.status === 401) {
                    throw new Error('Unauthorized: Access token expired');
                }
                throw new Error(`API Error: ${response.statusText}`);
            }
        } catch (error) {
            if (error.message.includes('Unauthorized')) {
                console.warn('토큰 만료, 토큰 갱신 시도 중...');
                try {
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        console.log('새로운 토큰 발급:', newAccessToken);
                        await AsyncStorage.setItem('accessToken', newAccessToken);
                        return dispatch(callFetchExercisesRecordAPI(exerciseId, memberId, exerciseService, recordDate));
                    } else {
                        console.error('토큰 갱신 실패');
                        throw new Error('Failed to refresh access token');
                    }
                } catch (refreshError) {
                    console.error('토큰 갱신 중 오류 발생:', refreshError);
                    throw refreshError;
                }
            } else {
                console.error('운동 기록 조회 중 오류 발생:', error);
                dispatch(fetchExercisesRecordFailure(error.message));
                throw error;
            }
        }
    };
};
