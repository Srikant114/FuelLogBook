import React, { useEffect, useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FLBLogoLight, FLBLogoDark } from "../../assets/index";
import { navLinks } from "../../data/navLinks";
import ThemeToggle from "../../utils/ThemeToggle";
import { useThemeContext } from "../../context/ThemeContext";

const NavbarUser = () => {
  const { theme } = useThemeContext();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (openMobileMenu) {
      document.body.classList.add("max-md:overflow-hidden");
    } else {
      document.body.classList.remove("max-md:overflow-hidden");
    }
  }, [openMobileMenu]);

  // Smooth scroll handler
  const handleScroll = (e, href) => {
    e.preventDefault();

    if (href === "/") {
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href.startsWith("#")) {
      const sectionId = href.replace("#", "");
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href); // fallback for external or other routes
    }

    setOpenMobileMenu(false);
  };

  return (
    <nav
      className={`flex items-center justify-between fixed z-50 top-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 py-4 ${
        openMobileMenu ? "" : "backdrop-blur"
      }`}
    >
      <a href="/" onClick={(e) => handleScroll(e, "/")}>
        <img
          className="h-9 md:h-13 w-auto shrink-0"
          width={140}
          height={40}
          src={theme === "light" ? FLBLogoLight : FLBLogoDark}
          alt="logo"
        />
      </a>

      {/* Desktop Links */}
      <div className="hidden items-center md:gap-8 lg:gap-9 md:flex lg:pl-20">
        {navLinks?.map((link) => (
          <a
            key={link?.name}
            href={link?.href}
            onClick={(e) => handleScroll(e, link?.href)}
            className="transition hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)]"
          >
            {link?.name}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* Desktop Buttons */}
        <button
        
          className="hidden md:block transition px-4 py-2 border rounded-md"
          style={{
            borderColor: "var(--color-primary)",
            color: "var(--color-text)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <Link to="/login">Sign in</Link>
        </button>

        <button
          className="hidden md:block transition px-4 py-2 rounded-md text-white"
          style={{
            backgroundColor: "var(--color-primary)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--color-primary-dark)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-primary)")
          }
          onClick={(e) => handleScroll(e, "#get-started")}
        >
          Get started
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
          className="md:hidden"
        >
          <MenuIcon size={26} className="active:scale-90 transition" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center gap-6 text-lg font-medium backdrop-blur-md md:hidden transition duration-300 ${
          openMobileMenu
            ? "translate-x-0 bg-[var(--color-bg)/60] dark:bg-[var(--color-bg-dark)/40]"
            : "-translate-x-full"
        }`}
      >
        {navLinks?.map((link) => (
          <a
            key={link?.name}
            href={link?.href}
            onClick={(e) => handleScroll(e, link?.href)}
            className="transition hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)]"
          >
            {link?.name}
          </a>
        ))}

        <button
          style={{
            borderColor: "var(--color-primary)",
            color: "var(--color-text)",
            backgroundColor: "var(--color-bg)",
          }}
          className="px-4 py-2 border rounded-md transition"
        >
          Sign in
        </button>

        <button
          className="aspect-square size-10 p-1 items-center justify-center rounded-md flex text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--color-primary-dark)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-primary)")
          }
          onClick={() => setOpenMobileMenu(false)}
        >
          <XIcon />
        </button>
      </div>
    </nav>
  );
};

export default NavbarUser;
