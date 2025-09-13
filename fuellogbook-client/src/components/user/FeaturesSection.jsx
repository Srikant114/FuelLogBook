import React from "react";
import { featuresData } from "../../data/featuresData";
import TitleUser from "../common/TitleUser";

const FeaturesSection = () => {
  return (
    <>

    <TitleUser heading="FEATURES" title=" Built for Smart Drivers" description="Log fuel, calculate mileage, and generate insightful reports for all your vehicles."/>

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
