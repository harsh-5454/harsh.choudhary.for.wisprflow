import React, { useEffect } from 'react';
import { HeroScene } from '../components/home/HeroScene';
import { WisprEditorialSection } from '../components/home/WisprEditorialSection';
import { StrengthsStory } from '../components/home/StrengthsStory';
import { WhyHireMeSection } from '../components/home/WhyHireMeSection';
import { BeyondTheScreen } from '../components/home/BeyondTheScreen';
import { AboutBridge } from '../components/home/AboutBridge';

export const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Harsh Choudhary';
  }, []);

  return (
    <main id="main-content" className="page-home">
      <HeroScene />
      <WisprEditorialSection />
      <StrengthsStory />
      <WhyHireMeSection />
      <BeyondTheScreen />
      <AboutBridge />
    </main>
  );
};

