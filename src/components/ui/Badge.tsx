import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default:
      'bg-accent-soft text-text-secondary border-accent-border',
    accent:
      'bg-accent-soft text-accent border-accent-border',
    success:
      'bg-emerald-500/8 text-emerald-400 border-emerald-500/20',
    warning:
      'bg-amber-500/8 text-amber-400 border-amber-500/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
