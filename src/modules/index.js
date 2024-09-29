import { combineReducers } from '@reduxjs/toolkit';
import { memberReducer } from './MemberSlice';
import { askReducer } from './AskSlice';
import authReducer from './AuthSlice'; // authReducer 가져오기
import exerciseReducer from './ExerciseSlice'; // exerciseReducer 가져오기

const rootReducer = combineReducers({
  member: memberReducer,
  ask: askReducer,
  auth: authReducer, // auth 리듀서 포함
  exercises: exerciseReducer, // exercise 리듀서 포함

});

export default rootReducer;
