import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/events';
import { useReducedMotion } from '@/lib/prefs';
import { t } from '@/lib/motion';
import { AiStatus, SampleLabel } from '../ui/Bits';
import { Button } from '../ui/Button';
import { Hotspot } from '../ui/Hotspot';
import { Term } from '../ui/Term';
import { Flag } from '@/lib/review';

/** Assistant asks, a tenant-isolated tool call runs, an audited log line appears. Simulated. */
export function McpDemo() {
  const [stage, setStage] = useState(0); // 0 idle, 1 ask, 2 call, 3 result, 4 audit
  const [log, setLog] = useState<string[]>([]);
  const timers = useRef<number[]>([]);
  const reduced = useReducedMotion();
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    trackEvent('mcp_demo_run', { tool: 'get_member_balance' });
    const line = `${new Date().toISOString().slice(0, 19)}Z tenant=acme-cards tool=get_member_balance actor=assistant result=ok`;
    if (reduced) {
      setStage(4);
      setLog((l) => [line, ...l].slice(0, 3));
      return;
    }
    setStage(1);
    [700, 1500, 2300].forEach((d, i) => timers.current.push(window.setTimeout(() => {
      setStage(i + 2);
      if (i === 2) setLog((l) => [line, ...l].slice(0, 3));
    }, d)));
  };

  const Lane = ({ n, title, on, children }: { n: number; title: string; on: boolean; children: React.ReactNode }) => (
    <motion.li
      animate={{ opacity: on ? 1 : 0.35 }}
      transition={t.base}
      className={`rounded-xl border p-4 ${on ? 'border-ink/40 bg-surface' : 'bg-sunken'}`}
    >
      <p className="label-mono">{n}. {title}</p>
      <div className="mt-2 text-sm">{children}</div>
    </motion.li>
  );

  return (
    <div id="mcp-demo" data-tour="mcp-demo" data-section="mcp-demo" className="relative rounded-xl2 border bg-surface p-5 sm:p-6">
      <Hotspot id="mcp-demo" label="MCP tool call" className="right-4 top-4">Run the sample call. Each tool call stays inside one tenant and writes an audit line.</Hotspot>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold"><Term id="mcp">MCP</Term> tool call</h3>
        <AiStatus id="toolCalling" />
        <SampleLabel flag="mcpDemo">Sample data</SampleLabel>
      </div>
      <ol className="grid gap-3 md:grid-cols-3">
        <Lane n={1} title="Assistant asks" on={stage >= 1}>
          <p className="rounded-lg bg-sunken p-2.5">“What is the points balance for member 4821?”</p>
        </Lane>
        <Lane n={2} title="Tenant-isolated tool call" on={stage >= 2}>
          <code className="block break-words rounded-lg bg-sunken p-2.5 font-mono text-[12px]">get_member_balance(<br />&nbsp;&nbsp;tenant: "acme-cards",<br />&nbsp;&nbsp;member_id: "4821")</code>
          {stage >= 3 && <p className="mt-2 font-mono text-[12px] text-success">{`{ "balance": 1248 }`}</p>}
          <p className="mt-2 text-xs text-muted">Other tenants: no access.</p>
        </Lane>
        <Lane n={3} title="Audited" on={stage >= 4}>
          <p className="text-muted">One line is written to the audit log for every call.</p>
        </Lane>
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={run} arrow>{stage ? 'Run it again' : 'Run the tool call'}</Button>
      </div>
      <ul className="mt-4 min-h-[48px] space-y-1 font-mono text-[11px] leading-snug" aria-live="polite" aria-label="Audit log">
        <AnimatePresence initial={false}>
          {log.map((l, i) => (
            <motion.li key={l + i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={t.base} className="rounded bg-sunken px-2 py-1.5 text-muted">{l}</motion.li>
          ))}
        </AnimatePresence>
        {!log.length && <li className="text-muted">The audit line appears here.</li>}
      </ul>
      <p className="mt-2 text-xs text-muted"><Flag id="mcpDemo" /></p>
    </div>
  );
}
