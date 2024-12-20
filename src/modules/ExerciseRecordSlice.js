import { createSlice } from '@reduxjs/toolkit';

const exerciseRecordSlice = createSlice({
    name: 'exercisesRecord',
    initialState: {
        exercisesRecord: {}, // 객체로 변경
        status: 'idle', // 상태 초기값이 'idle'로 설정
        error: null,
    },
    reducers: {
        fetchExerciseRecordSuccess: (state, action) => {

            console.log("이전기록을 리듀서로 등록합니다.")

            const { exerciseId, memberId, exerciseService, recordDate, data } = action.payload;
            const key = `${exerciseId}_${memberId}_${exerciseService}_${recordDate}`; // 고유 키 생성
            state.exercisesRecord[key] = data; // 해당 키로 데이터를 저장
            state.status = 'succeeded';
        },
        
        fetchExercisesRecordFailure: (state, action) => {
            const { message, exerciseId, memberId, exerciseService, recordDate } = action.payload;
            state.error = { message, exerciseId, memberId, exerciseService, recordDate }; // 키값을 포함한 에러 메시지 저장
            state.status = 'failed';
        },
        
        deleteExerciseRecordSuccess: (state, action) => {

            console.log("이전기록 삭제후 리듀서에 등록합니다.")

            const { exerciseId, memberId, exerciseService, recordDate } = action.payload;
            const key = `${exerciseId}_${memberId}_${exerciseService}_${recordDate}`;
            delete state.exercisesRecord[key]; // 해당 키로 데이터를 삭제
        },
    },
});

export const {
    fetchExerciseRecordSuccess,
    fetchExercisesRecordFailure,
    deleteExerciseRecordSuccess,
} = exerciseRecordSlice.actions;

export default exerciseRecordSlice.reducer;
