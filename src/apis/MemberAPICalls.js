import { postLogin } from '../modules/MemberSlice';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 가져오기
import * as RNLocalize from 'react-native-localize';

import { API_URL_JP, API_URL_US } from '@env';

const locales = RNLocalize.getLocales();
const userLocale = locales.length > 0 ? locales[0].languageTag : "en-US"; // 예: "ja-JP", "ko-KR", "en-US"

// 🇯🇵 일본이거나 🇰🇷 한국이면 일본 서버 사용, 그 외에는 미국 서버 사용
const userRegion = userLocale.includes("JP") || userLocale.includes("KR") ? "JP" : "US";
const API_URL = userRegion === "JP" ? API_URL_JP : API_URL_US;

// 로그인 API 호출 함수 (리액트 네이티브 버전)
export const callLoginAPI = ({ form }) => {
    const requestURL = `${API_URL}/auth/login`;

    return async (dispatch) => {
        try {
            // 로그인 시도 함수
            const loginAttempt = async (apiUrl) => {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        memberId: form.memberId,
                        memberPassword: form.memberPassword,
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    // console.log('[MemberAPICalls] callLoginAPI RESULT : ', result);

                    // 로그인 성공 시 AsyncStorage에 토큰 및 API_URL 문자열 저장
                    if (result.status === 200 && result.userInfo) {
                        await AsyncStorage.setItem('accessToken', result.userInfo.accessToken);
                        await AsyncStorage.setItem('refreshToken', result.userInfo.refreshToken);
                        await AsyncStorage.setItem('memberId', result.userInfo.memberId);

                        // 문자열로 API_URL 저장 (실제 주소가 아닌 API_URL_JP 또는 API_URL_US)
                        await AsyncStorage.setItem('API_URL', userRegion === "JP" ? "API_URL_JP" : "API_URL_US");

                        dispatch(postLogin(result.userInfo));
                        return { status: 200, userInfo: result.userInfo }; // 성공 결과 반환
                    }
                }
                return { status: 400, errorMessage: '로그인에 실패했습니다.' }; // 실패 시 메시지 반환
            };

            // 첫 번째 인스턴스 로그인 시도
            let result = await loginAttempt(requestURL);

            // 첫 번째 인스턴스에서 실패한 경우, 두 번째 인스턴스로 로그인 시도
            if (result.status !== 200) {
                // 실패 시 다른 인스턴스 (예: 일본 → 미국, 미국 → 일본)
                API_URL = userRegion === "JP" ? "API_URL_US" : "API_URL_JP";
                result = await loginAttempt(`${API_URL}/auth/login`);
            }

            return result;
        } catch (error) {
            // console.error('[MemberAPICalls] callLoginAPI ERROR : ', error);
            // 실패할 경우 기본적으로 500 상태와 오류 메시지를 반환
            return { status: 500, errorMessage: '서버 오류가 발생했습니다.' };
        }
    };
};


export const deleteAccount = async (memberId, accessToken = null) => {
    
    try {
        if (!accessToken) {
            accessToken = await AsyncStorage.getItem('accessToken');
        }

        const response = await fetch(`${API_URL}/delete/deleteAccount?memberId=${memberId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        

        if (response.status === 200) {
            return true; // 요청 성공
        } else if (response.status === 401) {
            console.warn('토큰 만료: 새로운 토큰을 요청 중...');
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새로 발급받은 토큰으로 재귀 호출
                return await deleteAccount(memberId, newAccessToken);
            } else {
                console.error('새로운 토큰을 가져오지 못했습니다.');
                throw new Error('Unable to refresh token');
            }
        } else {
            const errorMessage = `Unexpected error occurred: ${response.statusText}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('요청 실패:', error);
        throw error; // 오류를 호출한 쪽으로 전달
    }
};