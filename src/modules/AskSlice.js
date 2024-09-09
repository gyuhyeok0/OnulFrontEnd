import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

// createSlice로 FIND_MEMBER 및 ALARM_MESSAGE 관련 액션과 리듀서를 정의
const askSlice = createSlice({
    name: 'ask',
    initialState,
    reducers: {
        findMember: (state, { payload }) => {
            return payload;
        },
        alarmMessage: (state, { payload }) => {
            return payload;
        },
    },
});

// 액션을 export
export const { findMember, alarmMessage } = askSlice.actions;

// 리듀서를 export
export const askReducer = askSlice.reducer;
