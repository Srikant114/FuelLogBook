// src/components/PublicRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../common/Loader";

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
      <Loader />
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
