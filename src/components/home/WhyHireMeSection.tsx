import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SITE_COPY } from '../../data/copy';
import { AssetStage } from '../shared/AssetStage';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface DrumItemData {
  id: number;
  text: string;
  isClosing: boolean;
}

const WHY_HIRE_DRUM_ITEMS: DrumItemData[] = [
  {
    id: 0,
    text: SITE_COPY.home.whyHireMe.paragraphs[0],
    isClosing: false,
  },
  {
    id: 1,
    text: SITE_COPY.home.whyHireMe.paragraphs[1],
    isClosing: false,
  },
  {
    id: 2,
    text: SITE_COPY.home.whyHireMe.paragraphs[2],
    isClosing: false,
  },
  {
    id: 3,
    text: SITE_COPY.home.whyHireMe.closingBold,
    isClosing: true,
  },
];

export const WhyHireMeSection: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pinnedStageRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Map raw progress [0, 1] to drum step [0, items.length - 1] with an end hold zone
  const progressToStep = useCallback((p: number, numItems: number): number => {
    const maxStep = numItems - 1;
    const startHold = 0.03;
    const endHold = 0.16; // 16% scroll runway hold so the closing text stays firmly stopped in line

    if (p <= startHold) return 0;
    if (p >= 1 - endHold) return maxStep;

    const t = (p - startHold) / (1 - startHold - endHold);
    return t * maxStep;
  }, []);

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

    // Calculate center target for each item taking track.offsetTop into account
    const targetY: number[] = items.map((item) => {
      if (!item) return 0;
      const itemCenter = track.offsetTop + item.offsetTop + item.offsetHeight / 2;
      return focusLine - itemCenter;
    });

    // Interpolate track Y position smoothly across the scroll runway with end hold
    const step = progressToStep(p, items.length);
    const lowerIdx = Math.floor(step);
    const upperIdx = Math.min(items.length - 1, lowerIdx + 1);
    const t = step - lowerIdx;
    const currentTrackY = targetY[lowerIdx] + (targetY[upperIdx] - targetY[lowerIdx]) * t;

    track.style.transform = `translate3d(0, ${currentTrackY.toFixed(1)}px, 0)`;

    // Apply distance-from-focus styling to each item
    items.forEach((item) => {
      if (!item) return;
      const itemCenterInViewport = track.offsetTop + item.offsetTop + item.offsetHeight / 2 + currentTrackY;
      const distFromFocus = Math.abs(itemCenterInViewport - focusLine);
      const normalizedDist = distFromFocus / (vHeight * 0.45);

      // In-focus item = 1.0 opacity, deep bold ink (#0c0c0a)
      // Out-of-focus items = pale, light muted ink (~0.20 - 0.30 opacity)
      const opacity = Math.max(0.18, 1.0 - Math.pow(Math.min(1, normalizedDist), 0.75) * 0.8);
      const scale = Math.max(0.93, 1.02 - normalizedDist * 0.08);
      const weight = Math.round(Math.max(400, 700 - normalizedDist * 300));

      item.style.opacity = opacity.toFixed(3);
      item.style.transform = `scale(${scale.toFixed(3)})`;
      item.style.fontWeight = `${weight}`;
      item.style.fontVariationSettings = `'wght' ${weight}`;

      const textEl = item.querySelector<HTMLElement>('.why-hire-drum-text');
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
  }, [progressToStep]);

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
        id="why-hire-me"
        aria-labelledby="why-hire-me-heading"
        className="editorial-section why-hire-section why-hire-section--reduced-motion"
      >
        <div className="editorial-shell why-hire-shell">
          <div className="why-hire-lead">
            <h2 id="why-hire-me-heading" className="display-h2 why-hire-heading">
              <span className="why-hire-heading-line">
                {SITE_COPY.home.whyHireMe.headingLines[0]}
              </span>
              <span className="why-hire-heading-line">
                {SITE_COPY.home.whyHireMe.headingLines[1]}
              </span>
            </h2>
          </div>

          <div className="why-hire-body-grid">
            <div className="why-hire-prose">
              {SITE_COPY.home.whyHireMe.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="body-editorial why-hire-body-statement">
                  {paragraph}
                </p>
              ))}
              <p className="why-hire-closing-statement">
                <strong>{SITE_COPY.home.whyHireMe.closingBold}</strong>
              </p>
            </div>

            <div className="why-hire-visual">
              <AssetStage
                assetId="A12"
                proxyVariant="why-hire-workspace"
                className="why-hire-stage-figure"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="why-hire-me"
      aria-labelledby="why-hire-me-heading"
      ref={scrollContainerRef}
      className="why-hire-scroll-container why-hire-section"
    >
      <div ref={pinnedStageRef} className="why-hire-pinned-stage">
        <div className="editorial-shell why-hire-shell">
          <div className="why-hire-lead">
            <h2 id="why-hire-me-heading" ref={headingRef} className="display-h2 why-hire-heading">
              <span className="why-hire-heading-line">
                {SITE_COPY.home.whyHireMe.headingLines[0]}
              </span>
              <span className="why-hire-heading-line">
                {SITE_COPY.home.whyHireMe.headingLines[1]}
              </span>
            </h2>
          </div>

          <div className="why-hire-body-grid">
            {/* Left Column: Kinetic Vertical Drum / Roller */}
            <div className="why-hire-drum-col">
              <div ref={viewportRef} className="why-hire-drum-viewport">
                <div ref={trackRef} className="why-hire-drum-track">
                  {WHY_HIRE_DRUM_ITEMS.map((item, idx) => (
                    <div
                      key={idx}
                      ref={(el) => {
                        itemRefs.current[idx] = el;
                      }}
                      className={`why-hire-drum-item ${
                        item.isClosing ? 'why-hire-drum-item--closing' : ''
                      }`}
                    >
                      <p className="why-hire-drum-text">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Calm Workspace Visual Asset */}
            <div className="why-hire-visual-col">
              <AssetStage
                assetId="A12"
                proxyVariant="why-hire-workspace"
                className="why-hire-stage-figure"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
