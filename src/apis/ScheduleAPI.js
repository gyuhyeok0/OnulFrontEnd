import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { refreshAccessToken } from '../apis/Token';

// 서버로 데이터를 전송하는 함수
export const sendDataToServer = async (part, memberId, weekType, day, accessToken = null) => {
    try {
        // 토큰이 없을 경우 AsyncStorage에서 가져오기
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        console.log(part);
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

// 서버로 데이터를 삭제 요청하는 함수
export const deleteDataFromServer = async (part, memberId, weekType, day, accessToken = null) => {
    try {
        // 토큰이 없을 경우 AsyncStorage에서 가져오기
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        console.log(part);
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

        // 응답 상태 확인
        if (!response.ok) {
            if (response.status === 401) { // 상태 코드가 401 (Unauthorized)일 경우
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await deleteDataFromServer(part, memberId, weekType, day, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('서버 요청이 실패했습니다.');
            }
        }

    } catch (error) {
        Alert.alert('서버와 통신 중 오류가 발생했습니다.');
        console.error('Error deleting data from server:', error);
    }
};
