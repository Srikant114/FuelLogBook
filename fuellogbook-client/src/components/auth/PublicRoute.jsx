// src/components/PublicRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * PublicRoute
 * - Prevents authenticated users from accessing public pages such as /, /login, /register.
 * - If authenticated -> redirect to /admin
 *
 * Usage:
 * <Route element={<PublicRoute />}>
 *   <Route path="/" element={<Home />} />
 *   <Route path="/login" element={<Login />} />
 * </Route>
 */

const PublicRoute = ({ redirectTo = "/admin" }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-full grid place-items-center">
        <div className="animate-pulse text-theme-light dark:text-theme-light">Checking authentication…</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
