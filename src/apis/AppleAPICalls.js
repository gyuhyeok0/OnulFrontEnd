import { postLogin } from '../modules/MemberSlice';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 가져오기
import * as RNLocalize from 'react-native-localize';
import { persistor } from '../store';

import { API_URL_JP, API_URL_US } from '@env';

    const locales = RNLocalize.getLocales();
    const userLocale = locales.length > 0 ? locales[0].languageTag : "en-US";
    
    const isAsiaPacific = ["JP", "KR", "HK", "NZ", "AU"].some(region =>
        userLocale.toUpperCase().includes(region)
    );
    const userRegion = isAsiaPacific ? "JP" : "US";
    const API_URL = userRegion === "JP" ? API_URL_JP : API_URL_US;
    

    export const callAppleLoginAPI = async ({ identityToken, dispatch }) => {
            const requestURL = `${API_URL}/auth/apple`;
            console.log('[📡 API 요청 URL]', requestURL);
            console.log('[🪪 전송할 identityToken]', identityToken);
        
            try {
            const response = await fetch(requestURL, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identityToken }),
            });
        
            console.log('[✅ 응답 status]', response.status);
            console.log('[✅ response.ok?]', response.ok);
        
            if (response.ok) {
                const result = await response.json();
                console.log('[📦 서버 응답 결과]', result);
        
                const { accessToken, refreshToken, memberId } = result;
                console.log('[🔐 accessToken]', accessToken);
                console.log('[🔐 refreshToken]', refreshToken);
                console.log('[👤 memberId]', memberId);
        
                if (accessToken && refreshToken && memberId) {
                await AsyncStorage.setItem('accessToken', accessToken);
                await AsyncStorage.setItem('refreshToken', refreshToken);
                await AsyncStorage.setItem('memberId', memberId);
        
                const userRegion = ['JP', 'KR', 'HK', 'NZ', 'AU'].some(region =>
                    (RNLocalize.getLocales()[0]?.languageTag || '').toUpperCase().includes(region)
                ) ? 'JP' : 'US';
                const apiUrlToStore = userRegion === "JP" ? "API_URL_JP" : "API_URL_US";
        
                await AsyncStorage.setItem('API_URL', apiUrlToStore);
                console.log('[🌍 저장된 API_URL]', apiUrlToStore);
        
                dispatch(postLogin(result));
                console.log('[📥 Redux postLogin dispatch 완료]');
        
                return { status: 200, userInfo: result };
                } else {
                console.warn('[⚠️ 필수 값 누락]', { accessToken, refreshToken, memberId });
                }
            } else {
                console.warn('[❌ 서버 응답 실패]', await response.text());
            }
        
            return { status: 400, errorMessage: 'Apple 로그인 실패' };
            } catch (error) {
            console.error('[🔥 서버 오류]', error);
            return { status: 500, errorMessage: '서버 오류' };
            }
};
      