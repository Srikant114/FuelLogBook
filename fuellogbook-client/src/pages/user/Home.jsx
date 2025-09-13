import React from "react";
import NavbarUser from "../../components/user/NavbarUser";
import HeroSection from "../../components/user/HeroSection";
import FeaturesSection from "../../components/user/FeaturesSection";
import PricingSection from "../../components/user/PricingSection";
import FAQSection from "../../components/user/FAQSection";
import SalesSection from "../../components/user/SalesSection";
import FooterUser from "../../components/user/FooterUser";
import ScrollToTopButton from "../../utils/ScrollToTopButton";

const Home = () => {
  return (
    <>
      <NavbarUser />
      <div id="home">
        <HeroSection />
      </div>
      <div id="features" className="scroll-mt-24">
        <FeaturesSection />
      </div>
      <div id="pricing" className="scroll-mt-21">
        <PricingSection />
      </div>
      <div id="faq">
        <FAQSection />
      </div>
      <SalesSection />
      <FooterUser />
       <ScrollToTopButton />
    </>
  );
};

export default Home;
