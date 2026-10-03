import { createStore, useStore } from './store';

export type Channel = 'app' | 'whatsapp' | 'email';

export interface SandboxState {
  doublePoints: boolean;
  threshold: number;
  channel: Channel;
  programName: string;
  note: string;
  source: 'default' | 'template' | 'command';
}

export const SANDBOX_DEFAULT: SandboxState = { doublePoints: false, threshold: 12000, channel: 'app', programName: 'Customer rewards', note: '', source: 'default' };

/** In-memory only. */
export const sandboxStore = createStore<SandboxState>({ ...SANDBOX_DEFAULT });
export const useSandbox = () => useStore(sandboxStore);
