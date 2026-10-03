import { QUICK_START, TOURS } from '@/content/tours';
import { ClosingCta, MidCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section } from '@/components/ui/Section';
import { Graphic } from '@/components/graphics';
import { Button } from '@/components/ui/Button';
import { startTour } from '@/lib/tour';
import { trackEvent } from '@/lib/events';
import { useLocation } from 'react-router-dom';
import type { GraphicKey } from '@/content/tours';

const PREVIEW: Record<string, GraphicKey> = { site: 'ai', governance: 'approval', build: 'points' };

export default function Tours() {
  const { pathname } = useLocation();
  return (
    <>
      <PageHero eyebrow="Resources · Guided tours" title="Learn Loyalife by doing." lead="Three short tours. A spotlight shows you where to look. Skip or leave any time." ctaKey="resources" />
      <Section id="tours" section="tours-grid" tone="plain" className="!pt-6" label="Tours">
        <ul className="grid gap-6 lg:grid-cols-3">
          {QUICK_START.map((id) => {
            const tour = TOURS.find((x) => x.id === id)!;
            return (
              <li key={id} className="card flex flex-col p-5">
                <Graphic kind={PREVIEW[id]} compact />
                <h2 className="h3 mt-4">{tour.title}</h2>
                <p className="mt-1 flex-1 text-sm text-muted">{tour.blurb}</p>
                <p className="label-mono mt-3">{tour.steps.length} steps · {tour.length}</p>
                <Button className="mt-4 self-start" arrow onClick={() => { trackEvent('cta_click', { page: pathname, variant: 'mid', label: `Start ${tour.title}`, kind: 'ghost' }); startTour(id); }} aria-label={`Start ${tour.title}`}>Start</Button>
              </li>
            );
          })}
        </ul>
      </Section>
      <MidCta title="Prefer to talk it through?" ctaKey="resources" />
      <PageFaq ids={['launch', 'program-types']} />
      <ClosingCta ctaKey="resources" />
      <PageFoot />
    </>
  );
}
