import * as RNLocalize from 'react-native-localize';

import { API_URL_JP, API_URL_US } from '@env';


    const locales = RNLocalize.getLocales();
    const userLocale = locales.length > 0 ? locales[0].languageTag : "en-US"; // 예: "ja-JP", "ko-KR", "en-US"

    // 🇯🇵 일본이거나 🇰🇷 한국이면 일본 서버 사용, 그 외에는 미국 서버 사용
    const userRegion = userLocale.includes("JP") || userLocale.includes("KR") ? "JP" : "US";
    const API_URL = userRegion === "JP" ? API_URL_JP : API_URL_US;





export const inspection = async () => {
    try {
        const response = await fetch(`${API_URL}/inspection/selectInspection`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {

        const errorMessage = "networkError";
        return errorMessage;
    }
};
