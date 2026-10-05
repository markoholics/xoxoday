import { useEffect, useRef, useState } from 'react';
import { BENCHMARKS } from '@/content/site';
import { trackEvent } from '@/lib/events';
import { Hotspot } from '../ui/Hotspot';
import { SampleLabel, Switch } from '../ui/Bits';
import { Flag } from '@/lib/review';

/** Build versus buy estimator. Outputs use only the supplied benchmarks. */
export function Estimator() {
  const [eng, setEng] = useState(3);
  const [mk, setMk] = useState(10);
  const [rate, setRate] = useState(150000);
  const [quote, setQuote] = useState('');
  const [myTeam, setMyTeam] = useState(false);
  const [steady, setSteady] = useState(true);
  const touched = useRef(false);
  const timer = useRef<number>();
  useEffect(() => {
    if (!touched.current) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => trackEvent('estimator_used', { engineers: eng, markets: mk }), 500);
    return () => window.clearTimeout(timer.current);
  }, [eng, mk, rate, quote, myTeam, steady]);
  // Illustrative cost model. Inputs are yours; only the headcount and timeline ranges come from the published benchmarks.
  const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
  const range = (a: number, b: number) => (Math.round(a) === Math.round(b) ? usd(a) : `${usd(a)} to ${usd(b)}`);
  const teamLo = myTeam ? eng : 3;
  const teamHi = myTeam ? eng : 5;
  const buildLo = teamLo * rate * (9 / 12);
  const buildHi = teamHi * rate * (12 / 12);
  const runLo = 0;
  const runHi = rate; // 0 to 1 FTE
  const quoteNum = Number(quote.replace(/[^0-9.]/g, ''));
  const hasQuote = quote.trim() !== '' && quoteNum > 0;
  const loyalifeYear1Lo = (hasQuote ? quoteNum : 0) + (steady ? runLo : 0);
  const loyalifeYear1Hi = (hasQuote ? quoteNum : 0) + (steady ? runHi : 0);
  const below = eng < 3;
  const beyond = mk > 50;
  return (
    <div id="estimator" data-tour="estimator" data-section="estimator" className="relative rounded-xl2 border bg-surface p-5 sm:p-8">
      <Hotspot id="estimator" label="Estimator" className="right-4 top-4">Move the sliders. Outputs come only from the published benchmarks.</Hotspot>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold">Build versus buy estimator</h3>
        <SampleLabel flag="estimator">Sample data</SampleLabel>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-7">
          <div>
            <div className="flex items-baseline justify-between"><label htmlFor="est-eng" className="text-sm font-medium">Engineers available</label><output htmlFor="est-eng" className="font-mono text-sm tabular-nums">{eng}</output></div>
            <input id="est-eng" type="range" min={0} max={10} step={1} value={eng} onChange={(e) => { touched.current = true; setEng(Number(e.target.value)); }} className="mt-2 w-full accent-[rgb(var(--brand))]" />
          </div>
          <fieldset className="space-y-4 rounded-xl border p-4">
            <legend className="px-1 text-sm font-medium">Cost assumptions</legend>
            <div>
              <label htmlFor="est-rate" className="text-sm font-medium">Loaded cost per engineer per year (USD)</label>
              <input id="est-rate" type="number" min={0} step={5000} inputMode="numeric" value={rate} onChange={(e) => { touched.current = true; setRate(Math.max(0, Number(e.target.value) || 0)); }} className="mt-1 h-11 w-full rounded-lg border bg-canvas px-3 text-base tabular-nums" aria-describedby="est-rate-help" />
              <p id="est-rate-help" className="mt-1 text-xs text-muted">Placeholder of $150,000. Replace with your own figure.<Flag id="priceFactors" /></p>
            </div>
            <div>
              <label htmlFor="est-quote" className="text-sm font-medium">Loyalife quote per year, if you have one (USD)</label>
              <input id="est-quote" type="text" inputMode="numeric" placeholder="Leave blank until you have a quote" value={quote} onChange={(e) => { touched.current = true; setQuote(e.target.value); }} className="mt-1 h-11 w-full rounded-lg border bg-canvas px-3 text-base" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="est-myteam" className="text-sm">Cost my {eng} {eng === 1 ? 'engineer' : 'engineers'} instead of the benchmark team</label>
              <Switch id="est-myteam" label="Cost my engineers instead of the benchmark team" checked={myTeam} onChange={(v) => { touched.current = true; setMyTeam(v); }} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="est-steady" className="text-sm">Include Loyalife steady state team (0 to 1 FTE)</label>
              <Switch id="est-steady" label="Include Loyalife steady state team" checked={steady} onChange={(v) => { touched.current = true; setSteady(v); }} />
            </div>
          </fieldset>
          <div>
            <div className="flex items-baseline justify-between"><label htmlFor="est-mk" className="text-sm font-medium">Markets</label><output htmlFor="est-mk" className="font-mono text-sm tabular-nums">{mk}</output></div>
            <input id="est-mk" type="range" min={1} max={60} step={1} value={mk} onChange={(e) => { touched.current = true; setMk(Number(e.target.value)); }} className="mt-2 w-full accent-[rgb(var(--brand))]" />
          </div>
        </div>
        <div className="space-y-3" aria-live="polite">
          <div className="rounded-xl border p-4">
            <p className="label-mono">Time to first redemption</p>
            <p className="mt-1">In house: <strong>{BENCHMARKS.inHouse.launch}</strong></p>
            <p>Loyalife: <strong>{BENCHMARKS.loyalife.launch}</strong></p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="label-mono">Engineering</p>
            <p className="mt-1">You have <strong>{eng}</strong>. An in house build needs <strong>{BENCHMARKS.inHouse.staff}</strong>. Loyalife needs <strong>{BENCHMARKS.loyalife.staff}</strong>.</p>
            {below && <p className="mt-2 inline-block rounded-full border border-warning/60 bg-warning/10 px-3 py-0.5 text-sm text-warning">Below typical in house staffing</p>}
          </div>
          <div className="rounded-xl border p-4">
            <p className="label-mono">Reach</p>
            <p className="mt-1">You chose <strong>{mk}</strong> {mk === 1 ? 'market' : 'markets'}. In house builds reach <strong>{BENCHMARKS.inHouse.reach}</strong> with {BENCHMARKS.inHouse.options}. Loyalife reaches <strong>{BENCHMARKS.loyalife.reach}</strong> with <strong>{BENCHMARKS.loyalife.options}</strong>.</p>
            {beyond && <p className="mt-2 inline-block rounded-full border border-danger/60 bg-danger/10 px-3 py-0.5 text-sm text-danger">Beyond typical in house reach</p>}
          </div>
          <div className="rounded-xl border-2 border-ink/80 bg-sunken p-4" data-estimated-cost>
            <p className="label-mono">Estimated cost, first year</p>
            <dl className="mt-2 space-y-2 text-sm">
              <div className="flex items-baseline justify-between gap-3"><dt>In house build</dt><dd className="text-right text-lg font-semibold tabular-nums">{range(buildLo, buildHi)}</dd></div>
              <div className="flex items-baseline justify-between gap-3"><dt>Loyalife team cost{steady ? '' : ' (excluded)'}</dt><dd className="text-right font-semibold tabular-nums">{steady ? range(runLo, runHi) : '$0'}</dd></div>
              <div className="flex items-baseline justify-between gap-3"><dt>Loyalife licence</dt><dd className="text-right font-semibold tabular-nums">{hasQuote ? usd(quoteNum) : 'Quote from sales'}</dd></div>
              {hasQuote && <div className="flex items-baseline justify-between gap-3 border-t pt-2"><dt>Loyalife total</dt><dd className="text-right text-lg font-semibold tabular-nums">{range(loyalifeYear1Lo, loyalifeYear1Hi)}</dd></div>}
            </dl>
            <p className="mt-2 text-xs text-muted">{myTeam ? `Uses your ${eng} ${eng === 1 ? 'engineer' : 'engineers'}` : 'Uses the benchmark team of 3 to 5 engineers'} over 9 to 12 months. Loyalife needs 0 to 1 FTE at steady state. Illustrative, not a quote.</p>
          </div>
          <p className="text-xs text-muted">Benchmarks from Xoxoday enterprise customers. Your results will vary.<Flag id="benchmarks" /></p>
        </div>
      </div>
    </div>
  );
}
