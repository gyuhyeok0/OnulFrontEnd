import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const bodySlice = createSlice({
    name: 'body',
    initialState: {
        bodyData: {}, // 날짜를 기준으로 그룹화된 데이터 구조
        status: 'idle',
        error: null,
    },
    reducers: {
        setBodyData: (state, action) => {
            console.log("Redux에 몸 데이터를 저장합니다.");

            const { dateKey, bodyData } = action.payload;

            console.log("dateKey:", dateKey);  // dateKey 출력
            console.log("bodyData:", bodyData); // bodyData 출력

            if (dateKey) {
                if (state.bodyData[dateKey]) {
                    console.log(`기존 데이터가 존재합니다. ${dateKey} 데이터를 업데이트합니다.`);
                } else {
                    console.log(`${dateKey} 데이터가 새로 추가됩니다.`);
                }

                state.bodyData[dateKey] = bodyData;
                state.status = 'succeeded';
            } else {
                state.status = 'failed';
                console.error("DateKey is missing in the payload.");
            }

            console.log("저장된 bodyData:", JSON.stringify(state.bodyData, null, 2));
        },

        fetchBodyDataFailure: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },

        deleteBodyData: (state, action) => {
            const { date } = action.payload;

            if (state.bodyData[date]) {
                delete state.bodyData[date];
                console.log(`Redux bodyData updated after deletion:`, JSON.stringify(state.bodyData, null, 2));
            }
        },
    },
});

// 셀렉터
export const selectBodyData = (state) => state.body.bodyData;

export const selectBodyDataByDate = createSelector(
    [selectBodyData, (state, dateKey) => dateKey],
    (bodyData, dateKey) => bodyData[dateKey] || {} // 해당 날짜 데이터 반환
);

// 액션 생성자 내보내기
export const { setBodyData, fetchBodyDataFailure, deleteBodyData } = bodySlice.actions;

// 리듀서 내보내기
export default bodySlice.reducer;
