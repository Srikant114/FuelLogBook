// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../common/Loader";

/**
 * ProtectedRoute
 * - If `children` are provided, it will render children when authenticated.
 * - Otherwise it will render <Outlet /> for nested routes.
 */
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, loading } = useAuth();

  // while verifying token on app load, render a small placeholder
  if (loading) {
    return (
      <Loader />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // if children passed (common when wrapping Layout), render them
  if (children) return <>{children}</>;

  // otherwise render nested route outlet
  return <Outlet />;
};

export default ProtectedRoute;
