import * as RNLocalize from 'react-native-localize';

import { API_URL_JP, API_URL_US } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';


const getStoredAPIURL = async () => {
    const storedAPI = await AsyncStorage.getItem('API_URL'); // 'API_URL' 문자열을 가져옴
    
    // 'API_URL_JP' 또는 'API_URL_US' 문자열에 맞는 실제 API URL을 반환
    if (storedAPI === 'API_URL_JP') {
        return API_URL_JP;
    } else if (storedAPI === 'API_URL_US') {
        return API_URL_US;
    } else {
        // If no stored value, fall back to the logic based on user's locale
        const locales = RNLocalize.getLocales();
        const userLocale = locales.length > 0 ? locales[0].languageTag : "en-US"; // 예: "ja-JP", "ko-KR", "en-US"
        
        // 🇯🇵 일본이거나 🇰🇷 한국이면 일본 서버 사용, 그 외에는 미국 서버 사용
        const userRegion = userLocale.includes("JP") || userLocale.includes("KR") ? "JP" : "US";
        return userRegion === "JP" ? API_URL_JP : API_URL_US;
    }
};

export const inspection = async () => {
    try {
        console.log("📡 API 요청 시작");

        const API_URL = await getStoredAPIURL();
        console.log("📡 API_URL:", API_URL);

        const requestURL = `${API_URL}/inspection/selectInspection`;
        console.log("📡 요청 URL:", requestURL);

        const response = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("📡 응답 상태 코드:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📡 응답 데이터:", data);
        return data;
    } catch (error) {
        console.error("❌ 요청 실패:", error);
        return "networkError";
    }
};


