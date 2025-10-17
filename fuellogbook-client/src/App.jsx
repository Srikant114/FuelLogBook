// src/App.jsx
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/user/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import FuelLogs from "./pages/admin/FuelLogs";
import Vehicles from "./pages/admin/Vehicles";
import Report from "./pages/admin/Report";
import Users from "./pages/admin/Users";
import Subscriptions from "./pages/admin/Subscriptions";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import MyAccount from "./pages/admin/MyAccount";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
    <AuthProvider>

      <Routes>
        {/* Public pages: redirect authenticated users to /admin */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin routes: protect the whole /admin tree */}
        <Route
          path="/admin"
          element={
            // ProtectedRoute wraps the AdminLayout; children (nested routes) will render inside AdminLayout's Outlet
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* index => /admin -> Dashboard */}
          <Route index element={<Dashboard />} />

          {/* nested admin routes */}
          <Route path="fuel-logs" element={<FuelLogs />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="report" element={<Report />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="users" element={<Users />} />
          <Route path="account" element={<MyAccount />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
    </>
  );
};

export default App;
