import React from 'react';
import { CareerChapterCopy } from '../../data/copy';
import { AssetStage, ProxyVariant } from '../shared/AssetStage';

const CHAPTER_VARIANT_MAP: Record<CareerChapterCopy['id'], ProxyVariant> = {
  'grant-thornton': 'career-grant-thornton',
  ian: 'career-ian',
  kalaari: 'career-kalaari',
  'independent-building': 'career-independent',
};

interface CareerChapterProps {
  chapter: CareerChapterCopy;
}

/**
 * Full-flow editorial chapter used on mobile (<960px) and reduced-motion mode,
 * preserving 100% of copy in clean vertical reading order without horizontal swiping.
 */
export const CareerChapter: React.FC<CareerChapterProps> = ({ chapter }) => {
  return (
    <article
      className="career-vertical-chapter"
      aria-labelledby={`chapter-heading-${chapter.id}`}
    >
      <div className="career-vertical-chapter__visual">
        <AssetStage
          assetId={chapter.sceneAssetId}
          proxyVariant={CHAPTER_VARIANT_MAP[chapter.id]}
          activeAccent={chapter.accentColor}
          className="career-vertical-chapter__figure"
        />
      </div>

      <div className="career-vertical-chapter__content">
        <p className="chapter-eyebrow">{chapter.eyebrow}</p>
        {chapter.role && <p className="chapter-role">{chapter.role}</p>}
        <h2
          id={`chapter-heading-${chapter.id}`}
          className="display-h3 career-chapter-heading"
        >
          {chapter.heading}
        </h2>

        <div className="career-chapter-paragraphs">
          {chapter.paragraphs.map((p, idx) => (
            <p key={idx} className="body-editorial">
              {p}
            </p>
          ))}
        </div>

        {chapter.milestone && (
          <p className="career-chapter-milestone">{chapter.milestone}</p>
        )}

        {chapter.investments && chapter.investmentsHeading && (
          <div className="career-chapter-subblock">
            <h3 className="career-subblock-heading">
              {chapter.investmentsHeading}
            </h3>
            <div
              className="career-portfolio-logos-row career-portfolio-logos-row--vertical"
              role="list"
              aria-label={chapter.investmentsHeading}
            >
              {chapter.investments.map((inv) => (
                <div
                  key={inv.name}
                  role="listitem"
                  className="career-portfolio-logo-item"
                  title={inv.detail ? `${inv.name} — ${inv.detail}` : inv.name}
                >
                  {inv.logoSrc || inv.logoWebpSrc ? (
                    <picture>
                      {inv.logoWebpSrc && (
                        <source srcSet={inv.logoWebpSrc} type="image/webp" />
                      )}
                      <img
                        src={inv.logoSrc || inv.logoWebpSrc}
                        alt={inv.name}
                        className="career-portfolio-logo-img"
                        loading="lazy"
                      />
                    </picture>
                  ) : (
                    <div className="career-portfolio-badge">
                      <span className="career-portfolio-dot" />
                      <strong className="career-portfolio-name">{inv.name}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {chapter.writingList && chapter.writingHeading && (
          <div className="career-chapter-subblock">
            <h3 className="career-subblock-heading">
              {chapter.writingHeading}
            </h3>
            <ul className="career-subblock-list">
              {chapter.writingList.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong> — {item.subtitle}
                </li>
              ))}
            </ul>
          </div>
        )}

        {chapter.closing && (
          <p className="career-chapter-closing">{chapter.closing}</p>
        )}
      </div>
    </article>
  );
};

export { CHAPTER_VARIANT_MAP };

