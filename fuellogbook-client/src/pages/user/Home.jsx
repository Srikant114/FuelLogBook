import React from 'react'
import NavbarUser from '../../components/user/NavbarUser'
import HeroSection from '../../components/user/HeroSection'
import FeaturesSection from '../../components/user/FeaturesSection'
import PricingSection from '../../components/user/PricingSection'
import FAQSection from '../../components/user/FAQSection'

const Home = () => {
  return (
    <>
        <NavbarUser/>
        <HeroSection/>
        <FeaturesSection/>
        <PricingSection/>
        <FAQSection/>
    </>
  )
}

export default Home