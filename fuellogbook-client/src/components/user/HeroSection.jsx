import React from 'react'
import Marquee from "react-fast-marquee";
import { useThemeContext } from '../../context/ThemeContext'
import { hp, indian, re, shell, tvs } from '../../assets/index'
import { BarChart3, CarFront } from 'lucide-react';

const HeroSection = () => {
  const { theme } = useThemeContext()

  const companiesLogo = [
    { name: "HP", logo: hp },
    { name: "IndianOil", logo: indian },
    { name: "Royal Enfield", logo: re },
    { name: "Shell", logo: shell },
    { name: "TVS", logo: tvs },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-16 bg-[url('/light-hero-gradient.svg')] dark:bg-[url('/dark-hero-gradient.svg')] bg-no-repeat bg-cover">

      {/* Small community banner */}
      <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 pr-4 mt-28 sm:mt-32 md:mt-36 rounded-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-600/20">
        <div className='flex items-center -space-x-3'>
          <img className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="user1" />
          <img className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="user2" />
          <img className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop" alt="user3" />
        </div>
        <p className='text-xs sm:text-sm text-theme-light dark:text-theme-light'>Track fuel & mileage with us</p>
      </div>

      {/* Hero Heading */}
      <h1 className="mt-4 text-4xl sm:text-5xl md:text-[64px] font-semibold max-w-full sm:max-w-xl md:max-w-2xl leading-snug sm:leading-tight md:leading-[1.2]">
        Simplify your{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: theme === "dark" ? "var(--gradient-dark)" : "var(--gradient-primary)" }}
        >
          fuel tracking
        </span>
      </h1>

      {/* Paragraph */}
      <p className="text-sm sm:text-base md:text-lg text-theme-light dark:text-theme-light max-w-full sm:max-w-lg mt-2 px-2 sm:px-0">
        Log your fuel, calculate mileage, and get detailed reports to save money and drive smarter.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button className="flex items-center justify-center gap-2 w-full sm:w-auto bg-primary hover:bg-primary-dark text-white rounded-md px-4 sm:px-6 py-3 sm:h-11 transition">
          <CarFront strokeWidth={1.5} />
          <span>Add Fuel Log</span>
        </button>

        <button className="flex items-center justify-center gap-2 w-full sm:w-auto border border-primary text-theme dark:text-white rounded-md px-4 sm:px-6 py-3 sm:h-11 transition">
          <BarChart3 strokeWidth={1.5} />
          <span>View Reports</span>
        </button>
      </div>

      {/* Brands/Logos */}
      <h3 className="text-sm sm:text-base text-center text-theme-light mt-12 sm:mt-16 pb-10 sm:pb-14 font-medium">
        Trusted by leading brands —
      </h3>

      <Marquee
        className="max-w-full sm:max-w-5xl mx-auto"
        gradient={true}
        speed={25}
        gradientColor={theme === "dark" ? "#000" : "#fff"}
      >
        <div className="flex items-center justify-center">
          {[...companiesLogo, ...companiesLogo].map((company, index) => (
            <img key={index} className="mx-6 sm:mx-11 w-16 sm:w-24 h-auto" src={company.logo} alt={company.name} />
          ))}
        </div>
      </Marquee>
    </div>
  )
}

export default HeroSection;
