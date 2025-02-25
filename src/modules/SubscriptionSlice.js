import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Purchases from 'react-native-purchases';

// ✅ 비동기 thunk: 구독 상태 확인
export const fetchSubscriptionStatus = createAsyncThunk(
    'subscription/fetchStatus',
    async (_, { rejectWithValue }) => {
        try {
        const customerInfo = await Purchases.getCustomerInfo();
        const isPremiumActive = customerInfo.entitlements.active["Pro"] ? true : false;
        return isPremiumActive;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

// ✅ Slice 생성
const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState: {
        isPremium: false,
        loading: false,
        error: null,
    },
    reducers: {
        setPremiumStatus: (state, action) => {
        state.isPremium = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchSubscriptionStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
            state.isPremium = action.payload;
            state.loading = false;
        })
        .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });
    },
});

// ✅ 액션 및 리듀서 내보내기
export const { setPremiumStatus } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
