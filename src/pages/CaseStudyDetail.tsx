import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { STORIES } from '@/content/site';
import { SOLUTIONS } from '@/content/solutions';
import { ClosingCta, MidCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section } from '@/components/ui/Section';
import { Flag } from '@/lib/review';
import { Graphic } from '@/components/graphics';
import { trackEvent } from '@/lib/events';
import NotFound from './NotFound';

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const story = STORIES.find((s) => s.id === slug);
  useEffect(() => {
    if (story) trackEvent('story_open', { id: story.id });
  }, [story]);
  if (!story) return <NotFound />;
  const related = SOLUTIONS.filter((s) => (story.industry.startsWith('Banking') ? s.slug === 'banking-and-cards' : s.slug === 'travel-and-energy'));
  const others = STORIES.filter((s) => s.id !== story.id);
  return (
    <>
      <PageHero eyebrow={`Case study · ${story.industry}`} title={story.company} lead={story.topic} ctaKey="caseStudies" />
      <Section id="story" tone="plain" className="!pt-6" label="Story">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <figure>
            <blockquote className="border-l-4 border-accent pl-6 text-2xl font-medium leading-snug tracking-tight sm:text-3xl">“{story.quote}”<Flag id="quotes" /></blockquote>
            <figcaption className="mt-5 text-muted">{story.person}, {story.role}, {story.company}</figcaption>
            <p className="mt-8 text-sm text-muted">Quote shown as published today. The full story is not on this site yet.<Flag id="caseStory" /></p>
            <ul className="mt-6 space-y-2 text-sm">
              {related.map((s) => <li key={s.slug}><Link className="link" to={`/solutions/${s.slug}`}>Related solution: {s.label}</Link></li>)}
              <li><Link className="link" to="/resources/case-studies">All case studies</Link></li>
            </ul>
          </figure>
          <Graphic kind={story.industry.startsWith('Banking') ? 'points' : 'global'} />
        </div>
      </Section>
      <MidCta title="Want to talk to someone about a program like this?" ctaKey="caseStudies" />
      <Section tone="sunken" label="More stories">
        <h2 className="h3 mb-5">More stories</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {others.map((s) => (
            <li key={s.id}><Link to={`/resources/case-studies/${s.id}`} className="card card-hover block p-5"><span className="font-semibold text-brand">{s.company}</span><span className="mt-1 block text-sm text-muted">{s.topic}</span></Link></li>
          ))}
        </ul>
      </Section>
      <PageFaq ids={['launch', 'global']} />
      <ClosingCta ctaKey="caseStudies" />
      <PageFoot />
    </>
  );
}
