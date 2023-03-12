import { createSlice } from '@reduxjs/toolkit';

export const chatsSlice = createSlice({
  name: 'chats',
  initialState: {},
  reducers: {
    setChats: (state, { payload }) => {
      return payload;
    },
  },
});

export const { setChats } = chatsSlice.actions;

export default chatsSlice.reducer;
