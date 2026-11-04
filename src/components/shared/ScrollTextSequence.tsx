import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ScrollTextSequenceProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

/**
 * Restrained progressive text reveal (`design.md` Section 2.3 & 6.5):
 * Copy stays permanently in the DOM for screen readers and search engines,
 * with a gentle 14px / 380ms settle when scrolled into view.
 */
export const ScrollTextSequence: React.FC<ScrollTextSequenceProps> = ({
  children,
  className = '',
  delayMs = 0,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState<boolean>(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className={`scroll-reveal-block ${revealed ? 'is-visible' : ''} ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
};

