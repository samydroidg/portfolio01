import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  className?: string;
}

export default function Button({ children, variant = 'primary', href, className = '', ...props }: ButtonProps) {
  const base = 'relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium overflow-hidden';

  const variants = {
    primary:
      'bg-accent text-white hover:brightness-110 shadow-soft hover:shadow-elevated',
    secondary:
      'glass hover:bg-white/10 dark:hover:bg-white/8 hover:border-accent-border text-text-secondary hover:text-text',
    ghost:
      'text-text-muted hover:text-text hover:bg-accent-soft',
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        style={{ transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </a>
    );
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
      {...(props as any)}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
