import { createSlice } from '@reduxjs/toolkit';

const initialState = {}; // 초기 상태

const exerciseVolumeSlice = createSlice({
    name: 'exerciseVolumeData',
    initialState,
    reducers: {
        // 운동 볼륨 업데이트 (있으면 덮어쓰고, 없으면 생성)
        updateExerciseVolume(state, action) {

            console.log("저장중")
            const { exerciseId, date, preVolume } = action.payload;

            // 운동 ID에 대한 초기화
            if (!state[exerciseId]) {
                state[exerciseId] = {};
            }

            // 날짜별 데이터 업데이트 또는 생성
            state[exerciseId][date] = { preVolume };
        },

        // 전체 운동 볼륨 데이터 초기화 (삭제)
        resetExerciseVolumeData(state) {
            console.log("삭제되었습니다.")
            return {}; // 전체 초기화
        },
    },
});

// Selector: 오늘 제외하고 가장 최근 볼륨 가져오기
export const selectLatestPreVolume = (state, exerciseId) => {
    // console.log("실행======================================");

    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜
    const exerciseData = state.exerciseVolumeData[exerciseId] || {}; // exerciseVolumeData를 상태에서 가져오기

    // 날짜들을 배열로 만들고, 오늘을 제외한 최신 날짜를 찾아 그 날짜에 해당하는 볼륨을 반환
    const dates = Object.keys(exerciseData).filter(date => date !== today);
    
    if (dates.length === 0) return null; // 오늘을 제외한 데이터가 없다면 null 반환

    // 가장 최근 날짜 찾기
    const latestDate = dates.sort((a, b) => new Date(b) - new Date(a))[0];

    return exerciseData[latestDate].preVolume; // 최신 날짜에 해당하는 볼륨 반환
};


export const { updateExerciseVolume, resetExerciseVolumeData } = exerciseVolumeSlice.actions;
export default exerciseVolumeSlice.reducer;
