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
            
             // 날짜에 해당하는 레코드를 삭제하고 새로 생성하도록 처리
            if (state.foodRecords[date]) {
                delete state.foodRecords[date]; // 해당 날짜의 데이터를 삭제
            }
            
            // 날짜 키가 없으면 새 객체 생성
            if (!state.foodRecords[date]) {
                state.foodRecords[date] = {};
            }
        
            // mealType 데이터 업데이트 또는 추가
            if (state.foodRecords[date][mealType]) {
                // 기존 nutrition 업데이트
                state.foodRecords[date][mealType].totalNutrition = {
                    ...state.foodRecords[date][mealType].totalNutrition, // 기존 데이터
                    ...totalNutrition, // 새 데이터 병합
                };
        
                // 레시피 이름이 있다면 기존 레시피 이름에 새로 받은 레시피 이름을 병합
                state.foodRecords[date][mealType].recipeNames = [
                    ...new Set([
                        ...(state.foodRecords[date][mealType].recipeNames || []), // 기존 recipeNames 유지
                        ...recipeNames, // 새로 전달받은 recipeNames 병합
                    ])
                ]; // 중복된 이름이 있을 수 있으므로 Set으로 처리하여 중복 제거
            } else {
                state.foodRecords[date][mealType] = {
                    totalNutrition,
                    recipeNames, // 새로운 레시피 이름 목록 추가
                };
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

// selectTodayFoodData 셀렉터 (오늘 날짜를 인자로 받도록 수정)
export const selectTodayFoodData = createSelector(
    (state) => state.totalFood.foodRecords, // 상태에서 foodRecords를 가져옵니다.
    (_, today) => today,  // `today`를 인자로 받습니다.
    (foodRecords, today) => {
        const dateKey = today; // 전달된 today를 사용
        const todayData = foodRecords[dateKey] || {}; // 전달된 날짜에 해당하는 데이터 가져오기

        // 필요한 경우 recipeNames도 반환
        return {
            ...todayData, // 기존 데이터
            recipeNames: todayData.recipeNames || [] // 레시피 이름이 없으면 빈 배열 반환
        };
    }
);

export const { fetchTotalFoodSuccess, fetchTotalFoodFailure, resetFoodStatus, deleteFoodData} = exerciseRecordSlice.actions;

export default exerciseRecordSlice.reducer;
