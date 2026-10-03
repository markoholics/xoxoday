import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { GLOSSARY } from '@/content/glossary';
import { QUICK_START, TOURS, getTour } from '@/content/tours';
import { SECTION_HELP } from '@/content/sections';
import { closeGuide, uiStore, useUi, type GuideTab } from '@/lib/ui';
import { resumeTour, startTour, useTour } from '@/lib/tour';
import { useCurrentSection } from '@/lib/section';
import { prefsStore, setReduceMotion, useReducedMotion } from '@/lib/prefs';
import { useStore } from '@/lib/store';
import { useFocusTrap } from '@/lib/focus';
import { useMediaQuery } from '@/lib/hooks';
import { t } from '@/lib/motion';
import { Flag } from '@/lib/review';
import { Tabs, TabPanel } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Bits';
import { IconClose } from '../ui/Icons';
import { Graphic } from '../graphics';
import { AskTab } from './AskTab';

const TABS: { id: GuideTab; label: string }[] = [
  { id: 'tour', label: 'Tour' },
  { id: 'help', label: 'Help' },
  { id: 'ask', label: 'Ask' },
];

function TourTab() {
  const tour = useTour();
  const resume = tour.resumeId ? getTour(tour.resumeId) : undefined;
  return (
    <div className="space-y-4">
      {resume && (
        <div className="rounded-xl border bg-sunken p-3">
          <p className="text-sm font-medium">Pick up where you left off</p>
          <p className="text-xs text-muted">{resume.title}, step {tour.resumeIndex + 1} of {resume.steps.length}</p>
          <Button size="sm" className="mt-2" onClick={resumeTour}>Resume tour</Button>
        </div>
      )}
      <div>
        <h3 className="text-sm font-semibold">Quick start</h3>
        <ul className="mt-2 space-y-2">
          {QUICK_START.map((id) => {
            const td = TOURS.find((x) => x.id === id)!;
            return (
              <li key={id} className="flex items-center justify-between gap-3 rounded-xl border p-3">
                <div>
                  <p className="text-sm font-medium">{td.title}</p>
                  <p className="text-xs text-muted">{td.blurb}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => startTour(id)} aria-label={`Start ${td.title}`}>Start</Button>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="text-xs text-muted">Press Esc to leave a tour. Use the Left and Right arrow keys to move between steps.</p>
    </div>
  );
}

function HelpTab() {
  const sec = useCurrentSection();
  const help = sec ? SECTION_HELP[sec] : undefined;
  const [q, setQ] = useState('');
  const prefs = useStore(prefsStore);
  const reduced = useReducedMotion();
  const list = GLOSSARY.filter((g) => (g.term + ' ' + g.definition).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <section aria-live="polite" id="help-looking-at">
        <h3 className="text-sm font-semibold">What am I looking at</h3>
        {help ? (
          <div className="mt-2 rounded-xl border p-3">
            <p className="text-sm font-medium">{help.title}</p>
            <p className="mt-1 text-sm text-muted">{help.text}</p>
            {help.graphic && <div className="mt-3"><Graphic kind={help.graphic} compact /></div>}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">Scroll the page. This panel explains the section on screen.</p>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold">Quick start</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {QUICK_START.map((id) => (
            <li key={id}><Button size="sm" variant="ghost" onClick={() => startTour(id)}>{TOURS.find((x) => x.id === id)!.title}</Button></li>
          ))}
        </ul>
      </section>

      <section id="glossary">
        <h3 className="text-sm font-semibold">Glossary <Flag id="glossary" /></h3>
        <label className="sr-only" htmlFor="glossary-search">Search the glossary</label>
        <input id="glossary-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms" className="mt-2 h-10 w-full rounded-lg border bg-canvas px-3 text-sm" />
        <dl className="mt-3 space-y-2.5">
          {list.map((g) => (
            <div key={g.id}>
              <dt className="text-sm font-medium">{g.term}</dt>
              <dd className="text-sm text-muted">{g.definition}</dd>
            </div>
          ))}
          {!list.length && <p className="text-sm text-muted">No terms match.</p>}
        </dl>
      </section>

      <section>
        <h3 className="text-sm font-semibold">Keyboard shortcuts</h3>
        <ul className="mt-2 space-y-1.5 text-sm">
          {[['?', 'Open Help'], ['/', 'Ask Loyalife'], ['Cmd or Ctrl + K', 'Search and commands'], ['G then T', 'Open tours'], ['Esc', 'Close a panel or tour']].map(([k, d]) => (
            <li key={k} className="flex items-center justify-between gap-3">
              <span className="text-muted">{d}</span>
              <kbd className="rounded border bg-sunken px-1.5 py-0.5 font-mono text-xs">{k}</kbd>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold">Settings</h3>
        <div className="mt-2 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="sw-reduce" className="text-sm">Reduce motion{reduced && !prefs.reduceMotion ? ' (system setting is on)' : ''}</label>
            <Switch id="sw-reduce" label="Reduce motion" checked={prefs.reduceMotion} onChange={setReduceMotion} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="sw-hints" className="text-sm">Show hints</label>
            <Switch id="sw-hints" label="Show hints" checked={prefs.showHints} onChange={(v) => prefsStore.set({ showHints: v })} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function GuidePanel() {
  const { guideTab } = useUi();
  const ref = useRef<HTMLDivElement>(null);
  const mobile = useMediaQuery('(max-width: 639px)');
  const reduced = useReducedMotion();
  useFocusTrap(ref, true, closeGuide);
  const nav = useNavigate();
  void nav;
  const pos = mobile
    ? 'fixed inset-x-0 bottom-0 h-[78vh] rounded-t-2xl border-t'
    : 'fixed bottom-20 right-6 h-[min(640px,calc(100vh-120px))] w-[400px] rounded-xl2 border';
  return createPortal(
    <div className="overlay-root fixed inset-0 z-[60]" data-no-print>
      {mobile && <div className="absolute inset-0 bg-ink/30" onClick={closeGuide} aria-hidden />}
      <motion.div
        ref={ref}
        role="dialog"
        aria-label="Guide"
        className={`${pos} flex flex-col overflow-hidden bg-surface shadow-soft`}
        initial={reduced ? { opacity: 0 } : mobile ? { opacity: 0, y: 40 } : { opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={t.base}
      >
        <div className="flex items-center justify-between px-4 pt-3">
          <h2 className="text-base font-semibold">Guide</h2>
          <button type="button" onClick={closeGuide} aria-label="Close guide" className="rounded-full p-1.5 text-muted hover:bg-sunken"><IconClose /></button>
        </div>
        <Tabs tabs={TABS} value={guideTab} onChange={(v) => uiStore.set({ guideTab: v })} label="Guide sections" idPrefix="guide" className="px-2" />
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <TabPanel idPrefix="guide" id={guideTab} className="outline-none">
            {guideTab === 'tour' && <TourTab />}
            {guideTab === 'help' && <HelpTab />}
            {guideTab === 'ask' && <AskTab />}
          </TabPanel>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
