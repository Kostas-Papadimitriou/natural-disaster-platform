import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { isAdminUser } from "../utils/authHelpers";

function ProtectedAdminRoute({ children }) {
  const authUser = useSelector((state) => state.auth?.user);
  const isAdmin = isAdminUser(authUser);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;