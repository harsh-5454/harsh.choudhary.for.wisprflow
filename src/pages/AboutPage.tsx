import React, { useEffect } from 'react';
import { AboutIntro } from '../components/about/AboutIntro';
import { CareerJourney } from '../components/about/CareerJourney';
import { ResumeContact } from '../components/about/ResumeContact';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About — Harsh Choudhary';
  }, []);

  return (
    <main id="main-content" className="page-about">
      <AboutIntro />
      <CareerJourney />
      <ResumeContact />
    </main>
  );
};

