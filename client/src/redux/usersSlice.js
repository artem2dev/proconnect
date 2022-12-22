import { createSlice } from '@reduxjs/toolkit';

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    id: null,
  },
  reducers: {
    getUserInfo: (state, { payload }) => {
      return payload;
    },
  },
});

export const { getUserInfo } = usersSlice.actions;

export default usersSlice.reducer;
