// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
      <div className="w-full h-full grid place-items-center">
        <div className="animate-pulse text-theme-light dark:text-theme-light">Checking authentication…</div>
      </div>
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
