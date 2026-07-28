import type { ReactNode } from 'react';
import { DURATION } from '../../constants/animation';

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  onClick?: () => void;
  href?: string;
}

export default function Card({ children, className = '', glass = false, hover = false, onClick, href }: CardProps) {
  const base = 'rounded-xl';

  const styles = glass
    ? 'glass shadow-soft'
    : 'bg-surface border border-border shadow-soft';

  const hoverStyles = hover
    ? 'cursor-pointer hover:border-border-hover hover:shadow-elevated hover:-translate-y-0.5'
    : '';

  const classes = `${base} ${styles} ${hoverStyles} ${className}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} style={{ transition: `all ${DURATION.hover}s cubic-bezier(0.16, 1, 0.3, 1)` }}>
        {children}
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={`${classes} text-left w-full`} style={{ transition: `all ${DURATION.hover}s cubic-bezier(0.16, 1, 0.3, 1)` }}>
        {children}
      </button>
    );
  }

  return <div className={classes}>{children}</div>;
}
