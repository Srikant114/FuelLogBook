import { LayoutDashboard, Fuel, Car, FileBarChart, Users, Podcast } from "lucide-react";

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
    name:"Subscriptions",
    href:"/admin/subscriptions",
    icon: Podcast,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
];
