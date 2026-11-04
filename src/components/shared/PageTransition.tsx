import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [entered, setEntered] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion) {
      setEntered(true);
      return;
    }
    setEntered(false);
    const frame = requestAnimationFrame(() => {
      setEntered(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, prefersReducedMotion]);

  return (
    <div
      className={`page-transition ${entered ? 'is-entered' : 'is-entering'}`}
      data-route={location.pathname}
    >
      {children}
    </div>
  );
};

