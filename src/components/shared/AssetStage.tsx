import React, { useEffect, useRef, useState } from 'react';
import { ASSET_MANIFEST, AssetDefinition } from '../../config/assets';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export type ProxyVariant =
  | 'hero-stage'
  | 'wispr-ripple'
  | 'why-me-character'
  | 'why-hire-workspace'
  | 'beyond-reading'
  | 'beyond-building'
  | 'beyond-football'
  | 'beyond-training'
  | 'lore-evidence'
  | 'career-grant-thornton'
  | 'career-ian'
  | 'career-kalaari'
  | 'career-independent';

interface AssetStageProps {
  assetId: string;
  proxyVariant: ProxyVariant;
  className?: string;
  activeAccent?: string;
  emoteStateLabel?: string;
  emoteStepIndex?: number;
  priority?: boolean;
  frameless?: boolean;
  paused?: boolean;
  overrideSrc?: string | null;
}

/**
 * Architectural & Silhouette Composition Proxies (Phase 1)
 * Communicates subject scale, horizon line, focal weight, and text-safe space
 * without imitating final 3D/clay renders or defaulting to rounded placeholder cards.
 */
const ArchitecturalProxySVG: React.FC<{
  variant: ProxyVariant;
  accent?: string;
  emoteStepIndex?: number;
}> = ({ variant, accent = 'var(--clay-green)', emoteStepIndex = 0 }) => {
  switch (variant) {
    case 'hero-stage':
      return (
        <svg
          viewBox="0 0 960 600"
          className="proxy-svg proxy-svg--hero"
          aria-hidden="true"
        >
          {/* Open negative space guides (upper studio zone) */}
          <line x1="60" y1="430" x2="900" y2="430" className="proxy-horizon" />
          <line x1="480" y1="70" x2="480" y2="540" className="proxy-axis" />

          {/* Photorealistic Harsh upper/mid silhouette study (behind miniature table plane) */}
          <g className="proxy-figure-group">
            <ellipse cx="486" cy="166" rx="38" ry="46" className="proxy-silhouette-head" />
            <path
              d="M392 398 C396 290, 424 234, 486 234 C548 234, 576 290, 582 398 Z"
              className="proxy-silhouette-torso"
            />
            {/* Extending arm placing miniature clay piece into foreground */}
            <path
              d="M548 286 C568 332, 548 378, 514 406"
              className="proxy-gesture-line"
            />
            <circle cx="508" cy="412" r="9" fill={accent} opacity="0.85" />
          </g>

          {/* Richly detailed miniature clay landscape foreground massing */}
          <g className="proxy-miniature-foreground">
            <path
              d="M110 492 L220 430 L740 430 L850 492 L790 546 L170 546 Z"
              className="proxy-plinth"
            />
            {/* Miniature architectural blocks & sculpted terrain */}
            <rect x="252" y="384" width="66" height="46" className="proxy-mass" />
            <polygon points="246,384 285,358 324,384" className="proxy-mass-roof" />
            <rect x="358" y="396" width="52" height="34" className="proxy-mass" />
            {/* Focal clay object being placed */}
            <rect
              x="484"
              y="398"
              width="44"
              height="32"
              stroke={accent}
              strokeWidth="1.6"
              fill="color-mix(in srgb, var(--clay-green) 14%, transparent)"
            />
            <circle cx="614" cy="408" r="22" className="proxy-mass" />
            <path d="M664 430 Q696 382 728 430 Z" className="proxy-mass" />
            {/* Foreground terrain ridge */}
            <path
              d="M150 512 C280 488, 390 524, 520 502 C630 484, 720 516, 810 500"
              className="proxy-contour"
            />
          </g>
        </svg>
      );

    case 'wispr-ripple':
      return (
        <svg viewBox="0 0 240 240" className="proxy-svg" aria-hidden="true">
          <ellipse cx="120" cy="192" rx="54" ry="10" className="proxy-shadow" />
          <path
            d="M66 136 C66 92, 98 64, 126 70 C156 76, 178 106, 170 140 C162 170, 124 178, 94 166 C74 158, 66 148, 66 136 Z"
            className="proxy-mass"
          />
          <path
            d="M86 128 C96 102, 130 96, 146 118 C156 132, 142 152, 116 150"
            fill="none"
            stroke="var(--clay-green)"
            strokeWidth="1.5"
          />
          <circle cx="120" cy="124" r="6" fill="var(--clay-green)" opacity="0.7" />
        </svg>
      );

    case 'why-me-character': {
      const headTilt = [-2, 4, -4, 3, 0, -3][emoteStepIndex % 6];
      const armRaise = [0, -4, -12, -8, -3, -16][emoteStepIndex % 6];
      return (
        <svg viewBox="0 0 400 500" className="proxy-svg" aria-hidden="true">
          {/* Studio plinth shadow */}
          <ellipse cx="200" cy="438" rx="84" ry="15" className="proxy-shadow" />
          <line x1="76" y1="438" x2="324" y2="438" className="proxy-horizon" />

          {/* Full-body clay Harsh silhouette study */}
          <g
            style={{
              transform: `translateY(${armRaise * 0.2}px)`,
              transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Head */}
            <g
              style={{
                transformOrigin: '200px 128px',
                transform: `rotate(${headTilt}deg)`,
                transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <ellipse cx="200" cy="116" rx="34" ry="40" className="proxy-silhouette-head" />
              <path d="M170 102 Q200 72 230 102" className="proxy-contour" />
            </g>

            {/* Cream T-shirt torso */}
            <path
              d="M152 168 C164 158, 236 158, 248 168 L258 282 L142 282 Z"
              className="proxy-silhouette-torso"
            />
            {/* Arms with subtle emote response */}
            <path
              d={`M152 176 C128 214, 130 252, 144 ${274 + armRaise}`}
              className="proxy-gesture-line"
            />
            <path
              d={`M248 176 C274 210, 274 244, 256 ${266 + armRaise}`}
              stroke={accent}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Jeans legs */}
            <path
              d="M158 282 L152 424 L188 424 L196 322 L204 322 L212 424 L248 424 L242 282 Z"
              className="proxy-mass"
            />
            {/* Active strength accent marker */}
            <circle cx="256" cy={266 + armRaise} r="6" fill={accent} />
          </g>
        </svg>
      );
    }

    case 'why-hire-workspace':
      return (
        <svg viewBox="0 0 800 450" className="proxy-svg" aria-hidden="true">
          <line x1="48" y1="336" x2="752" y2="336" className="proxy-horizon" />
          {/* Open calm workbench */}
          <polygon
            points="140,336 220,276 640,276 700,336"
            className="proxy-plinth"
          />
          <rect x="140" y="336" width="560" height="16" className="proxy-mass" />
          {/* Completed coherent prototype anchor */}
          <g>
            <rect
              x="364"
              y="206"
              width="112"
              height="70"
              fill="color-mix(in srgb, var(--clay-green) 12%, var(--paper))"
              stroke="var(--clay-green)"
              strokeWidth="1.6"
            />
            <circle cx="420" cy="241" r="18" fill="none" stroke="var(--clay-green)" strokeWidth="1.5" />
            <line x1="384" y1="192" x2="456" y2="192" stroke="var(--ink)" strokeWidth="1.2" />
          </g>
          {/* Purposeful surrounding tools */}
          <rect x="242" y="254" width="46" height="22" className="proxy-mass" />
          <circle cx="546" cy="264" r="12" className="proxy-mass" />
          <rect x="574" y="258" width="38" height="18" className="proxy-mass" />
        </svg>
      );

    case 'beyond-reading':
      return (
        <svg viewBox="0 0 220 220" className="proxy-svg" aria-hidden="true">
          <ellipse cx="110" cy="182" rx="58" ry="10" className="proxy-shadow" />
          {/* Sculpted clay open book + abstract desert dune ridge */}
          <path d="M52 148 L108 134 L108 82 L52 94 Z" className="proxy-mass" />
          <path d="M168 148 L112 134 L112 82 L168 94 Z" className="proxy-silhouette-torso" />
          <path
            d="M64 118 Q96 96 112 114 T156 108"
            fill="none"
            stroke="var(--clay-yellow)"
            strokeWidth="2"
          />
        </svg>
      );

    case 'beyond-building':
      return (
        <svg viewBox="0 0 220 220" className="proxy-svg" aria-hidden="true">
          <ellipse cx="110" cy="182" rx="52" ry="10" className="proxy-shadow" />
          <rect x="68" y="88" width="84" height="68" className="proxy-mass" />
          <circle cx="96" cy="122" r="12" fill="none" stroke="var(--clay-blue)" strokeWidth="1.8" />
          <line x1="122" y1="108" x2="138" y2="108" stroke="var(--ink)" strokeWidth="1.6" />
          <line x1="122" y1="122" x2="138" y2="122" stroke="var(--clay-blue)" strokeWidth="1.6" />
          <rect x="88" y="72" width="44" height="16" className="proxy-silhouette-torso" />
        </svg>
      );

    case 'beyond-football':
      return (
        <svg viewBox="0 0 220 220" className="proxy-svg" aria-hidden="true">
          <ellipse cx="110" cy="182" rx="46" ry="9" className="proxy-shadow" />
          <circle cx="110" cy="122" r="46" className="proxy-silhouette-torso" />
          <polygon
            points="110,98 126,110 120,128 100,128 94,110"
            fill="color-mix(in srgb, var(--clay-red) 20%, transparent)"
            stroke="var(--clay-red)"
            strokeWidth="1.4"
          />
        </svg>
      );

    case 'beyond-training':
      return (
        <svg viewBox="0 0 220 220" className="proxy-svg" aria-hidden="true">
          <ellipse cx="110" cy="184" rx="56" ry="10" className="proxy-shadow" />
          <circle cx="110" cy="122" r="48" className="proxy-mass" />
          <circle cx="110" cy="122" r="32" className="proxy-plinth" />
          <circle cx="110" cy="122" r="11" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
        </svg>
      );

    case 'lore-evidence':
      return (
        <svg viewBox="0 0 480 340" className="proxy-svg" aria-hidden="true">
          <rect x="36" y="34" width="408" height="272" className="proxy-plinth" />
          <line x1="36" y1="74" x2="444" y2="74" className="proxy-horizon" />
          <rect x="68" y="104" width="180" height="126" className="proxy-mass" />
          <line x1="274" y1="118" x2="404" y2="118" className="proxy-horizon" />
          <line x1="274" y1="142" x2="388" y2="142" className="proxy-horizon" />
          <line x1="274" y1="166" x2="396" y2="166" className="proxy-horizon" />
          <circle cx="158" cy="167" r="22" fill="none" stroke={accent} strokeWidth="1.6" />
        </svg>
      );

    case 'career-grant-thornton':
      return (
        <svg viewBox="0 0 800 450" className="proxy-svg" aria-hidden="true">
          <line x1="0" y1="378" x2="800" y2="378" className="proxy-horizon" />
          {/* Symmetrical institutional consulting facade */}
          <rect x="230" y="148" width="340" height="230" className="proxy-silhouette-torso" />
          <rect x="214" y="132" width="372" height="18" className="proxy-mass" />
          {/* Classical column rhythm */}
          {[266, 326, 386, 446, 506].map((x) => (
            <rect key={x} x={x} y="176" width="28" height="124" className="proxy-plinth" />
          ))}
          {/* Open cutaway entrance & project table */}
          <rect
            x="362"
            y="314"
            width="76"
            height="64"
            fill="color-mix(in srgb, var(--clay-green) 16%, var(--paper))"
            stroke="var(--clay-green)"
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'career-ian':
      return (
        <svg viewBox="0 0 800 450" className="proxy-svg" aria-hidden="true">
          <line x1="0" y1="378" x2="800" y2="378" className="proxy-horizon" />
          {/* Collaborative startup pavilion */}
          <rect x="210" y="192" width="250" height="186" className="proxy-silhouette-torso" />
          <rect x="460" y="228" width="146" height="150" className="proxy-plinth" />
          <polygon points="198,192 335,142 472,192" className="proxy-mass" />
          {/* Cutaway meeting table + small prototypes */}
          <rect
            x="266"
            y="296"
            width="138"
            height="52"
            fill="color-mix(in srgb, var(--clay-blue) 14%, var(--paper))"
            stroke="var(--clay-blue)"
            strokeWidth="1.5"
          />
          <circle cx="314" cy="318" r="9" fill="var(--clay-yellow)" />
          <rect x="342" y="310" width="24" height="16" className="proxy-mass" />
        </svg>
      );

    case 'career-kalaari':
      return (
        <svg viewBox="0 0 800 450" className="proxy-svg" aria-hidden="true">
          <line x1="0" y1="378" x2="800" y2="378" className="proxy-horizon" />
          {/* Substantial VC office & research studio */}
          <rect x="176" y="108" width="448" height="270" className="proxy-silhouette-torso" />
          <rect x="160" y="92" width="480" height="18" className="proxy-mass" />
          {/* Library grid wing + research table wing */}
          <rect x="212" y="144" width="172" height="106" className="proxy-plinth" />
          <line x1="212" y1="178" x2="384" y2="178" className="proxy-horizon" />
          <line x1="212" y1="212" x2="384" y2="212" className="proxy-horizon" />
          <rect x="416" y="144" width="172" height="106" className="proxy-plinth" />
          <circle cx="502" cy="197" r="24" fill="none" stroke="var(--clay-green)" strokeWidth="1.6" />
          {/* Grand central studio window / investment table */}
          <rect
            x="324"
            y="282"
            width="152"
            height="96"
            fill="color-mix(in srgb, var(--clay-green) 15%, var(--paper))"
            stroke="var(--clay-green)"
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'career-independent':
      return (
        <svg viewBox="0 0 800 450" className="proxy-svg" aria-hidden="true">
          <line x1="0" y1="378" x2="800" y2="378" className="proxy-horizon" />
          {/* Smaller open-air founder's workshop */}
          <rect x="256" y="204" width="288" height="174" className="proxy-silhouette-torso" />
          <line x1="240" y1="204" x2="560" y2="184" stroke="var(--ink)" strokeWidth="2" />
          {/* Open studio frame showing desk, abstract screen & prototypes in progress */}
          <rect x="292" y="248" width="216" height="130" className="proxy-plinth" />
          <rect
            x="352"
            y="276"
            width="68"
            height="44"
            fill="color-mix(in srgb, var(--clay-red) 15%, var(--paper))"
            stroke="var(--clay-red)"
            strokeWidth="1.5"
          />
          <line x1="330" y1="334" x2="474" y2="334" stroke="var(--ink)" strokeWidth="1.8" />
          <circle cx="448" cy="322" r="10" fill="var(--clay-yellow)" />
        </svg>
      );
  }
};

export const AssetStage: React.FC<AssetStageProps> = ({
  assetId,
  proxyVariant,
  className = '',
  activeAccent,
  emoteStateLabel,
  emoteStepIndex = 0,
  priority = false,
  frameless = false,
  paused = false,
  overrideSrc = null,
}) => {
  const asset: AssetDefinition | undefined = ASSET_MANIFEST[assetId];
  const prefersReducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaLoadFailed, setMediaLoadFailed] = useState(false);

  const shouldRenderRealMedia = Boolean(asset && asset.supplied && !mediaLoadFailed);
  const isNativeVideoFile = Boolean(
    asset && /\.(webm|mp4|mov)(\?|$)/i.test(asset.src)
  );
  const useStaticFrame = prefersReducedMotion || paused;

  // Pause offscreen or explicitly paused videos per `design.md` Section 6.4
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !shouldRenderRealMedia || !isNativeVideoFile) return;

    if (useStaticFrame) {
      videoEl.pause();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl.play().catch(() => {});
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(videoEl);
    return () => observer.disconnect();
  }, [shouldRenderRealMedia, isNativeVideoFile, useStaticFrame]);

  if (!asset) return null;

  const isTransparentMedia =
    asset.type === 'transparent-still' || asset.type === 'transparent-video';

  const resolvedImgSrc =
    overrideSrc ||
    (useStaticFrame && (asset.posterSrc || asset.fallbackStillSrc)
      ? asset.posterSrc || asset.fallbackStillSrc || asset.src
      : asset.src);

  return (
    <figure
      className={`asset-stage ${
        frameless || isTransparentMedia ? 'asset-stage--frameless' : ''
      } ${
        shouldRenderRealMedia ? 'asset-stage--live' : 'asset-stage--proxy'
      } ${className}`}
      style={{ aspectRatio: asset.aspectRatio }}
      data-asset-id={asset.id}
    >
      {shouldRenderRealMedia ? (
        isNativeVideoFile ? (
          useStaticFrame && (asset.posterSrc || asset.fallbackStillSrc) ? (
            <img
              src={overrideSrc || asset.posterSrc || asset.fallbackStillSrc}
              alt={asset.alt}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              decoding="async"
              onError={() => setMediaLoadFailed(true)}
              className="asset-stage__media"
            />
          ) : (
            <video
              ref={videoRef}
              src={asset.src}
              poster={asset.posterSrc}
              muted
              loop
              playsInline
              autoPlay
              preload={priority ? 'auto' : 'metadata'}
              aria-label={asset.alt}
              onError={() => setMediaLoadFailed(true)}
              className="asset-stage__media"
            />
          )
        ) : (
          <img
            src={resolvedImgSrc}
            alt={asset.alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            onError={() => setMediaLoadFailed(true)}
            className="asset-stage__media"
          />
        )
      ) : (
        <div className="asset-proxy" role="img" aria-label={`${asset.alt} (Asset slot ${asset.id}: ${asset.filename})`}>
          {!frameless && (
            <>
              <span className="asset-proxy__tick asset-proxy__tick--tl" aria-hidden="true" />
              <span className="asset-proxy__tick asset-proxy__tick--tr" aria-hidden="true" />
              <span className="asset-proxy__tick asset-proxy__tick--bl" aria-hidden="true" />
              <span className="asset-proxy__tick asset-proxy__tick--br" aria-hidden="true" />
            </>
          )}

          <ArchitecturalProxySVG
            variant={proxyVariant}
            accent={activeAccent}
            emoteStepIndex={emoteStepIndex}
          />

          <figcaption className="asset-proxy__meta">
            <span className="asset-proxy__id">{asset.id}</span>
            <span className="asset-proxy__filename">{asset.filename}</span>
            {emoteStateLabel && (
              <span className="asset-proxy__state">{emoteStateLabel}</span>
            )}
          </figcaption>
        </div>
      )}
    </figure>
  );
};

