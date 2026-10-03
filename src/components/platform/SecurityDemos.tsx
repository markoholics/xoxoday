import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/events';
import { useReducedMotion } from '@/lib/prefs';
import { t } from '@/lib/motion';
import { AiStatus, SampleLabel } from '../ui/Bits';
import { Button } from '../ui/Button';
import { Term } from '../ui/Term';
import { Hotspot } from '../ui/Hotspot';
import { Flag } from '@/lib/review';
import { IconCheck } from '../ui/Icons';

type Stage = 'draft' | 'submitted' | 'approved' | 'live';
const STAGES: { id: Stage; label: string }[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'submitted', label: 'Checker review' },
  { id: 'approved', label: 'Approved' },
  { id: 'live', label: 'Live' },
];

export function DualControlDemo() {
  const [stage, setStage] = useState<Stage>('draft');
  const [blocked, setBlocked] = useState(false);
  const [audit, setAudit] = useState<string[]>([]);
  const idx = STAGES.findIndex((s) => s.id === stage);
  const add = (s: string) => setAudit((a) => [s, ...a].slice(0, 4));
  return (
    <div id="dual-control" data-tour="dual-control" data-section="dual-control" className="relative rounded-xl2 border bg-surface p-5 sm:p-6">
      <Hotspot id="dual-control" label="Dual-control" className="right-4 top-4">Submit as the maker, then try approving as the same person. It is blocked.</Hotspot>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold"><Term id="dual-control">Dual-control</Term> approval</h3>
        <SampleLabel flag="securityDemos">Sample data</SampleLabel>
      </div>
      <p className="rounded-lg bg-sunken p-3 text-sm"><span className="label-mono mr-2">Change</span>Raise Gold tier threshold to 12,000 points</p>
      <ol className="mt-5 grid grid-cols-4 gap-2" aria-label="Approval stages">
        {STAGES.map((s, i) => (
          <li key={s.id} aria-current={i === idx ? 'step' : undefined} className="text-center">
            <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-colors duration-200 ease-calm ${i <= idx ? 'border-success bg-success text-canvas' : 'border-ink/30'}`}>
              {i <= idx ? <IconCheck size={14} strokeWidth={3} /> : i + 1}
            </span>
            <span className="mt-1 block text-xs text-muted">{s.label}</span>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap gap-2" aria-live="polite">
        {stage === 'draft' && (
          <Button size="sm" onClick={() => { setStage('submitted'); setBlocked(false); add('Maker (Program lead) submitted the change'); }}>Submit as maker</Button>
        )}
        {stage === 'submitted' && (
          <>
            <Button size="sm" onClick={() => { setStage('approved'); setBlocked(false); add('Checker (Finance) approved the change'); trackEvent('governance_approve', { decision: 'approve', context: 'dual-control' }); window.setTimeout(() => { setStage('live'); add('Change went live. Audit entry written'); }, 700); }}>Approve as checker</Button>
            <Button size="sm" variant="ghost" onClick={() => { setBlocked(true); add('Blocked: maker tried to approve own change'); }}>Try approving as the maker</Button>
          </>
        )}
        {stage === 'live' && <Button size="sm" variant="ghost" onClick={() => { setStage('draft'); setBlocked(false); setAudit([]); }}>Start over</Button>}
      </div>
      {blocked && <p role="alert" className="mt-3 rounded-lg border border-danger/50 bg-danger/10 p-3 text-sm">Blocked. With dual-control, the maker cannot approve their own change.</p>}
      <ul className="mt-4 space-y-1 font-mono text-[11px] text-muted" aria-label="Audit trail">
        {audit.map((a, i) => <li key={a + i} className="rounded bg-sunken px-2 py-1.5">{a}</li>)}
        {!audit.length && <li>Audit trail entries appear here.</li>}
      </ul>
    </div>
  );
}

const LEDGER = [
  { key: 'evt-1001', label: 'Purchase', d: 120 },
  { key: 'evt-1002', label: 'Referral', d: 50 },
  { key: 'evt-1003', label: 'Redeem', d: -80 },
  { key: 'evt-1004', label: 'Mission', d: 40 },
  { key: 'evt-1005', label: 'Purchase', d: 60 },
];

export function LedgerReplayDemo() {
  const [shown, setShown] = useState(LEDGER.length);
  const [replaying, setReplaying] = useState(false);
  const [dup, setDup] = useState('');
  const reduced = useReducedMotion();
  const timer = useRef<number>();
  useEffect(() => () => window.clearInterval(timer.current), []);
  const bal = LEDGER.slice(0, shown).reduce((a, l) => a + l.d, 0);
  const full = LEDGER.reduce((a, l) => a + l.d, 0);
  const replay = () => {
    setDup('');
    if (reduced) return setShown(LEDGER.length);
    setReplaying(true);
    setShown(0);
    let i = 0;
    timer.current = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= LEDGER.length) {
        window.clearInterval(timer.current);
        setReplaying(false);
      }
    }, 500);
  };
  return (
    <div id="ledger-replay" data-tour="ledger-replay" data-section="ledger-replay" className="rounded-xl2 border bg-surface p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold">Audit ledger replay</h3>
        <SampleLabel flag="securityDemos">Sample data</SampleLabel>
      </div>
      <p className="text-sm text-muted">The <Term id="reward-ledger">reward ledger</Term> is idempotent and replayable. Replay the lines to rebuild a balance.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <ul className="space-y-1.5 font-mono text-xs" aria-label="Ledger lines">
          {LEDGER.map((l, i) => (
            <li key={l.key} className={`flex justify-between rounded px-2 py-1.5 transition-opacity duration-200 ${i < shown ? 'bg-sunken opacity-100' : 'opacity-30'}`}>
              <span>{l.key} · {l.label}</span>
              <span className={l.d < 0 ? 'text-danger' : 'text-success'}>{l.d > 0 ? '+' : ''}{l.d}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-xl border p-4 text-center">
          <p className="label-mono">Rebuilt balance</p>
          <p className="mt-1 text-4xl font-semibold tabular-nums" aria-live="polite">{bal}</p>
          <p className="text-xs text-muted">{shown === LEDGER.length ? (bal === full ? 'Matches the stored balance' : '') : 'Replaying…'}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={replay} disabled={replaying}>{replaying ? 'Replaying' : 'Replay the ledger'}</Button>
        <Button size="sm" variant="ghost" onClick={() => setDup('Duplicate event evt-1003 ignored. The key was already applied, so the balance did not change.')} disabled={replaying}>Replay a duplicate event</Button>
      </div>
      {dup && <p role="status" className="mt-3 rounded-lg border bg-sunken p-3 text-sm">{dup}</p>}
    </div>
  );
}

export function AnomalyDemo() {
  const [spike, setSpike] = useState(15);
  const base = [22, 18, 15, 12, 10, 14, 24, 34, 40, 38, 36, 40, 42, 38, 36, 34, 38, 44, 46, 40, 34, 28, 24, 20];
  const flagged = spike >= 60;
  const data = base.map((v, i) => (i >= 18 && i <= 20 ? v + Math.round((spike / 100) * 90) : v));
  const max = Math.max(...data, 60);
  return (
    <div id="anomaly" data-tour="anomaly" data-section="anomaly" className="rounded-xl2 border bg-surface p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold"><Term id="anomaly">Anomaly detection</Term></h3>
        <AiStatus id="anomalyDetection" />
        <SampleLabel flag="securityDemos">Sample data</SampleLabel>
      </div>
      <svg viewBox="0 0 300 110" role="img" aria-label={`Sample chart of redemptions per hour. ${flagged ? 'A spike is flagged.' : 'Within normal range.'}`} className="w-full">
        {data.map((v, i) => {
          const h = (v / max) * 90;
          const hot = flagged && i >= 18 && i <= 20;
          return <rect key={i} x={6 + i * 12} y={100 - h} width="8" height={h} rx="2" className={hot ? 'fill-danger' : 'fill-brand/70'} style={{ transition: 'all 320ms cubic-bezier(0.22,1,0.36,1)' }} />;
        })}
        <line x1="0" y1="100" x2="300" y2="100" className="stroke-line" />
      </svg>
      <div className="mt-3">
        <label htmlFor="spike" className="text-sm font-medium">Simulate a redemption spike</label>
        <input id="spike" type="range" min={0} max={100} value={spike} onChange={(e) => setSpike(Number(e.target.value))} className="mt-1 w-full accent-[rgb(var(--brand))]" />
      </div>
      <div aria-live="polite" className="mt-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={String(flagged)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t.fast}
            className={`rounded-lg border p-3 text-sm ${flagged ? 'border-danger/60 bg-danger/10' : 'bg-sunken'}`}>
            {flagged ? 'Flagged: redemptions are well above the normal range. Held for review by a person.' : 'Within the normal range. No action needed.'}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
