// src/layouts/MainLayout.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "../components/Auth/AuthModal";

export default function MainLayout({ children, pageTitle }) {
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const { user, loading } = useAuth();

  const toggleCollapse = () => setCollapsed((s) => !s);
  const toggleMobile = () => setMobileOpen((s) => !s);
  const toggleTheme = () => setDarkMode((s) => !s);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="flex h-screen">
      {/* Sidebar: on mobile, slide-in; on desktop it's fixed width */}
      <div className={`hidden lg:block ${collapsed ? "w-16" : "w-64"}`}>
        <Sidebar collapsed={collapsed} onCollapseToggle={toggleCollapse} />
      </div>

      {/* Mobile sidebar overlay */}
      <div className={`lg:hidden ${mobileOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={toggleMobile} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50">
            <Sidebar collapsed={false} onCollapseToggle={toggleMobile} />
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          onMenuClick={toggleMobile}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          pageTitle={pageTitle}
        />
        <main className="flex-1 overflow-auto bg-[var(--bg)]">
          <div className="max-w-7xl mx-auto p-6">{children}</div>
        </main>
      </div>

      {/* Show auth modal if not authenticated */}
      {!loading && !user && <AuthModal open={true} />}
    </div>
  );
}
