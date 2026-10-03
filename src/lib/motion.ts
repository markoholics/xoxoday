import type { Transition, Variants } from 'framer-motion';

/** Motion tokens. One file. Motion explains, gives feedback, reveals or orients. */
export const duration = { fast: 0.12, base: 0.2, slow: 0.32, long: 0.6 } as const;
export const ms = { fast: 120, base: 200, slow: 320, long: 600 } as const;
export const ease = [0.22, 1, 0.36, 1] as const;
export const spring: Transition = { type: 'spring', stiffness: 260, damping: 26 };
export const stagger = 0.06; // 60ms

export const t = {
  fast: { duration: duration.fast, ease } as Transition,
  base: { duration: duration.base, ease } as Transition,
  slow: { duration: duration.slow, ease } as Transition,
  long: { duration: duration.long, ease } as Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: t.slow },
};

export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: t.base },
};

export const panel: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { ...t.base, staggerChildren: 0.04, delayChildren: 0.03 } },
  exit: { opacity: 0, scale: 0.98, transition: t.fast },
};

export const panelItem: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: t.base },
};

export const press = { scale: 0.98 };
export const lift = { y: -2 };
