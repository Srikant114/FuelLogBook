import { LayoutDashboard, Fuel, Car, FileBarChart, Users, Podcast, Shield, Settings, FileText, BarChart3, Bell, LifeBuoy, CreditCard } from "lucide-react";

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


// export const adminNavLinks = [
//   { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
//   { name: "Fuel Logs", href: "/admin/fuel-logs", icon: Fuel },
//   { name: "Vehicles", href: "/admin/vehicles", icon: Car },
//   { name: "Report", href: "/admin/report", icon: FileBarChart },
//   { name: "Subscriptions", href: "/admin/subscriptions", icon: Podcast },
//   { name: "Users", href: "/admin/users", icon: Users },
//   { name: "Billing", href: "/admin/billing", icon: CreditCard },
//   { name: "Support", href: "/admin/support", icon: LifeBuoy },
//   { name: "Notifications", href: "/admin/notifications", icon: Bell },
//   { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
//   { name: "Content", href: "/admin/content", icon: FileText },
//   { name: "Settings", href: "/admin/settings", icon: Settings },
//   { name: "Audit Logs", href: "/admin/audit-logs", icon: Shield },
// ];