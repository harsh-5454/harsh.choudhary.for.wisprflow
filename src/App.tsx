import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { SiteHeader } from './components/shared/SiteHeader';
import { PageTransition } from './components/shared/PageTransition';
import { SiteFooter } from './components/shared/SiteFooter';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <SiteHeader />
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
      <SiteFooter />
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
};

