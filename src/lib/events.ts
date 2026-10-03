/** Typed event catalogue and tiny pub/sub bus. */
export interface EventCatalogue {
  cta_click: { page: string; variant: string; label?: string; kind?: 'ghost' | 'solid' };
  tour_start: { tourId: string };
  tour_complete: { tourId: string; dwellMs: number };
  governance_approve: { decision: 'approve' | 'reject'; changeId?: string; context?: string };
  ai_studio_build: { step: string; completed?: boolean };
  mcp_demo_run: { tool?: string };
  deployment_select: { mode: string };
  api_explorer_used: { endpoint?: string; language?: string; action?: string };
  sandbox_used: { control: string };
  region_switch: { region: string };
  estimator_used: { engineers: number; markets: number };
  story_open: { id: string };
  demo_watch_75: { demoId: string; dwellMs: number };
  concierge_ask: { query: string; matched: boolean };
  command_bar_submit: { query: string };
  explorer_tier_up: { tier: string; points: number };
  demo_form_step1: { hasEmail: boolean };
  demo_form_submit: { programType?: string; shared?: boolean };
}

export type EventName = keyof EventCatalogue;
export interface TrackedEvent<N extends EventName = EventName> {
  name: N;
  payload: EventCatalogue[N];
  at: number;
}

type Listener = (e: TrackedEvent) => void;
const listeners = new Set<Listener>();
let interacted = false;

if (typeof window !== 'undefined') {
  const mark = () => {
    interacted = true;
    ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.removeEventListener(ev, mark, true));
  };
  ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.addEventListener(ev, mark, true));
}

/** True once the visitor has pressed, tapped or typed. Used by Explorer Mode (no points for reloads). */
export const hasUserInteracted = () => interacted;

export function trackEvent<N extends EventName>(name: N, payload: EventCatalogue[N]): void {
  const e = { name, payload, at: Date.now() } as TrackedEvent;
  listeners.forEach((l) => {
    try {
      l(e);
    } catch (err) {
      console.error('[events] listener failed', err);
    }
  });
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
