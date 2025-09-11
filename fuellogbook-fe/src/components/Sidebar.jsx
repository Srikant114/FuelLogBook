// src/layouts/Sidebar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../routes/AppRoutes"; // central routes with icons


function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const onMyAccount = () => {
    setOpen(false);
    // replace with navigation or modal logic
    // e.g. navigate("/account")
    window.alert("My Account clicked");
  };

  const onLogout = () => {
    setOpen(false);
    // replace with your logout logic
    window.alert("Logged out");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="p-1 rounded-md hover:bg-[var(--hover-bg)] focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
        title="More"
      >
        {/* Kebab icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-[var(--muted)]"
        >
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
        </svg>
      </button>

      {/* Dropdown opens upwards (positioned bottom-full) */}
      {open && (
        <div
          className="absolute right-0 bottom-full mb-3 z-50 w-44 origin-bottom-right transform-gpu
                     rounded-lg bg-[var(--panel)] shadow-lg ring-1 ring-black ring-opacity-5
                     overflow-hidden"
          role="menu"
        >
          {/* little arrow pointing to button */}
          <div
            className="absolute right-4 -bottom-2 w-3 h-3 bg-[var(--panel)] transform rotate-45 shadow-sm border-t border-l border-black/5"
            aria-hidden
          />

          <div className="py-2">
            <button
              onClick={onMyAccount}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--hover-bg)]"
              role="menuitem"
            >
              {/* profile icon */}
              <svg
                className="w-4 h-4 text-[var(--muted)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" strokeWidth="1.5" />
                <path d="M6 20c0-2.2 2.7-4 6-4s6 1.8 6 4" strokeWidth="1.5" />
              </svg>
              <span>My Account</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--hover-bg)]"
              role="menuitem"
            >
              {/* logout icon */}
              <svg
                className="w-4 h-4 text-[var(--muted)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="1.5" />
                <path d="M16 17l5-5-5-5" strokeWidth="1.5" />
                <path d="M21 12H9" strokeWidth="1.5" />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed, onCollapseToggle }) {
  const loc = useLocation();

  // Only include routes that we want in the nav (skip wildcard / NotFound)
  const navRoutes = routes.filter((r) => r.path && r.path !== "*" && r.name !== "NotFound");

  return (
    <aside
      className={`flex flex-col h-screen bg-[var(--panel)] transition-width duration-200
        ${collapsed ? "w-16 sidebar-collapsed" : "w-64"}`}
      aria-label="Sidebar"
    >
      {/* Top header */}
      <div className="flex items-center justify-between px-4 py-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg avatar-placeholder flex items-center justify-center shadow-sm"
            title="Logo"
          >
            <div className="w-5 h-5 rounded-full border border-gray-200" />
          </div>

          <div className="ml-1">
            <div className="text-sm font-semibold collapsed-text select-none">Acme Inc.</div>
          </div>
        </div>

        {/* collapse toggle */}
        <button
          onClick={onCollapseToggle}
          className="p-1 rounded-md hover:bg-[var(--hover-bg)] dark:hover:bg-gray-800"
          aria-label="Toggle sidebar"
        >
          <svg
            className={`w-4 h-4 transform transition-transform text-[var(--muted)] ${collapsed ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Separator */}
      <div className="px-4">
        <hr className="border-t border-gray-200 dark:border-gray-700 opacity-25" />
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 overflow-y-auto -mx-1 pt-4">
        <ul className="space-y-1.5">
          {navRoutes.map((r) => {
            const active = loc.pathname === r.path;
            return (
              <li key={r.path} className="relative group">
                <Link
                  to={r.path}
                  className={`relative flex items-center gap-3 py-2 px-3 rounded-lg mx-1 transition-colors duration-150
                    ${active ? "bg-transparent text-[var(--accent)] font-semibold" : "text-[var(--text)] hover:bg-[var(--hover-bg)] hover:text-[var(--hover-text)]"}`}
                >
                  {/* slim active indicator */}
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-md"
                      style={{ background: "var(--accent)" }}
                      aria-hidden
                    />
                  )}

                  <span className="text-lg flex items-center justify-center z-10">{r.icon}</span>
                  <span className="collapsed-text z-10">{r.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User card at bottom (updated) */}
      <div className="px-3 py-4">
        <div className="flex items-center gap-3">
          {/* Avatar with small badge */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
              alt="User avatar"
              className="h-10 w-10 rounded-lg object-cover ring-1 ring-white shadow-sm"
            />
            <div className="absolute -top-2 -right-1 flex items-center justify-center h-5 w-5 bg-[var(--accent)] rounded-full shadow-sm">
              <p className="text-white text-xs leading-none">09</p>
            </div>
          </div>

          {/* Name & email (hidden when collapsed) */}
          <div className="flex-1 min-w-0 ">
            <div className="text-sm font-semibold collapsed-text">Srikant</div>
            <div className="text-xs text-[var(--muted)] collapsed-text">@example.com</div>
          </div>

          {/* Menu (opens upward) */}
          <div className="ml-2">
            <UserMenu />
          </div>
        </div>
      </div>
    </aside>
  );
}
