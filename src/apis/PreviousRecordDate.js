import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { refreshAccessToken } from '../apis/Token';
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

// 이전기록 날짜만 조회
export const previousRecordDate = async (memberId, exerciseId, exerciseService) => {
    try {

        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

        // AsyncStorage에서 토큰 가져오기
        let accessToken = await AsyncStorage.getItem('accessToken');

        const response = await fetch(`${API_URL}/exercisesRecord/selectPreviousRecordDate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
            },
            body: JSON.stringify({
                memberId,
                exerciseId,
                exerciseService,
            }),
        });

        // 응답 상태 확인
        if (response.status === 401) { // 상태 코드가 401 (Unauthorized)일 경우
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새 토큰을 AsyncStorage에 저장
                await AsyncStorage.setItem('accessToken', newAccessToken);

                // 새 토큰으로 다시 시도
                return await previousRecordDate(memberId, exerciseId, exerciseService);
            } else {
                throw new Error('새로운 토큰을 가져오지 못했습니다.');
            }
        }

        if (!response.ok) {
            throw new Error(`서버 요청이 실패했습니다. 상태 코드: ${response.status}`);
        }

        // 서버로부터 반환된 데이터를 JSON으로 파싱
        const data = await response.json();

        return data; // 반환된 데이터를 호출자에게 전달

    } catch (error) {
        // Alert.alert('서버와 통신 중 오류가 발생했습니다.', error.message);
        // console.error('Error sending data to server:', error);
        return null; // 실패 시 null 반환
    }
};


// // 가장 최근의 날짜 가지고오기
// export const mostPreviousRecordDate = async (memberId, exerciseId, exerciseService) => {
//     try {

//         // AsyncStorage에서 토큰 가져오기
//         let accessToken = await AsyncStorage.getItem('accessToken');

//         const response = await fetch('http://localhost:8080/exercisesRecord/selectMostPreviousRecordDate', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
//             },
//             body: JSON.stringify({
//                 memberId,
//                 exerciseId,
//                 exerciseService,
//             }),
//         });

//         // 응답 상태 확인
//         if (response.status === 401) { // 상태 코드가 401 (Unauthorized)일 경우
//             const newAccessToken = await refreshAccessToken();
//             if (newAccessToken) {
//                 // 새 토큰을 AsyncStorage에 저장
//                 await AsyncStorage.setItem('accessToken', newAccessToken);

//                 // 새 토큰으로 다시 시도
//                 return await previousRecordDate(memberId, exerciseId, exerciseService);
//             } else {
//                 throw new Error('새로운 토큰을 가져오지 못했습니다.');
//             }
//         }

//         if (!response.ok) {
//             throw new Error(`서버 요청이 실패했습니다. 상태 코드: ${response.status}`);
//         }

//         // 서버로부터 반환된 데이터를 JSON으로 파싱
//         const data = await response.json();
//         return data; // 반환된 데이터를 호출자에게 전달

//     } catch (error) {
//         // Alert.alert('서버와 통신 중 오류가 발생했습니다.', error.message);
//         return { success: false}; // 기본값 반환
//     }
// };

