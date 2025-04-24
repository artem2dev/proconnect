import { createSlice } from '@reduxjs/toolkit';

export const globalState = createSlice({
  name: 'globalState',
  initialState: {
    sidebarVisible: false,
  },
  reducers: {
    setGlobalState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
});

export const { setGlobalState } = globalState.actions;

export default globalState.reducer;
