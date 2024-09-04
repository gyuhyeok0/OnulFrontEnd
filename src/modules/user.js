import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: '',
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
        state.username = action.payload.username;
        state.isAuthenticated = true;
        },
        logout: (state) => {
        state.username = '';
        state.isAuthenticated = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
