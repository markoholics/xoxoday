export interface DemoPayload {
  email: string;
  name?: string;
  company?: string;
  region?: string;
  programType?: 'Customer' | 'Channel partner' | 'Influencer' | 'Not sure';
  topic?: string;
  explorerSummary?: string;
  prioritySlot?: boolean;
}

export interface DemoResult {
  ok: true;
  reference: string;
}

/** Prototype: resolves after a short delay and logs the payload. Nothing is sent. */
export async function submitDemoRequest(payload: DemoPayload): Promise<DemoResult> {
  await new Promise((r) => setTimeout(r, 700));
  console.info('[demo] submitDemoRequest (prototype, nothing is sent)', payload);
  return { ok: true, reference: 'PROTO-' + Math.random().toString(36).slice(2, 7).toUpperCase() };
}

/** One field security pack request. Same prototype rules. */
export async function requestSecurityPack(email: string): Promise<DemoResult> {
  await new Promise((r) => setTimeout(r, 600));
  console.info('[security-pack] requestSecurityPack (prototype, nothing is sent)', { email });
  return { ok: true, reference: 'PROTO-' + Math.random().toString(36).slice(2, 7).toUpperCase() };
}
