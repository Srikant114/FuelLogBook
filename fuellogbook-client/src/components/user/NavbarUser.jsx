import React, { useEffect, useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { FLBLogoLight, FLBLogoDark } from "../../assets/index";
import { navLinks } from "../../data/navLinks";
import ThemeToggle from "../../utils/ThemeToggle";
import { useThemeContext } from "../../context/ThemeContext";

const NavbarUser = () => {
  const { theme } = useThemeContext();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  useEffect(() => {
    if (openMobileMenu) {
      document.body.classList.add("max-md:overflow-hidden");
    } else {
      document.body.classList.remove("max-md:overflow-hidden");
    }
  }, [openMobileMenu]);

  return (
    <nav
      className={`flex items-center justify-between fixed z-50 top-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 py-4 ${
        openMobileMenu ? "" : "backdrop-blur"
      }`}
    >
      <Link href="/">
        <img
          className="h-9 md:h-9.5 w-auto shrink-0"
          width={140}
          height={40}
          priority
          fetchPriority="high"
          src={theme === "light" ? FLBLogoLight : FLBLogoDark}
          alt="logo"
        />
      </Link>

      {/* Desktop Links */}
      <div className="hidden items-center md:gap-8 lg:gap-9 md:flex lg:pl-20">
        {navLinks?.map((link) => (
          <Link
            key={link?.name}
            href={link?.href}
            className="transition hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)]"
          >
            {link?.name}
          </Link>
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
          Sign in
        </button>

        <button
          className="hidden md:block transition px-4 py-2 rounded-md text-white"
          style={{
            backgroundColor: "var(--color-primary)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-primary-dark)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-primary)")
          }
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
          <Link
            key={link?.name}
            href={link?.href}
            className="transition hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)]"
          >
            {link?.name}
          </Link>
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
            (e.currentTarget.style.backgroundColor = "var(--color-primary-dark)")
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
