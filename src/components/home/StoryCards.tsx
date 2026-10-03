import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORIES, type Story } from '@/content/site';
import { trackEvent } from '@/lib/events';
import { Section, SectionHead } from '../ui/Section';
import { Overlay } from '../ui/Overlay';
import { CtaPair } from '../ui/CtaPair';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { Flag } from '@/lib/review';

export function StoryDrawer({ story, onClose }: { story: Story | null; onClose: () => void }) {
  const nav = useNavigate();
  return (
    <Overlay open={!!story} onClose={onClose} label={story ? `${story.company} story` : 'Story'} side="right" widthClass="max-w-md">
      {story && (
        <div className="flex h-full flex-col p-6 pt-14">
          <p className="label-mono">{story.industry}</p>
          <h2 className="h2 mt-2">{story.company}</h2>
          <blockquote className="mt-6 border-l-2 border-accent pl-4">
            <p className="text-lg leading-relaxed">“{story.quote}”</p>
            <footer className="mt-3 text-sm text-muted">{story.person}, {story.role}<Flag id="quotes" /></footer>
          </blockquote>
          <p className="mt-6 text-sm text-muted">Quote shown as published today. <Flag id="caseStory" /></p>
          <div className="mt-auto pt-8">
            <CtaPair
              variant="drawer"
              ctaKey="caseStudies"
              size="md"
              onGhost={() => {
                onClose();
                nav(`/resources/case-studies/${story.id}`);
              }}
            />
          </div>
        </div>
      )}
    </Overlay>
  );
}

export function StoryCards() {
  const [open, setOpen] = useState<Story | null>(null);
  return (
    <Section id="stories" section="stories" tour="stories">
      <SectionHead title="What customers say" lead="Four published stories. Open a card to read the full quote." />
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STORIES.map((s) => (
          <RevealItem key={s.id}>
            <button
              type="button"
              onClick={() => {
                setOpen(s);
                trackEvent('story_open', { id: s.id });
              }}
              className="card card-hover flex h-full w-full flex-col p-5 text-left"
            >
              <span className="label-mono">{s.industry}</span>
              <span className="mt-2 text-lg font-semibold">{s.company}</span>
              <span className="mt-1 text-sm text-muted">{s.topic}</span>
              <span className="mt-6 text-sm font-medium text-brand">Read the quote</span>
            </button>
          </RevealItem>
        ))}
      </RevealGroup>
      <StoryDrawer story={open} onClose={() => setOpen(null)} />
    </Section>
  );
}
