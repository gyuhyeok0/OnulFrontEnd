import { createSlice } from '@reduxjs/toolkit';

// 초기 상태
const initialState = {
    userInfo: null,  // 객체로 설정 (배열이 아님)
};

const memberSlice = createSlice({
    name: 'member',
    initialState,
    reducers: {
        postLogin: (state, action) => {
            state.userInfo = { ...action.payload };
            state.status = 200; // 상태 200으로 설정
        },
        // 로그인 실패 시 상태를 추가할 수도 있습니다.
        postLoginFailure: (state) => {
            state.status = 500;
        },
    },
});

// 액션과 리듀서 export
export const { postLogin, postLoginFailure } = memberSlice.actions;
export const memberReducer = memberSlice.reducer;