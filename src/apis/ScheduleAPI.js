import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { refreshAccessToken } from '../apis/Token';
import { fetchScheduleSuccess, fetchScheduleFailure } from '../modules/ScheduleSlice';  // 경로는 해당 파일의 위치에 맞게 수정하세요.


// 서버로 데이터를 전송하는 함수
export const sendDataToServer = async (part, memberId, weekType, day, accessToken = null) => {
    try {
        // 토큰이 없을 경우 AsyncStorage에서 가져오기
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const response = await fetch('http://localhost:8080/schedule/registSchedule', {
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

    } catch (error) {
        Alert.alert('서버와 통신 중 오류가 발생했습니다.');
        console.error('Error sending data to server:', error);
    }
};


export const deleteDataFromServer = async (part, memberId, weekType, day, accessToken = null) => {
    try {
        // 토큰이 없을 경우 AsyncStorage에서 가져오기
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const response = await fetch('http://localhost:8080/schedule/deleteSchedule', {
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


    } catch (error) {
        Alert.alert('서버와 통신 중 오류가 발생했습니다.');
        console.error('Error deleting data from server:', error);
    }
};


// 리듀서
// 스케줄 조회
export const callFetchScheduleAPI = () => {
    return async (dispatch) => {
        try {
            let memberId = await AsyncStorage.getItem('memberId'); // 액세스 토큰 가져오기
            let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기

            const requestURL = `http://localhost:8080/schedule/selectSchedule?memberId=${memberId}`; // memberId를 쿼리 파라미터로 추가

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
            Alert.alert('서버와 통신 중 오류가 발생했습니다.');
            console.error('[ScheduleAPICalls] callFetchScheduleAPI ERROR : ', error.message);
            dispatch(fetchScheduleFailure(error.message));
        }
    };
};
