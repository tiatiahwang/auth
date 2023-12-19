import { createSlice } from '@reduxjs/toolkit';

// TODO: server 측이랑 밀리세컨 맞추기
const TOKEN_EXPIRES = 3 * 1000; // 3 seconds

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    accessToken: null,
    expireTime: null,
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload;
      state.expireTime = new Date().getTime() + TOKEN_EXPIRES;
    },
    removeAccessToken: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.expireTime = null;
    },
  },
});

export const { setAccessToken, removeAccessToken } = authSlice.actions;

export default authSlice.reducer;
