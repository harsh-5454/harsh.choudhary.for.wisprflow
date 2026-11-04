import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SITE_COPY } from '../../data/copy';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const HeroScene: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pinnedStageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Animated foreground typography refs
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const leftSubheadingRef = useRef<HTMLDivElement | null>(null);
  const rightSubheadingRef = useRef<HTMLDivElement | null>(null);

  // Video state tracking
  const [isVideoReady, setIsVideoReady] = useState(false);
  const durationRef = useRef<number>(8.0);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  // Safe seek handler with queue batching
  const performSeek = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const duration = durationRef.current || 8.0;
    const maxSafeTime = Math.max(0, duration - 0.04);
    const target = Math.max(0.001, Math.min(maxSafeTime, targetTimeRef.current));

    // Avoid micro-seeks that cause decoding churn
    if (Math.abs(video.currentTime - target) < 0.015) return;

    if (!isSeekingRef.current) {
      isSeekingRef.current = true;
      try {
        video.currentTime = target;
      } catch {
        isSeekingRef.current = false;
      }
    }
  }, []);

  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false;
    const video = videoRef.current;
    if (video) {
      const duration = durationRef.current || 8.0;
      const maxSafeTime = Math.max(0, duration - 0.04);
      const target = Math.max(0.001, Math.min(maxSafeTime, targetTimeRef.current));
      if (Math.abs(video.currentTime - target) >= 0.015) {
        performSeek();
      }
    }
  }, [performSeek]);

  // Synchronise typography & video with normalized scroll progress
  const updateProgress = useCallback((rawProgress: number) => {
    const p = Math.max(0, Math.min(1, rawProgress));

    // 1. Video timeline mapping: progress × duration
    const duration = durationRef.current || 8.0;
    const maxSafeTime = Math.max(0, duration - 0.04);
    targetTimeRef.current = p * maxSafeTime;
    performSeek();

    // 2. Main Headline: Centered in whitespace above character
    // Appears right when website opens (opacity 1) and stays visible on scroll
    if (headlineRef.current) {
      headlineRef.current.style.opacity = '1';
      headlineRef.current.style.transform = 'translate3d(-50%, 0, 0)';
      headlineRef.current.style.pointerEvents = 'auto';
    }

    // 3. First Subheading (Left): Appears after user scrolls a little (4% -> 16%)
    // Once visible, it stays visible and does NOT disappear with scrolling
    if (leftSubheadingRef.current) {
      let opacity = 0;
      let y = 14;

      if (p < 0.04) {
        opacity = 0;
        y = 14;
      } else if (p <= 0.16) {
        const t = (p - 0.04) / 0.12;
        opacity = t;
        y = 14 * (1 - t);
      } else {
        opacity = 1;
        y = 0;
      }

      leftSubheadingRef.current.style.opacity = opacity.toFixed(3);
      leftSubheadingRef.current.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      leftSubheadingRef.current.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    }

    // 4. Second Subheading (Right): Appears after user scrolls a little bit more (18% -> 30%)
    // Once visible, it stays visible and does NOT disappear with scrolling
    if (rightSubheadingRef.current) {
      let opacity = 0;
      let y = 14;

      if (p < 0.18) {
        opacity = 0;
        y = 14;
      } else if (p <= 0.30) {
        const t = (p - 0.18) / 0.12;
        opacity = t;
        y = 14 * (1 - t);
      } else {
        opacity = 1;
        y = 0;
      }

      rightSubheadingRef.current.style.opacity = opacity.toFixed(3);
      rightSubheadingRef.current.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      rightSubheadingRef.current.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    }
  }, [performSeek]);

  // Video metadata and initial setup
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.duration && !isNaN(video.duration)) {
      durationRef.current = video.duration;
    }
    video.pause();

    // Render the initial frame cleanly
    try {
      video.currentTime = 0.001;
    } catch {
      // Ignored if browser not ready
    }
    setIsVideoReady(true);

    if (triggerRef.current) {
      updateProgress(triggerRef.current.progress);
    }
  }, [updateProgress]);

  // Initialize ScrollTrigger on mount
  useEffect(() => {
    if (prefersReducedMotion || !scrollContainerRef.current) {
      setIsVideoReady(true);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.15,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        updateProgress(self.progress);
      },
    });

    triggerRef.current = trigger;
    updateProgress(trigger.progress);

    return () => {
      trigger.kill();
      triggerRef.current = null;
    };
  }, [prefersReducedMotion, updateProgress]);

  return (
    <div
      ref={scrollContainerRef}
      className="hero-scroll-container"
      aria-label="Cinematic scroll-controlled hero"
    >
      <div
        ref={pinnedStageRef}
        className="hero-pinned-stage"
      >
        {/* Layer 1: Clean Background Video Layer — Zero glare/tint */}
        <div className="hero-video-layer" aria-hidden="true">
          <img
            src="/assets/hero/hero_scene_poster.webp"
            alt=""
            className={`hero-video-poster ${isVideoReady ? 'is-hidden' : ''}`}
          />
          <video
            ref={videoRef}
            src="/assets/hero/hero_scroll_video.mp4"
            poster="/assets/hero/hero_scene_poster.webp"
            muted
            playsInline
            preload="auto"
            autoPlay={false}
            controls={false}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={() => setIsVideoReady(true)}
            onSeeked={handleSeeked}
            className={`hero-video-element ${isVideoReady ? 'is-ready' : ''}`}
          />
        </div>

        {/* Layer 2: Foreground Symmetrical Editorial Layer */}
        <div className="hero-foreground-layer">
          {/* Hero Heading: Centered in the whitespace above the character in 2 lines */}
          <div ref={headlineRef} className="hero-headline-centered">
            <h1 id="hero-heading" tabIndex={-1} className="hero-display-h1">
              <span className="hero-headline-line hero-headline-line--1">
                {SITE_COPY.home.hero.headlineLines[0]}
              </span>
              <span className="hero-headline-line hero-headline-line--2">
                {SITE_COPY.home.hero.headlineLines[1]}
              </span>
            </h1>
          </div>

          {/* Symmetrical Centered Subheadings in Whitespace Above / Around Character */}
          <div className="hero-flanking-subheadings">
            {/* Left Subheading Block: Appears after a little scroll */}
            <div
              ref={leftSubheadingRef}
              className="hero-subheading-block hero-subheading-block--left"
            >
              <p className="hero-supporting-paragraph">
                {SITE_COPY.home.hero.subheadingLeft}
              </p>
            </div>

            {/* Right Subheading Block: Appears after a little bit more scroll */}
            <div
              ref={rightSubheadingRef}
              className="hero-subheading-block hero-subheading-block--right"
            >
              <p className="hero-supporting-paragraph">
                {SITE_COPY.home.hero.subheadingRight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
