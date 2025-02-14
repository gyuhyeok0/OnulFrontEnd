import { createSelector } from 'reselect';

const EMPTY_ARRAY = Object.freeze([]); // 불변 빈 배열

const createExerciseSelector = (key) =>
    createSelector(
        [(state) => state.exercises[key] || EMPTY_ARRAY], // undefined 방지
        (exercises) => exercises.slice() // 새로운 배열 반환
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
