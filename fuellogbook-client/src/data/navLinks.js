import { LayoutDashboard, Fuel, Car, FileBarChart, Users } from "lucide-react";

export const navLinks = [
  {
    name: "Home",
    href: "/", // keep as root
  },
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "Pricing",
    href: "#pricing",
  },
  {
    name: "FAQ",
    href: "#faq",
  },
];

export const adminNavLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard, // store component, not JSX
  },
  {
    name: "Fuel Logs",
    href: "/admin/fuel-logs",
    icon: Fuel,
  },
  {
    name: "Vehicles",
    href: "/admin/vehicles",
    icon: Car,
  },
  {
    name: "Report",
    href: "/admin/report",
    icon: FileBarChart,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
];
