import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';


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

export const notice = async (accessToken) => {
    try {
        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

        const response = await axios.get(
            `${API_URL}/notice/getNotice`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        
        if (response.status === 200) {
            const data = response.data;
        
            if (data === "No active notice") {
                return null;
            }
        
            return data;
        }

    } catch (error) {
        // 상태 코드가 401일 경우
        if (error.response && error.response.status === 401) {
            
            // 새로 발급된 토큰을 가져옴
            const newAccessToken = await refreshAccessToken();
            
            if (newAccessToken) {
                await notice(newAccessToken);
            } else {
                console.error("새로운 토큰을 가져오지 못했습니다.");
            }

        } else {
            console.error("상태 확인 중 오류 발생: ", error);
        }
    }
};