import { createSlice } from '@reduxjs/toolkit';

const exerciseRecordSlice = createSlice({
        name: 'exercisesRecord',
        initialState: {
        exercisesRecord: [],
        status: 'idle', // 상태 초기값이 'idle'로 설정
        error: null,
        },
        
        reducers: {
            fetchExerciseRecordSuccess: (state, action) => {
                state.exercisesRecord = action.payload;
                state.status = 'succeeded';
            },
            fetchExercisesRecordFailure: (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            },
            deleteExerciseRecordSuccess: (state, action) => {
                const { id } = action.payload; // 삭제할 세트 번호
                state.exercisesRecord = state.exercisesRecord.filter(
                    (record) => record.setNumber !== id
                ); // 삭제 처리
            },
        },
    });

    export const { 
        fetchExerciseRecordSuccess, 
        fetchExercisesRecordFailure, 
        deleteExerciseRecordSuccess 
    } = exerciseRecordSlice.actions;
    
    export default exerciseRecordSlice.reducer;
