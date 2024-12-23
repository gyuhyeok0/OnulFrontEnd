import { createSlice } from '@reduxjs/toolkit';

const exerciseRecordSlice = createSlice({
    name: 'exerciseRecord',
    initialState: {
        exercisesRecord: {}, // exerciseId를 기준으로 그룹화된 데이터 구조
        status: 'idle',
        error: null,
    },
    reducers: {
        // 성공적으로 운동 기록을 가져왔을 때
        fetchExerciseRecordSuccess: (state, action) => {
            console.log("운동 기록을 리덕스 상태에 저장합니다.");

            const { exerciseId, exerciseService, recordDate, data } = action.payload;

            // exerciseId 그룹 생성
            if (!state.exercisesRecord[exerciseId]) {
                state.exercisesRecord[exerciseId] = {};
            }

            // exerciseService 그룹 생성
            if (!state.exercisesRecord[exerciseId][exerciseService]) {
                state.exercisesRecord[exerciseId][exerciseService] = {};
            }

            // recordDate 데이터를 저장
            state.exercisesRecord[exerciseId][exerciseService][recordDate] = data;
            state.status = 'succeeded';
        },

        // 운동 기록 가져오기에 실패했을 때
        fetchExercisesRecordFailure: (state, action) => {
            const { message, exerciseId, exerciseService, recordDate } = action.payload;
            state.error = { message, exerciseId, exerciseService, recordDate }; // 에러 정보 저장
            state.status = 'failed';
        },

        // 성공적으로 운동 기록 삭제 시
        deleteExerciseRecordSuccess: (state, action) => {
            console.log("운동 기록 삭제 후 리덕스 상태를 업데이트합니다.");

            console.log(action.payload);

            const { exerciseId, exerciseService, recordDate } = action.payload;

            if (state.exercisesRecord[exerciseId]?.[exerciseService]?.[recordDate]) {
                delete state.exercisesRecord[exerciseId][exerciseService][recordDate]; // 특정 날짜 데이터 삭제

                // 해당 recordDate 삭제 후 하위 데이터가 없으면 그룹 삭제
                if (Object.keys(state.exercisesRecord[exerciseId][exerciseService]).length === 0) {
                    delete state.exercisesRecord[exerciseId][exerciseService];
                }

                if (Object.keys(state.exercisesRecord[exerciseId]).length === 0) {
                    delete state.exercisesRecord[exerciseId];
                }
            }
        },
    },
});

// 액션 생성자 내보내기
export const {
    fetchExerciseRecordSuccess,
    fetchExercisesRecordFailure,
    deleteExerciseRecordSuccess,
} = exerciseRecordSlice.actions;

// 리듀서 내보내기
export default exerciseRecordSlice.reducer;

// Selector 함수 (효율적으로 특정 데이터만 가져오기 위해 사용)
export const selectExerciseRecordByDetails = (
    state,
    exerciseId,
    exerciseService,
    recordDate
) => {
    return (
        state.exerciseRecord.exercisesRecord[exerciseId]?.[exerciseService]?.[recordDate] || null
    );
};

// Selector 함수 사용 예시:
// const recordData = useSelector((state) => selectExerciseRecordByDetails(state, exerciseId, exerciseService, recordDate));
