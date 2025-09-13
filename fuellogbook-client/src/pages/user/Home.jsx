import React from 'react'
import NavbarUser from '../../components/user/NavbarUser'
import HeroSection from '../../components/user/HeroSection'
import FeaturesSection from '../../components/user/FeaturesSection'
import PricingSection from '../../components/user/PricingSection'
import FAQSection from '../../components/user/FAQSection'
import SalesSection from '../../components/user/SalesSection'

const Home = () => {
  return (
    <>
        <NavbarUser/>
        <HeroSection/>
        <FeaturesSection/>
        <PricingSection/>
        <FAQSection/>
        <SalesSection/>
    </>
  )
}

export default Home