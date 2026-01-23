import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import guestReducer from './guestSlice';
import menuReducer from './menuSlice';
import cartReducer from './cartSlice';
import couponReducer from './couponSlice';
import tableReducer from './tableSlice';
import orderReducer from './orderSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    guest: guestReducer,
    menu: menuReducer,
    cart: cartReducer,
    coupon: couponReducer,
    table: tableReducer,
    order: orderReducer,
    ui: uiReducer
  },
});
