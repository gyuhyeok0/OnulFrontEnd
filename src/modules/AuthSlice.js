import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        isLoggedIn: false,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setToken, setIsLoggedIn, logout } = authSlice.actions;
export default authSlice.reducer;
