import { createSlice } from '@reduxjs/toolkit';

// 내 운동 조회
const myExerciseSlice = createSlice({
    name: 'myExercises',
    initialState: {
        myExercises: [],
        status: 'idle', // 상태 초기값
        error: null,
    },
    
    reducers: {
        fetchMyExercisesSuccess: (state, action) => {
            state.myExercises = action.payload; // 운동 데이터를 상태에 저장
            state.status = 'succeeded'; // 상태 변경
        },
        fetchMyExercisesFailure: (state, action) => {
            state.error = action.payload; // 오류 메시지 상태에 저장
            state.status = 'failed'; // 상태 변경
        },
    },
});

// 액션 생성자 내보내기
export const { fetchMyExercisesSuccess, fetchMyExercisesFailure } = myExerciseSlice.actions;

// 리듀서 내보내기
export default myExerciseSlice.reducer;
