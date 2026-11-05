import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RESUME_ASSET, ASSET_MANIFEST } from '../../config/assets';
import { SITE_COPY } from '../../data/copy';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const ResumeLinkControl: React.FC<{
  label: string;
  className?: string;
}> = ({ label, className = '' }) => {
  const [pendingNotice, setPendingNotice] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!RESUME_ASSET.supplied) {
      e.preventDefault();
      setPendingNotice(true);
    }
  };

  return (
    <span className="resume-link-wrap">
      <a
        href={RESUME_ASSET.supplied ? RESUME_ASSET.href : '#resume-slot'}
        onClick={handleClick}
        className={className}
        download={RESUME_ASSET.supplied ? RESUME_ASSET.filename : undefined}
        aria-describedby={pendingNotice ? 'resume-slot-notice' : undefined}
      >
        {label}
      </a>
      {pendingNotice && !RESUME_ASSET.supplied && (
        <span id="resume-slot-notice" className="resume-pending-note" role="status">
          Integration slot ready: supply{' '}
          <code>/public/assets/shared/harsh_choudhary_resume.pdf</code>
        </span>
      )}
    </span>
  );
};

export const SiteFooter: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const footerRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(prefersReducedMotion);

  // Trigger reveal animation when footer enters viewport
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = footerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -4% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // Tactile 3D perspective tilt on pointer movement over the visual card
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = x / rect.width;
      const yPct = y / rect.height;
      const rotX = (0.5 - yPct) * 12; // tilt up/down up to 6deg
      const rotY = (xPct - 0.5) * 12; // tilt left/right up to 6deg

      cardRef.current.style.setProperty('--card-rot-x', `${rotX.toFixed(2)}deg`);
      cardRef.current.style.setProperty('--card-rot-y', `${rotY.toFixed(2)}deg`);
      cardRef.current.style.setProperty('--glare-x', `${(xPct * 100).toFixed(1)}%`);
      cardRef.current.style.setProperty('--glare-y', `${(yPct * 100).toFixed(1)}%`);
      cardRef.current.style.setProperty('--glare-opacity', '0.28');
    },
    [prefersReducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--card-rot-x', '0deg');
    cardRef.current.style.setProperty('--card-rot-y', '0deg');
    cardRef.current.style.setProperty('--glare-opacity', '0');
  }, []);

  const handleResumeCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('a')) return;
    const anchor = e.currentTarget.querySelector<HTMLAnchorElement>('a');
    if (anchor) {
      anchor.click();
    }
  };

  const handleResumeKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const anchor = e.currentTarget.querySelector<HTMLAnchorElement>('a');
      if (anchor) {
        anchor.click();
      }
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const footerImage = ASSET_MANIFEST.A26;

  return (
    <footer
      ref={footerRef}
      className={`site-footer ${isVisible ? 'is-visible' : ''}`}
      role="contentinfo"
      aria-label="Site contact and colophon footer"
    >
      <div className="editorial-shell site-footer__shell">
        <div className="site-footer__layout">
          {/* LEFT: Clay Miniature Diorama Visual Stage */}
          <div className="site-footer__visual-stage">
            <div className="site-footer__card-floater">
              <div
                ref={cardRef}
                className="site-footer__card-stage"
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                tabIndex={0}
                role="img"
                aria-label={
                  footerImage?.alt ||
                  'Harsh sitting atop the Wispr Flow building in a stop-motion clay city'
                }
              >
                <div className="site-footer__glare-layer" aria-hidden="true" />
                <img
                  src={footerImage ? footerImage.src : '/assets/footer/footer_wispr_flow_city.jpg'}
                  alt={
                    footerImage
                      ? footerImage.alt
                      : 'Harsh sitting atop the Wispr Flow building in a stop-motion clay city'
                  }
                  className="site-footer__image"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial Content & Direct Contact Links */}
          <div className="site-footer__content-stage">
            {/* Display Heading */}
            <h2 className="site-footer__heading">{SITE_COPY.footer.heading}</h2>

            {/* Body Copy */}
            <p className="site-footer__body">{SITE_COPY.footer.body}</p>

            {/* Direct Contact Links with Horizontal Gridlines */}
            <div className="site-footer__cards-grid" aria-label="Direct contact links">
              {/* Email Card */}
              <a
                href={`mailto:${SITE_COPY.footer.email}`}
                className="site-footer__card"
                aria-label={`Send email to ${SITE_COPY.footer.email}`}
              >
                <div className="site-footer__card-info">
                  <span className="site-footer__card-label">Email</span>
                  <span className="site-footer__card-value">{SITE_COPY.footer.email}</span>
                </div>
                <div className="site-footer__card-arrow" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </a>

              {/* LinkedIn Card */}
              <a
                href={SITE_COPY.footer.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__card"
                aria-label={`Open LinkedIn profile: ${SITE_COPY.footer.linkedinDisplay}`}
              >
                <div className="site-footer__card-info">
                  <span className="site-footer__card-label">LinkedIn</span>
                  <span className="site-footer__card-value">{SITE_COPY.footer.linkedinDisplay}</span>
                </div>
                <div className="site-footer__card-arrow" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </a>

              {/* Resume Card */}
              <div
                className="site-footer__card site-footer__card--resume"
                onClick={handleResumeCardClick}
                onKeyDown={handleResumeKeyDown}
                role="button"
                tabIndex={0}
                aria-label={`Download resume: ${SITE_COPY.footer.resumeLabel}`}
              >
                <div className="site-footer__card-info">
                  <span className="site-footer__card-label">Resume</span>
                  <ResumeLinkControl
                    label={SITE_COPY.footer.resumeLabel}
                    className="site-footer__card-value site-footer__resume-trigger"
                  />
                </div>
                <div className="site-footer__card-arrow" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 5. Colophon & Back-To-Top Button */}
            <div className="site-footer__colophon">
              <span className="site-footer__colophon-copy">
                © {new Date().getFullYear()} Harsh Choudhary · Crafted with clay & code
              </span>
              <button
                type="button"
                onClick={handleScrollToTop}
                className="site-footer__top-button"
                aria-label="Scroll back to the top of the page"
              >
                <span className="site-footer__top-text">Back to top</span>
                <span className="site-footer__top-arrow" aria-hidden="true">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
