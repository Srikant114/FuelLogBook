import React from "react";
import { SparklesIcon } from "lucide-react";
import { useThemeContext } from "../../context/ThemeContext";
import TitleUser from "../common/TitleUser";
import { pricingData } from "../../data/pricingData";
import { colorSplash, colorSplashLight } from "../../assets";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

const PricingSection = () => {
  const { theme } = useThemeContext();

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  return (
    <div className="relative">
      <img
        className="absolute -mt-20 md:-mt-100 md:left-20 pointer-events-none"
        src={theme === "dark" ? colorSplash : colorSplashLight}
        alt="color-splash"
        width={1000}
        height={1000}
        priority
        fetchPriority="high"
      />

      <TitleUser
        heading="PRICING"
        title="Our Pricing Plans"
        description="Flexible pricing options designed for vehicle owners — log fuel, track mileage, and generate cost reports easily."
      />

      {/* Desktop Grid */}
      <div className="hidden md:flex flex-wrap items-center justify-center gap-6 mt-8">
        {pricingData.map((plan, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className={`p-6 rounded-2xl max-w-75 w-full shadow-[0px_4px_26px] shadow-black/6 ${
              plan.mostPopular
                ? "relative pt-12 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)]"
                : "bg-white/50 dark:bg-gray-800/50 border border-slate-200 dark:border-slate-800"
            }`}
          >
            {plan.mostPopular && (
              <div
                className="flex items-center text-xs gap-1 py-1.5 px-2 absolute top-4 right-4 rounded bg-white font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                <SparklesIcon size={14} />
                <p>Most Popular</p>
              </div>
            )}

            <p className={plan.mostPopular ? "text-white" : ""}>{plan.title}</p>
            <h4
              className={`text-3xl font-semibold mt-1 ${
                plan.mostPopular ? "text-white" : ""
              }`}
            >
              ₹{plan.price}
              <span
                className={`font-normal text-sm ${
                  plan.mostPopular ? "text-white" : "text-slate-300"
                }`}
              >
                /mo
              </span>
            </h4>

            <hr
              className={`my-8 ${
                plan.mostPopular
                  ? "border-gray-300"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            />

            <div
              className={`space-y-2 ${
                plan.mostPopular ? "text-white" : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <feature.icon
                    size={18}
                    className={plan.mostPopular ? "text-white" : "text-[var(--color-primary)]"}
                  />
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>

            <button
              className={`transition w-full py-3 rounded-lg font-medium mt-8 ${
                plan.mostPopular
                  ? "bg-white hover:bg-slate-100 text-slate-800"
                  : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white"
              }`}
            >
              <span>{plan.buttonText}</span>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden mt-10 px-4">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
        >
          {pricingData.map((plan, index) => (
            <SwiperSlide key={index}>
              <motion.div
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className={`p-6 rounded-2xl max-w-full w-full shadow-[0px_4px_26px] shadow-black/6 ${
                  plan.mostPopular
                    ? "relative pt-12 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)]"
                    : "bg-white/50 dark:bg-gray-800/50 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {plan.mostPopular && (
                  <div
                    className="flex items-center text-xs gap-1 py-1.5 px-2 absolute top-4 right-4 rounded bg-white font-medium"
                    style={{ color: "var(--color-primary)" }}
                  >
                    <SparklesIcon size={14} />
                    <p>Most Popular</p>
                  </div>
                )}

                <p className={plan.mostPopular ? "text-white" : ""}>{plan.title}</p>
                <h4
                  className={`text-3xl font-semibold mt-1 ${
                    plan.mostPopular ? "text-white" : ""
                  }`}
                >
                  ₹{plan.price}
                  <span
                    className={`font-normal text-sm ${
                      plan.mostPopular ? "text-white" : "text-slate-300"
                    }`}
                  >
                    /mo
                  </span>
                </h4>

                <hr
                  className={`my-8 ${
                    plan.mostPopular
                      ? "border-gray-300"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                />

                <div
                  className={`space-y-2 ${
                    plan.mostPopular
                      ? "text-white"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <feature.icon
                        size={18}
                        className={plan.mostPopular ? "text-white" : "text-[var(--color-primary)]"}
                      />
                      <span>{feature.name}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`transition w-full py-3 rounded-lg font-medium mt-8 ${
                    plan.mostPopular
                      ? "bg-white hover:bg-slate-100 text-slate-800"
                      : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white"
                  }`}
                >
                  <span>{plan.buttonText}</span>
                </button>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PricingSection;
