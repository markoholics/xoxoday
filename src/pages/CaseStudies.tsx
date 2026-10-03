import { Link } from 'react-router-dom';
import { STORIES } from '@/content/site';
import { ClosingCta, MidCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { trackEvent } from '@/lib/events';
import { Flag } from '@/lib/review';

export default function CaseStudies() {
  return (
    <>
      <PageHero eyebrow="Resources · Case studies" title="Banks, partner networks and global travel." lead="Four published stories. Quotes appear as published today." ctaKey="caseStudies" />
      <Section id="stories" tone="plain" className="!pt-6" label="Stories">
        <RevealGroup className="grid gap-px overflow-hidden rounded-xl2 border bg-line sm:grid-cols-2">
          {STORIES.map((s) => (
            <RevealItem key={s.id} className="bg-canvas">
              <Link to={`/resources/case-studies/${s.id}`} onClick={() => trackEvent('story_open', { id: s.id })} className="group block h-full bg-surface p-7 transition-colors duration-200 hover:bg-sunken">
                <span className="label-mono">{s.industry}</span>
                <span className="mt-3 block text-2xl font-semibold tracking-tight">{s.company}</span>
                <span className="mt-3 block text-muted">“{s.quote}”<Flag id="quotes" /></span>
                <span className="mt-4 block text-sm text-muted">{s.person}, {s.role}</span>
                <span className="mt-5 inline-block text-sm font-medium text-brand">Read the story <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span></span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
      <MidCta title="Want a story like these for your program?" ctaKey="caseStudies" />
      <PageFaq ids={['launch', 'global']} />
      <ClosingCta ctaKey="caseStudies" />
      <PageFoot />
    </>
  );
}
