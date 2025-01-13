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
            const { date, mealType, totalNutrition } = action.payload;
        
            // 날짜 키가 없으면 새 객체 생성
            if (!state.foodRecords[date]) {
                state.foodRecords[date] = {};
            }
        
            // mealType 데이터 업데이트 또는 추가
            if (state.foodRecords[date][mealType]) {
                state.foodRecords[date][mealType].totalNutrition = {
                    ...state.foodRecords[date][mealType].totalNutrition, // 기존 데이터
                    ...totalNutrition, // 새 데이터 병합
                };
            } else {
                state.foodRecords[date][mealType] = { totalNutrition };
            }
        
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
                        console.log(`삭제된 데이터: ${date}`);
                    }
                });
        
                console.log(`Redux foodRecords 상태 업데이트 후:`, JSON.stringify(state.foodRecords, null, 2));
            }
        
            state.status = 'succeeded'; // 상태를 'succeeded'로 업데이트
        },
        
    },
});

// selectTodayFoodData 셀렉터 예시 (확인해보세요)
export const selectTodayFoodData = createSelector(
    (state) => state.totalFood.foodRecords, // 상태에서 foodRecords를 가져옵니다.
    (foodRecords) => foodRecords[new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' })] || {} // 오늘 날짜 기준으로 데이터 반환
);

export const { fetchTotalFoodSuccess, fetchTotalFoodFailure, resetFoodStatus, deleteFoodData} = exerciseRecordSlice.actions;

export default exerciseRecordSlice.reducer;
