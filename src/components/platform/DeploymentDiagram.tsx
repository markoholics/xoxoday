import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { useActive } from '@/lib/hooks';
import { useReducedMotion } from '@/lib/prefs';
import { t } from '@/lib/motion';

export type Mode = 'cloud' | 'hybrid' | 'onprem';

const LABEL: Record<Mode, string> = { cloud: 'Cloud', hybrid: 'Hybrid', onprem: 'On-prem' };

/** Illustrative diagram: white label member app, multi-tenant core, VPC boundary, two Active-Active regions pulsing in sync. */
export function DeploymentDiagram({ mode }: { mode: Mode }) {
  const ref = useRef<SVGSVGElement>(null);
  const active = useActive(ref);
  const reduced = useReducedMotion();
  const cloudW = mode === 'cloud' ? 280 : mode === 'hybrid' ? 140 : 0;
  const onW = 280 - cloudW;
  const pulse = active ? { opacity: [0.55, 1, 0.55] } : { opacity: 1 };
  const pulseT = { duration: 2, repeat: Infinity, ease: 'easeInOut' as const };
  return (
    <svg ref={ref} viewBox="0 0 640 340" role="img" aria-label={`Deployment diagram, ${LABEL[mode]} mode: a white label member app connects to the multi-tenant Loyalife core inside a VPC boundary, with two Active-Active regions.`} className="h-auto w-full font-sans">
      {/* member app */}
      <rect x="14" y="110" width="104" height="120" rx="16" className="fill-sunken stroke-line" />
      <rect x="40" y="128" width="52" height="72" rx="8" className="fill-surface stroke-ink/50" />
      <rect x="48" y="138" width="36" height="6" rx="3" className="fill-accent" />
      <rect x="48" y="150" width="28" height="4" rx="2" className="fill-muted/50" />
      <rect x="48" y="160" width="32" height="4" rx="2" className="fill-muted/50" />
      <text x="66" y="218" fontSize="9.500" textAnchor="middle" className="fill-ink font-sans" fontWeight="600">White label</text>
      <text x="66" y="230" fontSize="9.500" textAnchor="middle" className="fill-ink font-sans" fontWeight="600">member app</text>
      <path d="M122 170h60m-6-6 6 6-6 6" fill="none" className="stroke-brand" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* VPC boundary */}
      <rect x="190" y="22" width="436" height="296" rx="18" fill="none" className="stroke-ink/60" strokeWidth="1.5" strokeDasharray="7 5" />
      <rect x="206" y="12" width="96" height="20" rx="10" className="fill-canvas stroke-ink/60" />
      <text x="254" y="26" fontSize="10" textAnchor="middle" className="fill-ink font-sans" fontWeight="600">VPC boundary</text>

      {/* core */}
      <rect x="210" y="50" width="280" height="150" rx="14" className="fill-surface stroke-brand" strokeWidth="1.5" />
      <motion.rect y="50" height="150" rx="14" className="fill-brand/15" initial={{ x: 210, width: cloudW }} animate={{ x: 210, width: cloudW }} transition={reduced ? { duration: 0 } : t.slow} style={{ display: cloudW ? 'block' : 'none' }} />
      <motion.rect y="50" height="150" rx="14" className="fill-accent/25" initial={{ x: 210 + cloudW, width: onW }} animate={{ x: 210 + cloudW, width: onW }} transition={reduced ? { duration: 0 } : t.slow} style={{ display: onW ? 'block' : 'none' }} />
      <text x="224" y="72" fontSize="11" className="fill-ink font-sans" fontWeight="700">Multi-tenant Loyalife core</text>
      {['Program A', 'Program B', 'Program C'].map((p, i) => (
        <g key={p}>
          <rect x={224 + i * 86} y="90" width="76" height="40" rx="8" className="fill-surface stroke-line" />
          <text x={262 + i * 86} y="114" fontSize="9.500" textAnchor="middle" className="fill-ink font-sans">{p}</text>
        </g>
      ))}
      <AnimatePresence mode="wait">
        <motion.g key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t.base}>
          {cloudW > 0 && <text x={210 + cloudW / 2} y="170" fontSize="11" textAnchor="middle" className="fill-brand font-sans" fontWeight="700">Cloud</text>}
          {onW > 0 && <text x={210 + cloudW + onW / 2} y="170" fontSize="11" textAnchor="middle" className="fill-ink font-sans" fontWeight="700">On-prem</text>}
          {mode === 'hybrid' && <line x1="350" y1="146" x2="350" y2="192" className="stroke-ink/40" strokeDasharray="3 3" />}
        </motion.g>
      </AnimatePresence>

      {/* two Active-Active regions */}
      <path d="M350 200v26" className="stroke-line" strokeWidth="2" />
      {[0, 1].map((i) => (
        <g key={i}>
          <motion.rect x={226 + i * 190} y="232" width="150" height="62" rx="12" className="fill-surface stroke-success" strokeWidth="1.5" animate={pulse} transition={pulseT} />
          <text x={301 + i * 190} y="258" fontSize="11" textAnchor="middle" className="fill-ink font-sans" fontWeight="700">Region {i === 0 ? 'A' : 'B'}</text>
          <text x={301 + i * 190} y="274" fontSize="9.500" textAnchor="middle" className="fill-success font-sans" fontWeight="600">Active-Active DR</text>
        </g>
      ))}
      <path d="M376 263h40m-6-5 6 5-6 5M416 263h-40m6-5-6 5 6 5" fill="none" className="stroke-success" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="396" y="252" fontSize="8.500" textAnchor="middle" className="fill-muted font-sans">sync</text>
    </svg>
  );
}
