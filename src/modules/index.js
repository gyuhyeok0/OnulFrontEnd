import { combineReducers } from '@reduxjs/toolkit';
import { memberReducer } from './MemberSlice';
import { askReducer } from './AskSlice';
import authReducer from './AuthSlice'; // authReducer 가져오기
import exerciseReducer from './ExerciseSlice'; // exerciseReducer 가져오기
import scheduleReducer from './ScheduleSlice'; // scheduleReducer 가져오기
import exerciseRecordReducer from './ExerciseRecordSlice'; // exerciseRecordReducer 가져오기

import {
  myChestReducer,
  myBackReducer,
  myAbsReducer,
  myArmsReducer,
  myCustomReducer,
  myEtcReducer,
  myLowerBodyReducer,
  myShouldersReducer
} from './MyExerciseSclice'; // 각각의 슬라이스 리듀서 가져오기

import schedulExerciseReducer from './ExerciseStateSlice/SchedulExerciseState';

import stateExerciseReducer from './StateExerciseSlice'; // 리듀서 가져오기
import weekReducer from './WeekReducer'; // weekReducer import
// import apiReducer from './ApiSlice'; // 아래에서 생성할 API slice


const rootReducer = combineReducers({
  member: memberReducer,
  ask: askReducer,
  auth: authReducer, // auth 리듀서 포함
  exercises: exerciseReducer, // exercise 리듀서 포함
  schedule: scheduleReducer, // schedule 리듀서 포함
  chestExercises: myChestReducer, // 가슴 운동 리듀서
  backExercises: myBackReducer, // 등 운동 리듀서
  absExercises: myAbsReducer, // 복근 운동 리듀서
  armsExercises: myArmsReducer, // 팔 운동 리듀서
  customExercises: myCustomReducer, // 사용자 정의 운동 리듀서
  etcExercises: myEtcReducer, // 기타 운동 리듀서
  lowerBodyExercises: myLowerBodyReducer, // 하체 운동 리듀서
  shouldersExercises: myShouldersReducer, // 어깨 운동 리듀서
  exerciseRecord: exerciseRecordReducer, // 운동 기록 리듀서 추가
  schedulExerciseState: schedulExerciseReducer, // 이름 변경된 리듀서 등록


  stateExercise: stateExerciseReducer, // reorderedExercises 리듀서 추가

  week: weekReducer, // week 상태 관리
  // api: apiReducer, // 전역 상태에 API slice 추가

});

export default rootReducer;
