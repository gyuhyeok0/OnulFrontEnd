import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const latestExerciseRecordSlice = createSlice({
    name: 'latestExerciseRecord',
    initialState,
    reducers: {
        updateLatestRecord(state, action) {

            // console.log("각 운동에 대한 최근 날짜 리듀서가 업데이트 되었습니다.")
            const { exerciseId, recordDate } = action.payload;
            // 조건 없이 매번 업데이트
            state[exerciseId] = recordDate;
        },
    },
});

export const { updateLatestRecord } = latestExerciseRecordSlice.actions;
export default latestExerciseRecordSlice.reducer;
