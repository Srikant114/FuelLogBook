import React from "react";
import { motion } from "framer-motion";
import NavbarUser from "../../components/user/NavbarUser";
import HeroSection from "../../components/user/HeroSection";
import FeaturesSection from "../../components/user/FeaturesSection";
import PricingSection from "../../components/user/PricingSection";
import FAQSection from "../../components/user/FAQSection";
import SalesSection from "../../components/user/SalesSection";
import FooterUser from "../../components/user/FooterUser";
import ScrollToTopButton from "../../utils/ScrollToTopButton";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Home = () => {
  return (
    <>
      {/* Navbar */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <NavbarUser />
      </motion.div>

      {/* Hero Section */}
      <motion.div
        id="home"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <HeroSection />
      </motion.div>

      {/* Features Section */}
      <motion.div
        id="features"
        className="scroll-mt-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <FeaturesSection />
      </motion.div>

      {/* Pricing Section */}
      <motion.div
        id="pricing"
        className="scroll-mt-22"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <PricingSection />
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        id="faq"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <FAQSection />
      </motion.div>

      {/* Sales Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <SalesSection />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0.4 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <FooterUser />
      </motion.div>

      {/* Scroll-to-top button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ScrollToTopButton />
      </motion.div>
    </>
  );
};

export default Home;
