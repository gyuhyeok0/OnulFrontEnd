import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage';

// 서버로 운동 강도를 전송하는 함수
export const sendIntensityToServer = async (userId, intensity, accessToken = null) => {

    try {

        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const response = await fetch('http://localhost:8080/intensity/intensity', { // URL 수정
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // 액세스 토큰을 사용한 인증 헤더
            },
            body: JSON.stringify({
                memberId: userId,  // 사용자 ID 전송
                intensity: intensity,  // 선택한 운동 강도 전송
            }),
        });


        if (response.status === 200) {
            const data = await response.json();
            // console.log('서버 응답:', data);
                    // 서버 응답 데이터 반환
           return data; // 반환값 추가
        } else if (response.status === 401) {
            // 상태 코드가 401일 경우 액세스 토큰 갱신
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새 토큰으로 다시 시도
                await sendIntensityToServer(userId, intensity, newAccessToken);
            } else {
                console.error('새로운 토큰을 가져오지 못했습니다.');
            }
        } else {
            return { success: false, message: 'Unexpected error occurred' }; // 기본값 반환
        }


    } catch (error) {
        return { success: false, message: 'Unexpected error occurred' }; // 기본값 반환
    }
};
