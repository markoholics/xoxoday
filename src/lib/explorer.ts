import { createStore, useStore } from './store';
import { subscribe, trackEvent, hasUserInteracted, type TrackedEvent } from './events';
import { MISSIONS, tierFor, type MissionId, type TierId } from '@/content/explorer';
import { explorerEnabledByUrl } from '@/config/features';

export interface ExplorerState {
  enabled: boolean;
  points: number;
  completedMissions: MissionId[];
  badges: string[];
  tier: TierId;
  exploredTopics: string[];
  createdAt: number;
}

const fresh = (): ExplorerState => ({ enabled: true, points: 0, completedMissions: [], badges: [], tier: 'Explorer', exploredTopics: [], createdAt: Date.now() });

/** localStorage key loyalife_explorer_v1, with in-memory fallback. */
export const explorerStore = createStore<ExplorerState>(fresh(), 'loyalife_explorer_v1');
export const useExplorer = () => useStore(explorerStore);

/** Feature flag plus ?explorer=off. When false, nothing renders and nothing is tracked. */
export const explorerAvailable = () => typeof window !== 'undefined' && explorerEnabledByUrl();

export type Celebration = { kind: 'points'; points: number; label: string; badge: string } | { kind: 'tier'; tier: TierId; points: number };
export const celebrationStore = createStore<{ queue: Celebration[]; announce: string }>({ queue: [], announce: '' });

const TOPIC: Partial<Record<TrackedEvent['name'], string>> = {
  governance_approve: 'governance approvals',
  region_switch: 'regional rewards',
  estimator_used: 'build versus buy estimator',
  ai_studio_build: 'AI studio',
  deployment_select: 'deployment options',
  api_explorer_used: 'API explorer',
  sandbox_used: 'sandbox',
  mcp_demo_run: 'MCP demo',
  story_open: 'customer stories',
  tour_start: 'guided tours',
  command_bar_submit: 'program command bar',
  demo_watch_75: 'recorded demos',
  concierge_ask: 'Ask Loyalife',
};

export function award(id: MissionId): void {
  const s = explorerStore.get();
  const m = MISSIONS.find((x) => x.id === id);
  if (!m || !s.enabled || s.completedMissions.includes(id)) return;
  const points = s.points + m.points;
  const tier = tierFor(points);
  explorerStore.set({ points, tier, completedMissions: [...s.completedMissions, id], badges: [...s.badges, m.badge] });
  const q: Celebration[] = [{ kind: 'points', points: m.points, label: m.label, badge: m.badge }];
  if (tier !== s.tier) {
    q.push({ kind: 'tier', tier, points });
    trackEvent('explorer_tier_up', { tier, points });
  }
  celebrationStore.set((c) => ({ ...c, queue: [...c.queue, ...q], announce: `You earned ${m.points} points. ${m.badge} badge.` }));
}

function addTopic(topic?: string) {
  if (!topic) return;
  const s = explorerStore.get();
  if (!s.exploredTopics.includes(topic)) explorerStore.set({ exploredTopics: [...s.exploredTopics, topic] });
}

/** Builds the explorerSummary used by the demo form. */
export function explorerSummary(): string | undefined {
  const t = explorerStore.get().exploredTopics;
  if (!t.length) return undefined;
  return `Explored: ${t.slice(0, 6).join(', ')}.`;
}

export function resetExplorer() {
  explorerStore.set({ ...fresh() });
}

const lastSeen = new Map<string, number>();
let started = false;

/** Real interaction only. Ignores duplicates within 500ms, requires 2s dwell for tours and demos, and ignores anything before the first press or tap. */
export function startExplorer(): void {
  if (started || typeof window === 'undefined') return;
  started = true;
  subscribe((e) => {
    if (!explorerAvailable() || !explorerStore.get().enabled) return;
    if (!hasUserInteracted()) return;
    const key = e.name + ':' + JSON.stringify(e.payload);
    const prev = lastSeen.get(key) ?? 0;
    if (e.at - prev < 500) return;
    lastSeen.set(key, e.at);
    if (e.name !== 'explorer_tier_up' && e.name !== 'cta_click') addTopic(TOPIC[e.name]);
    const p = e.payload as Record<string, any>;
    switch (e.name) {
      case 'tour_complete':
        if (p.tourId === 'site' && p.dwellMs >= 2000) award('tour');
        break;
      case 'governance_approve':
        award('governance');
        break;
      case 'ai_studio_build':
        if (p.completed) award('studio');
        break;
      case 'region_switch':
        award('region');
        break;
      case 'estimator_used':
        award('estimator');
        break;
      case 'story_open':
        award('story');
        break;
      case 'demo_watch_75':
        if (p.dwellMs >= 2000) award('demo');
        break;
      case 'concierge_ask':
        award('concierge');
        break;
    }
  });
}
