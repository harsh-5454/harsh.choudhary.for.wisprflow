import React, { useState } from 'react';
import { RESUME_ASSET } from '../../config/assets';
import { SITE_COPY } from '../../data/copy';

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
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="editorial-shell site-footer__grid">
        <div className="site-footer__lead">
          <h2 className="site-footer__heading">{SITE_COPY.footer.heading}</h2>
          <p className="site-footer__body">{SITE_COPY.footer.body}</p>
        </div>

        <div className="site-footer__links" aria-label="Contact and resume links">
          <div className="site-footer__item">
            <span className="site-footer__label">Email</span>
            <a
              href={`mailto:${SITE_COPY.footer.email}`}
              className="editorial-link"
            >
              {SITE_COPY.footer.email}
            </a>
          </div>

          <div className="site-footer__item">
            <span className="site-footer__label">LinkedIn</span>
            <a
              href={SITE_COPY.footer.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link"
            >
              {SITE_COPY.footer.linkedinDisplay}
            </a>
          </div>

          <div className="site-footer__item">
            <span className="site-footer__label">Resume</span>
            <ResumeLinkControl
              label={SITE_COPY.footer.resumeLabel}
              className="editorial-link"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

