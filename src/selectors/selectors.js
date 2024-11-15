// src/selectors/selectors.js
import { createSelector } from 'reselect';

const createExerciseSelector = (key) => createSelector(
    (state) => state[key]?.myExercises || [],
    (myExercises) => myExercises.slice() // 배열을 복사하여 새로운 참조 생성
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
