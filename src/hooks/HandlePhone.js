import * as RNLocalize from 'react-native-localize';

import { API_URL_JP, API_URL_US } from '@env';

    const locales = RNLocalize.getLocales();
    const userLocale = locales.length > 0 ? locales[0].languageTag : "en-US";
    
    const isAsiaPacific = ["JP", "KR", "HK", "NZ", "AU"].some(region =>
        userLocale.toUpperCase().includes(region)
    );
    const userRegion = isAsiaPacific ? "JP" : "US";
    const API_URL = userRegion === "JP" ? API_URL_JP : API_URL_US;
    


// 비번찾기
export const fetchUserPhoneNumber = async (userId) => {
    const response = await fetch(`${API_URL}/sms/check-id`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; // { exists: true/false, phoneNumber: 'userPhoneNumber' }
};