import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { adminNavLinks } from "../../data/navLinks";

const SidebarAdmin = ({ isOpen, onClose, collapsed, setCollapsed }) => {
  // handle lock scroll when mobile sidebar open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // CSS for container uses variables for background/text
  const containerBaseStyle = {
    backgroundColor: "var(--color-bg)",
    color: "var(--color-text)",
    borderRightColor: "rgba(148,163,184,0.06)",
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col transition-all duration-200 ease-in-out
          ${collapsed ? "w-16" : "w-64"} shrink-0 border-r`}
        style={containerBaseStyle}
        aria-hidden={false}
      >
        <div className="h-full pt-4 flex flex-col">
          <nav className="flex-1 overflow-y-auto">
            {adminNavLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={index}
                  to={item.href}
                  end={item.href === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 px-3 transition-colors rounded-r-md mx-2 my-1
                    ${isActive ? "text-primary-active" : "hover:bg-gray-100 dark:hover:bg-slate-800"}`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? {
                          borderRight: "4px solid var(--color-primary)",
                          color: "var(--color-primary)",
                          backgroundColor: "rgba(146,63,239,0.05)",
                        }
                      : { color: "var(--color-text)" }
                  }
                >
                  <div className="flex items-center justify-center" style={{ width: 28 }}>
                    <Icon size={18} />
                  </div>
                  <p className={`md:block ${collapsed ? "hidden" : "block"} truncate`}>{item.name}</p>
                </NavLink>
              );
            })}
          </nav>

          {/* footer area */}
          {/* <div className="p-3 border-t mt-2" style={{ borderTopColor: "rgba(148,163,184,0.06)" }}>
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="w-full text-left px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <span className="grow text-sm">{collapsed ? ">" : "<--"}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-70"
                style={{ color: "var(--color-text)" }}
              >
                <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
              </svg>
            </button>
          </div> */}
        </div>
      </aside>

      {/* Mobile sidebar (slide-in) */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform md:hidden transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          ...containerBaseStyle,
          boxShadow: "0 6px 18px rgba(2,6,23,0.2)",
        }}
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col pt-4">
          <div className="flex items-center justify-between px-3">
            <div className="text-base font-semibold">Menu</div>
            <button onClick={onClose} aria-label="Close menu" className="p-2 rounded-md">
              {/* X icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="mt-3 flex-1 overflow-y-auto px-1">
            {adminNavLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={index}
                  to={item.href}
                  end={item.href === "/admin"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 px-4 transition-colors rounded-md my-1 ${
                      isActive ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? { borderLeft: "4px solid var(--color-primary)", color: "var(--color-primary)" }
                      : { color: "var(--color-text)" }
                  }
                >
                  <Icon size={18} />
                  <p className="truncate">{item.name}</p>
                </NavLink>
              );
            })}
          </nav>

          {/* <div className="p-3 border-t" style={{ borderTopColor: "rgba(148,163,184,0.06)" }}>
            <button
              onClick={() => {
                // collapse doesn't apply on mobile, but persist preference
                setCollapsed((c) => {
                  localStorage.setItem("admin_sidebar_collapsed", String(!c));
                  return !c;
                });
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
            >
            </button>
          </div> */}
        </div>
      </aside>
    </>
  );
};

export default SidebarAdmin;
