// 운동 기록 조회
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshAccessToken } from '../apis/Token'; // 토큰 갱신 API 호출
import { fetchExerciseRecordSuccess, fetchExercisesRecordFailure} from '../modules/ExerciseRecordSlice'; // 경로 확인
import { updateLatestRecord } from '../modules/LatestExerciseRecordSlice'
import { API_URL_JP, API_URL_US } from '@env'; // 환경변수에서 실제 URL 가져오기

// 로컬 스토리지에서 저장된 API_URL을 가져와 실제 API URL을 반환하는 함수
const getStoredAPIURL = async () => {
    const storedAPI = await AsyncStorage.getItem('API_URL'); // 'API_URL' 문자열을 가져옴

    // 'API_URL_JP' 또는 'API_URL_US' 문자열에 맞는 실제 API URL을 반환
    if (storedAPI === 'API_URL_JP') {
        return API_URL_JP;
    } else if (storedAPI === 'API_URL_US') {
        return API_URL_US;
    } else {
        return API_URL_US; // 기본값으로 미국 서버를 사용
    }
};

export const fetchExercisesRecord = async (exerciseId, memberId, exerciseService, recordDate) => {

    try {
        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

        const requestURL = `${API_URL}/exercisesRecord/searchRecord`;
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
            return [];
        }

        if (response.ok) {
            const result = await response.json();

            return result;
        } else {
            if (response.status === 401) {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    await AsyncStorage.setItem('accessToken', newAccessToken);
                    return fetchExercisesRecord(exerciseId, memberId, exerciseService, recordDate); // Retry after token refresh
                } else {
                    console.error('토큰 갱신 실패');
                    throw new Error('Failed to refresh access token');
                }
            }
        }
    } catch (error) {
        console.error('운동 기록 조회 중 오류 발생:', error);
        throw error;
    }
};



// memberId 와 recordDate 만으로 exerciseService 1,2,3 에대한 기록조회
export const loadExerciseRecordsForDate = (memberId, recordDate) => {

        try {
            return fetchData();

            async function fetchData() {
                const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

                const requestURL = `${API_URL}/exercisesRecord/recordsForDate`;
                const accessToken = await AsyncStorage.getItem('accessToken');

                const response = await fetch(requestURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ memberId, recordDate }),
                });

                if (response.ok) {
                    const result = await response.json();
                    

                    return result;
                } else {
                    if (response.status === 401) {
                        try {
                            const newAccessToken = await refreshAccessToken();
                            if (newAccessToken) {
                                await AsyncStorage.setItem('accessToken', newAccessToken);
                                return loadExerciseRecordsForDate(memberId, recordDate);
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
                throw error;
        
        }
    
};