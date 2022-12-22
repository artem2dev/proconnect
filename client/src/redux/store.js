import { configureStore } from '@reduxjs/toolkit';
import globalStateReducer from './globalState';
import usersReducer from './usersSlice';

export default configureStore({
  reducer: {
    users: usersReducer,
    globalState: globalStateReducer,
  },
});
