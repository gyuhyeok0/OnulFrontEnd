import { createSlice } from '@reduxjs/toolkit';

// ExerciseSlice.js
const exerciseSlice = createSlice({
    name: 'exercises',
    initialState: {
      exercises: [],
      status: 'idle', // 상태 초기값이 'idle'로 설정
      error: null,
    },
    
    reducers: {
      fetchExercisesSuccess: (state, action) => {
        state.exercises = action.payload;
        state.status = 'succeeded'; // 성공적으로 완료 시 'succeeded'
      },
      fetchExercisesFailure: (state, action) => {
        state.error = action.payload;
        state.status = 'failed'; // 실패 시 'failed'
      },
    },
  });

export const { fetchExercisesSuccess, fetchExercisesFailure } = exerciseSlice.actions;
export default exerciseSlice.reducer;
