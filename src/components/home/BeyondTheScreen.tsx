import React, { useEffect, useRef, useState } from 'react';
import { SITE_COPY } from '../../data/copy';
import { EditorialSection } from '../shared/EditorialSection';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const BeyondTheScreen: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);

  // Lazy-load & handle intersection playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    // Ensure muted is explicitly set for modern autoplay policies
    video.muted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => setIsPlaying(true))
                .catch(() => {
                  // Autoplay prevented; fallback gracefully to paused poster
                });
            }
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.1, rootMargin: '200px 0px' }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <EditorialSection
      id="beyond-the-screen"
      ariaLabelledBy="beyond-heading"
      className="beyond-section"
    >
      <div className="beyond-header">
        <h2 id="beyond-heading" className="display-h2 beyond-heading">
          {SITE_COPY.home.beyond.heading}
        </h2>
      </div>

      <div className="beyond-composition" ref={containerRef}>
        {/* Central Animated Illustration */}
        <div className="beyond-visual-wrap">
          {prefersReducedMotion ? (
            <img
              src="/assets/beyond/beyond_claymation_poster.webp"
              alt="Handmade claymation character seated in meditation with personal interests sprouting organically above him"
              className="beyond-visual beyond-visual--poster"
              width={1060}
              height={1060}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <video
              ref={videoRef}
              className={`beyond-visual beyond-visual--video ${
                isPlaying ? 'is-playing' : ''
              }`}
              width={1060}
              height={1060}
              playsInline
              muted
              loop
              autoPlay
              preload="metadata"
              poster="/assets/beyond/beyond_claymation_poster.webp"
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
              aria-label="Handmade claymation character seated in meditation with personal interests sprouting organically above him"
            >
              <source
                src="/assets/beyond/beyond_claymation_loop.webm"
                type="video/webm"
              />
              <source
                src="/assets/beyond/beyond_claymation_loop.mp4"
                type="video/mp4"
              />
            </video>
          )}
        </div>

        {/* Upper Left: Reading & Dune Universe */}
        <div className="beyond-callout beyond-callout--reading">
          <p className="beyond-callout-text">
            {SITE_COPY.home.beyond.readingLines[0]}
            <br />
            {SITE_COPY.home.beyond.readingLines[1]}
          </p>
          <div className="beyond-arrow beyond-arrow--reading" aria-hidden="true">
            <img
              src="/assets/beyond/arrow_reading.png"
              alt=""
              width={70}
              height={19}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Lower Left: FC Barcelona & Football */}
        <div className="beyond-callout beyond-callout--football">
          <p className="beyond-callout-text">
            {SITE_COPY.home.beyond.football}
          </p>
          <div className="beyond-arrow beyond-arrow--football" aria-hidden="true">
            <img
              src="/assets/beyond/arrow_football.png"
              alt=""
              width={74}
              height={36}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Right: Building Small Projects */}
        <div className="beyond-callout beyond-callout--building">
          <p className="beyond-callout-text">
            {SITE_COPY.home.beyond.building}
          </p>
          <div className="beyond-arrow beyond-arrow--building" aria-hidden="true">
            <img
              src="/assets/beyond/arrow_building.png"
              alt=""
              width={86}
              height={49}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* Centered Fitness Caption Below Visual */}
      <div className="beyond-caption-wrap">
        <span className="beyond-accent beyond-accent--left" aria-hidden="true">
          <img
            src="/assets/beyond/accents_left.png"
            alt=""
            width={24}
            height={28}
            loading="lazy"
            decoding="async"
          />
        </span>
        <p className="beyond-caption">
          {SITE_COPY.home.beyond.trainingQuestion}
        </p>
        <span className="beyond-accent beyond-accent--right" aria-hidden="true">
          <img
            src="/assets/beyond/accents_right.png"
            alt=""
            width={29}
            height={24}
            loading="lazy"
            decoding="async"
          />
        </span>
      </div>
    </EditorialSection>
  );
};
