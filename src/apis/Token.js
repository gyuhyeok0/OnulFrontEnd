// Token.js
import AsyncStorage from '@react-native-async-storage/async-storage'; // 올바른 경로로 가져오기
import { handlerLogOut } from '../hooks/HandleLogout';


export const refreshAccessToken = async (navigation) => {


    const refreshToken = await AsyncStorage.getItem('refreshToken'); // 리프레시 토큰 가져오기
    const memberId = await AsyncStorage.getItem('memberId'); // 회원 ID 가져오기


    const response = await fetch('http://localhost:8080/auth/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken, memberId }), // 리프레시 토큰을 서버로 전송
    });


    if (response.ok) {
        const data = await response.json();
    
        // 액세스 토큰과 리프레시 토큰 둘 다 있을 경우
        if (data.accessToken && data.refreshToken) {
            await AsyncStorage.setItem('accessToken', data.accessToken); // 새 액세스 토큰 저장
            await AsyncStorage.setItem('refreshToken', data.refreshToken); // 새 리프레시 토큰 저장
            
             // 지연 시간 추가
             await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 대기


            return data.accessToken; // 새로 발급된 액세스 토큰 반환
            
        } else if (data.accessToken) {
            // 액세스 토큰만 있을 경우
            await AsyncStorage.setItem('accessToken', data.accessToken); // 새 액세스 토큰 저장

             // 지연 시간 추가
             await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 대기


            return data.accessToken; // 새로 발급된 액세스 토큰 반환
        }
    } else {
            // 응답이 OK가 아닐 경우 (예: 400 에러 처리)
            const errorData = await response.json(); // 응답을 JSON으로 파싱
            if (errorData.statusMessage === "Refresh token not found") {

                // AsyncStorage의 모든 데이터를 삭제
                await AsyncStorage.clear()
                    .then(() => {
                        // 모든 스토리지 데이터가 삭제된 후에 네비게이션을 리셋
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }], // 'Login' 스크린으로 이동
                        });
                    })
                    .catch((error) => {
                        console.log("스토리지 삭제 중 오류 발생:", error);
                    });

            } else {
                console.log("오류입니다."); // 기타 오류 처리
            }
    }
};


