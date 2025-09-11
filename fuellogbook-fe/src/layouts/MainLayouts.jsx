import React from "react";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../routes/AppRoutes"; // import your central routes

export default function MainLayout({ children }) {
  const loc = useLocation();

  // only show routes that should appear in nav (skip NotFound, etc.)
  const navRoutes = routes.filter(
    (r) => r.path !== "*" && r.name !== "NotFound"
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <nav className="container mx-auto flex items-center gap-6 p-4">
          {/* Logo */}
          <Link to="/" className="font-bold text-lg">
            FuelLogbook
          </Link>

          {/* Dynamic nav links */}
          {navRoutes.map((r) => (
            <Link
              key={r.path}
              to={r.path}
              className={`${
                loc.pathname === r.path ? "underline font-semibold" : ""
              }`}
            >
              {r.name}
            </Link>
          ))}
        </nav>
      </header>

      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
