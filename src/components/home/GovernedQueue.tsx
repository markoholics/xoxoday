import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { trackEvent } from '@/lib/events';
import { t } from '@/lib/motion';
import { Section, SectionHead } from '../ui/Section';
import { Button } from '../ui/Button';
import { SampleLabel } from '../ui/Bits';
import { Hotspot } from '../ui/Hotspot';
import { Term } from '../ui/Term';
import { Graphic } from '../graphics';
import { Flag } from '@/lib/review';

type Status = 'pending' | 'approved' | 'rejected';
interface Change {
  id: string;
  text: string;
  maker: string;
  status: Status;
}

const SEED: Change[] = [
  { id: 'c1', text: 'Raise Gold tier threshold to 12,000 points', maker: 'Program lead', status: 'pending' },
  { id: 'c2', text: 'Launch double points weekend, budget $40,000', maker: 'Marketing', status: 'pending' },
  { id: 'c3', text: 'Add 2,400 reward options to the regional catalog', maker: 'Catalog team', status: 'pending' },
];

interface Line {
  id: number;
  text: string;
}

/** Interactive approval queue. Approve and Reject update status and append to the ledger panel. */
export function GovernedQueue() {
  const [items, setItems] = useState<Change[]>(SEED);
  const [lines, setLines] = useState<Line[]>([]);
  const [n, setN] = useState(0);

  const decide = (id: string, decision: 'approve' | 'reject') => {
    const c = items.find((x) => x.id === id);
    if (!c || c.status !== 'pending') return;
    const status: Status = decision === 'approve' ? 'approved' : 'rejected';
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status } : x)));
    const k = n + 1;
    setN(k);
    setLines((l) => [{ id: k, text: `#LG-${2040 + k} · ${status === 'approved' ? 'Approved' : 'Rejected'} by checker · ${c.text}` }, ...l]);
    trackEvent('governance_approve', { decision, changeId: id, context: 'home' });
  };

  const reset = () => {
    setItems(SEED);
    setLines([]);
    setN(0);
  };

  return (
    <Section id="governed" section="governed" tour="governed" tone="sunken">
      <SectionHead
        title="Every change approved. Every point traceable."
        lead={<>A <Term id="maker-checker">maker checker</Term> flow keeps every rule, budget and catalog change under review, and the <Term id="reward-ledger">reward ledger</Term> records the result.</>}
      />
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="relative rounded-xl2 border bg-surface p-5 sm:p-6">
          <Hotspot id="approval-queue" label="Approval queue" className="right-4 top-4">Approve or reject a change. The decision is added to the ledger on the right.</Hotspot>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">Approval queue</h3>
            <SampleLabel>Sample data</SampleLabel>
            <Flag id="approvalQueue" />
          </div>
          <ul className="space-y-3">
            {items.map((c) => (
              <li key={c.id} className="rounded-xl border p-4">
                <p className="text-[15px] font-medium">{c.text}</p>
                <p className="mt-0.5 text-xs text-muted">Proposed by {c.maker}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {c.status === 'pending' ? (
                    <>
                      <Button size="sm" onClick={() => decide(c.id, 'approve')} aria-label={`Approve: ${c.text}`}>Approve</Button>
                      <Button size="sm" variant="ghost" onClick={() => decide(c.id, 'reject')} aria-label={`Reject: ${c.text}`}>Reject</Button>
                      <span className="ml-1 font-mono text-[11px] uppercase text-muted">Pending</span>
                    </>
                  ) : (
                    <span className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${c.status === 'approved' ? 'border-success/60 text-success' : 'border-danger/60 text-danger'}`}>
                      {c.status}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <button type="button" onClick={reset} className="mt-4 text-sm text-brand underline-offset-4 hover:underline">Reset the sample</button>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl2 border bg-surface p-5 sm:p-6">
            <h3 className="text-base font-semibold">Ledger</h3>
            <ul className="mt-3 min-h-[96px] space-y-1.5 font-mono text-[12px] leading-snug" aria-live="polite">
              {!lines.length && <li className="text-muted">Decisions appear here.</li>}
              <AnimatePresence initial={false}>
                {lines.map((l) => (
                  <motion.li key={l.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={t.base} className="rounded bg-sunken px-2 py-1.5">{l.text}</motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
          <Graphic kind="approval" />
        </div>
      </div>
    </Section>
  );
}
