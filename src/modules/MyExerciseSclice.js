import { createSlice } from '@reduxjs/toolkit';

// 자유 운동 슬라이스
const myFreeSlice = createSlice({
    name: 'myFree',
    initialState: {
        myExercises: [],
        status: 'idle',
        error: null,
    },

    reducers: {
        fetchMyFreeExercisesSuccess: (state, action) => {
            state.myExercises = action.payload;
            state.status = 'succeeded';
        },
        fetchMyFreeExercisesFailure: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
        
        reorderMyFreeExercises: (state, action) => {
            const { sourceIndex, destinationIndex } = action.payload;
        
        
            if (sourceIndex !== destinationIndex) {
                const updatedExercises = [...state.myExercises]; // 배열 복사
                const [removed] = updatedExercises.splice(sourceIndex, 1);
                updatedExercises.splice(destinationIndex, 0, removed);
        
                // 새로운 상태 객체 반환
                state.myExercises = updatedExercises;
            }
        
        },
        
        
        
    },
});

// 가슴 운동 슬라이스
const myChestSlice = createSlice({
    name: 'myChest',
    initialState: {
        myExercises: [],
        status: 'idle',
        error: null,
    },
    
    reducers: {
        fetchMyChestExercisesSuccess: (state, action) => {
            
            state.myExercises = action.payload;
            state.status = 'succeeded';
        },
        fetchMyChestExercisesFailure: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
    },
});

// 등 운동 슬라이스
const myBackSlice = createSlice({
    name: 'myBack',
    initialState: {
        myExercises: [],
        status: 'idle',
        error: null,
    },
    
    reducers: {
        fetchMyBackExercisesSuccess: (state, action) => {
            state.myExercises = action.payload;
            state.status = 'succeeded';
        },
        fetchMyBackExercisesFailure: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
    },
});

// 복근 운동 슬라이스
const myAbsSlice = createSlice({
    name: 'myAbs',
    initialState: {
        myExercises: [],
        status: 'idle',
        error: null,
    },
    
    reducers: {
        fetchMyAbsExercisesSuccess: (state, action) => {
            state.myExercises = action.payload;
            state.status = 'succeeded';
        },
        fetchMyAbsExercisesFailure: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
    },
});

// 팔 운동 슬라이스
const myArmsSlice = createSlice({
    name: 'myArms',
    initialState: {
        myExercises: [],
        status: 'idle',
        error: null,
    },
    
    reducers: {
        fetchMyArmsExercisesSuccess: (state, action) => {
            state.myExercises = action.payload;
            state.status = 'succeeded';
        },
        fetchMyArmsExercisesFailure: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
    },
});

// 사용자 정의 운동 슬라이스
const myCustomSlice = createSlice({
    name: 'myCustom',
    initialState: {
        myExercises: [],
        status: 'idle',
        error: null,
    },
    
    reducers: {
        fetchMyCustomExercisesSuccess: (state, action) => {
            state.myExercises = action.payload;
            state.status = 'succeeded';
        },
        fetchMyCustomExercisesFailure: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
    },
});

// 기타 운동 슬라이스
const myEtcSlice = createSlice({
    name: 'myEtc',
    initialState: {
        myExercises: [],
        status: 'idle',
        error: null,
    },
    
    reducers: {
        fetchMyEtcExercisesSuccess: (state, action) => {
            state.myExercises = action.payload;
            state.status = 'succeeded';
        },
        fetchMyEtcExercisesFailure: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
    },
});

// 하체 운동 슬라이스
const myLowerBodySlice = createSlice({
    name: 'myLowerBody',
    initialState: {
        myExercises: [],
        status: 'idle',
        error: null,
    },
    
    reducers: {
        fetchMyLowerBodyExercisesSuccess: (state, action) => {
            state.myExercises = action.payload;
            state.status = 'succeeded';
        },
        fetchMyLowerBodyExercisesFailure: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
    },
});

// 어깨 운동 슬라이스
const myShouldersSlice = createSlice({
    name: 'myShoulders',
    initialState: {
        myExercises: [],
        status: 'idle',
        error: null,
    },
    
    reducers: {
        fetchMyShouldersExercisesSuccess: (state, action) => {
            state.myExercises = action.payload;
            state.status = 'succeeded';
        },
        fetchMyShouldersExercisesFailure: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
    },
});

// 액션 생성자 내보내기
export const { fetchMyChestExercisesSuccess, fetchMyChestExercisesFailure } = myChestSlice.actions;
export const { fetchMyBackExercisesSuccess, fetchMyBackExercisesFailure } = myBackSlice.actions;
export const { fetchMyAbsExercisesSuccess, fetchMyAbsExercisesFailure } = myAbsSlice.actions;
export const { fetchMyArmsExercisesSuccess, fetchMyArmsExercisesFailure } = myArmsSlice.actions;
export const { fetchMyCustomExercisesSuccess, fetchMyCustomExercisesFailure } = myCustomSlice.actions;
export const { fetchMyEtcExercisesSuccess, fetchMyEtcExercisesFailure } = myEtcSlice.actions;
export const { fetchMyLowerBodyExercisesSuccess, fetchMyLowerBodyExercisesFailure } = myLowerBodySlice.actions;
export const { fetchMyShouldersExercisesSuccess, fetchMyShouldersExercisesFailure } = myShouldersSlice.actions;
export const { fetchMyFreeExercisesSuccess, fetchMyFreeExercisesFailure, reorderMyFreeExercises } = myFreeSlice.actions;

// 리듀서 내보내기
export const myChestReducer = myChestSlice.reducer;
export const myBackReducer = myBackSlice.reducer;
export const myAbsReducer = myAbsSlice.reducer;
export const myArmsReducer = myArmsSlice.reducer;
export const myCustomReducer = myCustomSlice.reducer;
export const myEtcReducer = myEtcSlice.reducer;
export const myLowerBodyReducer = myLowerBodySlice.reducer;
export const myShouldersReducer = myShouldersSlice.reducer;
export const myFreeReducer = myFreeSlice.reducer;
