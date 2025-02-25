import { combineReducers } from '@reduxjs/toolkit';
import { memberReducer } from './MemberSlice';
import { askReducer } from './AskSlice';
import authReducer from './AuthSlice'; // authReducer 가져오기
import exerciseReducer from './ExerciseSlice'; // exerciseReducer 가져오기
import scheduleReducer from './ScheduleSlice'; // scheduleReducer 가져오기

import {
  myChestReducer,
  myBackReducer,
  myAbsReducer,
  myArmsReducer,
  myCustomReducer,
  myEtcReducer,
  myLowerBodyReducer,
  myShouldersReducer,
  myFreeReducer,
} from './MyExerciseSclice'; // 각각의 슬라이스 리듀서 가져오기

import schedulExerciseReducer from './ExerciseStateSlice/SchedulExerciseState';

import stateExerciseReducer from './StateExerciseSlice'; // 리듀서 가져오기
import weekReducer from './WeekReducer'; // weekReducer import
// import apiReducer from './ApiSlice'; // 아래에서 생성할 API slice

import intensityReducer from './IntensitySlice'; // 새로 만든 intensity 리듀서 가져오기
import bodyReducer from './BodySlice';
import totalFoodReducer from './TotalFoodSlice'; // 새로 만든 totalFood 리듀서 가져오기

import exerciseVolumeReducer from './VolumeSlice';
import subscriptionReducer from './SubscriptionSlice';


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
  schedulExerciseState: schedulExerciseReducer, // 이름 변경된 리듀서 등록
  
  freeExercises: myFreeReducer,


  stateExercise: stateExerciseReducer, // reorderedExercises 리듀서 추가

  week: weekReducer, // week 상태 관리
  // api: apiReducer, // 전역 상태에 API slice 추가

  intensity: intensityReducer, // 새로 추가한 intensity 리듀서
  body: bodyReducer, // body 키에 bodyReducer를 연결
  totalFood: totalFoodReducer, // totalFood 리듀서 추가
  exerciseVolumeData: exerciseVolumeReducer,

  subscription: subscriptionReducer,

});


export default rootReducer;
