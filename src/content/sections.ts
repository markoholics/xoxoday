import type { GraphicKey } from './tours';

/** "What am I looking at": one sentence per section marked data-section. */
export const SECTION_HELP: Record<string, { title: string; text: string; graphic?: GraphicKey }> = {
  hero: { title: 'Loyalife by Xoxoday', text: 'Describe a program, or watch the control room run a sample program.', graphic: 'ai' },
  'control-room': { title: 'Control room', text: 'Sample data. Programs, KPIs and an approval queue, updating on their own.', graphic: 'approval' },
  proof: { title: 'Proof band', text: 'Scale figures and the customer names, filtered by industry.' },
  audience: { title: 'Audience selector', text: 'Each tab shows one outcome, one mechanic and one story for that audience.', graphic: 'points' },
  governed: { title: 'Governed by design', text: 'Approve or reject a sample change. Each decision appends a line to the ledger.', graphic: 'approval' },
  'ai-teaser': { title: 'AI studio teaser', text: 'AI drafts and watches. A person approves before anything goes live.', graphic: 'ai' },
  rewards: { title: 'Rewards network', text: 'Pick a region to change the currency and the order of reward categories.', graphic: 'global' },
  stories: { title: 'Customer stories', text: 'Open a story card to read the full quote.' },
  faq: { title: 'FAQ', text: 'Answers to common buyer questions, taken from the facts on this site.' },
  pillars: { title: 'Five pillars', text: 'Tabs with a mock screen for each part of the platform. Sample data.' },
  sandbox: { title: 'Sandbox', text: 'Toggle a rule, change a tier threshold and preview a message. The member card updates.', graphic: 'points' },
  deployment: { title: 'Deployment diagram', text: 'Pick Cloud, Hybrid or On-prem to see where the Loyalife core sits.', graphic: 'global' },
  'ai-studio': { title: 'AI studio', text: 'Four steps: Brief, Draft, Simulate, Approve. A person approves before anything goes live.', graphic: 'ai' },
  'mcp-demo': { title: 'MCP tool call', text: 'An assistant asks. A tenant-isolated tool call runs. An audit line is written.', graphic: 'ai' },
  'dual-control': { title: 'Dual-control approval', text: 'A maker proposes and a different person checks.', graphic: 'approval' },
  'ledger-replay': { title: 'Ledger replay', text: 'Replay ledger lines to rebuild a balance. Duplicates are ignored.', graphic: 'ledger' },
  anomaly: { title: 'Anomaly demo', text: 'Move the slider to simulate a redemption spike and see it flagged.', graphic: 'ledger' },
  certs: { title: 'Security pack', text: 'Certification chips, a residency selector and a one field request form.' },
  'api-explorer': { title: 'API explorer', text: 'Illustrative requests in curl, Python and Node, plus the OAuth 2.0 to JWT flow.' },
  estimator: { title: 'Build versus buy estimator', text: 'Two sliders. Outputs use only the published benchmarks.' },
  'demo-slot': { title: 'Demo slot', text: 'A 90 second walkthrough for your role.', graphic: 'points' },
};
