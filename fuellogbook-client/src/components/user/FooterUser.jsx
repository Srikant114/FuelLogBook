import React from "react";
import { useThemeContext } from "../../context/ThemeContext";
import { navLinks } from "../../data/navLinks";
import {
  FLBFooterTextDark,
  FLBFooterTextLight,
  FLBLogoDark,
  FLBLogoLight,
} from "../../assets";
import { motion } from "framer-motion";

const FooterUser = () => {
  const { theme } = useThemeContext();
  const currentYear = new Date().getFullYear();

  const handleScroll = (e, href) => {
    e.preventDefault();
    if (href === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href.startsWith("#")) {
      const sectionId = href.replace("#", "");
      const section = document.getElementById(sectionId);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Framer Motion variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <footer className="relative px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 mt-20 w-full dark:text-slate-50">
      {/* Background Splash */}
      <motion.img
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 0.15, y: 0 }}
        viewport={{ once: true }}
        className="absolute max-w-4xl w-full h-auto -mt-5 max-sm:-mt-10 max-sm:right-1 max-md:px-4 right-0 md:right-14 lg:right-24 xl:right-72 top-0 pointer-events-none"
        src={theme === "dark" ? FLBFooterTextDark : FLBFooterTextLight}
        alt="landing"
        width={930}
        height={340}
        fetchPriority="high"
      />

      {/* Main Footer Content */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)] pb-6 backdrop-blur-[2px] py-8"
      >
        {/* Logo & Description */}
        <div className="md:max-w-114 text-center md:text-left">
          <a href="/" onClick={(e) => handleScroll(e, "/")}>
            <img
              className="h-9 md:h-20 w-auto mx-auto md:mx-0"
              src={theme === "dark" ? FLBLogoDark : FLBLogoLight}
              alt="Logo"
              width={140}
              height={40}
            />
          </a>
          <p className="mt-4 text-sm sm:text-base md:text-base text-slate-600 dark:text-slate-300">
            FuelLogBook helps you track your fuel, calculate mileage, and generate
            detailed reports for smarter driving and vehicle management.
          </p>
        </div>

        {/* Links & Contact */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start md:justify-end gap-10 sm:gap-16 w-full md:w-auto text-center sm:text-left">
          {/* Quick Links */}
          <div>
            <h2 className="font-semibold mb-3 sm:mb-5 text-base sm:text-lg">Quick Links</h2>
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className="hover:text-[var(--color-primary)] transition text-sm sm:text-base"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div className="mt-4 sm:mt-0">
            <h2 className="font-semibold mb-3 sm:mb-5 text-base sm:text-lg">Get in touch</h2>
            <div className="space-y-2 text-sm sm:text-base">
              <p>+91-98765-43210</p>
              <p>support@fuellogbook.com</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Copyright */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="pt-4 text-center pb-5 text-sm sm:text-base text-slate-500 dark:text-slate-400"
      >
        Copyright {currentYear} ©
        <a
          href="/"
          onClick={(e) => handleScroll(e, "/")}
          className="text-[var(--color-primary)] ms-2"
        >
          FuelLogBook
        </a>
        . All Rights Reserved.
      </motion.p>
    </footer>
  );
};

export default FooterUser;
