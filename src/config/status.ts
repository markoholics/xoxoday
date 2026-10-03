export type AiStatusValue = 'live' | 'beta' | 'proposed';

export interface AiStatusEntry {
  status: AiStatusValue;
  label: string;
  /** Supplied by the Xoxoday team and still to be confirmed. Flagged in review mode. */
  supplied?: boolean;
}

/** One place to change the status of every AI mention on the site. */
const entries = {
  anomalyDetection: { status: 'live', label: 'Anomaly detection' },
  loyalifeAiMcp: { status: 'live', label: 'Loyalife AI & MCP', supplied: true },
  onPremLlm: { status: 'live', label: 'On-prem LLM + MCP', supplied: true },
  toolCalling: { status: 'live', label: 'Tenant-isolated, audited tool-calling', supplied: true },
  studioBrief: { status: 'live', label: 'AI studio: Brief', supplied: true },
  studioDraft: { status: 'proposed', label: 'AI studio: Draft' },
  studioSimulate: { status: 'proposed', label: 'AI studio: Simulate' },
  studioApprove: { status: 'live', label: 'AI studio: Approve (maker checker)' },
  commandBar: { status: 'proposed', label: 'Command bar' },
  concierge: { status: 'proposed', label: 'Ask Loyalife (local retrieval)' },
  teaser: { status: 'proposed', label: 'AI studio teaser' },
} satisfies Record<string, AiStatusEntry>;

export type AiStatusId = keyof typeof entries;
export const aiStatus: Record<AiStatusId, AiStatusEntry> = entries;

export const STATUS_TEXT: Record<AiStatusValue, string> = {
  live: 'Live',
  beta: 'Beta',
  proposed: 'Proposed',
};
