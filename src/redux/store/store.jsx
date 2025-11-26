// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import purchaseReducer from "../features/purchaseSlice";
import authReducer from "../features/authSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    purchases: purchaseReducer,
  },
});

export default store;
