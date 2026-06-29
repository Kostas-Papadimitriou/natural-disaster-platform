import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import realtimeReducer from "./realtimeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
      realtime: realtimeReducer,
  },
});

export default store;
