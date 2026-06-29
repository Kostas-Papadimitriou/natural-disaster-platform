import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import incidentReducer from './incidentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    incident: incidentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
