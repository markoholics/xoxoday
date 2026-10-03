import { useEffect, useRef, useState } from 'react';
import type { DemoDef } from '@/content/demos';
import { trackEvent } from '@/lib/events';
import { useOnScreen, useTabVisible } from '@/lib/hooks';
import { Graphic } from '../graphics';
import { IconCC, IconPause, IconPlay } from './Icons';
import { Flag } from '@/lib/review';

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/**
 * Demo player with poster, chapters, captions and transcript.
 * Without `src` it plays an animated walkthrough built in code. Pass `src` to use a recorded video.
 * Fires demo_watch_75 once at 75% with a 2 second dwell rule.
 */
export function DemoPlayer({ demo, src, poster, autoFocus }: { demo: DemoDef; src?: string; poster?: string; autoFocus?: boolean }) {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [cc, setCc] = useState(true);
  const fired = useRef(false);
  const dwell = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const vref = useRef<HTMLVideoElement>(null);
  const on = useOnScreen(ref, '0px');
  const vis = useTabVisible();
  const total = demo.seconds;

  const chapterIdx = Math.max(0, demo.chapters.map((c) => c.at).filter((a) => a <= pos).length - 1);
  const chapter = demo.chapters[chapterIdx];

  const check = (p: number) => {
    if (!fired.current && p / total >= 0.75 && dwell.current >= 2000) {
      fired.current = true;
      trackEvent('demo_watch_75', { demoId: demo.id, dwellMs: Math.round(dwell.current) });
    }
  };

  // Code built walkthrough clock. Pauses off screen and in hidden tabs.
  useEffect(() => {
    if (src || !playing || !on || !vis) return;
    const id = window.setInterval(() => {
      dwell.current += 100;
      setPos((p) => {
        const n = Math.min(total, p + 0.1);
        check(n);
        if (n >= total) setPlaying(false);
        return n;
      });
    }, 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, on, vis, src, total]);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const toggle = () => {
    if (!started) setStarted(true);
    if (src && vref.current) {
      if (playing) vref.current.pause();
      else void vref.current.play();
    }
    if (!src && pos >= total) setPos(0);
    setPlaying((v) => !v);
  };

  const seek = (s: number) => {
    setPos(s);
    if (src && vref.current) vref.current.currentTime = s;
    check(s);
  };

  return (
    <div ref={ref} tabIndex={-1} className="overflow-hidden rounded-xl2 border bg-surface outline-none" data-demo-player={demo.id}>
      <div className="relative aspect-video bg-sunken">
        {src ? (
          <video
            ref={vref}
            src={src}
            poster={poster}
            className="h-full w-full"
            onPlay={() => { setStarted(true); setPlaying(true); }}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              dwell.current = Math.max(dwell.current, v.currentTime * 1000);
              setPos(v.currentTime);
              if (v.duration) {
                if (!fired.current && v.currentTime / v.duration >= 0.75 && dwell.current >= 2000) {
                  fired.current = true;
                  trackEvent('demo_watch_75', { demoId: demo.id, dwellMs: Math.round(dwell.current) });
                }
              }
            }}
            controls
          />
        ) : !started ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="label-mono">{demo.label}</p>
            <p className="text-lg font-semibold">{demo.title}</p>
            <button type="button" onClick={toggle} aria-label={`Play ${demo.title}`} className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[#0C0A09] transition-transform duration-200 ease-calm hover:scale-105 active:scale-95">
              <IconPlay size={22} />
            </button>
            <p className="text-xs text-muted">Animated walkthrough built in code<Flag id="demoSlots" /></p>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md" key={chapter.graphic}>
              <Graphic kind={chapter.graphic} compact />
            </div>
            {cc && (
              <p className="absolute inset-x-4 bottom-3 rounded-md bg-ink/85 px-3 py-1.5 text-center text-sm text-canvas" aria-live="off" data-captions>
                {chapter.caption}
              </p>
            )}
          </div>
        )}
      </div>

      {!src && (
        <div className="border-t p-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-canvas">
              {playing ? <IconPause size={14} /> : <IconPlay size={14} />}
            </button>
            <input
              type="range"
              min={0}
              max={total}
              step={0.1}
              value={pos}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              aria-valuetext={`${mmss(pos)} of ${mmss(total)}`}
              className="h-1.5 min-w-0 flex-1 accent-[rgb(var(--brand))]"
            />
            <span className="w-24 shrink-0 text-right font-mono text-xs tabular-nums text-muted">{mmss(pos)} / {mmss(total)}</span>
            <button type="button" aria-pressed={cc} aria-label="Captions" onClick={() => setCc((v) => !v)} className={`rounded-md border p-1.5 ${cc ? 'bg-ink text-canvas' : ''}`}>
              <IconCC size={16} />
            </button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Chapters">
            {demo.chapters.map((c, i) => (
              <li key={c.title}>
                <button
                  type="button"
                  onClick={() => { if (!started) setStarted(true); seek(c.at); }}
                  aria-current={i === chapterIdx}
                  className={`rounded-full border px-3 py-1 text-xs ${i === chapterIdx ? 'border-ink bg-ink text-canvas' : 'hover:border-ink/50'}`}
                >
                  <span className="font-mono">{mmss(c.at)}</span> {c.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <details className="border-t px-3 py-2 text-sm">
        <summary className="select-none text-muted">Transcript</summary>
        <ol className="mt-2 space-y-1.5 pb-1 text-muted">
          {demo.chapters.map((c) => (
            <li key={c.title}><span className="font-mono text-xs">{mmss(c.at)}</span> {c.caption}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
