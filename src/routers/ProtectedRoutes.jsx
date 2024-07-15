import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../custom-hooks/useAuth";

const ProtectedRoutes = () => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser && userRole === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoutes;
