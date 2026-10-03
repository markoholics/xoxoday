import { GLOSSARY } from '@/content/glossary';
import { ClosingCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section, SectionHead } from '@/components/ui/Section';
import { Flag } from '@/lib/review';

const GUIDES = [
  'Plan a customer rewards program',
  'Run a channel partner program',
  'Set up missions and referrals for influencers',
  'Review a change as a checker',
];

export default function FaqGuides() {
  return (
    <>
      <PageHero eyebrow="Resources · FAQ and guides" title="Answers to common buyer questions." lead="Every answer comes from the facts on this site. Ask a question in the Guide for more." ctaKey="resources" />
      <PageFaq title="Frequently asked questions" />
      <Section id="glossary" tone="sunken" label="Glossary">
        <SectionHead title="Glossary" lead="Plain definitions for terms used on this site." />
        <dl className="grid gap-x-10 gap-y-5 md:grid-cols-2">
          {GLOSSARY.map((g) => (
            <div key={g.id}><dt className="font-semibold">{g.term}</dt><dd className="text-muted">{g.definition}</dd></div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-muted"><Flag id="glossary" /></p>
      </Section>
      <Section id="guides" label="Guides">
        <SectionHead title="Guides" lead="Guide placeholders. Content is coming." />
        <ul className="grid gap-4 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <li key={g} className="card flex items-center justify-between gap-4 p-5">
              <span className="font-medium">{g}</span>
              <span className="shrink-0 rounded-full border border-dashed px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">Placeholder</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted"><Flag id="guides" /></p>
      </Section>
      <ClosingCta ctaKey="resources" />
      <PageFoot />
    </>
  );
}
