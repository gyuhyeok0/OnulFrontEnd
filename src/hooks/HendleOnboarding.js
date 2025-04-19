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



// 온보딩 체크
export const checkOnboardingStatus = async (userId, accessToken, navigation) => {
    try {
        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.


        const response = await axios.get(
            `${API_URL}/onboarding/check?memberId=${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );


        // 응답 상태 코드가 200일 경우
        if (response.status === 200) {
            const needsOnboarding = response.data;


            if (needsOnboarding) {
                // 온보딩 페이지로 이동
                navigation.navigate('Onboarding');
            } else {

                // console.log("온보딩이 필요하지 않습니다.");
            }
        }

    } catch (error) {
        // 상태 코드가 401일 경우
        if (error.response && error.response.status === 401) {
            
            // 새로 발급된 토큰을 가져옴
            const newAccessToken = await refreshAccessToken(navigation);
            
            // 새 토큰으로 다시 checkOnboardingStatus 호출
            if (newAccessToken) {
                await checkOnboardingStatus(userId, newAccessToken, navigation);
            } else {
                console.error("새로운 토큰을 가져오지 못했습니다.");
            }

        } else {
            console.error("상태 확인 중 오류 발생: ", error);
        }
    }
};




// 무게 변환 함수
const convertToKg = (weight) => {
    if (weight && typeof weight === 'object') {
        if (weight.kg) return { kg: parseFloat(weight.kg) }; // kg로 주어진 경우 그대로 반환
        if (weight.lbs) return { kg: parseFloat((weight.lbs * 0.453592).toFixed(2)) }; // lbs -> kg 변환
    }
    if (typeof weight === 'number') {
        return { kg: parseFloat(weight) }; // 이미 kg이면 반환
    }
    throw new Error('Invalid weight format'); // 예상치 못한 형식일 경우 오류 발생
};

// 높이 변환 함수
const convertToCm = (height) => {
    if (height && typeof height === 'object') {
        if (height.cm) return { cm: parseFloat(height.cm) }; // cm로 주어진 경우 그대로 반환
        if (height.feet && height.inches) {
            const feetToCm = height.feet * 30.48;
            const inchesToCm = height.inches * 2.54;
            return { cm: parseFloat((feetToCm + inchesToCm).toFixed(2)) }; // feet와 inches -> cm 변환
        }
    }
    if (typeof height === 'number') {
        return { cm: parseFloat(height.toFixed(2)) }; // 이미 cm이면 반환
    }
    throw new Error('Invalid height format'); // 예상치 못한 형식일 경우 오류 발생
};

// 온보딩 등록 함수
export const registrationOnboarding = async (onboardingData, navigation) => {
    const { memberId, accessToken, gender, height, weight, benchPress1rm, deadlift1rm, squat1rm, heightUnit, weightUnit, basicUnit } = onboardingData;

    // 단위 변환 적용
    const { cm: convertedHeight } = convertToCm(height);
    const { kg: convertedWeight } = convertToKg(weight);

    // 서버에 보낼 데이터 객체 생성
    const dataToSend = {
        memberId,
        accessToken,
        gender,
        height: convertedHeight,
        weight: convertedWeight,
        benchPress1rm,
        deadlift1rm,
        squat1rm,
        heightUnit,
        weightUnit,
        basicUnit,
    };

    // 서버에 데이터 전송 예시
    try {
        
        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

        const response = await axios.post(`${API_URL}/onboarding/register`, dataToSend, {
            headers: {
                Authorization: `Bearer ${accessToken}`, // 토큰 추가
            },
        });

        await AsyncStorage.setItem('onboarding_checked', 'true');
        navigation.navigate('Exercise');

    } catch (error) {
        // 상태 코드가 401일 경우
        if (error.response && error.response.status === 401) {
            
            // 새로 발급된 토큰을 가져옴
            const newAccessToken = await refreshAccessToken(navigation);
            
            if (newAccessToken) {
                await registrationOnboarding({ ...onboardingData, accessToken: newAccessToken }, navigation);
            } else {
                console.error("새로운 토큰을 가져오지 못했습니다.");
            }

        } else {
            console.error("상태 확인 중 오류 발생: ", error);
        }
    }

    
};
