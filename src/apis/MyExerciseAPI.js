import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL_JP, API_URL_US } from '@env'; // 환경변수에서 실제 URL 가져오기

import {
    fetchMyChestExercisesSuccess,
    fetchMyChestExercisesFailure,
    fetchMyBackExercisesSuccess,
    fetchMyBackExercisesFailure,
    fetchMyAbsExercisesSuccess,
    fetchMyAbsExercisesFailure,
    fetchMyArmsExercisesSuccess,
    fetchMyArmsExercisesFailure,
    fetchMyCustomExercisesSuccess,
    fetchMyCustomExercisesFailure,
    fetchMyEtcExercisesSuccess,
    fetchMyEtcExercisesFailure,
    fetchMyLowerBodyExercisesSuccess,
    fetchMyLowerBodyExercisesFailure,
    fetchMyShouldersExercisesSuccess,
    fetchMyShouldersExercisesFailure,
    fetchMyFreeExercisesSuccess,
    fetchMyFreeExercisesFailure,

} from '../modules/MyExerciseSclice';

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


export const fetchMyExercises = (memberId, muscleGroup) => async (dispatch) => {

    try {
        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

        const accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기

        const response = await axios.get(`${API_URL}/myExercises/${memberId}/${muscleGroup}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`, // 액세스 토큰을 사용한 인증 헤더
            },
        });

        // 근육 그룹에 따라 다른 액션 호출
        switch (muscleGroup) {
            case '가슴':
                dispatch(fetchMyChestExercisesSuccess(response.data));
                break;
            case '등':
                dispatch(fetchMyBackExercisesSuccess(response.data));
                break;
            case '복근':
                dispatch(fetchMyAbsExercisesSuccess(response.data));
                break;
            case '팔':
                dispatch(fetchMyArmsExercisesSuccess(response.data));
                break;
            case '커스텀':
                dispatch(fetchMyCustomExercisesSuccess(response.data));
                break;
            case '기타':
                dispatch(fetchMyEtcExercisesSuccess(response.data));
                break;
            case '하체':
                dispatch(fetchMyLowerBodyExercisesSuccess(response.data));
                break;
            case '어깨':
                dispatch(fetchMyShouldersExercisesSuccess(response.data));
                break;
            case '자유':
                dispatch(fetchMyFreeExercisesSuccess(response.data));
                break;
            default:
                throw new Error(`알 수 없는 근육 그룹: ${muscleGroup}`);
        }

    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                await AsyncStorage.setItem('accessToken', newAccessToken);
                return dispatch(fetchMyExercises(memberId, muscleGroup));
            } else {
                switch (muscleGroup) {
                    case '가슴':
                        dispatch(fetchMyChestExercisesFailure('토큰 갱신 실패'));
                        break;
                    case '등':
                        dispatch(fetchMyBackExercisesFailure('토큰 갱신 실패'));
                        break;
                    case '복근':
                        dispatch(fetchMyAbsExercisesFailure('토큰 갱신 실패'));
                        break;
                    case '팔':
                        dispatch(fetchMyArmsExercisesFailure('토큰 갱신 실패'));
                        break;
                    case '사용자 정의':
                        dispatch(fetchMyCustomExercisesFailure('토큰 갱신 실패'));
                        break;
                    case '기타':
                        dispatch(fetchMyEtcExercisesFailure('토큰 갱신 실패'));
                        break;
                    case '하체':
                        dispatch(fetchMyLowerBodyExercisesFailure('토큰 갱신 실패'));
                        break;
                    case '어깨':
                        dispatch(fetchMyShouldersExercisesFailure('토큰 갱신 실패'));
                        break;
                    case '자유':
                        dispatch(fetchMyFreeExercisesFailure('토큰 갱신 실패'));
                        break;
                    default:
                        throw new Error(`알 수 없는 근육 그룹: ${muscleGroup}`);
                }
            }
        } else {
            switch (muscleGroup) {
                case '가슴':
                    dispatch(fetchMyChestExercisesFailure(error.message));
                    break;
                case '등':
                    dispatch(fetchMyBackExercisesFailure(error.message));
                    break;
                case '복근':
                    dispatch(fetchMyAbsExercisesFailure(error.message));
                    break;
                case '팔':
                    dispatch(fetchMyArmsExercisesFailure(error.message));
                    break;
                case '사용자 정의':
                    dispatch(fetchMyCustomExercisesFailure(error.message));
                    break;
                case '기타':
                    dispatch(fetchMyEtcExercisesFailure(error.message));
                    break;
                case '하체':
                    dispatch(fetchMyLowerBodyExercisesFailure(error.message));
                    break;
                case '어깨':
                    dispatch(fetchMyShouldersExercisesFailure(error.message));
                    break;
                case '자유':
                    dispatch(fetchMyFreeExercisesFailure(error.message));
                    break;
                default:
                    throw new Error(`알 수 없는 근육 그룹: ${muscleGroup}`);
            }
        }
    }
};

// 서버로 운동 등록 데이터를 전송하는 함수
export const sendExerciseToServer = async (newExercises, muscleGroup, memberId) => {
    try {

        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

        const accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기

        const response = await fetch(`${API_URL}/myExercises/RegistMyExercise`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // 액세스 토큰을 사용한 인증 헤더
            },
            body: JSON.stringify({
                memberId: memberId,  // 사용자 ID 전송
                exerciseIds: newExercises,  // 선택한 운동 목록 전송
                muscleGroup: muscleGroup,
            }),
        });

        if (response.status === 200) {
            const data = await response.json();
        } else if (response.status === 401) {
            // 상태 코드가 401일 경우 액세스 토큰 갱신
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새 토큰으로 다시 시도
                await sendExerciseToServer(newExercises);
            } else {
                console.error('새로운 토큰을 가져오지 못했습니다.');
            }
        } else {
            // console.error('서버 요청 실패:', response.status);
        }
    } catch (error) {
        // console.error('서버 요청 중 오류 발생:', error);
    }
};

// 내 운동 삭제
export const deleteExerciseFromServer = async (exerciseId, muscleGroup, memberId) => {
    try {

        const API_URL = await getStoredAPIURL(); // 동적으로 API URL을 가져옵니다.

        const accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
        
        const response = await axios.delete(`${API_URL}/myExercises/DeleteMyExercise/${exerciseId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`, // 액세스 토큰을 사용한 인증 헤더
                'Content-Type': 'application/json', // JSON 형식의 데이터 전송
            },
            data: {
                memberId: memberId,
                muscleGroup: muscleGroup,
            }
        });

        return response.data;
        
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // 상태 코드가 401인 경우 토큰 갱신
            console.warn('토큰이 만료되었습니다. 새로운 토큰을 가져오는 중입니다.');
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // 새 토큰을 AsyncStorage에 저장
                await AsyncStorage.setItem('accessToken', newAccessToken);
                // 새 토큰으로 다시 시도
                return await deleteExerciseFromServer(exerciseId, muscleGroup, memberId);
            } else {
                console.error('새로운 토큰을 가져오지 못했습니다.');
                throw new Error('토큰 갱신 실패');
            }
        } else {
            console.error('운동 삭제 중 오류 발생:', error);
            throw error;
        }
    }
};
