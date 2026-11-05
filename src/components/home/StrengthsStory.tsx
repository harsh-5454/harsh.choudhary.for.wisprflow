import React, { useState } from 'react';
import { SITE_COPY, StrengthItem } from '../../data/copy';
import { AssetStage } from '../shared/AssetStage';
import { EditorialSection } from '../shared/EditorialSection';
import { CharacterLorePanel } from './CharacterLorePanel';

const CLAY_ICONS: Record<StrengthItem['id'], { src: string; alt: string }> = {
  'extreme-ownership': {
    src: '/assets/why-me/clay_icon_ownership.png',
    alt: 'Sculpted green clay icon for extreme ownership',
  },
  'high-agency': {
    src: '/assets/why-me/clay_icon_agency.png',
    alt: 'Sculpted orange crossed tools clay icon for high agency',
  },
  curiosity: {
    src: '/assets/why-me/clay_icon_curiosity.png',
    alt: 'Sculpted purple binoculars clay icon for curiosity',
  },
  adaptability: {
    src: '/assets/why-me/clay_icon_adaptability.png',
    alt: 'Sculpted blue open book clay icon for adaptability',
  },
};

export const StrengthsStory: React.FC = () => {
  const strengths = SITE_COPY.home.whyMe.strengths;

  const [selectedId, setSelectedId] = useState<StrengthItem['id']>(
    strengths[0].id
  );
  const [openLoreStrength, setOpenLoreStrength] = useState<StrengthItem | null>(
    null
  );

  return (
    <EditorialSection
      id="why-me"
      ariaLabelledBy="why-me-heading"
      className="why-me-section"
    >
      <div className="why-me-header">
        <h2 id="why-me-heading" className="display-h2 why-me-heading">
          {SITE_COPY.home.whyMe.heading}
        </h2>
      </div>

      <div className="why-me-stage">
        {/* Left: Plasticine character 360-degree rotation video */}
        <div className="why-me-character-col">
          <AssetStage
            assetId="A06"
            proxyVariant="why-me-character"
            frameless
            className="why-me-character-figure"
          />
        </div>

        {/* Right: Character Powers / Abilities in authentic claymation style */}
        <div className="why-me-attributes-col">
          <div className="character-powers-header">
            <h3 className="character-powers-heading">Character Powers / Abilities</h3>
          </div>

          <div
            className="character-powers-list"
            role="region"
            aria-label="Character Powers and Abilities"
          >
            {strengths.map((item) => {
              const icon = CLAY_ICONS[item.id];
              return (
                <div key={item.id} className="clay-power-row">
                  <div className="clay-power-row__icon-tile" aria-hidden="true">
                    <img
                      src={icon.src}
                      alt={icon.alt}
                      className="clay-power-row__icon-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="clay-power-row__main">
                    <div className="clay-power-row__top">
                      <span className="clay-power-row__title">{item.title}</span>
                      <span
                        className="clay-power-row__score"
                        aria-label="Power level: 9.5 out of 10"
                      >
                        9.5/10
                      </span>
                    </div>

                    <div className="clay-power-row__bar-track" aria-hidden="true">
                      <div
                        className={`clay-power-row__bar-fill clay-power-row__bar-fill--${item.id}`}
                        style={{ width: '95%' }}
                      />
                    </div>

                    <p className="clay-power-row__description">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Single "Explore character lore" button with previous clean editorial design */}
          <div className="why-me-single-action">
            <button
              type="button"
              onClick={() => {
                const active =
                  strengths.find((s) => s.id === selectedId) ?? strengths[0];
                setOpenLoreStrength(active);
              }}
              className="why-me-lore-trigger"
              aria-haspopup="dialog"
            >
              <span>{SITE_COPY.home.whyMe.loreAffordance}</span>
              <span aria-hidden="true" className="lore-arrow">
                ↗
              </span>
            </button>
          </div>
        </div>
      </div>

      <CharacterLorePanel
        strength={openLoreStrength}
        allStrengths={strengths}
        onSelectStrength={(item) => {
          setSelectedId(item.id);
          setOpenLoreStrength(item);
        }}
        onClose={() => setOpenLoreStrength(null)}
      />
    </EditorialSection>
  );
};
