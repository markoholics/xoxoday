import { motion } from 'framer-motion';
import type { ReactNode, ElementType } from 'react';
import { fadeUp, fadeOnly, stagger } from '@/lib/motion';
import { useReducedMotion } from '@/lib/prefs';

/** Scroll reveal: fade up 12px, once only. Reduced motion: opacity only. */
export function Reveal({ children, className, delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: ElementType }) {
  const reduced = useReducedMotion();
  const M = (motion as unknown as Record<string, React.ComponentType<any>>)[as as string] ?? motion.div;
  if (typeof window !== 'undefined' && window.__PRERENDER__) {
    const T = as as ElementType;
    return <T className={className}>{children}</T>;
  }
  return (
    <M
      className={className}
      variants={reduced ? fadeOnly : fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ delay }}
    >
      {children}
    </M>
  );
}

/** Children reveal with a 60ms stagger. */
export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  if (typeof window !== 'undefined' && window.__PRERENDER__) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  if (typeof window !== 'undefined' && window.__PRERENDER__) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={reduced ? fadeOnly : fadeUp}>
      {children}
    </motion.div>
  );
}
