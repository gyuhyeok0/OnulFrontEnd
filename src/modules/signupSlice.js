import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: '',
    password: '',
    phoneNumber: '',
};

const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        setSignupInfo: (state, action) => {
        state.username = action.payload.username;
        state.password = action.payload.password;
        },
        setPhoneNumber: (state, action) => {
        state.phoneNumber = action.payload.phoneNumber;
        },
    },
});

export const { setSignupInfo, setPhoneNumber } = signupSlice.actions;
export default signupSlice.reducer;
