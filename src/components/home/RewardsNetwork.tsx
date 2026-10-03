import { motion } from 'framer-motion';
import { useState } from 'react';
import { REGIONS_REWARD, REWARD_ORDER, REWARD_SAMPLE_VALUE, type RegionId } from '@/content/platform';
import { trackEvent } from '@/lib/events';
import { useReducedMotion } from '@/lib/prefs';
import { spring } from '@/lib/motion';
import { Section, SectionHead } from '../ui/Section';
import { Tabs } from '../ui/Tabs';
import { Hotspot } from '../ui/Hotspot';
import { SampleLabel } from '../ui/Bits';
import { Flag } from '@/lib/review';
import { Graphic } from '../graphics';

const ICON: Record<string, string> = {
  Dining: 'M6 3v8a3 3 0 0 0 3 3v7M9 3v6M12 3v8M18 3c-2 2-3 5-3 8h3v10',
  Travel: 'M3 16l18-6-2-3-6 2-5-5-2 1 3 6-5 2 1 3Z',
  Electronics: 'M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm4 15h2',
  'Mobile top up': 'M8 3h8v18H8zM12 7v6M9 10h6',
  Subscriptions: 'M4 6h16v12H4zM4 10h16M9 14h3',
  Charity: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.600-7 10-7 10Z',
  Experiences: 'M12 3l2.5 5.500 6 .7-4.400 4.100 1.200 5.900L12 16.400 6.700 19.200l1.200-5.900L3.500 9.200l6-.7L12 3Z',
  Merchandise: 'M5 8h14l-1 12H6L5 8Zm4 0a3 3 0 0 1 6 0',
};

export function RewardsNetwork() {
  const [region, setRegion] = useState<RegionId>('global');
  const reduced = useReducedMotion();
  const def = REGIONS_REWARD.find((r) => r.id === region)!;
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: def.currency, maximumFractionDigits: 0 }).format(n);
  const change = (r: RegionId) => {
    setRegion(r);
    trackEvent('region_switch', { region: r });
  };
  return (
    <Section id="rewards" section="rewards" tour="rewards" tone="sunken">
      <SectionHead title="Rewards members actually want, wherever they are." lead="Pick a region. The currency and the order of reward categories change." />
      <div className="relative">
        <Hotspot id="region-chips" label="Region chips" className="-top-1 right-0" align="right">Pick a region to see local currency and a different order of rewards.</Hotspot>
        <Tabs tabs={REGIONS_REWARD.map((r) => ({ id: r.id, label: r.label }))} value={region} onChange={change} label="Region" idPrefix="reg" variant="pill" className="mb-6 flex-wrap pr-8" />
      </div>
      <div role="tabpanel" id={`reg-panel-${region}`} aria-labelledby={`reg-tab-${region}`}>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>{def.note}</span>
          <SampleLabel flag="regionRewards">Sample data</SampleLabel>
          <Flag id="options" />
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {REWARD_ORDER[region].map((c) => (
            <motion.li layout={!reduced} transition={spring} key={c} className="card card-hover p-4">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-brand" aria-hidden><path d={ICON[c]} /></svg>
              <p className="mt-3 text-[15px] font-medium">{c}</p>
              <p className="text-sm tabular-nums text-muted">From {fmt(REWARD_SAMPLE_VALUE[c])}</p>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="mt-10 grid items-center gap-6 sm:grid-cols-2">
        <p className="text-muted">Rewards reach members in 150+ countries, in 30+ languages and 55+ currencies, from a marketplace of 10M+ options in 30+ categories.<Flag id="countries" /><Flag id="langCurrency" /></p>
        <Graphic kind="global" />
      </div>
    </Section>
  );
}
