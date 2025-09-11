import { lazy } from "react";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import About from "../pages/About";
import NotFound from "../pages/NotFound";

export const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/dashboard", component: Dashboard, name: "Dashboard" },
  { path: "/about", component: About, name: "About" },
  { path: "*", component: NotFound, name: "NotFound" },
];
