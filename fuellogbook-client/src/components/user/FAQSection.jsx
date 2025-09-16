import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useThemeContext } from "../../context/ThemeContext";
import TitleUser from "../common/TitleUser";
import { faqsData } from "../../data/faqsData";
import { colorSplash, colorSplashLight } from "../../assets";
import { motion, AnimatePresence } from "framer-motion";

const FAQSection = () => {
  const { theme } = useThemeContext();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="relative max-w-2xl mx-auto flex flex-col items-center justify-center px-4 md:px-0">
      <img
        className="absolute -mb-120 -left-40 -z-10 pointer-events-none"
        src={theme === "dark" ? colorSplash : colorSplashLight}
        alt="color-splash"
        width={1000}
        height={1000}
        priority
        fetchPriority="high"
      />

      <TitleUser
        heading="FAQ's"
        title="Frequently asked questions"
        description="Track fuel expenses, calculate mileage, and generate cost reports — all in one simple dashboard."
      />

      <div className="mt-8 w-full">
        {faqsData.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border-b border-slate-300 dark:border-[var(--color-primary-dark)] py-4 cursor-pointer w-full"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">{faq.question}</h3>
              <ChevronDown
                size={18}
                className={`transition-all duration-500 ease-in-out ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                style={{
                  color:
                    openIndex === index ? "var(--color-primary)" : "inherit",
                }}
              />
            </div>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0 }}
                  animate={{ opacity: 1, maxHeight: 500 }} // pick a safe max height
                  exit={{ opacity: 0, maxHeight: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-slate-600 dark:text-slate-300 pt-4">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
