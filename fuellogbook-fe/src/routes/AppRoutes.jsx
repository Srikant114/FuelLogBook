// src/routes/AppRoutes.jsx
import { lazy } from "react";
import {
  FiHome,
  FiTruck,
  FiActivity,
  FiBarChart2,
  FiUsers,
  FiDatabase,
  FiFileText,
  FiSearch,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Vehicles = lazy(() => import("../pages/Vehicles"));
const FuelLogs = lazy(() => import("../pages/FuelLogs"));
const Reports = lazy(() => import("../pages/Reports"));
const Users = lazy(() => import("../pages/Users"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const routes = [
  { path: "/", name: "Dashboard", component: Dashboard, icon: <FiHome /> },
  {
    path: "/vehicles",
    name: "Vehicles",
    component: Vehicles,
    icon: <FiTruck />,
  },
  {
    path: "/fuel-logs",
    name: "Fuel Logs",
    component: FuelLogs,
    icon: <FiActivity />,
  },
  {
    path: "/reports",
    name: "Reports",
    component: Reports,
    icon: <FiBarChart2 />,
  },
  { path: "/users", name: "Users", component: Users, icon: <FiUsers /> },


  // 404 catch-all
  { path: "*", name: "NotFound", component: NotFound, icon: <FiFileText /> },
];
