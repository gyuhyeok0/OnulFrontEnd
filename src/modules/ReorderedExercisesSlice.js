// import { createSlice } from '@reduxjs/toolkit';

// const initialState = [];

// const reorderedExercisesSlice = createSlice({
//     name: 'reorderedExercises',
//     initialState,
//     reducers: {
//         updateReorderedExercises: (state, action) => {
//         console.log("실행됨", action.payload); // 로그가 먼저 찍힘

//         // 기존에 전달된 payload에 weekType과 day를 추가
//         return {
//             ...action.payload,  // 기존 action.payload의 값 복사
//             weekType: action.payload.weekType || 'defaultWeekType', // weekType 설정 (default 값 설정 가능)
//             day: action.payload.day || 'defaultDay'  // day 설정 (default 값 설정 가능)
//         };
//         },
//     },
// });

// // updateReorderedExercises 액션을 export
// export const { updateReorderedExercises } = reorderedExercisesSlice.actions;
// export default reorderedExercisesSlice.reducer;
