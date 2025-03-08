import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { refreshAccessToken } from '../apis/Token';
import { fetchScheduleSuccess, fetchScheduleFailure } from '../modules/ScheduleSlice';  // 경로는 해당 파일의 위치에 맞게 수정하세요.
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

// 서버로 데이터를 전송하는 함수
export const sendDataToServer = async (part, memberId, weekType, day, accessToken = null) => {
    try {
        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

        // 토큰이 없을 경우 AsyncStorage에서 가져오기
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const response = await fetch(`${API_URL}/schedule/registSchedule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
            },
            body: JSON.stringify({
                weekType: weekType,
                day: day,
                part: part,
                memberId: memberId,
            }),
        });

        

        // 응답 상태 확인
        if (!response.ok) {
            if (response.status === 401) { // 상태 코드가 401 (Unauthorized)일 경우
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await sendDataToServer(part, memberId, weekType, day, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('서버 요청이 실패했습니다.');
            }
        }

        const data = await response.json();
        return data; // 반환값 추가


    } catch (error) {
        return { success: false, message: 'Unexpected error occurred' }; // 기본값 반환
    }
};


export const deleteDataFromServer = async (part, memberId, weekType, day, accessToken = null) => {
    try {
        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

        // 토큰이 없을 경우 AsyncStorage에서 가져오기
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const response = await fetch(`${API_URL}/schedule/deleteSchedule`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
            },
            body: JSON.stringify({
                weekType: weekType,
                day: day,
                part: part,
                memberId: memberId,
            }),
        });

        // console.log(response.status)

        if (!response.ok) {
            if (response.status === 401) { // 상태 코드가 401 (Unauthorized)일 경우
                console.log("dks")
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await deleteDataFromServer(part, memberId, weekType, day, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('서버 요청이 실패했습니다. 상태 코드: ' + response.status);
            }
        }

        const data = await response.json();
        return data; // 반환값 추가


    } catch (error) {
        return { success: false, message: 'Unexpected error occurred' }; // 기본값 반환
    }
};


// 리듀서
// 스케줄 조회
export const callFetchScheduleAPI = () => {
    return async (dispatch) => {
        try {
            const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

            let memberId = await AsyncStorage.getItem('memberId'); // 액세스 토큰 가져오기
            let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기

            const requestURL = `${API_URL}/schedule/selectSchedule?memberId=${memberId}`;

            const response = await fetch(requestURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
                },
            });


            if (!response.ok) {
                if (response.status === 401) { // 상태 코드가 401 (Unauthorized)일 경우
                    console.log('Access token expired, attempting to refresh token...');
                    const newAccessToken = await refreshAccessToken(); // 새 액세스 토큰 요청
                    if (newAccessToken) {
                        console.log('New access token acquired, retrying request...');
                        // 새 토큰으로 다시 API 호출
                        return await callFetchScheduleAPI()(dispatch); // dispatch를 인자로 전달
                    } else {
                        throw new Error('새로운 토큰을 가져오지 못했습니다.');
                    }
                } else {
                    throw new Error(`Failed to fetch schedule: ${response.statusText}`);
                }
            }

            // 204 No Content 처리
            if (response.status === 204) {
                console.log("스케줄이 존재하지 않습니다."); // 204 상태일 경우
                dispatch(fetchScheduleSuccess([])); // 빈 배열을 전달하여 기존 상태를 제거
                return; // 추가 작업 없이 종료
            }

            const result = await response.json();
            // console.log('[ScheduleAPICalls] callFetchScheduleAPI RESULT : ', result);

            // 성공 시 데이터를 리듀서에 전달
            dispatch(fetchScheduleSuccess(result));

        } catch (error) {
            Alert.alert('error');
            console.error('[ScheduleAPICalls] callFetchScheduleAPI ERROR : ', error.message);
            dispatch(fetchScheduleFailure(error.message));
        }
    };
};

