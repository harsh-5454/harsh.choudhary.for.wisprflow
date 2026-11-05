import React, { useEffect, useRef, useState } from 'react';
import { StrengthItem } from '../../data/copy';
import { LORE_WIKI_DATA } from '../../data/loreData';

interface CharacterLorePanelProps {
  strength: StrengthItem | null;
  allStrengths?: StrengthItem[];
  onSelectStrength?: (strength: StrengthItem) => void;
  onClose: () => void;
}

let cachedSupportsDisplayTransition: boolean | undefined;
function canTransitionDisplay(): boolean {
  if (cachedSupportsDisplayTransition !== undefined) {
    return cachedSupportsDisplayTransition;
  }
  if (
    typeof window === 'undefined' ||
    !window.CSS?.supports?.('transition-behavior', 'allow-discrete') ||
    !document.body
  ) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText =
    'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  cachedSupportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return cachedSupportsDisplayTransition;
}

function supportsTopLayerExit(): boolean {
  return Boolean(
    typeof window !== 'undefined' &&
      window.CSS?.supports?.('overlay', 'auto') &&
      canTransitionDisplay()
  );
}

export const CharacterLorePanel: React.FC<CharacterLorePanelProps> = ({
  strength,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const screenContentRef = useRef<HTMLDivElement | null>(null);

  const [activeSectionId, setActiveSectionId] = useState<string>('lore-trait-01');

  const performAnimatedClose = async () => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open) {
      onClose();
      return;
    }

    if (!supportsTopLayerExit()) {
      dialog.setAttribute('data-closing', '');
      const animations = dialog.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((resolve) => setTimeout(resolve, 320)),
        ]);
      }
      dialog.removeAttribute('data-closing');
    }

    dialog.close();
    onClose();
    previousActiveElementRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (strength) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      if (!dialog.open) {
        dialog.showModal();
      }
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus({ preventScroll: true });
        if (screenContentRef.current) {
          screenContentRef.current.scrollTop = 0;
        }
      });
    } else if (dialog.open) {
      dialog.close();
    }
  }, [strength]);

  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    void performAnimatedClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      void performAnimatedClose();
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="lore-dossier"
      aria-labelledby="lore-dossier-title"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      {strength && (
        <div className="clay-computer-chassis" role="region" aria-label="Clay Computer Workstation">
          {/* Top Chassis Bezel: Tactile plasticine details */}
          <div className="clay-computer-bezel-top">
            <div className="clay-computer-vent-slits" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="clay-computer-badge">
              <span className="clay-badge-dot" />
              <span className="clay-badge-text">WISPR·OS // CLAY-TERMINAL 96</span>
            </div>

            <div className="clay-computer-controls">
              <div className="clay-power-indicator" title="System Online">
                <span className="clay-led-light" />
                <span className="clay-led-label">ONLINE</span>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => void performAnimatedClose()}
                className="clay-close-keycap"
                aria-label="Close computer screen popup (ESC)"
              >
                <span className="clay-keycap-legend">✕ ESC</span>
              </button>
            </div>
          </div>

          {/* Deeply Recessed Screen Housing */}
          <div className="clay-computer-screen-housing">
            {/* Glossy CRT/Glass reflection highlight */}
            <div className="clay-screen-glare" aria-hidden="true" />

            {/* Inner Monitor Screen: The Wiki Experience */}
            <div
              ref={screenContentRef}
              className="clay-computer-screen"
              role="document"
            >
              {/* Wiki Navigation Bar */}
              <header className="wiki-navbar">
                <div className="wiki-navbar__brand">
                  <div className="wiki-navbar__emblem" aria-hidden="true">
                    📖
                  </div>
                  <div>
                    <h1 id="lore-dossier-title" className="wiki-navbar__title">
                      WISPR-WIKI
                    </h1>
                    <span className="wiki-navbar__tagline">
                      Character Lore · Traits & Abilities
                    </span>
                  </div>
                </div>

                {/* Wiki Tools / Navigation */}
                <nav className="wiki-navbar__tabs" aria-label="Wiki sections">
                  {LORE_WIKI_DATA.traits.map((trait) => (
                    <button
                      key={trait.id}
                      type="button"
                      onClick={() => scrollToSection(`lore-trait-${trait.number}`)}
                      className={`wiki-nav-tab ${
                        activeSectionId === `lore-trait-${trait.number}`
                          ? 'is-active'
                          : ''
                      }`}
                    >
                      {trait.number}. {trait.title.split('&')[0].trim()}
                    </button>
                  ))}
                </nav>
              </header>

              {/* Wiki Subheader & Breadcrumbs */}
              <div className="wiki-breadcrumbs-bar">
                <div className="wiki-breadcrumbs">
                  <span>Home</span>
                  <span className="sep">/</span>
                  <span>Personnel</span>
                  <span className="sep">/</span>
                  <span>Candidates</span>
                  <span className="sep">/</span>
                  <span className="current">{LORE_WIKI_DATA.meta.title}</span>
                </div>
                <div className="wiki-meta-tag">
                  <span className="wiki-meta-badge">Canonical Entry</span>
                  <span className="wiki-meta-date">
                    Last revision: {LORE_WIKI_DATA.meta.lastRevision}
                  </span>
                </div>
              </div>

              {/* Main Wiki Layout: Article + Infobox */}
              <div className="wiki-layout" id="section-top">
                {/* Left: Main Article Content */}
                <main className="wiki-article">
                  <header className="wiki-article__header">
                    <h2 className="wiki-article__title">
                      {LORE_WIKI_DATA.meta.title}
                    </h2>
                    <p className="wiki-article__subtitle">
                      {LORE_WIKI_DATA.meta.subtitle}
                    </p>
                  </header>

                  {/* Clean, focused character traits & abilities sections */}
                  <div className="wiki-traits-container">
                    {LORE_WIKI_DATA.traits.map((trait, index) => (
                      <React.Fragment key={trait.id}>
                        <section
                          id={`lore-trait-${trait.number}`}
                          className="wiki-trait-section"
                        >
                          <div className="wiki-trait-section__header">
                            <h3 className="wiki-trait-title">
                              {trait.number}. {trait.title}
                            </h3>
                            <span className="wiki-trait-anchor" aria-hidden="true">
                              [lore::{trait.id}]
                            </span>
                          </div>

                          <div className="wiki-special-ability-card">
                            <span className="wiki-special-ability-label">
                              Special ability:
                            </span>
                            <span className="wiki-special-ability-text">
                              {trait.specialAbility}
                            </span>
                          </div>

                          <div className="wiki-trait-paragraphs">
                            {trait.paragraphs.map((p, pIndex) => (
                              <p key={pIndex} className="wiki-trait-paragraph">
                                {p}
                              </p>
                            ))}
                          </div>
                        </section>

                        {index < LORE_WIKI_DATA.traits.length - 1 && (
                          <hr className="wiki-trait-divider" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </main>

                {/* Right Column: Classic Wiki Infobox */}
                <aside className="wiki-infobox" aria-label="Harsh Choudhary dossier infobox">
                  <div className="wiki-infobox__title">
                    {LORE_WIKI_DATA.infobox.name}
                  </div>
                  <div className="wiki-infobox__subtitle">
                    {LORE_WIKI_DATA.infobox.subtitle}
                  </div>

                  {/* Common Visual: Claymation avatar of Harsh in image placeholder */}
                  <div className="wiki-infobox__visual-wrapper">
                    <div className="wiki-visual-blend">
                      <img
                        src={LORE_WIKI_DATA.avatar.src}
                        alt={LORE_WIKI_DATA.avatar.alt}
                        className="wiki-visual-img wiki-avatar-img"
                        loading="eager"
                      />
                    </div>
                    <figcaption className="wiki-infobox__visual-caption">
                      {LORE_WIKI_DATA.avatar.caption}
                    </figcaption>
                  </div>

                  {/* Infobox Key-Value Rows */}
                  <table className="wiki-infobox__table">
                    <tbody>
                      <tr>
                        <th scope="row">Role</th>
                        <td>{LORE_WIKI_DATA.infobox.role}</td>
                      </tr>
                      <tr>
                        <th scope="row">Alignment</th>
                        <td>
                          <span className="wiki-infobox-highlight">
                            {LORE_WIKI_DATA.infobox.alignment}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Target</th>
                        <td>{LORE_WIKI_DATA.infobox.targetTeam}</td>
                      </tr>
                      <tr>
                        <th scope="row">Status</th>
                        <td>
                          <span className="wiki-status-pill">
                            {LORE_WIKI_DATA.infobox.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Special Abilities</th>
                        <td>
                          <ul className="wiki-infobox-bullets">
                            {LORE_WIKI_DATA.infobox.traitsAndAbilities.map((t) => (
                              <li key={t.number}>
                                <strong>{t.name}:</strong> {t.specialAbility}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </aside>
              </div>
            </div>
          </div>

          {/* Bottom Chassis Chin: Tactile molded details */}
          <div className="clay-computer-bezel-bottom">
            <div className="clay-floppy-drive" aria-hidden="true">
              <span className="clay-floppy-slot" />
              <span className="clay-floppy-eject" />
            </div>

            <div className="clay-computer-model">
              <span>MODEL: LORE-STATION // ARCHIVE-REV-96</span>
            </div>

            <div className="clay-dial-cluster" aria-hidden="true">
              <span className="clay-knob" title="Contrast" />
              <span className="clay-knob" title="Brightness" />
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
};
