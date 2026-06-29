import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connected: false,
  unreadCount: 0,
  refreshKey: 0,
  lastIncident: null,
  notifications: [],
};

const realtimeSlice = createSlice({
  name: "realtime",
  initialState,
  reducers: {
    socketConnected: (state) => {
      state.connected = true;
    },
    socketDisconnected: (state) => {
      state.connected = false;
    },
    incidentReceived: (state, action) => {
      state.lastIncident = action.payload;
      state.unreadCount += 1;
      state.refreshKey += 1;

      state.notifications.unshift({
        id: Date.now(),
        type: "incident_created",
        title: action.payload?.title || "Νέο περιστατικό",
        incident: action.payload,
        createdAt: new Date().toISOString(),
      });
    },
    clearUnread: (state) => {
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (item) => item.id !== action.payload
      );
    },
    clearLastIncident: (state) => {
      state.lastIncident = null;
    },
  },
});

export const {
  socketConnected,
  socketDisconnected,
  incidentReceived,
  clearUnread,
  removeNotification,
  clearLastIncident,
} = realtimeSlice.actions;

export default realtimeSlice.reducer;