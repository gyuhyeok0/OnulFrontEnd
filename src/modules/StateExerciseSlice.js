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

            exercises.forEach((exercise) => {
                const { id, exerciseServiceNumber } = exercise;
                const uniqueKey = `${id}-${exerciseServiceNumber}`;

                if (!state.exerciseSets[uniqueKey]) {
                    state.exerciseSets[uniqueKey] = {
                        id,
                        exerciseServiceNumber,
                        sets: [
                            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                        ],
                    };
                }
            });
        },

        updateExerciseSetsInRedux: (state, action) => {
            const { exerciseId, exerciseServiceNumber, updatedSets } = action.payload;
            const uniqueKey = `${exerciseId}-${exerciseServiceNumber}`;

            if (!updatedSets) {
                console.error("updatedSets가 undefined입니다. action.payload:", action.payload);
                return;
            }

            if (state.exerciseSets[uniqueKey]) {
                state.exerciseSets[uniqueKey] = {
                    ...state.exerciseSets[uniqueKey],
                    sets: updatedSets.map((set) => ({ ...set })),
                };
            } else {
                console.log("해당 uniqueKey에 대한 기존 상태가 없습니다.");
            }
        },

        resetState: (state) => {
            console.log('Resetting all exerciseSets');
        
            for (let uniqueKey in state.exerciseSets) {
                if (state.exerciseSets.hasOwnProperty(uniqueKey)) {
                    console.log(`Resetting exerciseSets for uniqueKey: ${uniqueKey}`);
                    const { id, exerciseServiceNumber } = state.exerciseSets[uniqueKey];
                    state.exerciseSets[uniqueKey] = {
                        id,
                        exerciseServiceNumber,
                        sets: [
                            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                            { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                        ],
                    };
                    console.log('After reset:', state.exerciseSets[uniqueKey]);
                }
            }
        },
    },
});

export const { addDefaultSetsToRedux, updateExerciseSetsInRedux, resetState } =
    stateExerciseSlice.actions;
export default stateExerciseSlice.reducer;
