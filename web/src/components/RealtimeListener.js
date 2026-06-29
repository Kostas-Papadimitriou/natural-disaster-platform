import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  socketConnected,
  socketDisconnected,
  incidentReceived,
} from "../store/realtimeSlice";

const WS_URL = "ws://127.0.0.1:8000/ws/incidents/";
// Αν το backend είναι αλλού:
// const WS_URL = "ws://192.168.1.5:8000/ws/incidents/";

function RealtimeListener() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("WebSocket connected");
      dispatch(socketConnected());
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "incident_created") {
          dispatch(incidentReceived(message.incident));
        }
      } catch (error) {
        console.error("WebSocket parse error:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      dispatch(socketDisconnected());
    };

    return () => {
      socket.close();
    };
  }, [dispatch, isAuthenticated]);

  return null;
}

export default RealtimeListener;