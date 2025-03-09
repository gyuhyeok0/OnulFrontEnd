import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

// 초기 상태
const initialState = {
    foodRecords: {}, // 객체로 초기화 (날짜별 데이터 관리)
    status: 'idle', // idle | loading | succeeded | failed
    error: null, // 에러 메시지
};

// 슬라이스 정의
const exerciseRecordSlice = createSlice({
    name: 'totalFood',
    initialState,
    reducers: {

        fetchTotalFoodSuccess(state, action) {
            const { date, mealType, totalNutrition, recipeNames } = action.payload;
            
            // 날짜 키가 없으면 새 객체 생성
            if (!state.foodRecords[date]) {
                state.foodRecords[date] = {};
            }
        
            // mealType 데이터는 항상 새 데이터로 덮어씀
            state.foodRecords[date][mealType] = {
                totalNutrition,
                recipeNames, // 들어온 데이터만 저장
            };
        
            state.status = 'succeeded';
        },
        
        
        
        
        fetchTotalFoodFailure(state, action) {
            state.status = 'failed';
            state.error = action.payload; // 에러 메시지 저장
        },
        
        resetFoodStatus(state) {
            state.status = 'idle';
            state.error = null; // 상태 초기화
        },

        deleteFoodData: (state, action) => {
            const { dates } = action.payload; // 삭제할 날짜 배열
        
            if (Array.isArray(dates)) {
                dates.forEach((date) => {
                    if (state.foodRecords[date]) {
                        delete state.foodRecords[date]; // 해당 날짜 데이터를 삭제
                    }
                });
        
            }
        
            state.status = 'succeeded'; // 상태를 'succeeded'로 업데이트
        },
        
    },
});

// selectTodayFoodData 셀렉터 (오늘 날짜를 인자로 받도록 수정)
export const selectTodayFoodData = createSelector(
    (state) => state.totalFood.foodRecords, // 상태에서 foodRecords를 가져옵니다.
    (_, today) => today, // `today`를 인자로 받습니다.
    (foodRecords, today) => {
        const dateKey = today; // 전달된 today를 사용
        const todayData = foodRecords[dateKey] || {}; // 전달된 날짜에 해당하는 데이터 가져오기

        // 오늘 날짜의 데이터를 mealType별로 반환
        return Object.entries(todayData).map(([mealType, data]) => ({
            mealType,
            ...data, // totalNutrition과 recipeNames 포함
        }));
    }
);


export const { fetchTotalFoodSuccess, fetchTotalFoodFailure, resetFoodStatus, deleteFoodData} = exerciseRecordSlice.actions;

export default exerciseRecordSlice.reducer;