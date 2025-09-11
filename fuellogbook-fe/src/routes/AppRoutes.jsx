import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Vehicles = lazy(() => import("../pages/Vehicles"));
const FuelLogs = lazy(() => import("../pages/FuelLogs"));
const Reports = lazy(() => import("../pages/Reports"));
const Users = lazy(() => import("../pages/Users"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const routes = [
  { path: "/", name: "Dashboard", component: Dashboard },
  { path: "/vehicles", name: "Vehicles", component: Vehicles },
  { path: "/fuel-logs", name: "Fuel Logs", component: FuelLogs },
  { path: "/reports", name: "Reports", component: Reports },
  { path: "/users", name: "Users", component: Users },
  { path: "*", name: "NotFound", component: NotFound },
];