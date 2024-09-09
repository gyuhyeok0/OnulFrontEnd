import { combineReducers } from '@reduxjs/toolkit';
import { memberReducer } from './MemberSlice';
import { askReducer } from './AskSlice';

const rootReducer = combineReducers({
  member: memberReducer,  // member 관련 상태
  ask: askReducer         // ask 관련 상태
});

export default rootReducer;

