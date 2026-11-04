import React, { useState } from 'react';
import { SITE_COPY } from '../../data/copy';
import { AssetStage, ProxyVariant } from '../shared/AssetStage';
import { EditorialSection } from '../shared/EditorialSection';
import { ScrollTextSequence } from '../shared/ScrollTextSequence';

type BeyondKey = 'reading' | 'building' | 'football' | 'training';

const SCULPTURAL_OBJECTS: Array<{
  key: BeyondKey;
  assetId: string;
  variant: ProxyVariant;
  positionClass: string;
}> = [
  {
    key: 'reading',
    assetId: 'A13',
    variant: 'beyond-reading',
    positionClass: 'beyond-object--reading',
  },
  {
    key: 'building',
    assetId: 'A14',
    variant: 'beyond-building',
    positionClass: 'beyond-object--building',
  },
  {
    key: 'football',
    assetId: 'A15',
    variant: 'beyond-football',
    positionClass: 'beyond-object--football',
  },
  {
    key: 'training',
    assetId: 'A16',
    variant: 'beyond-training',
    positionClass: 'beyond-object--training',
  },
];

export const BeyondTheScreen: React.FC = () => {
  const [highlighted, setHighlighted] = useState<BeyondKey | null>(null);

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

      <div className="beyond-spread">
        <div className="beyond-narrative">
          <ScrollTextSequence>
            <p
              className={`body-editorial beyond-paragraph ${
                highlighted === 'reading' ? 'is-resonating' : ''
              }`}
              onMouseEnter={() => setHighlighted('reading')}
              onMouseLeave={() => setHighlighted(null)}
            >
              {SITE_COPY.home.beyond.readingLines[0]}
              <br />
              {SITE_COPY.home.beyond.readingLines[1]}
            </p>
          </ScrollTextSequence>

          <ScrollTextSequence delayMs={60}>
            <p
              className={`body-editorial beyond-paragraph ${
                highlighted === 'building' ? 'is-resonating' : ''
              }`}
              onMouseEnter={() => setHighlighted('building')}
              onMouseLeave={() => setHighlighted(null)}
            >
              {SITE_COPY.home.beyond.building}
            </p>
          </ScrollTextSequence>

          <ScrollTextSequence delayMs={120}>
            <p
              className={`body-editorial beyond-paragraph ${
                highlighted === 'football' ? 'is-resonating' : ''
              }`}
              onMouseEnter={() => setHighlighted('football')}
              onMouseLeave={() => setHighlighted(null)}
            >
              {SITE_COPY.home.beyond.football}
            </p>
          </ScrollTextSequence>
        </div>

        {/* Deliberate sculptural constellation — not a 4-card grid */}
        <div
          className="beyond-constellation"
          aria-label="Sculptural miniature objects representing personal interests"
        >
          {SCULPTURAL_OBJECTS.map((obj) => (
            <div
              key={obj.key}
              className={`beyond-object-item ${obj.positionClass} ${
                highlighted === obj.key ? 'is-active' : ''
              }`}
              onMouseEnter={() => setHighlighted(obj.key)}
              onMouseLeave={() => setHighlighted(null)}
            >
              <AssetStage
                assetId={obj.assetId}
                proxyVariant={obj.variant}
                frameless
                className="beyond-object-figure"
              />
            </div>
          ))}
        </div>
      </div>

      <ScrollTextSequence delayMs={160} className="beyond-signoff-wrap">
        <p
          className={`beyond-signoff ${
            highlighted === 'training' ? 'is-resonating' : ''
          }`}
          onMouseEnter={() => setHighlighted('training')}
          onMouseLeave={() => setHighlighted(null)}
        >
          {SITE_COPY.home.beyond.trainingQuestion}
        </p>
      </ScrollTextSequence>
    </EditorialSection>
  );
};

