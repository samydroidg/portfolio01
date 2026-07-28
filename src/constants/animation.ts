/* ─── Durations (ms) ─── */
export const DURATION = {
  micro: 0.15,
  hover: 0.2,
  cardReveal: 0.4,
  sectionReveal: 0.6,
  modal: 0.4,
  pageTransition: 0.6,
  loading: 1.8,
} as const;

/* ─── Easing presets ─── */
export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.25, 0.1, 0.25, 1],
  spring: { type: 'spring' as const, stiffness: 200, damping: 20 },
  springSnappy: { type: 'spring' as const, stiffness: 300, damping: 25 },
  springSoft: { type: 'spring' as const, stiffness: 150, damping: 18 },
} as const;

/* ─── Reusable Framer Motion variants ─── */
export const SPRING = { type: 'spring' as const, stiffness: 200, damping: 20 };

export const VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  fadeUp: (distance = 12) => ({
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: distance },
  }),

  fadeDown: (distance = 12) => ({
    initial: { opacity: 0, y: -distance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -distance },
  }),

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  blurIn: {
    initial: { opacity: 0, filter: 'blur(8px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(8px)' },
  },

  slideIn: (direction: 'left' | 'right' = 'left', distance = 16) => ({
    initial: { opacity: 0, x: direction === 'left' ? -distance : distance },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'left' ? -distance : distance },
  }),

  cardHover: {
    rest: { scale: 1, y: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.02), 0 2px 8px rgba(0,0,0,0.04)' },
    hover: {
      scale: 1.02,
      y: -2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.02)',
      transition: { duration: DURATION.hover, ease: EASE.out },
    },
  },

  staggerContainer: (staggerMs = 0.06) => ({
    animate: { transition: { staggerChildren: staggerMs } },
  }),

  staggerItem: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
  },

  press: {
    rest: { scale: 1 },
    tap: { scale: 0.98 },
  },
} as const;

/* ─── Viewport options for section reveals ─── */
export const VIEWPORT = {
  once: true,
  margin: '-80px',
} as const;
