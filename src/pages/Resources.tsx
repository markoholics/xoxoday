import { Link } from 'react-router-dom';
import { ClosingCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';

const CARDS = [
  { to: '/resources/case-studies', t: 'Case studies', d: 'Banks, partner networks and global travel.' },
  { to: '/resources/tours', t: 'Guided tours', d: 'Site, governance and program building.' },
  { to: '/resources/demos', t: 'Recorded demos', d: '90 second walkthroughs by role.' },
  { to: '/resources/faq', t: 'FAQ and guides', d: 'Answers to common buyer questions.' },
  { to: '/resources/docs', t: 'Documentation', d: 'Developer docs and API reference.' },
  { to: '/resources/security-pack', t: 'Security pack', d: 'Certifications, architecture and controls.' },
];

export default function Resources() {
  return (
    <>
      <PageHero eyebrow="Resources" title="Learn it, watch it, or build on it." lead="Six places to go. Start with a tour if you are new." ctaKey="resources" />
      <Section tone="plain" className="!pt-6" label="Resources">
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <RevealItem key={c.to}>
              <Link to={c.to} className="card card-hover block h-full p-6">
                <span className="text-lg font-semibold text-brand">{c.t}</span>
                <span className="mt-1 block text-muted">{c.d}</span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
      <PageFaq ids={['launch', 'program-types', 'integrations']} />
      <ClosingCta ctaKey="resources" />
      <PageFoot />
    </>
  );
}
