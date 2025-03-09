
import { createSelector } from 'reselect';

export const createExerciseSelector = (key) => createSelector(
    (state) => (state[key]?.myExercises ? state[key].myExercises : []), 
    (myExercises) => myExercises.slice() 
);

export const selectCustomExercises = createExerciseSelector('customExercises');
