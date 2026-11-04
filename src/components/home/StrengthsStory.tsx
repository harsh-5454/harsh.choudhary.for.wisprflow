import React, { useEffect, useState } from 'react';
import { WHY_ME_REACTION_SOURCES } from '../../config/assets';
import { SITE_COPY, StrengthItem } from '../../data/copy';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { AssetStage } from '../shared/AssetStage';
import { EditorialSection } from '../shared/EditorialSection';
import { CharacterLorePanel } from './CharacterLorePanel';

const IDLE_EMOTE_SEQUENCE = [
  'Idle stance',
  'Looking around',
  'Subtle shrug',
  'Thoughtful gesture',
  'Confident nod',
  'Brief celebratory gesture',
] as const;

/**
 * Qualitative tactile bar widths (visual rhythm only — never numerical scores,
 * percentages, rankings, or HUD stats per `emergent_master_prompt.md` Section 5).
 */
const QUALITATIVE_BAR_SPANS: Record<StrengthItem['id'], string> = {
  'extreme-ownership': '88%',
  'high-agency': '84%',
  curiosity: '92%',
  adaptability: '86%',
};

export const StrengthsStory: React.FC = () => {
  const strengths = SITE_COPY.home.whyMe.strengths;
  const prefersReducedMotion = usePrefersReducedMotion();

  const [selectedId, setSelectedId] = useState<StrengthItem['id']>(
    strengths[0].id
  );
  const [openLoreStrength, setOpenLoreStrength] = useState<StrengthItem | null>(
    null
  );
  const [emoteIndex, setEmoteIndex] = useState<number>(0);
  const [emotePaused, setEmotePaused] = useState<boolean>(false);
  const [reactionFlash, setReactionFlash] = useState<string | null>(null);
  const [reactionOverrideSrc, setReactionOverrideSrc] = useState<string | null>(
    null
  );

  const activeStrength =
    strengths.find((s) => s.id === selectedId) ?? strengths[0];

  // Independent character idle/emote loop (not tied to scroll)
  useEffect(() => {
    if (prefersReducedMotion || emotePaused) return;
    const timer = window.setInterval(() => {
      setEmoteIndex((prev) => (prev + 1) % IDLE_EMOTE_SEQUENCE.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, emotePaused]);

  const handleSelectStrength = (item: StrengthItem, idx: number) => {
    setSelectedId(item.id);
    if (!prefersReducedMotion) {
      setEmoteIndex((idx + 3) % IDLE_EMOTE_SEQUENCE.length);
      setReactionFlash(item.emoteCue);
      setReactionOverrideSrc(WHY_ME_REACTION_SOURCES[item.id] ?? null);
    }
  };

  useEffect(() => {
    if (!reactionFlash) return;
    const timeout = window.setTimeout(() => {
      setReactionFlash(null);
      setReactionOverrideSrc(null);
    }, 1800);
    return () => window.clearTimeout(timeout);
  }, [reactionFlash]);

  const currentEmoteLabel = prefersReducedMotion
    ? 'Static pose (reduced motion)'
    : reactionFlash || IDLE_EMOTE_SEQUENCE[emoteIndex];

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
        {/* Left: One full-body clay/plasticine avatar running independent emote loop */}
        <div className="why-me-character-col">
          <AssetStage
            assetId="A06"
            proxyVariant="why-me-character"
            activeAccent={activeStrength.accentVar}
            emoteStateLabel={currentEmoteLabel}
            emoteStepIndex={emoteIndex}
            paused={emotePaused}
            overrideSrc={reactionOverrideSrc}
            frameless
            className={`why-me-character-figure ${
              reactionFlash ? 'is-reacting' : ''
            }`}
          />

          {!prefersReducedMotion && (
            <div className="why-me-loop-controls">
              <button
                type="button"
                className="subtle-text-control"
                onClick={() => setEmotePaused((p) => !p)}
                aria-pressed={emotePaused}
              >
                {emotePaused ? 'Resume character loop' : 'Pause character loop'}
              </button>
            </div>
          )}
        </div>

        {/* Right: Four qualitative strength attributes + active verbatim detail + lore trigger */}
        <div className="why-me-attributes-col">
          <div
            className="strength-attributes-list"
            role="listbox"
            aria-label="Personal strengths"
          >
            {strengths.map((item, idx) => {
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  className={`strength-row ${isSelected ? 'is-selected' : ''}`}
                  style={
                    {
                      '--strength-accent': item.accentVar,
                      '--bar-span': QUALITATIVE_BAR_SPANS[item.id],
                    } as React.CSSProperties
                  }
                >
                  <div className="strength-row__top">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectStrength(item, idx)}
                      className="strength-row__select"
                    >
                      <span className="strength-row__title">{item.title}</span>
                      <span className="strength-row__bar-track" aria-hidden="true">
                        <span className="strength-row__bar-fill" />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleSelectStrength(item, idx);
                        setOpenLoreStrength(item);
                      }}
                      className="strength-row__lore-trigger"
                      aria-haspopup="dialog"
                    >
                      <span>{SITE_COPY.home.whyMe.loreAffordance}</span>
                      <span aria-hidden="true" className="lore-arrow">
                        ↗
                      </span>
                    </button>
                  </div>

                  {/* Stable in-flow verbatim description reveal */}
                  <div
                    className={`strength-row__detail ${
                      isSelected ? 'is-expanded' : ''
                    }`}
                  >
                    <p className="strength-row__description">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="why-me-closing-line">
            {SITE_COPY.home.whyMe.closingLine}
          </p>
        </div>
      </div>

      <CharacterLorePanel
        strength={openLoreStrength}
        onClose={() => setOpenLoreStrength(null)}
      />
    </EditorialSection>
  );
};

