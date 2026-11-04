import React from 'react';
import { SITE_COPY } from '../../data/copy';
import { EditorialSection } from '../shared/EditorialSection';
import { useEditorialNavigate } from '../shared/SiteHeader';

export const AboutBridge: React.FC = () => {
  const editorialNavigate = useEditorialNavigate();

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }
    e.preventDefault();
    editorialNavigate('/about');
  };

  return (
    <EditorialSection
      id="about-bridge"
      ariaLabelledBy="about-bridge-heading"
      className="about-bridge-section"
    >
      <div className="about-bridge-layout">
        <div className="about-bridge-content">
          <h2
            id="about-bridge-heading"
            className="display-h2 about-bridge-heading"
          >
            {SITE_COPY.home.aboutBridge.heading}
          </h2>

          <p className="body-editorial about-bridge-body">
            {SITE_COPY.home.aboutBridge.body}
          </p>

          <div className="about-bridge-action">
            <a
              href="/about"
              onClick={handleNavigate}
              className="about-bridge-link"
            >
              <span>{SITE_COPY.home.aboutBridge.linkText}</span>
            </a>
          </div>
        </div>
      </div>
    </EditorialSection>
  );
};

