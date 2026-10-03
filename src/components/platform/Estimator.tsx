import { useEffect, useRef, useState } from 'react';
import { BENCHMARKS } from '@/content/site';
import { trackEvent } from '@/lib/events';
import { Hotspot } from '../ui/Hotspot';
import { SampleLabel } from '../ui/Bits';
import { Flag } from '@/lib/review';

/** Build versus buy estimator. Outputs use only the supplied benchmarks. */
export function Estimator() {
  const [eng, setEng] = useState(3);
  const [mk, setMk] = useState(10);
  const touched = useRef(false);
  const timer = useRef<number>();
  useEffect(() => {
    if (!touched.current) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => trackEvent('estimator_used', { engineers: eng, markets: mk }), 500);
    return () => window.clearTimeout(timer.current);
  }, [eng, mk]);
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
          <p className="text-xs text-muted">Benchmarks from Xoxoday enterprise customers. Your results will vary.<Flag id="benchmarks" /></p>
        </div>
      </div>
    </div>
  );
}
