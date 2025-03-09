import { createSlice } from '@reduxjs/toolkit';

const initialState = {}; // 초기 상태

const exerciseVolumeSlice = createSlice({
    name: 'exerciseVolumeData',
    initialState,
    reducers: {
        // 운동 볼륨 업데이트 (있으면 덮어쓰고, 없으면 생성)
        updateExerciseVolume(state, action) {

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
            return {}; // 전체 초기화
        },
    },
});


import { createSelector } from '@reduxjs/toolkit';

// 1️⃣ 상태에서 exerciseVolumeData 가져오기
const selectExerciseVolumeData = (state) => state.exerciseVolumeData;

// 2️⃣ 오늘을 제외한 가장 최근 볼륨을 찾는 Selector
export const selectLatestPreVolume = createSelector(
    [selectExerciseVolumeData, (_, exerciseId) => exerciseId], 
    (exerciseVolumeData, exerciseId) => {
        if (!exerciseVolumeData || !exerciseVolumeData[exerciseId]) return null;

        const today = new Date().toISOString().split('T')[0];
        const exerciseData = exerciseVolumeData[exerciseId];

        // 날짜 목록을 생성하고 가장 최근 날짜 찾기
        const dates = Object.keys(exerciseData).filter((date) => date !== today);

        if (dates.length === 0) return null;

        // ✅ 가장 최근 날짜를 캐싱하여 반환
        const latestDate = dates.reduce((latest, current) => (new Date(current) > new Date(latest) ? current : latest));

        return exerciseData[latestDate]?.preVolume || null;
    }
);




export const { updateExerciseVolume, resetExerciseVolumeData } = exerciseVolumeSlice.actions;
export default exerciseVolumeSlice.reducer;
