import React from "react";
import { FiMenu, FiSun, FiMoon, FiBell } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { routes } from "../routes/AppRoutes"; // central route config

export default function Topbar({ onMenuClick, darkMode, onToggleTheme }) {
  const loc = useLocation();

  // find matching route by path
  const currentRoute = routes.find((r) => r.path === loc.pathname);
  const pageTitle = currentRoute?.name || "Dashboard";

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[var(--panel)] shadow-md">
      {/* Left: menu toggle + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-[var(--hover-bg)] lg:hidden"
          aria-label="Open menu"
        >
          <FiMenu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-[var(--text)] tracking-wide">
          {pageTitle}
        </h1>
      </div>

      {/* Right: quick stats, notifications, theme toggle */}
      <div className="flex items-center gap-3">
        {/* Quick Stats (hidden on xs) */}
        <div className="hidden sm:flex items-center gap-4 px-3 py-2 rounded-lg bg-[var(--panel)] shadow-sm">
          <div className="text-sm">
            <div className="text-xs text-[var(--muted)]">This month</div>
            <div className="text-sm font-semibold">1,024 logs</div>
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />

          <div className="text-sm">
            <div className="text-xs text-[var(--muted)]">Vehicles</div>
            <div className="text-sm font-semibold">124</div>
          </div>
        </div>

        {/* Notifications */}
        <button
          className="p-2 rounded-lg hover:bg-[var(--hover-bg)]"
          aria-label="Notifications"
          title="Notifications"
        >
          <FiBell size={18} className="text-[var(--text)]" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {darkMode ? (
            <FiSun size={18} className="text-[var(--text)]" />
          ) : (
            <FiMoon size={18} className="text-[var(--text)]" />
          )}
        </button>
      </div>
    </header>
  );
}
