import React from 'react';

interface ClayIconProps {
  name: string;
  className?: string;
}

export const ClayIcon: React.FC<ClayIconProps> = ({ name, className = '' }) => {
  switch (name) {
    case 'chart':
      return (
        <div className={`clay-icon-badge ${className}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="clay-icon-svg" fill="none">
            <rect x="3" y="13" width="4.5" height="8" rx="1.5" fill="#7c3aed" />
            <rect x="9.75" y="8" width="4.5" height="13" rx="1.5" fill="#7c3aed" />
            <rect x="16.5" y="3" width="4.5" height="18" rx="1.5" fill="#7c3aed" />
          </svg>
        </div>
      );

    case 'search':
      return (
        <div className={`clay-icon-badge ${className}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="clay-icon-svg" fill="none">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="#7c3aed" strokeWidth="2.75" />
            <path
              d="M15.5 15.5L20.5 20.5"
              stroke="#7c3aed"
              strokeWidth="2.75"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    case 'layers':
      return (
        <div className={`clay-icon-badge ${className}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="clay-icon-svg" fill="none">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              fill="#7c3aed"
              fillOpacity="0.9"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="#7c3aed"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="#7c3aed"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'target':
      return (
        <div className={`clay-icon-badge ${className}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="clay-icon-svg" fill="none">
            <circle cx="12" cy="12" r="8.5" stroke="#7c3aed" strokeWidth="2.2" />
            <circle cx="12" cy="12" r="4.5" stroke="#7c3aed" strokeWidth="2.2" />
            <circle cx="12" cy="12" r="1.5" fill="#7c3aed" />
          </svg>
        </div>
      );

    case 'user':
      return (
        <div className={`clay-icon-badge ${className}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="clay-icon-svg" fill="none">
            <circle cx="12" cy="8" r="4.25" stroke="#7c3aed" strokeWidth="2.2" />
            <path
              d="M5 20C5 16.5 8 14.5 12 14.5C16 14.5 19 16.5 19 20"
              stroke="#7c3aed"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    case 'file':
      return (
        <div className={`clay-icon-badge ${className}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="clay-icon-svg" fill="none">
            <path
              d="M6 3H14L19 8V20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20V4C5 3.4 5.4 3 6 3Z"
              stroke="#7c3aed"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M14 3V8H19" stroke="#7c3aed" strokeWidth="2" strokeLinejoin="round" />
            <path d="M9 13H15" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 17H13" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'cpu':
      return (
        <div className={`clay-icon-badge ${className}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="clay-icon-svg" fill="none">
            <rect x="5" y="5" width="14" height="14" rx="2" stroke="#7c3aed" strokeWidth="2.2" />
            <rect x="9" y="9" width="6" height="6" rx="1" fill="#7c3aed" />
            <path d="M9 2V5M15 2V5M9 19V22M15 19V22M2 9H5M2 15H5M19 9H22M19 15H22" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'compass':
      return (
        <div className={`clay-icon-badge ${className}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="clay-icon-svg" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#7c3aed" strokeWidth="2.2" />
            <polygon points="16,8 14,14 8,16 10,10" fill="#7c3aed" />
          </svg>
        </div>
      );

    case 'handshake':
      return (
        <div className={`clay-icon-badge ${className}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="clay-icon-svg" fill="none">
            <path
              d="M3 10L8 5L13 10L17 6L21 10M11 13L13 15M8 16L11 19M16 14L13 17"
              stroke="#7c3aed"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="4" y="11" width="16" height="8" rx="2" stroke="#7c3aed" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'sparkles':
      return (
        <div className={`clay-icon-badge ${className}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="clay-icon-svg" fill="none">
            <path
              d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z"
              fill="#7c3aed"
            />
            <circle cx="18" cy="17" r="2" fill="#7c3aed" />
          </svg>
        </div>
      );

    case 'code':
      return (
        <div className={`clay-icon-badge ${className}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="clay-icon-svg" fill="none">
            <path
              d="M7 8L3 12L7 16M17 8L21 12L17 16M14 4L10 20"
              stroke="#7c3aed"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'hammer':
      return (
        <div className={`clay-icon-badge ${className}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="clay-icon-svg" fill="none">
            <path
              d="M14 6L18 10L16 12L12 8L14 6ZM4 18L10 12L12 14L6 20L4 18Z"
              stroke="#7c3aed"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'document':
      return (
        <div className="clay-doc-badge" aria-hidden="true">
          <svg viewBox="0 0 28 32" className="clay-doc-svg" fill="none">
            {/* Sheet of paper */}
            <path
              d="M3 4C3 2.89543 3.89543 2 5 2H19L25 8V28C25 29.1046 24.1046 30 23 30H5C3.89543 30 3 29.1046 3 28V4Z"
              fill="#ffffff"
              stroke="#e2dcd2"
              strokeWidth="1.5"
            />
            {/* Folded corner */}
            <path
              d="M19 2V8H25"
              fill="#ede6da"
              stroke="#e2dcd2"
              strokeWidth="1.5"
            />
            {/* Header pill */}
            <rect x="6.5" y="7" width="8" height="4" rx="1.5" fill="#7c3aed" />
            {/* Text lines */}
            <rect x="6.5" y="14" width="14" height="2" rx="1" fill="#9ca3af" />
            <rect x="6.5" y="18.5" width="12" height="2" rx="1" fill="#cbd5e1" />
            <rect x="6.5" y="23" width="9" height="2" rx="1" fill="#cbd5e1" />
          </svg>
        </div>
      );

    default:
      return null;
  }
};

