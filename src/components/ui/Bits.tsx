import { useState, type ReactNode } from 'react';
import { aiStatus, STATUS_TEXT, type AiStatusId, type AiStatusValue } from '@/config/status';
import { Flag } from '@/lib/review';
import type { FlagId } from '@/content/flags';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden />;
}

export function PageSkeleton() {
  return (
    <div className="container-x py-24" role="status" aria-label="Loading">
      <Skeleton className="mb-6 h-4 w-32" />
      <Skeleton className="mb-4 h-12 w-full max-w-xl" />
      <Skeleton className="mb-10 h-12 w-2/3 max-w-lg" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function Chip({ children, active, onClick, className = '', as }: { children: ReactNode; active?: boolean; onClick?: () => void; className?: string; as?: 'span' }) {
  const c = `inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors duration-200 ease-calm ${
    active ? 'border-ink bg-ink text-canvas' : 'border-line bg-surface text-ink hover:border-ink/50'
  } ${className}`;
  if (as === 'span' || !onClick) return <span className={c}>{children}</span>;
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={c}>
      {children}
    </button>
  );
}

/** Mono label for simulated elements. */
export function SampleLabel({ children = 'Sample data', flag, className = '' }: { children?: string; flag?: FlagId; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded border border-line bg-sunken px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted ${className}`}>
      {children}
      {flag && <Flag id={flag} />}
    </span>
  );
}

const STATUS_STYLE: Record<AiStatusValue, string> = {
  live: 'border-success/60 text-success bg-success/10',
  beta: 'border-warning/60 text-warning bg-warning/10',
  proposed: 'border-dashed border-muted/70 text-muted bg-transparent',
};

/** AI mention chip. Status comes from src/config/status.ts. */
export function AiStatus({ id, status }: { id?: AiStatusId; status?: AiStatusValue }) {
  const entry = id ? aiStatus[id] : undefined;
  const s = status ?? entry?.status ?? 'proposed';
  const [tip, setTip] = useState(false);
  const tipText = s === 'proposed' ? 'Status to be confirmed by product' : undefined;
  return (
    <span
      className="relative inline-flex align-middle"
      onMouseEnter={() => setTip(true)}
      onMouseLeave={() => setTip(false)}
      onFocus={() => setTip(true)}
      onBlur={() => setTip(false)}
    >
      <span
        tabIndex={tipText ? 0 : undefined}
        data-ai-status={s}
        aria-label={`AI status: ${STATUS_TEXT[s]}${tipText ? '. ' + tipText : ''}`}
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${STATUS_STYLE[s]}`}
      >
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
        {STATUS_TEXT[s]}
      </span>
      {entry?.supplied && <Flag id="aiMcp" />}
      {tip && tipText && (
        <span role="tooltip" className="pointer-events-none absolute left-0 top-full z-30 mt-1 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-canvas shadow-soft">
          {tipText}
        </span>
      )}
    </span>
  );
}

export function Checkpoint({ className = '' }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 rounded-lg border border-line bg-sunken px-3 py-2 text-sm ${className}`}>
      <span aria-hidden className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-accent" />
      <span>A person approves this before anything goes live.</span>
    </p>
  );
}

export function Switch({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; id?: string }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 ease-calm ${checked ? 'border-ink bg-ink' : 'border-ink/30 bg-sunken'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full transition-transform duration-200 ease-calm ${checked ? 'translate-x-6 bg-canvas' : 'translate-x-1 bg-ink'}`} />
    </button>
  );
}

export function KPI({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border bg-surface p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
    </div>
  );
}
