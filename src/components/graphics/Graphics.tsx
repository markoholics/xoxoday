import { motion, useTransform, type MotionValue } from 'framer-motion';
import { LoopFrame, type LoopProps } from './Loop';

const T = 'fill-ink font-sans';
const M = 'fill-muted font-sans';
/** window of p in [a,b] mapped to [from,to], clamped */
const win = (p: MotionValue<number>, a: number, b: number, from = 0, to = 1) => useTransform(p, [a, b], [from, to]);
const fade = (p: MotionValue<number>, a: number, b: number) => useTransform(p, [a, b], [0, 1]);

function Money({ p }: { p: MotionValue<number> }) {
  const bal = useTransform(p, (v) => Math.round(1200 + 48 * Math.min(1, Math.max(0, (v - 0.5) / 0.15))).toLocaleString('en-US'));
  const tokenX = win(p, 0.2, 0.5, 0, 88);
  const tokenO = useTransform(p, [0.15, 0.2, 0.5, 0.56], [0, 1, 1, 0]);
  const bar = win(p, 0.5, 0.75, 0.5, 0.62);
  const pulse = useTransform(p, [0.5, 0.58, 0.7], [0, 1, 0]);
  return (
    <>
      <rect x="16" y="46" width="92" height="88" rx="10" className="fill-sunken stroke-line" />
      <text x="28" y="68" fontSize="10" className={M}>Purchase</text>
      <text x="28" y="96" fontSize="20" fontWeight="600" className={T}>$48.00</text>
      <text x="28" y="118" fontSize="9" className={M}>Earn 1 point per $1</text>
      <motion.g style={{ x: tokenX, opacity: tokenO }}>
        <circle cx="122" cy="90" r="15" className="fill-accent" />
        <text x="122" y="94" fontSize="11" fontWeight="700" textAnchor="middle" className="fill-[#0C0A09] font-sans">+48</text>
      </motion.g>
      <motion.rect x="200" y="36" width="104" height="108" rx="12" className="fill-surface stroke-brand" strokeWidth="1.5" style={{ opacity: useTransform(pulse, (v) => 0.6 + v * 0.4) }} />
      <text x="214" y="58" fontSize="10" className={M}>Member card</text>
      <text x="214" y="92" fontSize="22" fontWeight="600" className={T}><motion.tspan>{bal}</motion.tspan></text>
      <text x="214" y="108" fontSize="9" className={M}>points</text>
      <rect x="214" y="122" width="76" height="6" rx="3" className="fill-sunken" />
      <motion.rect x="214" y="122" width="76" height="6" rx="3" className="fill-brand" style={{ scaleX: bar, originX: 0 }} />
    </>
  );
}
export function PointsEarnedLoop(props: LoopProps) {
  return (
    <LoopFrame {...props} duration={6000} label="A $48 purchase becomes 48 points on a member card"
      caption="A purchase becomes points on a member card."
      transcript="A member makes a $48 purchase. The program earns 1 point per $1. 48 points move to the member card and the balance rises from 1,200 to 1,248.">
      {(p) => <Money p={p} />}
    </LoopFrame>
  );
}

function Approval({ p }: { p: MotionValue<number> }) {
  const cardX = useTransform(p, [0.1, 0.45, 0.55, 0.85], [0, 108, 108, 216]);
  const line1 = win(p, 0.1, 0.45);
  const line2 = win(p, 0.55, 0.85);
  const check = useTransform(p, [0.45, 0.55], [0, 1]);
  const live = useTransform(p, [0.85, 0.92], [0, 1]);
  const nodes = [
    { x: 54, l: 'Draft' },
    { x: 162, l: 'Checker' },
    { x: 270, l: 'Live' },
  ];
  return (
    <>
      <line x1="54" y1="90" x2="270" y2="90" className="stroke-line" strokeWidth="3" strokeLinecap="round" />
      <motion.line x1="54" y1="90" x2="162" y2="90" className="stroke-brand" strokeWidth="3" strokeLinecap="round" style={{ pathLength: line1 }} />
      <motion.line x1="162" y1="90" x2="270" y2="90" className="stroke-success" strokeWidth="3" strokeLinecap="round" style={{ pathLength: line2 }} />
      {nodes.map((n) => (
        <g key={n.l}>
          <circle cx={n.x} cy="90" r="16" className="fill-surface stroke-line" strokeWidth="1.5" />
          <text x={n.x} y="128" fontSize="10" textAnchor="middle" className={M}>{n.l}</text>
        </g>
      ))}
      <motion.path d="M155 90l5 5 9-10" fill="none" className="stroke-success" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: check }} />
      <motion.g style={{ opacity: live }}>
        <circle cx="270" cy="90" r="16" className="fill-success" />
        <path d="M263 90l5 5 9-10" fill="none" className="stroke-canvas" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="244" y="46" width="52" height="18" rx="9" className="fill-success/15 stroke-success" />
        <text x="270" y="58.5" fontSize="9" fontWeight="600" textAnchor="middle" className="fill-success font-sans">Live</text>
      </motion.g>
      <motion.g style={{ x: cardX }}>
        <rect x="26" y="40" width="56" height="32" rx="7" className="fill-accent" />
        <text x="54" y="54" fontSize="8" fontWeight="700" textAnchor="middle" className="fill-[#0C0A09] font-sans">Raise tier</text>
        <text x="54" y="65" fontSize="8" textAnchor="middle" className="fill-[#0C0A09] font-sans">threshold</text>
      </motion.g>
    </>
  );
}
export function ApprovalLoop(props: LoopProps) {
  return (
    <LoopFrame {...props} duration={7000} label="A change moves from draft to checker to live"
      caption="A change moves from draft to checker to live."
      transcript="A maker drafts a change. The change moves to a checker, who approves it. Only then does the change go live.">
      {(p) => <Approval p={p} />}
    </LoopFrame>
  );
}

const LEDGER = [
  { t: '+120', l: 'Purchase', bal: 120 },
  { t: '+50', l: 'Referral', bal: 170 },
  { t: '-80', l: 'Redeem', bal: 90 },
  { t: '+40', l: 'Mission', bal: 130 },
];
function Ledger({ p }: { p: MotionValue<number> }) {
  const bal = useTransform(p, (v) => {
    const i = Math.floor((v - 0.12) / 0.18);
    return String(i < 0 ? 0 : LEDGER[Math.min(i, LEDGER.length - 1)].bal);
  });
  const op = LEDGER.map((_, i) => useTransform(p, [0.12 + i * 0.18, 0.12 + i * 0.18 + 0.06], [0, 1]));
  const x = LEDGER.map((_, i) => useTransform(p, [0.12 + i * 0.18, 0.12 + i * 0.18 + 0.08], [-12, 0]));
  return (
    <>
      <text x="20" y="28" fontSize="10" className={M}>Reward ledger</text>
      {LEDGER.map((r, i) => (
        <motion.g key={r.l} style={{ opacity: op[i], x: x[i] }}>
          <rect x="20" y={40 + i * 28} width="168" height="22" rx="6" className="fill-sunken" />
          <text x="30" y={55 + i * 28} fontSize="10" className={T}>{r.l}</text>
          <text x="178" y={55 + i * 28} fontSize="10" fontWeight="600" textAnchor="end" className={r.t.startsWith('-') ? 'fill-danger font-sans' : 'fill-success font-sans'}>{r.t}</text>
        </motion.g>
      ))}
      <rect x="208" y="40" width="96" height="106" rx="12" className="fill-surface stroke-brand" strokeWidth="1.5" />
      <text x="256" y="66" fontSize="10" textAnchor="middle" className={M}>Rebuilt balance</text>
      <text x="256" y="104" fontSize="30" fontWeight="600" textAnchor="middle" className={T}><motion.tspan>{bal}</motion.tspan></text>
      <text x="256" y="124" fontSize="9" textAnchor="middle" className={M}>points</text>
    </>
  );
}
export function LedgerReplayLoop(props: LoopProps) {
  return (
    <LoopFrame {...props} duration={7000} label="Ledger lines replay to rebuild a balance of 130 points"
      caption="Ledger lines replay to rebuild a balance."
      transcript="Four ledger lines replay in order: plus 120, plus 50, minus 80 and plus 40. The balance rebuilds to 130 points. The same lines always give the same balance.">
      {(p) => <Ledger p={p} />}
    </LoopFrame>
  );
}

function AiDraft({ p }: { p: MotionValue<number> }) {
  const brief = fade(p, 0.02, 0.12);
  const arrow1 = win(p, 0.2, 0.3);
  const draft = fade(p, 0.28, 0.4);
  const arrow2 = win(p, 0.45, 0.55);
  const sim = fade(p, 0.52, 0.62);
  const b1 = win(p, 0.55, 0.7, 0, 1);
  const b2 = win(p, 0.6, 0.75, 0, 1);
  const b3 = win(p, 0.65, 0.8, 0, 1);
  const wait = fade(p, 0.8, 0.9);
  const dot = useTransform(p, (v) => (0.45 + 0.55 * Math.abs(Math.sin(v * 40))));
  return (
    <>
      <motion.g style={{ opacity: brief }}>
        <rect x="12" y="34" width="84" height="64" rx="8" className="fill-sunken stroke-line" />
        <text x="22" y="50" fontSize="9" fontWeight="600" className={T}>Brief</text>
        <rect x="22" y="58" width="60" height="4" rx="2" className="fill-muted/50" />
        <rect x="22" y="68" width="48" height="4" rx="2" className="fill-muted/50" />
        <rect x="22" y="78" width="54" height="4" rx="2" className="fill-muted/50" />
      </motion.g>
      <motion.path d="M100 66h14m-5-5 5 5-5 5" fill="none" className="stroke-brand" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: arrow1 }} />
      <motion.g style={{ opacity: draft }}>
        <rect x="118" y="34" width="84" height="64" rx="8" className="fill-surface stroke-brand" strokeDasharray="4 3" />
        <text x="128" y="50" fontSize="9" fontWeight="600" className={T}>Draft</text>
        <rect x="128" y="58" width="64" height="4" rx="2" className="fill-brand/60" />
        <rect x="128" y="68" width="52" height="4" rx="2" className="fill-brand/60" />
        <rect x="128" y="78" width="58" height="4" rx="2" className="fill-brand/60" />
      </motion.g>
      <motion.path d="M206 66h14m-5-5 5 5-5 5" fill="none" className="stroke-brand" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: arrow2 }} />
      <motion.g style={{ opacity: sim }}>
        <rect x="224" y="34" width="84" height="64" rx="8" className="fill-surface stroke-brand" strokeDasharray="4 3" />
        <text x="234" y="50" fontSize="9" fontWeight="600" className={T}>Simulation</text>
        <motion.rect x="234" y="58" width="64" height="5" rx="2.5" className="fill-accent" style={{ scaleX: b1, originX: 0 }} />
        <motion.rect x="234" y="68" width="48" height="5" rx="2.5" className="fill-accent" style={{ scaleX: b2, originX: 0 }} />
        <motion.rect x="234" y="78" width="56" height="5" rx="2.5" className="fill-accent" style={{ scaleX: b3, originX: 0 }} />
      </motion.g>
      <motion.g style={{ opacity: wait }}>
        <rect x="68" y="124" width="184" height="30" rx="15" className="fill-surface stroke-ink/40" />
        <motion.circle cx="86" cy="139" r="4" className="fill-accent" style={{ opacity: dot }} />
        <text x="98" y="143" fontSize="10" fontWeight="600" className={T}>Waits for a person to approve</text>
      </motion.g>
    </>
  );
}
export function AiDraftLoop(props: LoopProps) {
  return (
    <LoopFrame {...props} duration={8000} finalP={0.97} label="A brief becomes a draft, then a simulation, then waits for a person"
      caption="A brief becomes a draft, a simulation, then waits for a person."
      transcript="A brief becomes a proposed draft. The draft is simulated. Nothing goes live: the result waits for a person to approve.">
      {(p) => <AiDraft p={p} />}
    </LoopFrame>
  );
}

const NODES = [
  { x: 52, y: 38, c: 'USD' },
  { x: 268, y: 38, c: 'EUR' },
  { x: 52, y: 142, c: 'AED' },
  { x: 268, y: 142, c: 'SGD' },
];
function Global({ p }: { p: MotionValue<number> }) {
  const lines = NODES.map((_, i) => win(p, 0.1 + i * 0.12, 0.3 + i * 0.12));
  const pops = NODES.map((_, i) => useTransform(p, [0.25 + i * 0.12, 0.35 + i * 0.12], [0, 1]));
  return (
    <>
      {NODES.map((n, i) => (
        <g key={n.c}>
          <line x1="160" y1="90" x2={n.x} y2={n.y} className="stroke-line" strokeWidth="2" />
          <motion.line x1="160" y1="90" x2={n.x} y2={n.y} className="stroke-brand" strokeWidth="2" strokeLinecap="round" style={{ pathLength: lines[i] }} />
          <motion.g style={{ opacity: pops[i] }}>
            <rect x={n.x - 30} y={n.y - 14} width="60" height="28" rx="14" className="fill-surface stroke-brand" />
            <text x={n.x} y={n.y + 4} fontSize="11" fontWeight="600" textAnchor="middle" className={T}>{n.c}</text>
          </motion.g>
        </g>
      ))}
      <circle cx="160" cy="90" r="30" className="fill-accent" />
      <text x="160" y="88" fontSize="9" fontWeight="700" textAnchor="middle" className="fill-[#0C0A09] font-sans">One</text>
      <text x="160" y="100" fontSize="9" fontWeight="700" textAnchor="middle" className="fill-[#0C0A09] font-sans">program</text>
    </>
  );
}
export function GlobalRewardsLoop(props: LoopProps) {
  return (
    <LoopFrame {...props} duration={6000} label="One program fans out to several regions and currencies"
      caption="One program fans out to several regions and currencies."
      transcript="One program sits at the center. Lines reach four sample regions, shown with the currencies USD, EUR, AED and SGD. Loyalife supports 55+ currencies.">
      {(p) => <Global p={p} />}
    </LoopFrame>
  );
}

function Partner({ p }: { p: MotionValue<number> }) {
  const scan = useTransform(p, [0.1, 0.4], [0, 52]);
  const scanO = useTransform(p, [0.08, 0.12, 0.4, 0.45], [0, 1, 1, 0]);
  const valid = fade(p, 0.45, 0.55);
  const chipX = win(p, 0.65, 0.92, 0, -96);
  const chipO = useTransform(p, [0.6, 0.66, 0.97], [0, 1, 1]);
  return (
    <>
      <rect x="24" y="22" width="84" height="136" rx="14" className="fill-sunken stroke-line" />
      <rect x="40" y="52" width="52" height="52" rx="4" className="fill-surface stroke-ink" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4].flatMap((r) => [0, 1, 2, 3, 4].map((c) => ((r * 5 + c * 3) % 4 < 2 ? <rect key={`${r}${c}`} x={46 + c * 8} y={58 + r * 8} width="6" height="6" className="fill-ink" /> : null)))}
      <motion.rect x="38" y="52" width="56" height="2.5" rx="1" className="fill-accent" style={{ y: scan, opacity: scanO }} />
      <text x="66" y="126" fontSize="9" textAnchor="middle" className={M}>Partner</text>
      <motion.g style={{ opacity: valid }}>
        <rect x="140" y="62" width="110" height="34" rx="17" className="fill-success/15 stroke-success" />
        <path d="M156 79l5 5 9-10" fill="none" className="stroke-success" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="205" y="83" fontSize="10" fontWeight="600" textAnchor="middle" className="fill-success font-sans">Proof validated</text>
      </motion.g>
      <motion.g style={{ x: chipX, opacity: chipO }}>
        <rect x="190" y="112" width="86" height="28" rx="14" className="fill-accent" />
        <text x="233" y="130" fontSize="10" fontWeight="700" textAnchor="middle" className="fill-[#0C0A09] font-sans">Reward issued</text>
      </motion.g>
    </>
  );
}
export function PartnerClaimLoop(props: LoopProps) {
  return (
    <LoopFrame {...props} duration={7000} label="A partner scans a QR code, proof is validated, a reward is issued"
      caption="A partner scans a QR code, proof is validated, a reward is issued."
      transcript="A partner scans a QR code. Loyalife validates the proof. After validation, a reward is issued to the partner.">
      {(p) => <Partner p={p} />}
    </LoopFrame>
  );
}
