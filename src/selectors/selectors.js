import { createSelector } from 'reselect';

const EMPTY_ARRAY = [];

const createExerciseSelector = (key) => createSelector(
    (state) => state[key]?.myExercises || EMPTY_ARRAY,
    (myExercises) => myExercises.length ? myExercises : EMPTY_ARRAY 
);

// 운동 부위별 선택자
export const selectChestExercises = createExerciseSelector('chestExercises');
export const selectBackExercises = createExerciseSelector('backExercises');
export const selectLowerBodyExercises = createExerciseSelector('lowerBodyExercises');
export const selectShouldersExercises = createExerciseSelector('shouldersExercises');
export const selectAbsExercises = createExerciseSelector('absExercises');
export const selectArmsExercises = createExerciseSelector('armsExercises');
export const selectAerobicExercises = createExerciseSelector('etcExercises');
export const selectCustomExercises = createExerciseSelector('customExercises');
