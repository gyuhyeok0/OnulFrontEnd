import { createSlice } from '@reduxjs/toolkit';

// ScheduleSlice.js
const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: {
        schedule: [], // 스케줄 데이터를 저장할 배열
        status: 'idle', // 상태 초기값
        error: null,    // 에러 정보 저장
    },
    
    reducers: {
        fetchScheduleSuccess: (state, action) => {
            state.schedule = action.payload;
            state.status = 'succeeded'; // 성공적으로 완료 시 'succeeded'
        },
        fetchScheduleFailure: (state, action) => {
            state.error = action.payload;
            state.status = 'failed'; // 실패 시 'failed'
        },
    },
});

export const { fetchScheduleSuccess, fetchScheduleFailure } = scheduleSlice.actions;
export default scheduleSlice.reducer;
