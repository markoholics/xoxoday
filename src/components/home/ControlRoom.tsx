import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useActive, useInterval } from '@/lib/hooks';
import { useReducedMotion } from '@/lib/prefs';
import { t } from '@/lib/motion';
import { Hotspot } from '../ui/Hotspot';
import { SampleLabel, KPI } from '../ui/Bits';
import { IconCheck } from '../ui/Icons';
import { Flag } from '@/lib/review';

const PROGRAMS = [
  { name: 'Customer rewards', audience: 'Customers', members: 482310, status: 'Live' },
  { name: 'Channel partner program', audience: 'Channel partners', members: 61480, status: 'Live' },
  { name: 'Influencer missions', audience: 'Influencers', members: 12940, status: 'Draft' },
];

const CHANGES = [
  'Raise Silver tier threshold to 8,000 points',
  'Add 600 reward options to the regional catalog',
  'Launch referral bonus, budget $15,000',
  'Pause the weekend bonus in one market',
  'Set partner quarterly target to 120 units',
  'Add a new mission: share a review',
  'Cap daily redemptions at 500 per member group',
  'Update the tier welcome message',
];

interface QItem {
  id: number;
  text: string;
  done: boolean;
}
interface LItem {
  id: number;
  text: string;
}

const seedQueue = (): QItem[] => [
  { id: 3, text: CHANGES[2], done: true },
  { id: 2, text: CHANGES[1], done: true },
  { id: 1, text: CHANGES[0], done: true },
];
const seedLedger = (): LItem[] => [
  { id: 3, text: '#LG-1043 Approved · Launch referral bonus' },
  { id: 2, text: '#LG-1042 Approved · Add 600 reward options' },
  { id: 1, text: '#LG-1041 Approved · Raise Silver threshold' },
];

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

/** The live control room. Sample data. Loops pause off screen and in hidden tabs. Reduced motion shows the final frame. */
export function ControlRoom() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useActive(ref);
  const reduced = useReducedMotion();
  const [members, setMembers] = useState(556730);
  const [points, setPoints] = useState(18420000);
  const [rate, setRate] = useState(31.4);
  const [queue, setQueue] = useState<QItem[]>(seedQueue);
  const [ledger, setLedger] = useState<LItem[]>(seedLedger);
  const n = useRef(3);
  const timers = useRef<number[]>([]);

  // KPI values tick slowly.
  useInterval(() => {
    setMembers((v) => v + 1 + Math.floor(Math.random() * 6));
    setPoints((v) => v + 250 + Math.floor(Math.random() * 650));
    setRate((v) => Math.min(34, Math.max(29, +(v + (Math.random() - 0.5) * 0.2).toFixed(1))));
  }, 2400, active);

  // Every 6 seconds a new approval slides in, is checked off, and appends a ledger line.
  useInterval(() => {
    n.current += 1;
    const id = n.current;
    const text = CHANGES[id % CHANGES.length];
    setQueue((q) => [{ id, text, done: false }, ...q].slice(0, 4));
    timers.current.push(
      window.setTimeout(() => {
        setQueue((q) => q.map((x) => (x.id === id ? { ...x, done: true } : x)));
        setLedger((l) => [{ id, text: `#LG-${1040 + id} Approved · ${text.slice(0, 34)}${text.length > 34 ? '…' : ''}` }, ...l].slice(0, 4));
      }, 2200),
    );
  }, 6000, active);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const pending = queue.filter((q) => !q.done).length;

  return (
    <div ref={ref} data-tour="control-room" data-section="control-room" className="relative rounded-xl2 border bg-surface p-4 sm:p-6">
      <Hotspot id="control-room" label="The control room" className="right-4 top-4">Values tick slowly. A new approval arrives every 6 seconds, is checked off, and adds a ledger line.</Hotspot>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="text-base font-semibold">Control room</h2>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <span className={`h-2 w-2 rounded-full bg-success ${active ? 'animate-pulse' : ''}`} aria-hidden /> Live
        </span>
        <SampleLabel>Sample data</SampleLabel>
        <Flag id="controlRoom" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KPI label="Active members" value={fmt(members)} />
        <KPI label="Points issued this month" value={fmt(points)} />
        <KPI label="Redemption rate" value={`${rate.toFixed(1)}%`} />
        <KPI label="Pending approvals" value={pending} hint={pending ? 'Waiting for a checker' : 'All clear'} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border p-4">
          <h3 className="label-mono mb-3">Programs</h3>
          <ul className="divide-y">
            {PROGRAMS.map((p) => (
              <li key={p.name} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted">{p.audience} · {fmt(p.members)} members</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${p.status === 'Live' ? 'border-success/60 text-success' : 'border-line text-muted'}`}>{p.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border p-4">
          <h3 className="label-mono mb-3">Approval queue</h3>
          <ul className="space-y-2" aria-live="off">
            <AnimatePresence initial={false}>
              {queue.map((q) => (
                <motion.li
                  key={q.id}
                  layout={!reduced}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={t.slow}
                  className="flex items-center gap-2.5 rounded-lg bg-sunken px-3 py-2 text-sm"
                >
                  <span aria-hidden className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${q.done ? 'border-success bg-success text-canvas' : 'border-ink/30'}`}>
                    {q.done && <IconCheck size={12} strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{q.text}</span>
                  <span className="shrink-0 font-mono text-[10px] uppercase text-muted">{q.done ? 'Approved' : 'Pending'}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <h3 className="label-mono mb-2 mt-4">Ledger</h3>
          <ul className="space-y-1 font-mono text-[11px] leading-snug text-muted">
            {ledger.map((l) => (
              <li key={l.id} className="truncate">{l.text}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
