import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import keycloak from "./keycloak";
import { login, logout } from "./store/authSlice";
import TopNavBar from "./components/TopNavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useSelector } from "react-redux";
import RealtimeListener from "./components/RealtimeListener";
import HomePage from "./pages/HomePage";
import DashboardTable from "./components/DashboardTable";
import NewIncidentPage from "./pages/NewIncidentPage";
import MapPage from "./pages/MapPage";
import AlertsPage from "./pages/AlertsPage";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";
import "bootstrap-icons/font/bootstrap-icons.css";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

function App() {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  useEffect(() => {
    keycloak
      .init({
        onLoad: "login-required",
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        if (authenticated) {
          dispatch(
            login({
              token: keycloak.token,
              user: keycloak.tokenParsed,
            })
          );
        } else {
          dispatch(logout());
        }
        setReady(true);
      })
      .catch((err) => {
        console.error("Keycloak init failed:", err);
        setReady(true);
      });
  }, [dispatch]);

  if (!ready) {
    return <div style={{ padding: "2rem" }}>Φόρτωση...</div>;
  }

  return (
    <div className="app-background">
      <Router>
        <TopNavBar />
        {isAuthenticated && <RealtimeListener />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardTable />} />
          <Route path="/new-incident" element={<NewIncidentPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route
  path="/users"
  element={
    <ProtectedAdminRoute>
      <UsersPage />
    </ProtectedAdminRoute>
  }
/>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;