import { createSlice } from '@reduxjs/toolkit';

const intensitySlice = createSlice({
    name: 'intensity',
    initialState: {
        data: null, // 성공 시 데이터를 저장
        status: 'idle', // 상태 초기값이 'idle'로 설정
        error: null,
    },
    reducers: {
        fetchIntensitySuccess: (state, action) => {
            state.data = action.payload;
            state.status = 'succeeded'; // 성공적으로 완료 시 'succeeded'
            state.error = null;
        },
        fetchIntensityFailure: (state, action) => {
            state.error = action.payload;
            state.status = 'failed'; // 실패 시 'failed'
        },
    },
});

export const { fetchIntensitySuccess, fetchIntensityFailure } = intensitySlice.actions;
export default intensitySlice.reducer;