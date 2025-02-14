import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import { API_URL } from '@env';
import { fetchMyAutoAdaptExercisesSuccess, fetchMyAutoAdaptExercisesFailure } from "../modules/MyExerciseSclice";


export const getAutoAdaptSetting = async (memberId, accessToken = null) => {
    try {

        let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
        const response = await fetch(`${API_URL}/autoAdapt/getAutoAdaptSetting?memberId=${memberId}`, {
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
                    return await getAutoAdaptSetting(memberId, newAccessToken);
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


export const updateAutoAdaptSetting = async (updateData, accessToken = null) => {
    try {

        let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기

        const response = await fetch(`${API_URL}/autoAdapt/updateAutoAdaptSetting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updateData), // updateData를 body에 JSON으로 변환 후 전송
        });

        if (!response.ok) {
            if (response.status === 401) {
                // 상태 코드가 401일 경우 액세스 토큰 갱신
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await updateAutoAdaptSetting(updateData, newAccessToken);
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

export const changePriorityPartsSetting = async (memberId, priorityParts, accessToken = null) => {
    try {

        console.log(memberId,priorityParts);

        let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기

        const response = await fetch(`${API_URL}/autoAdapt/changePriorityPartsSetting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ memberId, priorityParts }), // ✅ 객체로 변환 후 전송
        });

        if (!response.ok) {
            if (response.status === 401) {
                // 상태 코드가 401일 경우 액세스 토큰 갱신
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await changePriorityPartsSetting(memberId, priorityParts, newAccessToken);
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


export const aiRequset = async (memberId, checkDate, initialization, accessToken = null) => {
    try {

        let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기


        const getCurrentDate = () => {
            const now = new Date();
            return now.toLocaleDateString('en-CA'); // "YYYY-MM-DD" 형식 반환
        };
        
        const date = getCurrentDate();

        const response = await fetch(`${API_URL}/autoAdapt/aiRequest?date=${date}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ memberId, checkDate, initialization }) // ✅ 바디를 JSON 문자열로 변환하여 전달
        });
        


        if (!response.ok) {
            if (response.status === 401) {
                // 상태 코드가 401일 경우 액세스 토큰 갱신
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await aiRequset(memberId, checkDate, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('네트워크 오류');
            }
        }


        autoAdaptExercises(memberId);


        return { success: true };


    } catch (error) {
        return { success: false, error: error.message };
    }

};



export const autoAdaptExercises = async (memberId, accessToken = null) => {
    try {


        let accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기


        const getCurrentDate = () => {
            const now = new Date();
            return now.toLocaleDateString('en-CA'); // "YYYY-MM-DD" 형식 반환
        };
        
        const date = getCurrentDate();

        const response = await fetch(`${API_URL}/autoAdapt/autoAdaptExercises`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ memberId, date }) // ✅ 바디를 JSON 문자열로 변환하여 전달
        });
        


        if (!response.ok) {
            if (response.status === 401) {
                // 상태 코드가 401일 경우 액세스 토큰 갱신
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    // 새 토큰으로 다시 시도
                    return await autoAdaptExercises(memberId, newAccessToken);
                } else {
                    throw new Error('새로운 토큰을 가져오지 못했습니다.');
                }
            } else {
                throw new Error('네트워크 오류');
            }
        }

        
        // JSON 데이터 파싱
        const data = await response.json();

        const autoAdaptExercise = data.exercises
        
        return autoAdaptExercise; // ✅ 데이터 반환

    } catch (error) {
        throw error
    }

};