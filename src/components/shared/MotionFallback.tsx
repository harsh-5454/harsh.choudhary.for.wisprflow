import React from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface MotionFallbackProps {
  reducedFallback: React.ReactNode;
  children: React.ReactNode;
}

export const MotionFallback: React.FC<MotionFallbackProps> = ({
  reducedFallback,
  children,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  return <>{prefersReducedMotion ? reducedFallback : children}</>;
};

