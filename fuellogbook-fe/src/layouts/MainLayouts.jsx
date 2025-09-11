import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function MainLayout({ children }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <nav className="container mx-auto flex items-center gap-4 p-4">
          <Link to="/" className="font-bold text-lg">FuelLogbook</Link>
          <Link to="/dashboard" className={loc.pathname === "/dashboard" ? "underline" : ""}>Dashboard</Link>
          <Link to="/about" className="ml-auto">About</Link>
        </nav>
      </header>

      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
