import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import FeaturedVehicles from '@/components/landing/FeaturedVehicles';
import HowItWorks from '@/components/landing/HowItWorks';
import Stats from '@/components/landing/Stats';
import CTA from '@/components/landing/CTA';

/**
 * The main landing page for the application, designed to attract and inform
 * new, unauthenticated users. It's composed of several marketing sections.
 */
const LandingPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <Hero />
      <Stats />
      <Features />
      <FeaturedVehicles />
      <HowItWorks />
      <CTA />
    </div>
  );
};

export default LandingPage;
