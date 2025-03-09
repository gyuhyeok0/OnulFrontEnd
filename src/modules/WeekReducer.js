import { createSlice } from '@reduxjs/toolkit';

// 초기 상태 설정
const initialState = {
  isSwapped: false,  // 색상이 바뀌었는지 여부
  todayIndex: null,  // 오늘의 요일 인덱스
};

// 리듀서 정의
const weekReducer = createSlice({
    name: 'week',
    initialState,
    reducers: {
        setWeekState: (state, action) => {

        const { isSwapped, todayIndex } = action.payload;
        state.isSwapped = isSwapped;
        state.todayIndex = todayIndex;
        },
    },
});

export const { setWeekState } = weekReducer.actions;
export default weekReducer.reducer;
