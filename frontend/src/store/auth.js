import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        role: "user"
    },
    reducers: {
        login(state) {
            state.isLoggedIn = true;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.role = "user";
        },
        changeRole(state, action) {
            state.role = action.payload;
        }
    }
});

// ✅ Export with plural name
export const authActions = authSlice.actions;
export default authSlice.reducer;
