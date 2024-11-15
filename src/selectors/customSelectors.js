// src/selectors/customSelectors.js

import { createSelector } from 'reselect';

export const createExerciseSelector = (key) => createSelector(
    (state) => (state[key]?.myExercises ? state[key].myExercises : []), // myExercises가 정의되지 않았을 때 빈 배열 반환
    (myExercises) => myExercises.slice() // 배열을 복사하여 새로운 참조 생성
);

// customExercises를 선택할 때 사용할 셀렉터
export const selectCustomExercises = createExerciseSelector('customExercises');
