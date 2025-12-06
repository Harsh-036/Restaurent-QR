import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import guestReducer from './guestSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    guest: guestReducer
  },
});
