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

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="fuel-logs" element={<FuelLogs />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="report" element={<Report />} />
          <Route path="users" element={<Users />} />
        </Route>


        {/* Catch-All -> Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
};

export default App;
