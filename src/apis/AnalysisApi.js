import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
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

// ExerciseAPICalls.js
export const lastLoginRunDateAPI = async (memberId, accessToken = null) => {
    try {

        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.


        const getCurrentDate = () => {
            const now = new Date();
            return now.toLocaleDateString('en-CA'); // "YYYY-MM-DD" 형식 반환
        };
        
        const date = getCurrentDate();

        let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
        const response = await fetch(`${API_URL}/analysis/lastLoginRunDate?memberId=${memberId}&date=${date}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        

        if (!response.ok) {
            if (response.status === 401) {
                // 상태 코드가 401일 경우 액세스 토큰 갱신
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await lastLoginRunDateAPI(memberId, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('네트워크 오류');
            }
        }

    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};



export const analysisExerciseVolume = async (memberId, accessToken = null) => {
    try {

        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.


        let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
        const response = await fetch(`${API_URL}/analysis/findExerciseVolume?memberId=${memberId}`, {
            method: 'GET', // POST 요청
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                // 상태 코드가 401일 경우 액세스 토큰 갱신
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await analysisExerciseVolume(memberId, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('네트워크 오류');
            }
        }

        return response.json(); // 정상적인 응답이면 JSON으로 반환

    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};


export const WeeklyAndMonthlyExerciseVolume = async (memberId, accessToken = null) => {
    try {

        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

        let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
        const response = await fetch(`${API_URL}/analysis/WeeklyAndMonthlyExerciseVolume?memberId=${memberId}`, {
            method: 'GET', // POST 요청
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                // 상태 코드가 401일 경우 액세스 토큰 갱신
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await WeeklyAndMonthlyExerciseVolume(memberId, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('네트워크 오류');
            }
        }

        return response.json(); // 정상적인 응답이면 JSON으로 반환

    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};


export const MonthlyWeightAndDiet = async (memberId, accessToken = null) => {
    try {

        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

        let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
        const response = await fetch(`${API_URL}/analysis/MonthlyWeightAndDiet?memberId=${memberId}`, {
            method: 'GET', // POST 요청
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                // 상태 코드가 401일 경우 액세스 토큰 갱신
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await MonthlyWeightAndDiet(memberId, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('네트워크 오류');
            }
        }

        return response.json(); // 정상적인 응답이면 JSON으로 반환

    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};



export const getMuscleFaigue = async (memberId, accessToken = null) => {
    try {
        const API_URL = await getStoredAPIURL();

        const now = new Date();
        const getDateString = (date) => date.toLocaleDateString('en-CA'); // "YYYY-MM-DD"
        const today = getDateString(now);

        const getYesterdayString = () => {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            return getDateString(yesterday);
        };

        let token = accessToken || await AsyncStorage.getItem('accessToken');

        // 🎯 공통 fetch 함수 (401 처리 로직은 그대로 유지)
        const fetchData = async (dateToTry) => {
            const response = await fetch(`${API_URL}/analysis/getMuscleFaigue?memberId=${memberId}&date=${dateToTry}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        return await getMuscleFaigue(memberId, newAccessToken); // ✅ 재귀 호출
                    } else {
                        throw new Error('새로운 토큰을 가져오지 못했습니다.');
                    }
                } else {
                    throw new Error('네트워크 오류');
                }
            }

            const data = await response.json();
            return data && Object.keys(data).length > 0 ? data : null; // 빈 데이터 무시
        };

        // ✅ 오늘 시도
        const todayData = await fetchData(today);
        if (todayData) return todayData;

        // ✅ 오늘 없으면 어제 시도
        const yesterdayData = await fetchData(getYesterdayString());
        if (yesterdayData) return yesterdayData;

        // 모두 실패
        throw new Error('오늘과 어제 모두 데이터가 없습니다.');

    } catch (error) {
        console.error('getMuscleFaigue Error:', error);
        throw error;
    }
};
