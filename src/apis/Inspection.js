import * as RNLocalize from 'react-native-localize';

import { API_URL_JP, API_URL_US } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';


const getStoredAPIURL = async () => {
    const storedAPI = await AsyncStorage.getItem('API_URL');
    
    if (storedAPI === 'API_URL_JP') {
        return API_URL_JP;
    } else if (storedAPI === 'API_URL_US') {
        return API_URL_US;
    } else {
        // ✅ 여기서 로직만 교체
        const locales = RNLocalize.getLocales();
        const userLocale = locales.length > 0 ? locales[0].languageTag : "en-US";

        const isAsiaPacific = ["JP", "KR", "HK", "NZ", "AU"].some(region =>
            userLocale.toUpperCase().includes(region)
        );
        const userRegion = isAsiaPacific ? "JP" : "US";

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


