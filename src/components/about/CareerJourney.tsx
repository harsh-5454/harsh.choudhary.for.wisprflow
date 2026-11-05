import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ASSET_MANIFEST } from '../../config/assets';
import { CareerChapterCopy, SITE_COPY } from '../../data/copy';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { CareerChapter } from './CareerChapter';
import { ClayIcon } from './ClayIcons';

gsap.registerPlugin(ScrollTrigger);

interface UpperZoneProps {
  chapter: CareerChapterCopy;
}

const UpperZoneContent: React.FC<UpperZoneProps> = ({ chapter }) => {
  return (
    <div className="career-upper-zone">
      <div className="career-upper-grid">
        {/* Left Column: Main Narrative */}
        <div className="career-left-column">
          {/* Company Name & Role */}
          <div className="career-heading-group">
            <h3 className="career-company-name">{chapter.displayName}</h3>
            {chapter.role && <p className="career-role-title">{chapter.role}</p>}
          </div>

          {/* Large Bold Editorial Headline with Accent Hatch */}
          <div className="career-editorial-headline-wrap">
            <h2 className="career-editorial-headline">{chapter.heading}</h2>
            <svg
              className="career-headline-accent-svg"
              viewBox="0 0 32 20"
              fill="none"
              aria-hidden="true"
            >
              <line
                x1="8"
                y1="18"
                x2="14"
                y2="4"
                stroke="#7c3aed"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="18"
                y1="19"
                x2="22"
                y2="7"
                stroke="#7c3aed"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="27"
                y1="17"
                x2="30"
                y2="9"
                stroke="#7c3aed"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Short Narrative Description */}
          <div className="career-narrative-body">
            <p>{chapter.paragraphs[0]}</p>
            {chapter.milestone && (
              <p className="career-chapter-milestone">
                {chapter.milestone}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Supporting Information (Investments / Writing) */}
        <div className="career-right-column">
          {/* Investments worked on */}
          {chapter.investments && chapter.investments.length > 0 && (
            <div className="career-support-block">
              <span className="career-support-label">
                {chapter.investmentsHeading || 'Investments worked on:'}
              </span>
              <div
                className="career-portfolio-logos-row"
                role="list"
                aria-label={chapter.investmentsHeading || 'Investments worked on:'}
              >
                {chapter.investments.map((inv, idx) => (
                  <div
                    key={idx}
                    role="listitem"
                    className="career-portfolio-logo-item"
                    title={inv.detail ? `${inv.name} — ${inv.detail}` : inv.name}
                  >
                    {inv.logoSrc || inv.logoWebpSrc ? (
                      <picture>
                        {inv.logoWebpSrc && (
                          <source srcSet={inv.logoWebpSrc} type="image/webp" />
                        )}
                        <img
                          src={inv.logoSrc || inv.logoWebpSrc}
                          alt={inv.name}
                          className="career-portfolio-logo-img"
                          loading="lazy"
                        />
                      </picture>
                    ) : (
                      <div className="career-portfolio-badge">
                        <span className="career-portfolio-dot" />
                        <strong className="career-portfolio-name">{inv.name}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Published Writing */}
          {chapter.writingList && chapter.writingList.length > 0 && (
            <div className="career-support-block">
              <span className="career-support-label">
                {chapter.writingHeading || 'PUBLISHED WRITING'}
              </span>
              <div className="career-writing-list">
                {chapter.writingList.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url || '#'}
                    className="career-writing-card"
                    tabIndex={0}
                  >
                    <ClayIcon name="document" />
                    <div className="career-writing-info">
                      <span className="career-writing-title">
                        {item.title} <span className="career-ext-arrow">↗</span>
                      </span>
                      <span className="career-writing-subtitle">
                        {item.subtitle}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Closing / Takeaway (e.g. The Garage) */}
          {chapter.closing && !chapter.investments && (!chapter.writingList || chapter.writingList.length === 0) && (
            <div className="career-support-block">
              <p className="career-closing-takeaway">{chapter.closing}</p>
            </div>
          )}
        </div>
      </div>
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

  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  const pinWrapperRef = useRef<HTMLDivElement | null>(null);
  const worldTrackRef = useRef<HTMLDivElement | null>(null);
  const sceneryTrackRef = useRef<HTMLDivElement | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Preload all 4 high-res building assets and the seamless scenery panorama
  useEffect(() => {
    const assetsToPreload = [
      ASSET_MANIFEST.A20?.src,
      ASSET_MANIFEST.A21?.src,
      ASSET_MANIFEST.A22?.src,
      ASSET_MANIFEST.A23?.src,
      ASSET_MANIFEST.A24?.src,
    ];
    assetsToPreload.forEach((src) => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, []);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(min-width: 960px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktopViewport(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const useHorizontalPinnedMode = isDesktopViewport && !prefersReducedMotion;

  useEffect(() => {
    if (!useHorizontalPinnedMode || !pinWrapperRef.current || !worldTrackRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const pinWrapper = pinWrapperRef.current!;
      const worldTrack = worldTrackRef.current!;
      const sceneryTrack = sceneryTrackRef.current;

      const st = ScrollTrigger.create({
        trigger: pinWrapper,
        start: 'top top',
        end: '+=380%',
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // 4 stations total = 100vw * 4 = 400vw width.
          // Travel from station 0 (x=0) to station 3 (x=-300vw = -75% of track width).
          const worldPercent = -progress * 75;
          gsap.set(worldTrack, { xPercent: worldPercent });

          // Parallax background scenery moves slower (approx 0.38x parallax factor)
          if (sceneryTrack) {
            const sceneryPercent = -progress * 28;
            gsap.set(sceneryTrack, { xPercent: sceneryPercent });
          }

          // Active chapter index for the fixed upper narrative zone (0..3)
          const currentIdx = Math.min(3, Math.max(0, Math.round(progress * 3)));
          setActiveChapterIndex(currentIdx);
        },
      });

      scrollTriggerRef.current = st;
      (window as unknown as { __careerScrollTrigger?: ScrollTrigger }).__careerScrollTrigger = st;
      document.fonts?.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }, pinWrapperRef);

    return () => {
      delete (window as unknown as { __careerScrollTrigger?: ScrollTrigger }).__careerScrollTrigger;
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, [useHorizontalPinnedMode]);

  const jumpToChapter = (chapterIdx: number) => {
    const st = scrollTriggerRef.current;
    if (!st) return;
    const targetProgress = chapterIdx / 3;
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

  const activeChapter = chapters[activeChapterIndex] ?? chapters[0];
  const sceneryAsset = ASSET_MANIFEST.A20;

  return (
    <section
      className="career-journey-pinned-section"
      aria-label="Horizontal miniature career world"
    >
      <div ref={pinWrapperRef} className="career-journey-stage">
        {/* UPPER ZONE: Fixed Editorial Narrative & Supporting Info (55-60% of Viewport) */}
        <UpperZoneContent chapter={activeChapter} />

        {/* LOWER ZONE: Centered Miniature Building Scene & Parallax Landscape (38-42% of Viewport) */}
        <div className="career-lower-zone">
          {/* Layer 2: Seamless Continuous Background Trees & Shrubs Scenery (Parallax) */}
          <div
            ref={sceneryTrackRef}
            className="career-scenery-track"
            aria-hidden="true"
          >
            <img
              src={sceneryAsset?.src || '/assets/career/scenery_trees_panorama_5x.webp'}
              alt=""
              className="career-scenery-track__img"
              decoding="async"
            />
          </div>

          {/* Layer 3: Main 400vw Buildings Track — Exactly One Centered Destination per Stop */}
          <div ref={worldTrackRef} className="career-buildings-track">
            {/* Continuous tactile clay stone footpath scrolling with the buildings */}
            <div className="career-continuous-footpath" aria-hidden="true" />

            {chapters.map((chapter) => {
              const buildingAsset = ASSET_MANIFEST[chapter.sceneAssetId];
              return (
                <div
                  key={chapter.id}
                  id={`building-slot-${chapter.id}`}
                  className="career-building-station"
                >
                  <div className="career-building-anchor">
                    <picture>
                      <source srcSet={buildingAsset?.src} type="image/webp" />
                      <img
                        src={buildingAsset?.fallbackStillSrc || buildingAsset?.src}
                        alt={buildingAsset?.alt || `${chapter.company} building`}
                        className="career-building-image"
                        loading="eager"
                        decoding="async"
                      />
                    </picture>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ZONE: Experience toggle bar below the buildings */}
        <nav
          className="career-journey-index"
          aria-label="Jump to career chapter"
        >
          {chapters.map((ch, idx) => {
            const isCurrent = idx === activeChapterIndex;
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

      {/* Screen-reader semantic archive */}
      <div className="sr-only">
        {chapters.map((chapter) => (
          <section key={chapter.id} aria-label={`${chapter.eyebrow} full text`}>
            <h3>
              {chapter.eyebrow} — {chapter.heading}
            </h3>
            <p>{chapter.role}</p>
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
            {chapter.writingList && (
              <>
                <h4>{chapter.writingHeading}</h4>
                <ul>
                  {chapter.writingList.map((w) => (
                    <li key={w.title}>
                      {w.title} — {w.subtitle}
                    </li>
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
