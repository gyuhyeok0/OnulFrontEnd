import { combineReducers } from 'redux';
import user from './user'; // user 모듈 불러오기

const rootReducer = combineReducers({
  user,  // 사용자 상태 관리 리듀서
});

export default rootReducer;
