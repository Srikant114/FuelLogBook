import React from "react";
import { featuresData } from "../../data/featuresData";

const FeaturesSection = () => {
  return (
    <>
      <p className="text-center font-medium text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mt-28 px-10 py-2 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 w-max mx-auto">
        FEATURES
      </p>

      <h3 className="text-3xl font-semibold text-center mx-auto mt-4">
        Built for builders
      </h3>

      <p className="text-slate-600 dark:text-slate-300 text-center mt-2 max-w-lg mx-auto">
        Components, patterns and pages — everything you need to ship.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-10 px-6 md:px-16 lg:px-24 xl:px-32">
        {featuresData?.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/20 max-w-80 md:max-w-66"
          >
            <feature.icon
              className="size-8 mt-4 text-[var(--color-primary)]"
              strokeWidth={1.3}
            />
            <h3 className="text-base font-medium">{feature.title}</h3>
            <p className="text-slate-400 line-clamp-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeaturesSection;
