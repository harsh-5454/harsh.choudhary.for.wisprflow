import React from 'react';
import { SITE_COPY } from '../../data/copy';

export const AboutIntro: React.FC = () => {
  return (
    <section
      className="about-intro-section"
      aria-labelledby="about-intro-heading"
    >
      <div className="editorial-shell about-intro-grid">
        <div className="about-intro-headline-wrap">
          <h1
            id="about-intro-heading"
            tabIndex={-1}
            className="display-h1 about-intro-heading"
          >
            A somewhat unconventional career path{' '}
            <span className="about-intro-parenthetical">
              (at least as per my parents).
            </span>
          </h1>
        </div>

        <div className="about-intro-body-wrap">
          <p className="body-editorial">{SITE_COPY.about.intro.body}</p>
        </div>
      </div>
    </section>
  );
};

