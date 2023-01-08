import { configureStore } from '@reduxjs/toolkit';
import globalStateReducer from './globalStateSlice';
import usersReducer from './usersSlice';

export default configureStore({
  reducer: {
    users: usersReducer,
    globalState: globalStateReducer,
  },
});
