import React, { useEffect, useRef } from 'react';
import { StrengthItem } from '../../data/copy';
import { AssetStage } from '../shared/AssetStage';

interface CharacterLorePanelProps {
  strength: StrengthItem | null;
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

  return (
    <dialog
      ref={dialogRef}
      className="lore-dossier"
      aria-labelledby="lore-dossier-title"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      {strength && (
        <div
          className="lore-dossier__sheet"
          style={{ '--dossier-accent': strength.accentVar } as React.CSSProperties}
        >
          <div className="lore-dossier__header">
            <div className="lore-dossier__heading-group">
              <span className="lore-dossier__kicker">Character lore dossier</span>
              <h3 id="lore-dossier-title" className="lore-dossier__title">
                {strength.title}
              </h3>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => void performAnimatedClose()}
              className="lore-dossier__close"
              aria-label={`Close ${strength.title} lore panel`}
            >
              Close
            </button>
          </div>

          <p className="lore-dossier__quote">{strength.description}</p>

          <div className="lore-dossier__body">
            <div className="lore-dossier__copy-placeholder">
              <span className="lore-dossier__slot-tag">
                Character lore · 2–3 line field note
              </span>
              <div className="lore-dossier__lines" aria-hidden="true">
                <span />
                <span />
                <span className="short" />
              </div>
              <p className="lore-dossier__placeholder-note">
                Reserved for Harsh&apos;s supplied 2–3 line proof-of-work note
                on <strong>{strength.title}</strong>.
              </p>
            </div>

            <div className="lore-dossier__evidence">
              <AssetStage
                assetId={strength.loreAssetId}
                proxyVariant="lore-evidence"
                activeAccent={strength.accentVar}
                className="lore-dossier__evidence-stage"
              />
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
};

