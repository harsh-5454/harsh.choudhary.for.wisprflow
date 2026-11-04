import React from 'react';

interface EditorialSectionProps {
  id?: string;
  ariaLabelledBy?: string;
  className?: string;
  children: React.ReactNode;
}

export const EditorialSection: React.FC<EditorialSectionProps> = ({
  id,
  ariaLabelledBy,
  className = '',
  children,
}) => {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`editorial-section ${className}`}
    >
      <div className="editorial-shell">{children}</div>
    </section>
  );
};

