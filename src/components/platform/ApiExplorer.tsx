import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/events';
import { useReducedMotion } from '@/lib/prefs';
import { t } from '@/lib/motion';
import { Tabs, TabPanel } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Hotspot } from '../ui/Hotspot';
import { SampleLabel } from '../ui/Bits';
import { IconCheck, IconCopy } from '../ui/Icons';
import { Flag } from '@/lib/review';

type Lang = 'curl' | 'python' | 'node';
type Endpoint = 'members' | 'transactions' | 'points';

const BASE = 'https://api.example.com/v1';

const CODE: Record<Endpoint, Record<Lang, string>> = {
  members: {
    curl: `curl -X GET "${BASE}/members/4821" \\\n  -H "Authorization: Bearer <JWT>"`,
    python: `import requests\n\nr = requests.get(\n    "${BASE}/members/4821",\n    headers={"Authorization": "Bearer <JWT>"},\n)\nprint(r.json())`,
    node: `const res = await fetch("${BASE}/members/4821", {\n  headers: { Authorization: "Bearer <JWT>" },\n});\nconsole.log(await res.json());`,
  },
  transactions: {
    curl: `curl -X POST "${BASE}/transactions" \\\n  -H "Authorization: Bearer <JWT>" \\\n  -H "Idempotency-Key: evt-1006" \\\n  -d '{"member_id":"4821","amount":48.00,"currency":"USD"}'`,
    python: `import requests\n\nr = requests.post(\n    "${BASE}/transactions",\n    headers={"Authorization": "Bearer <JWT>", "Idempotency-Key": "evt-1006"},\n    json={"member_id": "4821", "amount": 48.00, "currency": "USD"},\n)\nprint(r.json())`,
    node: `const res = await fetch("${BASE}/transactions", {\n  method: "POST",\n  headers: {\n    Authorization: "Bearer <JWT>",\n    "Idempotency-Key": "evt-1006",\n    "Content-Type": "application/json",\n  },\n  body: JSON.stringify({ member_id: "4821", amount: 48.0, currency: "USD" }),\n});\nconsole.log(await res.json());`,
  },
  points: {
    curl: `curl -X GET "${BASE}/members/4821/points" \\\n  -H "Authorization: Bearer <JWT>"`,
    python: `import requests\n\nr = requests.get(\n    "${BASE}/members/4821/points",\n    headers={"Authorization": "Bearer <JWT>"},\n)\nprint(r.json())`,
    node: `const res = await fetch("${BASE}/members/4821/points", {\n  headers: { Authorization: "Bearer <JWT>" },\n});\nconsole.log(await res.json());`,
  },
};

const RESPONSE: Record<Endpoint, string> = {
  members: `{\n  "id": "4821",\n  "tier": "Gold",\n  "status": "active"\n}`,
  transactions: `{\n  "id": "txn_1006",\n  "member_id": "4821",\n  "points_earned": 48,\n  "status": "recorded"\n}`,
  points: `{\n  "member_id": "4821",\n  "balance": 1248,\n  "currency": "points"\n}`,
};

const FLOW = [
  { id: 'req', label: 'Request token', detail: 'POST /oauth/token with client credentials' },
  { id: 'jwt', label: 'Receive JWT', detail: 'A signed JWT comes back' },
  { id: 'members', label: 'Call for members', detail: 'GET /members with the JWT' },
  { id: 'tp', label: 'Call for transactions and points', detail: 'POST /transactions, GET /points' },
];

/** Illustrative requests. Not the production API reference. */
export function ApiExplorer() {
  const [lang, setLang] = useState<Lang>('curl');
  const [ep, setEp] = useState<Endpoint>('members');
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flow, setFlow] = useState(FLOW.length);
  const reduced = useReducedMotion();
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const used = (action: string) => trackEvent('api_explorer_used', { endpoint: ep, language: lang, action });
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE[ep][lang]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
    used('copy');
  };
  const runFlow = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    used('oauth_flow');
    if (reduced) return setFlow(FLOW.length);
    setFlow(0);
    FLOW.forEach((_, i) => timers.current.push(window.setTimeout(() => setFlow(i + 1), 500 + i * 700)));
  };

  return (
    <div id="api-explorer" data-tour="api-explorer" data-section="api-explorer" className="relative rounded-xl2 border bg-surface p-5 sm:p-6">
      <Hotspot id="api-explorer" label="API explorer" className="right-4 top-4">Pick an endpoint and a language. Send the sample request, then run the OAuth flow.</Hotspot>
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold">API explorer</h3>
        <SampleLabel flag="apiExplorer">Sample data</SampleLabel>
      </div>
      <p className="mb-5 text-sm text-muted">Illustrative requests. Not the production API reference.</p>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Tabs tabs={[{ id: 'members', label: 'Members' }, { id: 'transactions', label: 'Transactions' }, { id: 'points', label: 'Points' }]} value={ep} onChange={(v) => { setEp(v); setSent(false); used('endpoint'); }} label="Endpoint" idPrefix="ep" variant="pill" className="mb-3 flex-wrap" />
          <Tabs tabs={[{ id: 'curl', label: 'curl' }, { id: 'python', label: 'Python' }, { id: 'node', label: 'Node' }]} value={lang} onChange={(v) => { setLang(v); used('language'); }} label="Language" idPrefix="lang" className="mb-0" />
          <TabPanel idPrefix="lang" id={lang} className="outline-offset-4">
            <div className="relative">
              <pre className="mt-3 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-[12.5px] leading-relaxed text-canvas" tabIndex={0} aria-label={`${lang} request`}><code>{CODE[ep][lang]}</code></pre>
              <button type="button" onClick={copy} aria-label="Copy request" className="absolute right-2 top-5 rounded-md bg-canvas/15 p-1.5 text-canvas hover:bg-canvas/25">
                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              </button>
            </div>
          </TabPanel>
          <div className="mt-3 flex items-center gap-3">
            <Button size="sm" onClick={() => { setSent(true); used('send'); }}>Send sample request</Button>
            <span className="text-xs text-muted" aria-live="polite">{copied ? 'Copied' : ''}</span>
          </div>
          <AnimatePresence initial={false}>
            {sent && (
              <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t.base} className="mt-3 overflow-x-auto rounded-xl border bg-sunken p-4 font-mono text-[12.5px]" aria-label="Sample response">
                {RESPONSE[ep]}
              </motion.pre>
            )}
          </AnimatePresence>
        </div>

        <div>
          <h4 className="text-sm font-semibold">OAuth 2.0 → JWT</h4>
          <ol className="mt-3 space-y-2">
            {FLOW.map((s, i) => (
              <motion.li key={s.id} animate={{ opacity: i < flow ? 1 : 0.35 }} transition={t.base} className={`flex gap-3 rounded-xl border p-3 text-sm ${i < flow ? 'bg-surface' : 'bg-sunken'}`}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs ${i < flow ? 'bg-success text-canvas' : 'border'}`}>{i < flow ? <IconCheck size={12} strokeWidth={3} /> : i + 1}</span>
                <span><span className="block font-medium">{s.label}</span><span className="text-xs text-muted">{s.detail}</span></span>
              </motion.li>
            ))}
          </ol>
          <Button size="sm" variant="ghost" className="mt-3" onClick={runFlow}>Run the flow</Button>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted"><Flag id="api" /></p>
    </div>
  );
}
