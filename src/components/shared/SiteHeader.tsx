import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SITE_COPY } from '../../data/copy';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function useEditorialNavigate() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (to: string) => {
    if (location.pathname === to) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      return;
    }

    const performNav = () => {
      navigate(to);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    const docWithVT = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };

    if (!prefersReducedMotion && typeof docWithVT.startViewTransition === 'function') {
      const transition = docWithVT.startViewTransition(() => {
        performNav();
      });
      transition.finished.finally(() => {
        const mainHeading = document.querySelector<HTMLElement>('main h1');
        mainHeading?.focus({ preventScroll: true });
      });
    } else {
      performNav();
      requestAnimationFrame(() => {
        const mainHeading = document.querySelector<HTMLElement>('main h1');
        mainHeading?.focus({ preventScroll: true });
      });
    }
  };
}

export const SiteHeader: React.FC = () => {
  const location = useLocation();
  const editorialNavigate = useEditorialNavigate();
  const isAbout = location.pathname === '/about';

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
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
    editorialNavigate(to);
  };

  return (
    <header className="site-header" role="banner">
      <div className="site-header__inner">
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="site-header__brand"
          aria-current={!isAbout ? 'page' : undefined}
        >
          {SITE_COPY.nav.name}
        </a>

        <nav aria-label="Primary">
          <a
            href="/about"
            onClick={(e) => handleLinkClick(e, '/about')}
            className={`site-header__nav-link ${isAbout ? 'is-active' : ''}`}
            aria-current={isAbout ? 'page' : undefined}
          >
            {SITE_COPY.nav.about}
          </a>
        </nav>
      </div>
    </header>
  );
};
