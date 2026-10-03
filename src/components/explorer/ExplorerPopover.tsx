import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MISSIONS, REWARD_BY_TIER, TIERS, TOTAL_POINTS, type MissionId } from '@/content/explorer';
import { explorerStore, resetExplorer, useExplorer } from '@/lib/explorer';
import { features } from '@/config/features';
import { openGuide, uiStore } from '@/lib/ui';
import { startTour } from '@/lib/tour';
import { useFocusTrap } from '@/lib/focus';
import { useReducedMotion } from '@/lib/prefs';
import { useMediaQuery } from '@/lib/hooks';
import { t } from '@/lib/motion';
import { Flag } from '@/lib/review';
import { Button } from '../ui/Button';
import { IconCheck, IconClose } from '../ui/Icons';
import { SampleLabel, Switch } from '../ui/Bits';
import { TemplatePack, OnePager } from './Rewards';

const NEXT_ORDER: MissionId[] = ['governance', 'region', 'story', 'tour', 'studio', 'estimator', 'demo', 'concierge'];

export default function ExplorerPopover() {
  const s = useExplorer();
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mobile = useMediaQuery('(max-width: 639px)');
  const [pack, setPack] = useState(false);
  const [pager, setPager] = useState(false);
  const close = () => uiStore.set({ explorerOpen: false });
  useFocusTrap(ref, true, close);

  const nextTier = TIERS.find((x) => x.at > s.points);
  const prevTier = [...TIERS].reverse().find((x) => x.at <= s.points)!;
  const toNext = nextTier ? nextTier.at - s.points : 0;
  const tierPct = nextTier ? ((s.points - prevTier.at) / (nextTier.at - prevTier.at)) * 100 : 100;

  const nextId = NEXT_ORDER.find((id) => !s.completedMissions.includes(id));
  const nextMission = MISSIONS.find((m) => m.id === nextId);
  const go = () => {
    close();
    switch (nextId) {
      case 'tour': return startTour('site');
      case 'governance': return nav('/#governed');
      case 'studio': return nav('/platform/ai-mcp#ai-studio');
      case 'region': return nav('/#rewards');
      case 'estimator': return nav('/pricing#estimator');
      case 'story': return nav('/#stories');
      case 'demo': return nav('/resources/demos');
      case 'concierge': return openGuide('ask');
    }
  };

  const pos = mobile ? 'fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t' : 'fixed right-4 top-[72px] w-[380px] max-h-[calc(100vh-88px)] rounded-xl2 border';

  return createPortal(
    <div className="overlay-root fixed inset-0 z-[75]" data-no-print>
      <div className="absolute inset-0" onClick={close} aria-hidden />
      <motion.div
        ref={ref}
        role="dialog"
        aria-label="Your explorer journey"
        className={`${pos} overflow-y-auto bg-surface p-5 shadow-soft`}
        initial={reduced ? { opacity: 0 } : mobile ? { opacity: 0, y: 40 } : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={t.base}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Your explorer journey</h2>
            <p className="mt-0.5 text-sm text-muted">
              <span className="font-medium text-ink">{s.tier}</span> · {s.points} of {TOTAL_POINTS} points
            </p>
          </div>
          <button type="button" onClick={close} aria-label="Close" className="rounded-full p-1.5 text-muted hover:bg-sunken"><IconClose /></button>
        </div>

        <div className="mt-3" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(tierPct)} aria-label="Progress to next tier">
          <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-brand transition-[width] duration-600 ease-calm" style={{ width: `${tierPct}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-muted">{nextTier ? `${toNext} points to ${nextTier.id}` : 'Top tier reached'}</p>
        </div>

        {nextMission && s.enabled && (
          <div className="mt-4 rounded-xl border bg-sunken p-3">
            <p className="label-mono">Next best step</p>
            <p className="mt-1 text-sm font-medium">{nextMission.label}</p>
            <p className="text-xs text-muted">+{nextMission.points} points</p>
            <Button size="sm" className="mt-2" arrow onClick={go}>Take me there</Button>
          </div>
        )}

        <h3 className="mt-5 text-sm font-semibold">Missions</h3>
        <ul className="mt-2 space-y-1.5">
          {MISSIONS.map((m) => {
            const done = s.completedMissions.includes(m.id);
            return (
              <li key={m.id} className="flex items-start gap-2.5 text-sm">
                <span aria-hidden className={`mt-0.5 flex h-4.5 w-4.5 h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${done ? 'border-success bg-success text-canvas' : 'border-ink/30'}`}>
                  {done && <IconCheck size={11} strokeWidth={3} />}
                </span>
                <span className={done ? 'text-muted line-through' : ''}>{m.label}</span>
                <span className="ml-auto shrink-0 font-mono text-xs text-muted">{m.points}</span>
                <span className="sr-only">{done ? 'Completed' : 'Not completed'}</span>
              </li>
            );
          })}
        </ul>

        <h3 className="mt-5 text-sm font-semibold">Badges</h3>
        <ul className="mt-2 grid grid-cols-2 gap-2">
          {MISSIONS.map((m) => {
            const got = s.badges.includes(m.badge);
            return (
              <li key={m.id} className={`rounded-lg border px-2.5 py-1.5 text-xs ${got ? 'border-ink/40 bg-surface font-medium' : 'border-dashed text-muted'}`}>
                {got ? m.badge : 'Not yet earned'}
              </li>
            );
          })}
        </ul>

        <h3 className="mt-5 text-sm font-semibold">Rewards <Flag id="explorerRewards" /></h3>
        <ul className="mt-2 space-y-2">
          {Object.entries(REWARD_BY_TIER).map(([tier, r]) => {
            const at = TIERS.find((x) => x.id === tier)!.at;
            const earned = s.points >= at;
            return (
              <li key={tier} className="rounded-lg border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{r.title}</span>
                  <span className="shrink-0 font-mono text-[11px] text-muted">{earned ? 'Earned' : `${tier} · ${at} points`}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted">{r.text}</p>
                {earned && tier === 'Navigator' && <Button size="sm" variant="subtle" className="mt-2" onClick={() => setPack(true)}>Open template pack<Flag id="templatePack" /></Button>}
                {earned && tier === 'Insider' && <Button size="sm" variant="subtle" className="mt-2" onClick={() => setPager(true)}>Open one pager<Flag id="onePager" /></Button>}
                {earned && tier === 'Architect' && <Button size="sm" variant="subtle" className="mt-2" onClick={() => { close(); nav('/demo'); }}>See it on the demo page<Flag id="prioritySlot" /></Button>}
              </li>
            );
          })}
        </ul>
        {!features.realRewards && <p className="mt-2 text-xs text-muted">Rewards are placeholders. Nothing is shipped or booked.</p>}

        <details className="mt-5 rounded-lg border p-3 text-sm">
          <summary className="select-none font-medium">Leaderboard (sample data)</summary>
          <ol className="mt-2 space-y-1 text-xs text-muted">
            {[['Sample visitor A', 'Architect', 230], ['Sample visitor B', 'Insider', 150], ['Sample visitor C', 'Navigator', 90]].map(([n, tr, p]) => (
              <li key={n as string} className="flex justify-between"><span>{n} · {tr}</span><span className="font-mono">{p}</span></li>
            ))}
          </ol>
          <div className="mt-2"><SampleLabel flag="leaderboard">Sample data</SampleLabel></div>
        </details>

        <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4">
          <label htmlFor="explorer-switch" className="text-sm font-medium">Explorer Mode</label>
          <Switch id="explorer-switch" label="Explorer Mode" checked={s.enabled} onChange={(v) => explorerStore.set({ enabled: v })} />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button type="button" onClick={() => resetExplorer()} className="text-sm text-brand underline-offset-4 hover:underline">Reset my progress</button>
          <p className="text-xs text-muted">Saved only in your browser.</p>
        </div>
      </motion.div>
      <TemplatePack open={pack} onClose={() => setPack(false)} onDuplicate={() => { setPack(false); close(); }} />
      <OnePager open={pager} onClose={() => setPager(false)} />
    </div>,
    document.body,
  );
}
