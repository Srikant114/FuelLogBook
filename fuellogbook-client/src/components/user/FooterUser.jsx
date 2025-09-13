import React from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { navLinks } from "../../data/navLinks";
import {
  FLBFooterTextDark,
  FLBFooterTextLight,
  FLBLogoDark,
  FLBLogoLight,
} from "../../assets";

const FooterUser = () => {
  const { theme } = useThemeContext();
  const currentYear = new Date().getFullYear();

  // Smooth scroll handler
  const handleScroll = (e, href) => {
    e.preventDefault();

    if (href === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href.startsWith("#")) {
      const sectionId = href.replace("#", "");
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 mt-20 w-full dark:text-slate-50">
      <img
        className="absolute max-w-4xl w-full h-auto -mt-5 max-md:px-4 right-0 md:right-14 lg:right-24 xl:right-72 top-0 pointer-events-none"
        src={theme === "dark" ? FLBFooterTextDark : FLBFooterTextLight}
        alt="landing"
        width={930}
        height={340}
        fetchPriority="high"
      />

      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)] pb-6 backdrop-blur-[6px] py-8">
        <div className="md:max-w-114">
          {/* Logo → scroll to top */}
          <a href="/" onClick={(e) => handleScroll(e, "/")}>
            <img
              className="h-9 md:h-20 w-auto shrink-0"
              src={theme === "dark" ? FLBLogoDark : FLBLogoLight}
              alt="Logo"
              width={140}
              height={40}
            />
          </a>
          <p className="mt-6">
            FuelLogBook helps you track your fuel, calculate mileage, and
            generate detailed reports for smarter driving and vehicle
            management.
          </p>
        </div>

        <div className="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 className="font-semibold mb-5">Quick Links</h2>
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className="hover:text-[var(--color-primary)] transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Get in touch</h2>
            <div className="space-y-2">
              <p>+91-98765-43210</p>
              <p>support@fuellogbook.com</p>
            </div>
          </div>
        </div>
      </div>

      <p className="pt-4 text-center pb-5">
        Copyright {currentYear} ©
        <a
          href="/"
          onClick={(e) => handleScroll(e, "/")}
          className="text-[var(--color-primary)] ms-2"
        >
          FuelLogBook
        </a>
        . All Rights Reserved.
      </p>
    </footer>
  );
};

export default FooterUser;
