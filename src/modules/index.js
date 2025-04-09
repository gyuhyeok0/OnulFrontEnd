// store/modules/index.js (현재 rootReducer 파일)

import { combineReducers } from '@reduxjs/toolkit';
import { RESET_ALL_STATE } from './resetActions'; // ✅ 아까 만든 액션 import

import { memberReducer } from './MemberSlice';
import { askReducer } from './AskSlice';
import authReducer from './AuthSlice';
import exerciseReducer from './ExerciseSlice';
import scheduleReducer from './ScheduleSlice';

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
} from './MyExerciseSclice';

import schedulExerciseReducer from './ExerciseStateSlice/SchedulExerciseState';
import stateExerciseReducer from './StateExerciseSlice';
import weekReducer from './WeekReducer';
import intensityReducer from './IntensitySlice';
import bodyReducer from './BodySlice';
import totalFoodReducer from './TotalFoodSlice';
import exerciseVolumeReducer from './VolumeSlice';

// ✅ 기존 combineReducers 그대로 사용
const appReducer = combineReducers({
  member: memberReducer,
  ask: askReducer,
  auth: authReducer,
  exercises: exerciseReducer,
  schedule: scheduleReducer,
  chestExercises: myChestReducer,
  backExercises: myBackReducer,
  absExercises: myAbsReducer,
  armsExercises: myArmsReducer,
  customExercises: myCustomReducer,
  etcExercises: myEtcReducer,
  lowerBodyExercises: myLowerBodyReducer,
  shouldersExercises: myShouldersReducer,
  schedulExerciseState: schedulExerciseReducer,
  freeExercises: myFreeReducer,
  stateExercise: stateExerciseReducer,
  week: weekReducer,
  intensity: intensityReducer,
  body: bodyReducer,
  totalFood: totalFoodReducer,
  exerciseVolumeData: exerciseVolumeReducer,
});

// ✅ 여기서 액션 감지해서 상태 초기화
const rootReducer = (state, action) => {
  if (action.type === RESET_ALL_STATE) {
    state = undefined; // 전체 리덕스 초기화
  }
  return appReducer(state, action);
};

export default rootReducer;
