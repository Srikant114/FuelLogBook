// src/components/NavbarAdmin.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { Sun, Moon, ChevronDown, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { FLBLogoDark, FLBLogoLight } from "../../assets";
import ThemeToggle from "../../utils/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

const NavbarAdmin = ({ onHamburgerClick, sidebarCollapsed, toggleSidebarCollapsed }) => {
  const { theme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // close user menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleScroll = (e, path = "/") => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // perform logout: call AuthContext logout and redirect to home
  const handleLogout = () => {
    setOpenMenu(false);
    logout({ redirect: false }); // clear auth
    navigate("/"); // go to public home
  };

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 border-b py-3 transition-all z-30"
      style={{
        backgroundColor: "var(--color-bg)",
        borderBottomColor: "rgba(148,163,184,0.12)",
        color: "var(--color-text)",
      }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onHamburgerClick} className="p-2 rounded-md md:hidden" aria-label="Toggle menu" title="Open sidebar" style={{ color: "var(--color-text)" }}>
          <Menu size={20} />
        </button>

        <button onClick={toggleSidebarCollapsed} className="hidden md:inline-flex items-center gap-1 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800" title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} aria-pressed={sidebarCollapsed} style={{ color: "var(--color-text)" }}>
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <a href="/" onClick={(e) => handleScroll(e, "/")} className="flex items-center gap-3">
          <img className="h-8 md:h-10 w-auto shrink-0" width={140} height={40} src={theme === "light" ? FLBLogoLight : FLBLogoDark} alt="logo" style={{ filter: "none" }} />
        </a>
      </div>

      <div className="flex items-center gap-4 text-sm" style={{ color: "var(--color-text)" }}>
        <div>
          <ThemeToggle />
        </div>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setOpenMenu((o) => !o)} className="flex items-center gap-2 px-2 py-1 rounded-md" aria-haspopup="true" aria-expanded={openMenu} aria-label="Open user menu" style={{ color: "var(--color-text)" }}>
            <img className="w-8 h-8 rounded-full border object-cover" src={user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=ddd&color=333`} alt="User Avatar" style={{ borderColor: "rgba(99,102,241,0.08)" }} />
            <span className="hidden sm:inline">{user?.name || user?.username || "User"}</span>
            <ChevronDown size={16} />
          </button>

          {openMenu && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-40 py-1"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid rgba(148,163,184,0.08)",
                color: "var(--color-text)",
              }}
            >
              <Link to="/admin/account" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800" onClick={() => setOpenMenu(false)}>
                My Account
              </Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-800">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarAdmin;
