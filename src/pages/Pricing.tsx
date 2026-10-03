import { BENCHMARKS } from '@/content/site';
import { ClosingCta, MidCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section, SectionHead } from '@/components/ui/Section';
import { Estimator } from '@/components/platform/Estimator';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Flag } from '@/lib/review';

const FACTORS = [
  ['Members', 'The number of members across your programs.'],
  ['Programs', 'How many programs you run, and which types.'],
  ['Markets', 'The countries, languages and currencies you serve.'],
];

export default function Pricing() {
  return (
    <>
      <PageHero eyebrow="Pricing" title="Know what building costs before you talk to sales." lead="Prices are not published here. Use the estimator to compare a build with Loyalife using published benchmarks." ctaKey="pricing" />
      <Section id="how-pricing-works" tone="plain" className="!pt-6" label="How pricing works">
        <SectionHead title="How pricing works" lead="Pricing depends on a few factors. These are placeholders until confirmed." />
        <RevealGroup className="grid gap-4 md:grid-cols-3">
          {FACTORS.map(([a, b]) => (
            <RevealItem key={a}><div className="card h-full p-6"><h3 className="font-semibold">{a}<Flag id="priceFactors" /></h3><p className="mt-1 text-sm text-muted">{b}</p></div></RevealItem>
          ))}
        </RevealGroup>
      </Section>
      <Section tone="sunken" label="Estimator">
        <SectionHead title="Build versus buy" lead="Set your engineers and markets. See the benchmarks side by side." />
        <Estimator />
        <div className="mt-8 overflow-x-auto rounded-xl2 border bg-surface">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <caption className="sr-only">Build versus buy benchmarks</caption>
            <thead><tr className="border-b bg-sunken"><th scope="col" className="p-4 font-medium text-muted">Measure</th><th scope="col" className="p-4 font-semibold">Loyalife</th><th scope="col" className="p-4 font-semibold">In house build</th></tr></thead>
            <tbody className="divide-y">
              <tr><th scope="row" className="p-4 font-normal text-muted">Launch to first redemption</th><td className="p-4">{BENCHMARKS.loyalife.launch}</td><td className="p-4">{BENCHMARKS.inHouse.launch}</td></tr>
              <tr><th scope="row" className="p-4 font-normal text-muted">Engineering</th><td className="p-4">{BENCHMARKS.loyalife.staff}</td><td className="p-4">{BENCHMARKS.inHouse.staff}</td></tr>
              <tr><th scope="row" className="p-4 font-normal text-muted">Country reach</th><td className="p-4">{BENCHMARKS.loyalife.reach}</td><td className="p-4">{BENCHMARKS.inHouse.reach} at best</td></tr>
              <tr><th scope="row" className="p-4 font-normal text-muted">Reward options</th><td className="p-4">{BENCHMARKS.loyalife.options}</td><td className="p-4">{BENCHMARKS.inHouse.options}</td></tr>
              <tr><th scope="row" className="p-4 font-normal text-muted">Marketing tickets</th><td className="p-4">{BENCHMARKS.tickets}</td><td className="p-4 text-muted">Baseline</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">Benchmarks from Xoxoday enterprise customers. Your results will vary.<Flag id="benchmarks" /></p>
      </Section>
      <MidCta title="Want a quote for your members, programs and markets?" ctaKey="pricing" />
      <PageFaq ids={['launch', 'global']} />
      <ClosingCta ctaKey="pricing" />
      <PageFoot />
    </>
  );
}
