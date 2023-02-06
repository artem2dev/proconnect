import { configureStore } from '@reduxjs/toolkit';
import chatsReducer from './chatsSlice';
import globalStateReducer from './globalStateSlice';
import usersReducer from './usersSlice';

export default configureStore({
  reducer: {
    user: usersReducer,
    globalState: globalStateReducer,
    chats: chatsReducer,
  },
});
