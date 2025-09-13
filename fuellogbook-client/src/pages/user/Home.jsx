import React from 'react'
import NavbarUser from '../../components/user/NavbarUser'
import HeroSection from '../../components/user/HeroSection'
import FeaturesSection from '../../components/user/FeaturesSection'
import PricingSection from '../../components/user/PricingSection'

const Home = () => {
  return (
    <>
        <NavbarUser/>
        <HeroSection/>
        <FeaturesSection/>
        <PricingSection/>
    </>
  )
}

export default Home