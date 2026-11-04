import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SITE_COPY } from '../../data/copy';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface DrumItemData {
  id: number;
  text: string;
  isClosing: boolean;
}

const DRUM_ITEMS: DrumItemData[] = [
  {
    id: 0,
    text: SITE_COPY.home.wispr.paragraphs[0],
    isClosing: false,
  },
  {
    id: 1,
    text: SITE_COPY.home.wispr.paragraphs[1],
    isClosing: false,
  },
  {
    id: 2,
    text: SITE_COPY.home.wispr.paragraphs[2],
    isClosing: false,
  },
  {
    id: 3,
    text: SITE_COPY.home.wispr.closingBold,
    isClosing: true,
  },
];

export const WisprEditorialSection: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pinnedStageRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Update drum rotation and distance-based focus styling
  const updateDrum = useCallback((rawProgress: number) => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const p = Math.max(0, Math.min(1, rawProgress));
    const vHeight = viewport.offsetHeight;
    const focusLine = vHeight / 2;

    const items = itemRefs.current;
    if (!items.length || !items[0]) return;

    // Calculate center target for each item
    const targetY: number[] = items.map((item) => {
      if (!item) return 0;
      const itemCenter = item.offsetTop + item.offsetHeight / 2;
      return focusLine - itemCenter;
    });

    // Interpolate track Y position smoothly across the scroll runway
    const step = p * (items.length - 1);
    const lowerIdx = Math.floor(step);
    const upperIdx = Math.min(items.length - 1, lowerIdx + 1);
    const t = step - lowerIdx;
    const currentTrackY = targetY[lowerIdx] + (targetY[upperIdx] - targetY[lowerIdx]) * t;

    track.style.transform = `translate3d(0, ${currentTrackY.toFixed(1)}px, 0)`;

    // Apply distance-from-focus styling to each item (Ref: kinetic drum ticker)
    items.forEach((item) => {
      if (!item) return;
      const itemCenterInViewport = item.offsetTop + item.offsetHeight / 2 + currentTrackY;
      const distFromFocus = Math.abs(itemCenterInViewport - focusLine);
      const normalizedDist = distFromFocus / (vHeight * 0.45);

      // In-focus item = 1.0 opacity, deep bold ink (#0c0c0a)
      // Out-of-focus items = pale, light muted ink (~0.22 - 0.32 opacity) matching reference
      const opacity = Math.max(0.18, 1.0 - Math.pow(Math.min(1, normalizedDist), 0.75) * 0.8);
      const scale = Math.max(0.93, 1.02 - normalizedDist * 0.08);
      const weight = Math.round(Math.max(450, 720 - normalizedDist * 270));

      item.style.opacity = opacity.toFixed(3);
      item.style.transform = `scale(${scale.toFixed(3)})`;
      item.style.fontWeight = `${weight}`;
      item.style.fontVariationSettings = `'wght' ${weight}`;

      const textEl = item.querySelector<HTMLElement>('.wispr-drum-text');
      if (textEl) {
        if (normalizedDist < 0.2) {
          textEl.style.color = '#0c0c0a';
          textEl.style.textShadow = '0 1px 1px rgba(255, 255, 255, 0.7)';
        } else {
          textEl.style.color = 'var(--ink)';
          textEl.style.textShadow = 'none';
        }
      }
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !scrollContainerRef.current) return;

    let trigger: ScrollTrigger;
    trigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.15,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        updateDrum(self.progress);
      },
      onRefresh: (self) => {
        updateDrum(self.progress);
      },
    });

    // Initial render
    requestAnimationFrame(() => {
      updateDrum(0);
    });

    const handleResize = () => {
      updateDrum(trigger.progress);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      trigger.kill();
    };
  }, [prefersReducedMotion, updateDrum]);

  if (prefersReducedMotion) {
    return (
      <section
        id="why-wispr-flow"
        aria-labelledby="wispr-heading"
        className="editorial-section wispr-section wispr-section--reduced-motion"
      >
        <div className="editorial-shell">
          <div className="wispr-layout">
            <div className="wispr-left">
              <span className="wispr-eyebrow">02. WHY WISPR FLOW</span>
              <h2 id="wispr-heading" className="display-h2 wispr-heading">
                {SITE_COPY.home.wispr.heading}
              </h2>
            </div>
            <div className="wispr-right">
              <div className="wispr-prose">
                {SITE_COPY.home.wispr.paragraphs.map((paragraph, idx) => (
                  <p key={idx} className="wispr-body-statement">
                    {paragraph}
                  </p>
                ))}
                <p className="wispr-closing-statement">
                  <strong>{SITE_COPY.home.wispr.closingBold}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="why-wispr-flow"
      aria-labelledby="wispr-heading"
      ref={scrollContainerRef}
      className="wispr-scroll-container wispr-section"
    >
      <div ref={pinnedStageRef} className="wispr-pinned-stage">
        <div className="editorial-shell wispr-shell">
          <div className="wispr-layout">
            {/* Left Column: Pinned Eyebrow & Display Heading */}
            <div className="wispr-left">
              <div className="wispr-left-anchor">
                <span className="wispr-eyebrow">02. WHY WISPR FLOW</span>
                <h2 id="wispr-heading" className="display-h2 wispr-heading">
                  {SITE_COPY.home.wispr.heading}
                </h2>
              </div>
            </div>

            {/* Right Column: Kinetic Vertical Drum / Roller (Ref: Jump Cities Drum) */}
            <div className="wispr-right">
              <div ref={viewportRef} className="wispr-drum-viewport">
                <div ref={trackRef} className="wispr-drum-track">
                  {DRUM_ITEMS.map((item, idx) => (
                    <div
                      key={idx}
                      ref={(el) => {
                        itemRefs.current[idx] = el;
                      }}
                      className={`wispr-drum-item ${
                        item.isClosing ? 'wispr-drum-item--closing' : ''
                      }`}
                    >
                      <p className="wispr-drum-text">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
