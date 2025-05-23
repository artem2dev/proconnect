import { createSlice } from '@reduxjs/toolkit';

export const usersSlice = createSlice({
  name: 'users',
  initialState: {},
  reducers: {
    setUser: (state, { payload }) => {
      return payload;
    },
  },
});

export const { setUser } = usersSlice.actions;

export default usersSlice.reducer;
