import React from 'react';
import { SITE_COPY } from '../../data/copy';
import { AssetStage } from '../shared/AssetStage';
import { EditorialSection } from '../shared/EditorialSection';
import { ScrollTextSequence } from '../shared/ScrollTextSequence';

export const WhyHireMeSection: React.FC = () => {
  return (
    <EditorialSection
      id="why-hire-me"
      ariaLabelledBy="why-hire-me-heading"
      className="why-hire-section"
    >
      <div className="why-hire-lead">
        <h2 id="why-hire-me-heading" className="display-h2 why-hire-heading">
          {SITE_COPY.home.whyHireMe.heading}
        </h2>
      </div>

      <div className="why-hire-body-grid">
        <div className="why-hire-prose">
          {SITE_COPY.home.whyHireMe.paragraphs.map((paragraph, idx) => (
            <ScrollTextSequence key={idx} delayMs={idx * 65}>
              <p className="body-editorial">{paragraph}</p>
            </ScrollTextSequence>
          ))}
        </div>

        <div className="why-hire-visual">
          <AssetStage
            assetId="A12"
            proxyVariant="why-hire-workspace"
            className="why-hire-stage-figure"
          />
        </div>
      </div>

      <ScrollTextSequence delayMs={120} className="why-hire-coda-wrap">
        <p className="why-hire-coda">
          <strong>{SITE_COPY.home.whyHireMe.closingBold}</strong>
        </p>
      </ScrollTextSequence>
    </EditorialSection>
  );
};

