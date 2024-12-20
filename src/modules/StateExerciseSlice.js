import { createSlice } from '@reduxjs/toolkit';

// 초기 상태 선언
const initialState = {
    exerciseSets: {}, // 초기 상태
};

const stateExerciseSlice = createSlice({
    name: 'StateExerciseSet',
    initialState,
    reducers: {
        addDefaultSetsToRedux: (state, action) => {
            
            const exercises = action.payload;

            // console.log("새로 생성됨 맞아?:", exercises); // 전달된 운동 리스트 로그
        
            exercises.forEach((exercise) => {
                if (!state.exerciseSets[exercise.id]) {
                    // console.log(`Adding default sets for exercise ID: ${exercise.id}`); // 추가 작업 로그
                    state.exerciseSets[exercise.id] = {
                        id: exercise.id,
                        sets: [
                            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                        ],
                    };
                } else {
                    // console.log(`Exercise ID ${exercise.id} already exists in state.`); // 이미 존재하는 경우 로그
                }
            });
        
        },

        updateExerciseSetsInRedux: (state, action) => {
            console.log("디스패치 업데이트 됨");
        
            const { exerciseId, updatedSets } = action.payload;
        
            // 디버깅 로그 추가
            console.log("받은 exerciseId:", exerciseId);
            console.log("받은 updatedSets:", updatedSets);
        
            if (!updatedSets) {
                console.error("updatedSets가 undefined입니다. action.payload:", action.payload);
                return;
            }
        
            if (state.exerciseSets[exerciseId]) {
                state.exerciseSets[exerciseId] = {
                    ...state.exerciseSets[exerciseId],
                    sets: updatedSets.map((set) => ({ ...set })),
                };
                // console.log("상태 업데이트 완료:", state.exerciseSets[exerciseId]);
            } else {
                console.log("해당 exerciseId에 대한 기존 상태가 없습니다.");
            }
        },
        
        

        resetState: (state, action) => {
            // exerciseSets 내 모든 항목을 초기화
            console.log('Resetting all exerciseSets'); // 확인 로그
        
            for (let exerciseId in state.exerciseSets) {
                if (state.exerciseSets.hasOwnProperty(exerciseId)) {
                    console.log(`Resetting exerciseSets for ID: ${exerciseId}`); // 각 아이디 확인 로그
                    state.exerciseSets[exerciseId] = {
                        id: exerciseId,
                        sets: [
                            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                        ],
                    };
                    console.log('After reset:', state.exerciseSets[exerciseId]);
                }
            }
        },
        
    },
});

export const { addDefaultSetsToRedux, updateExerciseSetsInRedux, resetState } =
    stateExerciseSlice.actions;
export default stateExerciseSlice.reducer;
