// 운동 기록 조회
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshAccessToken } from '../apis/Token'; // 토큰 갱신 API 호출
import { fetchExerciseRecordSuccess, fetchExercisesRecordFailure} from '../modules/ExerciseRecordSlice'; // 경로 확인
import { updateLatestRecord } from '../modules/LatestExerciseRecordSlice'

// 운동 기록 조회(이전기록 컴포넌트에서 사용)
// 스토리지에 데이터가 있으면 리듀서 상태 업데이트만
// 스토리지에 데이터가 없으면 서버에 요청하고 리듀서 등록
// 스토리지 기간 1년으로 설정
export const callFetchExercisesRecordAPI = (exerciseId, memberId, exerciseService, recordDate) => {
    return async (dispatch) => { 

        const storageKey = `${exerciseId}_${exerciseService}_${recordDate}`;

        try {
            // AsyncStorage에서 데이터 가져오기
            const storedData = await AsyncStorage.getItem(storageKey);
            if (storedData) {
                console.log("스토리지에 기록이 있습니다. 리듀서 업데이트만 진행합니다.");
                dispatch(fetchExerciseRecordSuccess({
                    exerciseId, 
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


                    console.log(exerciseId);
                    console.log(exerciseService);
                    console.log(recordDate);

                    dispatch(fetchExerciseRecordSuccess({
                        exerciseId, 
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

export const callVolumeExerciseRecord = (payload) => {
    return async (dispatch) => {

        try {
            const requestURL = 'http://localhost:8080/exercisesRecord/searchVolume';
            const accessToken = await AsyncStorage.getItem('accessToken');

            const response = await fetch(requestURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 204) {
                console.log('운동 기록이 없습니다. (204 NO_CONTENT)');
                return []; // 데이터가 없음을 명시적으로 반환
            }


            if (response.ok) {
                // JSON 데이터 변환
                const result = await response.json();

                // 각 id에 대한 recordDate를 추출 및 포맷 변환
                const formattedData = result
                .filter((record) => record.recordDate && record.exercise && record.exercise.id) // 유효한 데이터만 필터링
                .map((record) => {
                    const formattedDate = `${record.recordDate[0]}-${String(record.recordDate[1]).padStart(2, '0')}-${String(record.recordDate[2]).padStart(2, '0')}`;
                    
                    // 콘솔에 exerciseId 출력
                    console.log('exerciseId:', record.exercise.id);

                    return {
                        exerciseId: record.exercise.id,
                        recordDate: formattedDate,
                    };
                });

                // 새 리듀서 업데이트
                formattedData.forEach(({ exerciseId, recordDate }) => {
                dispatch(updateLatestRecord({ exerciseId, recordDate }));
                });

                // 데이터 그룹화 함수
                function groupByExerciseId(data) {
                    return data.reduce((acc, record) => {
                        const { exercise } = record;
                        if (exercise && exercise.id) {
                            const exerciseId = exercise.id;
                            if (!acc[exerciseId]) {
                                acc[exerciseId] = [];
                            }
                            acc[exerciseId].push(record);
                        }
                        return acc;
                    }, {});
                }

                // 그룹화된 데이터를 디스패치
                const groupedData = groupByExerciseId(result);

                Object.entries(groupedData).forEach(([exerciseId, records]) => {
                
                    let exerciseService, formattedDate;  // 외부 변수 선언

                    records.forEach(record => {
                        // 각 record의 값들을 외부 변수에 할당
                        exerciseService = record.exerciseService;
                        formattedDate = record.recordDate;
                    });

                    const recordDate = `${formattedDate[0]}-${String(formattedDate[1]).padStart(2, '0')}-${String(formattedDate[2]).padStart(2, '0')}`;


                    dispatch(fetchExerciseRecordSuccess({
                        exerciseId, 
                        exerciseService, 
                        recordDate, 
                        data: records 
                    }));
                        
                    const storageKey = `${exerciseId}_${exerciseService}_${recordDate}`;

                     // 만료일을 1년 후로 설정
                    const expirationDate = new Date();
                    expirationDate.setFullYear(expirationDate.getFullYear() + 1);  // 1년 후로 설정
                    // 저장할 데이터에 만료일 추가
                    const dataToStore = {
                        ...result,
                        expirationDate: expirationDate.toISOString(),
                    };

                    AsyncStorage.setItem(storageKey, JSON.stringify(dataToStore));
                    console.log('데이터가 AsyncStorage에 저장되었습니다.');

                });
            
            } else if (response.status === 401) {
                try {
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        console.log('새로운 토큰 발급:', newAccessToken);
                        await AsyncStorage.setItem('accessToken', newAccessToken);
                        return dispatch(callVolumeExerciseRecord(payload)); // 토큰 갱신 후 재호출
                    } else {
                        console.error('토큰 갱신 실패');
                        throw new Error('Failed to refresh access token');
                    }
                } catch (refreshError) {
                    console.error('토큰 갱신 중 오류 발생:', refreshError);
                    return Promise.reject(refreshError);
                }
            } else {
                throw new Error(`HTTP 오류: ${response.status}`);
            }
        } catch (error) {
            console.error('운동 기록 조회 중 오류 발생:', error);
            return Promise.reject(error); // 오류를 상위로 전달
        }
    };
};
