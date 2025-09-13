import React from "react";
import TitleUser from "../common/TitleUser";
import { motion } from "framer-motion";

const SalesSection = () => {
  return (
    <div className="flex flex-col items-center text-center justify-center mt-20 px-4 md:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <TitleUser
          heading="Get Started"
          title="Track Your Fuel & Mileage Smarter"
          description="Join drivers who log their fuel, monitor mileage, and view detailed reports to save money and stay in control of their vehicles."
        />
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row items-center gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition text-white rounded-md px-6 h-11">
          Start free trial
        </button>
        <button className="border border-[var(--color-primary-dark)] transition text-slate-600 dark:text-white rounded-md px-6 h-11">
          Enroll Now
        </button>
      </motion.div>
    </div>
  );
};

export default SalesSection;
