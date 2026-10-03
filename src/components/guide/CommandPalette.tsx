import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/content/seo';
import { SOLUTIONS } from '@/content/solutions';
import { CASE_TITLES } from '@/content/caseTitles';
import { TOURS } from '@/content/tours';
import { askGuide, closePalette, useUi } from '@/lib/ui';
import { startTour } from '@/lib/tour';
import { useFocusTrap } from '@/lib/focus';
import { IconSearch } from '../ui/Icons';

interface Item {
  id: string;
  group: 'Navigate' | 'Tours' | 'Ask';
  label: string;
  hint?: string;
  run: () => void;
}

/** Cmd or Ctrl plus K. Sections: Navigate, Tours, Ask. */
export default function CommandPalette() {
  const { paletteOpen } = useUi();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, paletteOpen, closePalette);
  useEffect(() => {
    if (paletteOpen) {
      setQ('');
      setIdx(0);
    }
  }, [paletteOpen]);

  const items = useMemo<Item[]>(() => {
    const go = (to: string) => () => {
      closePalette();
      nav(to);
    };
    const pages: [string, string][] = [
      ...Object.entries(SEO).map(([path, m]) => [path, path === '/' ? 'Home' : m.title] as [string, string]),
      ...SOLUTIONS.map((s) => ['/solutions/' + s.slug, 'Solutions: ' + s.label] as [string, string]),
      ...Object.entries(CASE_TITLES).map(([slug, title]) => ['/resources/case-studies/' + slug, 'Case study: ' + title] as [string, string]),
    ];
    const navItems: Item[] = pages.map(([p, label]) => ({ id: 'n' + p, group: 'Navigate', label, hint: p, run: go(p) }));
    const tourItems: Item[] = TOURS.map((tour) => ({
      id: 't' + tour.id, group: 'Tours', label: tour.title, hint: tour.length,
      run: () => { closePalette(); startTour(tour.id); },
    }));
    const text = q.trim();
    const needle = text.toLowerCase();
    const f = (it: Item) => !needle || (it.label + ' ' + (it.hint ?? '')).toLowerCase().includes(needle);
    const ask: Item[] = text
      ? [{ id: 'ask-q', group: 'Ask', label: `Ask Loyalife: ${text}`, run: () => askGuide(text) }]
      : ['How fast can we launch?', 'What deployment options exist?'].map((s) => ({ id: 'a' + s, group: 'Ask' as const, label: s, run: () => askGuide(s) }));
    return [...navItems.filter(f).slice(0, 8), ...tourItems.filter(f), ...ask];
  }, [q, nav]);

  useEffect(() => setIdx(0), [q]);
  if (!paletteOpen || typeof document === 'undefined') return null;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx((i) => (i + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      items[idx]?.run();
    }
  };

  const groups = ['Navigate', 'Tours', 'Ask'] as const;
  return createPortal(
    <div className="overlay-root fixed inset-0 z-[95] flex items-start justify-center px-4 pt-[12vh]" data-no-print>
      <div className="absolute inset-0 bg-ink/40" onClick={closePalette} aria-hidden />
      <div ref={ref} role="dialog" aria-modal="true" aria-label="Search and commands" className="relative w-full max-w-xl overflow-hidden rounded-xl2 border bg-surface shadow-soft" onKeyDown={onKey}>
        <div className="flex items-center gap-3 border-b px-4">
          <IconSearch className="text-muted" />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={items[idx] ? 'pal-' + items[idx].id : undefined}
            aria-label="Search pages, tours or ask a question"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pages, start a tour, or ask a question"
            className="h-14 w-full bg-transparent text-base outline-none"
          />
          <kbd className="hidden rounded border bg-sunken px-1.5 py-0.5 font-mono text-xs sm:block">Esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {groups.map((g) => {
            const list = items.filter((i) => i.group === g);
            if (!list.length) return null;
            return (
              <li key={g} role="presentation">
                <p className="label-mono px-3 pb-1 pt-3">{g}</p>
                <ul role="group" aria-label={g}>
                  {list.map((it) => {
                    const i = items.indexOf(it);
                    return (
                      <li
                        key={it.id}
                        id={'pal-' + it.id}
                        role="option"
                        aria-selected={i === idx}
                        onMouseMove={() => setIdx(i)}
                        onClick={it.run}
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm ${i === idx ? 'bg-sunken' : ''}`}
                      >
                        <span>{it.label}</span>
                        {it.hint && <span className="shrink-0 font-mono text-xs text-muted">{it.hint}</span>}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
