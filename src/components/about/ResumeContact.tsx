import React from 'react';
import { SITE_COPY } from '../../data/copy';
import { EditorialSection } from '../shared/EditorialSection';
import { ResumeLinkControl } from '../shared/SiteFooter';

export const ResumeContact: React.FC = () => {
  return (
    <EditorialSection
      id="resume-contact"
      ariaLabelledBy="resume-contact-heading"
      className="resume-contact-section"
    >
      <div className="resume-contact-layout">
        <div className="resume-contact-main">
          <h2
            id="resume-contact-heading"
            className="display-h2 resume-contact-heading"
          >
            {SITE_COPY.about.resumeContact.heading}
          </h2>

          <p className="body-editorial resume-contact-body">
            {SITE_COPY.about.resumeContact.body}
          </p>

          <div className="resume-contact-cta">
            <ResumeLinkControl
              label={SITE_COPY.about.resumeContact.linkText}
              className="about-bridge-link"
            />
          </div>
        </div>
      </div>
    </EditorialSection>
  );
};

