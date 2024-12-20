import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    exerciseSets: {},
};

const schedulExerciseState = createSlice({
    name: 'schedulExerciseState',
    initialState,
    reducers: {
        initializeExerciseSets(state, action) {

            console.log("리듀서로 등록")
            const reorderedExercises = action.payload;
            reorderedExercises.forEach((exercise) => {
                if (!state.exerciseSets[exercise.id]) {
                    state.exerciseSets[exercise.id] = [
                        { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                        { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                        { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                    ];
                }
            });
        },

        updateExerciseSet(state, action) {

            console.log("리듀서로 업데이트")
            const { exerciseId, updatedSets } = action.payload;
            state.exerciseSets[exerciseId] = updatedSets;
        },

        resetExerciseSets(state, action) {

            console.log("리듀서 리셋")

            const reorderedExercises = action.payload;
            reorderedExercises.forEach((exercise) => {
                state.exerciseSets[exercise.id] = [
                    { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                    { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                    { kg: '', lbs: '', reps: '', km: '', mi: '', time: '', completed: false },
                ];
            });
        },
    },
});

export const { initializeExerciseSets, updateExerciseSet, resetExerciseSets } = schedulExerciseState.actions;
export default schedulExerciseState.reducer;
