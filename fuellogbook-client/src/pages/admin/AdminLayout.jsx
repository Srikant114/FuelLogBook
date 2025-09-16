import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "../../components/admin/NavbarAdmin";
import SidebarAdmin from "../../components/admin/SidebarAdmin";

const AdminLayout = () => {
  // control sidebar open (mobile) and collapsed (desktop)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // read persisted collapsed preference
    const persisted = localStorage.getItem("admin_sidebar_collapsed");
    if (persisted !== null) setSidebarCollapsed(persisted === "true");
  }, []);

  const toggleSidebarOpen = () => setSidebarOpen((s) => !s);
  const closeSidebar = () => setSidebarOpen(false);

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((s) => {
      const next = !s;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    // Use CSS variables for background/text so theme is respected
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <NavbarAdmin
        onHamburgerClick={toggleSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebarCollapsed={toggleSidebarCollapsed}
      />

      <div className="flex flex-1 relative">
        <SidebarAdmin
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Overlay for mobile when sidebar open */}
        {sidebarOpen && (
          <button
            aria-hidden="true"
            onClick={closeSidebar}
            className="fixed inset-0 z-20 bg-black/40 md:hidden"
          />
        )}

        <main
          className="flex-1 p-4 md:p-6 overflow-y-auto"
          // keep main readable with theme variables
          style={{
            backgroundColor: "transparent",
            color: "var(--color-text)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
