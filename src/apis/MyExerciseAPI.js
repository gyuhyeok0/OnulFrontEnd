import { refreshAccessToken } from '../apis/Token'; // 올바른 경로로 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

export const fetchMyExercises = (memberId, muscleGroup) => async (dispatch) => {

    try {
        const accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기

        const response = await axios.get(`http://localhost:8080/myExercises/${memberId}/${muscleGroup}`, {
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
        const accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기

        const response = await fetch('http://localhost:8080/myExercises/RegistMyExercise', { // URL 수정
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
            console.log('서버 응답:', data);
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
            console.error('서버 요청 실패:', response.status);
        }
    } catch (error) {
        console.error('서버 요청 중 오류 발생:', error);
    }
};

// 내 운동 삭제
export const deleteExerciseFromServer = async (exerciseId, muscleGroup, memberId) => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
        
        const response = await axios.delete(`http://localhost:8080/myExercises/DeleteMyExercise/${exerciseId}`, {
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
