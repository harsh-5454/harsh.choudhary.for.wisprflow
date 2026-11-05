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
  ...SITE_COPY.home.wispr.paragraphs.map((text, idx) => ({
    id: idx,
    text,
    isClosing: false,
  })),
  {
    id: SITE_COPY.home.wispr.paragraphs.length,
    text: SITE_COPY.home.wispr.closingBold,
    isClosing: true,
  },
];

export const WisprEditorialSection: React.FC = () => {
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
    const heading = headingRef.current;
    if (!track || !viewport) return;

    const p = Math.max(0, Math.min(1, rawProgress));
    const vHeight = viewport.offsetHeight;

    // Dynamically calculate the exact center line of the section heading
    // On desktop (side-by-side layout), align exactly with the vertical center of the section header
    // On mobile (stacked layout), focus on the middle of the drum viewport
    let focusLine = vHeight / 2;
    if (heading && window.innerWidth > 900) {
      const headingRect = heading.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      focusLine = (headingRect.top + headingRect.height / 2) - viewportRect.top;
    }

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

    // Apply distance-from-focus styling to each item (Ref: kinetic drum ticker)
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

      const isClosing = item.classList.contains('wispr-drum-item--closing');
      const textEl = item.querySelector<HTMLElement>('.wispr-drum-text');
      if (textEl) {
        if (isClosing) {
          textEl.style.color = 'var(--clay-green)';
          textEl.style.textShadow = 'none';
        } else if (normalizedDist < 0.2) {
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
        id="why-wispr-flow"
        aria-labelledby="wispr-heading"
        className="editorial-section wispr-section wispr-section--reduced-motion"
      >
        <div className="editorial-shell">
          <div className="wispr-layout">
            <div className="wispr-left">
              <h2
                id="wispr-heading"
                className="display-h2 wispr-heading"
                aria-label={SITE_COPY.home.wispr.heading}
              >
                <span className="wispr-heading-lockup" aria-hidden="true">
                  <span className="wispr-heading-prefix">Why</span>
                  <span className="wispr-heading-brand-wrap">
                    <img
                      src="/assets/wispr/wispr_flow_heading.png"
                      alt="Wispr Flow"
                      className="wispr-heading-logo"
                      width={537}
                      height={105}
                      loading="eager"
                      decoding="async"
                    />
                    <span className="wispr-heading-suffix">?</span>
                  </span>
                </span>
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
            {/* Left Column: Pinned Display Heading */}
            <div className="wispr-left">
              <div className="wispr-left-anchor">
                <h2
                  id="wispr-heading"
                  ref={headingRef}
                  className="display-h2 wispr-heading"
                  aria-label={SITE_COPY.home.wispr.heading}
                >
                  <span className="wispr-heading-lockup" aria-hidden="true">
                    <span className="wispr-heading-prefix">Why</span>
                    <span className="wispr-heading-brand-wrap">
                      <img
                        src="/assets/wispr/wispr_flow_heading.png"
                        alt="Wispr Flow"
                        className="wispr-heading-logo"
                        width={537}
                        height={105}
                        loading="eager"
                        decoding="async"
                      />
                      <span className="wispr-heading-suffix">?</span>
                    </span>
                  </span>
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
