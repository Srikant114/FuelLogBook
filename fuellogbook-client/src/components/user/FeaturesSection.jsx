import React from "react";
import { featuresData } from "../../data/featuresData";
import TitleUser from "../common/TitleUser";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6 },
    }),
  };

  return (
    <>
      <TitleUser
        heading="FEATURES"
        title="Built for Smart Drivers"
        description="Log fuel, calculate mileage, and generate insightful reports for all your vehicles."
      />

      {/* Desktop Grid */}
      <div className="hidden md:flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-10 px-6 md:px-16 lg:px-24 xl:px-32">
        {featuresData?.map((feature, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="p-6 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/20 max-w-80 md:max-w-66"
          >
            <feature.icon
              className="size-8 mt-4 text-[var(--color-primary)]"
              strokeWidth={1.3}
            />
            <h3 className="text-base font-medium">{feature.title}</h3>
            <p className="text-slate-400 line-clamp-2">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden mt-10 px-4">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1} // Show one card at a time
          centeredSlides={true} // Center the active card
          loop={true} // Infinite loop
          autoplay={{
            delay: 5000, // 5 seconds
            disableOnInteraction: false, // Continue autoplay after swipe
          }}
        >
          {featuresData?.map((feature, index) => (
            <SwiperSlide key={index}>
              <motion.div
                custom={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                viewport={{ once: true, amount: 0.3 }}
                className="p-6 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/20"
              >
                <feature.icon
                  className="size-8 mt-4 text-[var(--color-primary)]"
                  strokeWidth={1.3}
                />
                <h3 className="text-base font-medium">{feature.title}</h3>
                <p className="text-slate-400 line-clamp-2">{feature.description}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default FeaturesSection;
