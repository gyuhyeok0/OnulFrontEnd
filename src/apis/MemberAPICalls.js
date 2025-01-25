import { postLogin } from '../modules/MemberSlice';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 가져오기
import { API_URL } from '@env';

// 로그인 API 호출 함수 (리액트 네이티브 버전)
export const callLoginAPI = ({ form }) => {
    const requestURL = `${API_URL}/auth/login`;

    return async (dispatch) => {
        try {
            const response = await fetch(requestURL, {
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

                console.log('[MemberAPICalls] callLoginAPI RESULT : ', result);

                // 로그인 성공 시 AsyncStorage에 토큰 저장
                if (result.status === 200 && result.userInfo) {
                    await AsyncStorage.setItem('accessToken', result.userInfo.accessToken);
                    await AsyncStorage.setItem('refreshToken', result.userInfo.refreshToken);
                    await AsyncStorage.setItem('memberId', result.userInfo.memberId);


                    dispatch(postLogin(result.userInfo));
                    return { status: 200, userInfo: result.userInfo }; // 성공 결과 반환
                }
            }

            // 실패한 경우 기본적인 실패 상태를 반환
            return { status: 400, errorMessage: '로그인에 실패했습니다.' }; 
        } catch (error) {
            console.error('[MemberAPICalls] callLoginAPI ERROR : ', error);
            // 실패할 경우 기본적으로 500 상태와 오류 메시지를 반환
            return { status: 500, errorMessage: '서버 오류가 발생했습니다.' };
        }
    };
};