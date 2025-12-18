import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import guestReducer from './guestSlice';
import menuReducer from './menuSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    guest: guestReducer,
    menu: menuReducer
  },
});
