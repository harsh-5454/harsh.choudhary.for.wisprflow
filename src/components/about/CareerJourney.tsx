import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ASSET_MANIFEST, AVATAR_WALK_SEQUENCE } from '../../config/assets';
import { CareerChapterCopy, SITE_COPY } from '../../data/copy';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { AssetStage } from '../shared/AssetStage';
import { CareerChapter, CHAPTER_VARIANT_MAP } from './CareerChapter';

gsap.registerPlugin(ScrollTrigger);

interface JourneyMappedState {
  chapterIndex: number;
  subStep: number;
  worldPosition: number; // 0..3 continuous scene index
  isWalking: boolean;
}

/**
 * Piecewise Travel + Dwell Scroll Mapping (`design.md` Section 3.3):
 * Holds the miniature building steady while multi-part editorial copy reveals,
 * giving Kalaari (Chapter 03) and Independent Building (Chapter 04) generous dwell time.
 */
function mapScrollProgress(p: number): JourneyMappedState {
  const clamped = Math.max(0, Math.min(1, p));

  // Chapter 01: Grant Thornton (0.00 -> 0.17)
  if (clamped < 0.17) {
    return {
      chapterIndex: 0,
      subStep: clamped < 0.085 ? 0 : 1,
      worldPosition: 0,
      isWalking: false,
    };
  }
  // Walk 01 -> 02 (0.17 -> 0.24)
  if (clamped < 0.24) {
    const t = (clamped - 0.17) / 0.07;
    return {
      chapterIndex: t < 0.5 ? 0 : 1,
      subStep: t < 0.5 ? 1 : 0,
      worldPosition: t,
      isWalking: true,
    };
  }
  // Chapter 02: Indian Angel Network (0.24 -> 0.42)
  if (clamped < 0.42) {
    return {
      chapterIndex: 1,
      subStep: clamped < 0.33 ? 0 : 1,
      worldPosition: 1,
      isWalking: false,
    };
  }
  // Walk 02 -> 03 (0.42 -> 0.49)
  if (clamped < 0.49) {
    const t = (clamped - 0.42) / 0.07;
    return {
      chapterIndex: t < 0.5 ? 1 : 2,
      subStep: t < 0.5 ? 1 : 0,
      worldPosition: 1 + t,
      isWalking: true,
    };
  }
  // Chapter 03: Kalaari Capital (0.49 -> 0.75) — Longest dwell interval
  if (clamped < 0.75) {
    const sub = clamped < 0.58 ? 0 : clamped < 0.67 ? 1 : 2;
    return {
      chapterIndex: 2,
      subStep: sub,
      worldPosition: 2,
      isWalking: false,
    };
  }
  // Walk 03 -> 04 (0.75 -> 0.82)
  if (clamped < 0.82) {
    const t = (clamped - 0.75) / 0.07;
    return {
      chapterIndex: t < 0.5 ? 2 : 3,
      subStep: t < 0.5 ? 2 : 0,
      worldPosition: 2 + t,
      isWalking: true,
    };
  }
  // Chapter 04: Independent Building (0.82 -> 1.00)
  const sub4 = clamped < 0.885 ? 0 : clamped < 0.945 ? 1 : 2;
  return {
    chapterIndex: 3,
    subStep: sub4,
    worldPosition: 3,
    isWalking: false,
  };
}

const CHAPTER_JUMP_PROGRESS = [0.02, 0.26, 0.51, 0.84] as const;

const ChapterOverlayCard: React.FC<{
  chapter: CareerChapterCopy;
  subStep: number;
  onSelectSubStep: (step: number) => void;
}> = ({ chapter, subStep, onSelectSubStep }) => {
  if (chapter.id === 'grant-thornton') {
    return (
      <div className="journey-overlay__inner">
        <p className="chapter-eyebrow">{chapter.eyebrow}</p>
        <h2 className="display-h3 career-chapter-heading">{chapter.heading}</h2>
        <p className="body-editorial">{chapter.paragraphs[0]}</p>
        <p
          className={`career-chapter-milestone ${
            subStep >= 1 ? 'is-revealed' : 'is-muted-step'
          }`}
        >
          {chapter.milestone}
        </p>
      </div>
    );
  }

  if (chapter.id === 'ian') {
    return (
      <div className="journey-overlay__inner">
        <p className="chapter-eyebrow">{chapter.eyebrow}</p>
        <h2 className="display-h3 career-chapter-heading">{chapter.heading}</h2>
        <p className="body-editorial">{chapter.paragraphs[0]}</p>

        <div
          className={`career-chapter-subblock ${
            subStep >= 1 ? 'is-revealed' : 'is-muted-step'
          }`}
        >
          <h3 className="career-subblock-heading">
            {chapter.investmentsHeading}
          </h3>
          <ul className="career-subblock-list">
            {chapter.investments?.map((inv) => (
              <li key={inv.name}>{inv.fullText}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (chapter.id === 'kalaari') {
    return (
      <div className="journey-overlay__inner">
        <div className="journey-overlay__header-row">
          <p className="chapter-eyebrow">{chapter.eyebrow}</p>
          <div className="journey-substep-tabs" role="group" aria-label="Kalaari chapter views">
            {['Role', 'Investments & Writing', 'Reflection'].map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => onSelectSubStep(i)}
                className={`journey-substep-btn ${subStep === i ? 'is-active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <h2 className="display-h3 career-chapter-heading">{chapter.heading}</h2>

        {subStep === 0 && (
          <div className="journey-subpanel" key="kalaari-0">
            {chapter.paragraphs.map((p, idx) => (
              <p key={idx} className="body-editorial">
                {p}
              </p>
            ))}
          </div>
        )}

        {subStep === 1 && (
          <div className="journey-subpanel journey-subpanel--columns" key="kalaari-1">
            <div className="career-chapter-subblock">
              <h3 className="career-subblock-heading">
                {chapter.investmentsHeading}
              </h3>
              <ul className="career-subblock-list">
                {chapter.investments?.map((inv) => (
                  <li key={inv.name}>{inv.fullText}</li>
                ))}
              </ul>
            </div>

            <div className="career-chapter-subblock">
              <h3 className="career-subblock-heading">
                {chapter.writingHeading}
              </h3>
              <ul className="career-subblock-list">
                {chapter.writing?.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {subStep >= 2 && (
          <div className="journey-subpanel" key="kalaari-2">
            <p className="career-chapter-closing career-chapter-closing--prominent">
              {chapter.closing}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Chapter 04: Independent Building
  return (
    <div className="journey-overlay__inner">
      <div className="journey-overlay__header-row">
        <p className="chapter-eyebrow">{chapter.eyebrow}</p>
        <div
          className="journey-substep-tabs"
          role="group"
          aria-label="Independent Building chapter views"
        >
          {['The Idea', 'Wearing Every Hat', 'Takeaway'].map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => onSelectSubStep(i)}
              className={`journey-substep-btn ${subStep === i ? 'is-active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <h2 className="display-h3 career-chapter-heading">{chapter.heading}</h2>

      {subStep === 0 && (
        <div className="journey-subpanel" key="ind-0">
          <p className="body-editorial">{chapter.paragraphs[0]}</p>
          <p className="body-editorial">{chapter.paragraphs[1]}</p>
        </div>
      )}

      {subStep === 1 && (
        <div className="journey-subpanel" key="ind-1">
          <p className="body-editorial">{chapter.paragraphs[2]}</p>
          <p className="body-editorial">{chapter.paragraphs[3]}</p>
        </div>
      )}

      {subStep >= 2 && (
        <div className="journey-subpanel" key="ind-2">
          <p className="career-chapter-closing career-chapter-closing--prominent">
            {chapter.closing}
          </p>
        </div>
      )}
    </div>
  );
};

export const CareerJourney: React.FC = () => {
  const chapters = SITE_COPY.about.chapters;
  const prefersReducedMotion = usePrefersReducedMotion();

  const [isDesktopViewport, setIsDesktopViewport] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return window.matchMedia('(min-width: 960px)').matches;
  });

  const [mappedState, setMappedState] = useState<JourneyMappedState>({
    chapterIndex: 0,
    subStep: 0,
    worldPosition: 0,
    isWalking: false,
  });
  const [manualSubStepOverride, setManualSubStepOverride] = useState<
    number | null
  >(null);

  const pinWrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const bgParallaxRef = useRef<HTMLDivElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(min-width: 960px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktopViewport(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Preload lightweight RGBA walking gait frames so chapter travel has zero flicker
  useEffect(() => {
    AVATAR_WALK_SEQUENCE.gaitFrames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const useHorizontalPinnedMode = isDesktopViewport && !prefersReducedMotion;

  useEffect(() => {
    if (!useHorizontalPinnedMode || !pinWrapperRef.current || !trackRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: pinWrapperRef.current,
        start: 'top top',
        end: '+=440%',
        pin: true,
        scrub: 0.45,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = mapScrollProgress(self.progress);
          setManualSubStepOverride(null);
          setMappedState((prev) => {
            if (
              prev.chapterIndex === next.chapterIndex &&
              prev.subStep === next.subStep &&
              prev.isWalking === next.isWalking &&
              Math.abs(prev.worldPosition - next.worldPosition) < 0.004
            ) {
              return prev;
            }
            return next;
          });

          if (trackRef.current) {
            const xPercent = -(next.worldPosition * 25); // 4 panels = 100%, each step = 25% of track width
            gsap.set(trackRef.current, { xPercent });
          }
          if (bgParallaxRef.current) {
            gsap.set(bgParallaxRef.current, {
              xPercent: -(next.worldPosition * 9),
            });
          }
        },
      });

      scrollTriggerRef.current = st;
      document.fonts?.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }, pinWrapperRef);

    return () => {
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, [useHorizontalPinnedMode]);

  const jumpToChapter = (chapterIdx: number) => {
    const st = scrollTriggerRef.current;
    if (!st) return;
    const targetProgress = CHAPTER_JUMP_PROGRESS[chapterIdx] ?? 0;
    const targetScroll = st.start + (st.end - st.start) * targetProgress;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  // Stacked vertical chapters on mobile (<960px) or `prefers-reduced-motion: reduce`
  if (!useHorizontalPinnedMode) {
    return (
      <section
        className="career-journey-vertical"
        aria-label="Career journey chapters"
      >
        <div className="editorial-shell career-vertical-stack">
          {chapters.map((chapter) => (
            <CareerChapter key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </section>
    );
  }

  const activeChapter = chapters[mappedState.chapterIndex] ?? chapters[0];
  const effectiveSubStep = manualSubStepOverride ?? mappedState.subStep;
  const walkAsset = ASSET_MANIFEST.A25;
  const realPlatesSupplied = Boolean(ASSET_MANIFEST.A21?.supplied);

  // Scroll-scrubbed gait step during inter-building walks; calm standing pose at chapters
  const fractionalWalk =
    mappedState.worldPosition - Math.floor(mappedState.worldPosition);
  const gaitIdx =
    Math.floor(fractionalWalk * 12) % AVATAR_WALK_SEQUENCE.gaitFrames.length;
  const activeAvatarSrc = mappedState.isWalking
    ? AVATAR_WALK_SEQUENCE.gaitFrames[gaitIdx]
    : AVATAR_WALK_SEQUENCE.standSrc;

  return (
    <section
      className="career-journey-pinned-section"
      aria-label="Horizontal miniature career world"
    >
      <div ref={pinWrapperRef} className="career-journey-stage">
        {!realPlatesSupplied && (
          <div
            ref={bgParallaxRef}
            className="career-journey-backdrop"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 2400 320"
              preserveAspectRatio="none"
              className="career-journey-backdrop__svg"
            >
              <path
                d="M0 260 Q300 210 620 248 T1260 232 T1880 250 T2400 228 L2400 320 L0 320 Z"
                fill="color-mix(in srgb, var(--rule) 26%, transparent)"
              />
            </svg>
          </div>
        )}

        {/* Stable upper-left HTML editorial overlay (`design.md` Section 3.3) */}
        <div className="career-journey-overlay-shell">
          <div className="career-journey-overlay" aria-live="polite">
            <ChapterOverlayCard
              chapter={activeChapter}
              subStep={effectiveSubStep}
              onSelectSubStep={(step) => setManualSubStepOverride(step)}
            />
          </div>
        </div>

        {/* Continuous 400vw miniature building world */}
        <div className="career-journey-viewport">
          <div ref={trackRef} className="career-journey-track">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="career-scene-plate">
                <div className="career-scene-plate__building">
                  <AssetStage
                    assetId={chapter.sceneAssetId}
                    proxyVariant={CHAPTER_VARIANT_MAP[chapter.id]}
                    activeAccent={chapter.accentColor}
                    frameless
                    className="career-scene-plate__figure"
                  />
                </div>
              </div>
            ))}
            {!realPlatesSupplied && (
              <div className="career-continuous-ground" aria-hidden="true" />
            )}
          </div>

          {/* Layered Photorealistic Harsh Walking Avatar Pass (`A25`) */}
          <div
            className={`career-avatar-layer ${
              mappedState.isWalking ? 'is-walking' : 'is-paused'
            }`}
          >
            {walkAsset?.supplied ? (
              <div className="career-avatar-figure">
                <img
                  src={activeAvatarSrc}
                  alt={walkAsset.alt}
                  decoding="async"
                  className="career-avatar-layer__img"
                />
                <span
                  className="career-avatar-ground-shadow"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <div
                className="career-avatar-proxy"
                role="img"
                aria-label={`${walkAsset.alt} (Asset slot A25)`}
              >
                <svg viewBox="0 0 90 150" className="career-avatar-proxy__svg">
                  <ellipse
                    cx="45"
                    cy="140"
                    rx="22"
                    ry="5"
                    fill="rgba(23,23,21,0.14)"
                  />
                  <circle
                    cx="45"
                    cy="28"
                    r="12"
                    fill="var(--paper)"
                    stroke="var(--ink)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M32 44 L58 44 L54 88 L36 88 Z"
                    fill="var(--white)"
                    stroke="var(--ink)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="40"
                    y1="88"
                    x2={mappedState.isWalking ? '30' : '38'}
                    y2="136"
                    stroke="var(--clay-blue)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="50"
                    y1="88"
                    x2={mappedState.isWalking ? '60' : '52'}
                    y2="136"
                    stroke="var(--clay-blue)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="career-avatar-proxy__tag">
                  A25 · {mappedState.isWalking ? 'Walking →' : 'At scene'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Minimal chapter progress & direct jump index */}
        <nav
          className="career-journey-index"
          aria-label="Jump to career chapter"
        >
          {chapters.map((ch, idx) => {
            const isCurrent = idx === mappedState.chapterIndex;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => jumpToChapter(idx)}
                className={`career-index-item ${isCurrent ? 'is-current' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="career-index-item__num">{ch.number}</span>
                <span className="career-index-item__name">{ch.company}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Screen-reader & search-engine complete semantic archive of all 4 chapters */}
      <div className="sr-only">
        {chapters.map((chapter) => (
          <section key={chapter.id} aria-label={`${chapter.eyebrow} full text`}>
            <h3>
              {chapter.eyebrow} — {chapter.heading}
            </h3>
            {chapter.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {chapter.milestone && <p>{chapter.milestone}</p>}
            {chapter.investments && (
              <>
                <h4>{chapter.investmentsHeading}</h4>
                <ul>
                  {chapter.investments.map((inv) => (
                    <li key={inv.name}>{inv.fullText}</li>
                  ))}
                </ul>
              </>
            )}
            {chapter.writing && (
              <>
                <h4>{chapter.writingHeading}</h4>
                <ul>
                  {chapter.writing.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </>
            )}
            {chapter.closing && <p>{chapter.closing}</p>}
          </section>
        ))}
      </div>
    </section>
  );
};
