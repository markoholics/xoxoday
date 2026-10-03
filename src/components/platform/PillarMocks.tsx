import { useState } from 'react';
import { REWARD_CATEGORIES } from '@/content/site';
import { SampleLabel } from '../ui/Bits';
import { Flag } from '@/lib/review';

const Frame = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="overflow-hidden rounded-xl border bg-canvas">
    <div className="flex items-center gap-2 border-b bg-sunken px-3 py-2">
      <span className="flex gap-1" aria-hidden>{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-ink/20" />)}</span>
      <span className="text-xs font-medium">{title}</span>
      <span className="ml-auto flex items-center"><SampleLabel flag="mockScreens">Sample data</SampleLabel></span>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

function Programs() {
  return (
    <Frame title="Loyalty programs">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Sample programs</caption>
        <thead><tr className="text-xs text-muted"><th className="pb-2 font-medium">Program</th><th className="pb-2 font-medium">Type</th><th className="pb-2 font-medium">Status</th></tr></thead>
        <tbody className="divide-y">
          {[['Customer rewards', 'Enterprise', 'Live'], ['Partner program', 'Channel', 'Live'], ['Advocate missions', 'Influencer', 'Draft']].map(([a, b, c]) => (
            <tr key={a}><td className="py-2 font-medium">{a}</td><td className="py-2 text-muted">{b}</td><td className="py-2"><span className={`font-mono text-[11px] uppercase ${c === 'Live' ? 'text-success' : 'text-muted'}`}>{c}</span></td></tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 rounded-lg border border-dashed p-3 text-sm">
        <p className="label-mono mb-1">Rule</p>
        If purchase is $50 or more, then earn 2 points per $1.
      </div>
    </Frame>
  );
}

function Members() {
  const [q, setQ] = useState('');
  const rows = [['M-4821', 'Gold', '11,200'], ['M-4822', 'Silver', '3,480'], ['M-4823', 'Platinum', '31,050'], ['M-4824', 'Silver', '920'], ['M-4825', 'Gold', '14,310']].filter((r) => r.join(' ').toLowerCase().includes(q.toLowerCase()));
  return (
    <Frame title="Member management">
      <label htmlFor="mock-search" className="sr-only">Search members</label>
      <input id="mock-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ID or tier" className="mb-3 h-9 w-full rounded-lg border bg-surface px-3 text-sm" />
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Sample members</caption>
        <thead><tr className="text-xs text-muted"><th className="pb-2 font-medium">Member</th><th className="pb-2 font-medium">Tier</th><th className="pb-2 text-right font-medium">Points</th></tr></thead>
        <tbody className="divide-y">
          {rows.map(([a, b, c]) => <tr key={a}><td className="py-2 font-mono text-xs">{a}</td><td className="py-2">{b}</td><td className="py-2 text-right tabular-nums">{c}</td></tr>)}
          {!rows.length && <tr><td colSpan={3} className="py-3 text-muted">No sample members match.</td></tr>}
        </tbody>
      </table>
    </Frame>
  );
}

function Engagement() {
  const [lang, setLang] = useState('English');
  const msg: Record<string, string> = { English: 'You are 800 points from Gold. Redeem anytime.', Spanish: 'Te faltan 800 puntos para Gold. Canjea cuando quieras.', Arabic: 'تبقى لك 800 نقطة للوصول إلى Gold.' };
  return (
    <Frame title="Member engagement">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Message language">
        {Object.keys(msg).map((l) => (
          <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className={`rounded-full border px-3 py-1 text-xs ${lang === l ? 'border-ink bg-ink text-canvas' : ''}`}>{l}</button>
        ))}
      </div>
      <div className="mt-4 max-w-xs rounded-2xl rounded-bl-sm bg-success/15 p-3 text-sm" dir={lang === 'Arabic' ? 'rtl' : 'ltr'}>{msg[lang]}</div>
      <p className="mt-2 text-xs text-muted">WhatsApp bot preview. Members check balance, browse and redeem.</p>
    </Frame>
  );
}

function Rewards() {
  return (
    <Frame title="Loyalty rewards">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {REWARD_CATEGORIES.map((c) => <li key={c} className="rounded-lg border bg-surface px-3 py-3 text-sm">{c}</li>)}
      </ul>
    </Frame>
  );
}

function Reports() {
  const data = [42, 55, 48, 63, 71, 66];
  const red = [18, 22, 20, 27, 31, 29];
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  return (
    <Frame title="Reports and insights">
      <svg viewBox="0 0 300 120" role="img" aria-label="Sample chart: points issued and redeemed per month" className="w-full">
        {data.map((v, i) => (
          <g key={i}>
            <rect x={14 + i * 48} y={100 - v} width="16" height={v} rx="3" className="fill-brand" />
            <rect x={32 + i * 48} y={100 - red[i]} width="16" height={red[i]} rx="3" className="fill-accent" />
            <text x={30 + i * 48} y="114" fontSize="8" textAnchor="middle" className="fill-muted font-sans">{months[i]}</text>
          </g>
        ))}
      </svg>
      <p className="mt-2 flex gap-4 text-xs text-muted"><span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-brand" />Issued</span><span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-accent" />Redeemed</span></p>
    </Frame>
  );
}

export const MOCKS = { programs: Programs, members: Members, engagement: Engagement, rewards: Rewards, reports: Reports };
export { Flag };
