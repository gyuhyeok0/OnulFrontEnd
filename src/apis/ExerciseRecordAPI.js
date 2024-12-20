// 운동 기록 조회
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshAccessToken } from '../apis/Token'; // 토큰 갱신 API 호출
import { fetchExerciseRecordSuccess, fetchExercisesRecordFailure } from '../modules/ExerciseRecordSlice'; // 경로 확인

// 운동 기록 조회(이전기록 컴포넌트에서 사용)
// 스토리지에 데이터가 있으면 리듀서 상태 업데이트만
// 스토리지에 데이터가 없으면 서버에 요청하고 리듀서 등록
// 스토리지 기간 1년으로 설정
export const callFetchExercisesRecordAPI = (exerciseId, memberId, exerciseService, recordDate) => {
    return async (dispatch) => { 
        console.log('조회 및 스토리지 그리고 리듀서 등록을 시작합니다.:', exerciseId, memberId, exerciseService, recordDate);

        const storageKey = `${exerciseId}_${memberId}_${exerciseService}_${recordDate}`;

        try {
            // AsyncStorage에서 데이터 가져오기
            const storedData = await AsyncStorage.getItem(storageKey);
            if (storedData) {
                console.log("스토리지에 기록이 있습니다. 리듀서 업데이트만 진행합니다.");
                dispatch(fetchExerciseRecordSuccess({
                    exerciseId, 
                    memberId, 
                    exerciseService, 
                    recordDate, 
                    data: JSON.parse(storedData) 
                }));
                return JSON.parse(storedData);
            }

            // AsyncStorage에 데이터가 없으면 새로 요청
            return fetchData();

            async function fetchData() {
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
                    console.log('db에 등록된 기록이 없습니다.');
                    return [];
                }

                if (response.ok) {
                    const result = await response.json();
                    console.log('[ExerciseAPICalls] API 결과:', result);

                    dispatch(fetchExerciseRecordSuccess({
                        exerciseId, 
                        memberId, 
                        exerciseService, 
                        recordDate, 
                        data: result 
                    }));

                    // 만료일을 1년 후로 설정
                    const expirationDate = new Date();
                    expirationDate.setFullYear(expirationDate.getFullYear() + 1);  // 1년 후로 설정
                    // 저장할 데이터에 만료일 추가
                    const dataToStore = {
                        ...result,
                        expirationDate: expirationDate.toISOString(),
                    };

                    await AsyncStorage.setItem(storageKey, JSON.stringify(dataToStore));
                    console.log('데이터가 AsyncStorage에 저장되었습니다.');

                    return result;
                } else {
                    if (response.status === 401) {
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
                    }
                }
            }
        } catch (error) {
            
                console.error('운동 기록 조회 중 오류 발생:', error);
                dispatch(fetchExercisesRecordFailure(error.message));
                throw error;
        
        }
    };
};
