export type GraphicKey = 'points' | 'approval' | 'ledger' | 'ai' | 'global' | 'partner';

export interface TourStep {
  id: string;
  target: string;
  route?: string;
  title: string;
  body: string;
  graphic?: GraphicKey;
}

export interface TourDef {
  id: 'site' | 'governance' | 'build' | 'sandbox';
  title: string;
  length: string;
  blurb: string;
  steps: TourStep[];
}

export const TOURS: TourDef[] = [
  {
    id: 'site',
    title: 'Site in 3 minutes',
    length: '3 minutes',
    blurb: 'See what Loyalife does, who it serves and how it stays in control.',
    steps: [
      { id: 'nav', route: '/', target: '[data-tour="nav"]', title: 'Four items. That is the whole site.', body: 'Platform, Solutions, Resources and Pricing. Open a panel to see every page inside it.' },
      { id: 'command', route: '/', target: '[data-tour="command-bar"]', title: 'Describe a program', body: 'Type a goal or pick a chip. You get a sample program card. A person approves it before anything goes live.', graphic: 'ai' },
      { id: 'control-room', route: '/', target: '[data-tour="control-room"]', title: 'The control room', body: 'Sample data. Values tick, and a new approval arrives every few seconds.', graphic: 'approval' },
      { id: 'proof', route: '/', target: '[data-tour="proof"]', title: 'Proof at scale', body: 'Read the numbers, then filter the customer names by industry.' },
      { id: 'audience', route: '/', target: '[data-tour="audience"]', title: 'Pick an audience', body: 'Customers, channel partners or influencers. Each tab shows one outcome, one mechanic and one story.', graphic: 'points' },
      { id: 'governed', route: '/', target: '[data-tour="governed"]', title: 'Approve or reject a change', body: 'Try it. Each decision lands in the ledger panel.', graphic: 'approval' },
      { id: 'ai', route: '/', target: '[data-tour="ai-teaser"]', title: 'AI drafts. People decide.', body: 'Loyalife drafts and watches. A person approves before anything goes live.', graphic: 'ai' },
      { id: 'rewards', route: '/', target: '[data-tour="rewards"]', title: 'Switch region', body: 'Region chips change the currency and the order of reward categories.', graphic: 'global' },
      { id: 'stories', route: '/', target: '[data-tour="stories"]', title: 'Read a story', body: 'Open a card to read the full quote.' },
      { id: 'guide', route: '/', target: '[data-tour="guide"]', title: 'Need help? Open Guide', body: 'Tour, Help and Ask live here. Press ? for shortcuts.' },
    ],
  },
  {
    id: 'governance',
    title: 'Governance in 90 seconds',
    length: '90 seconds',
    blurb: 'Follow a change from draft to approval, then replay the ledger.',
    steps: [
      { id: 'dual', route: '/platform/security', target: '[data-tour="dual-control"]', title: 'Dual-control', body: 'The maker proposes. A different person checks. Try approving as the maker.', graphic: 'approval' },
      { id: 'ledger', route: '/platform/security', target: '[data-tour="ledger-replay"]', title: 'Replay the ledger', body: 'Replay lines to rebuild a balance. A duplicate event is ignored.', graphic: 'ledger' },
      { id: 'anomaly', route: '/platform/security', target: '[data-tour="anomaly"]', title: 'Spot a spike', body: 'Move the slider. A redemption spike is flagged for review.', graphic: 'ledger' },
      { id: 'certs', route: '/platform/security', target: '[data-tour="certs"]', title: 'Certifications and residency', body: 'Request the security pack with a work email.' },
    ],
  },
  {
    id: 'build',
    title: 'Build a program in 2 minutes',
    length: '2 minutes',
    blurb: 'Change a rule in the sandbox, then draft a program in the AI studio.',
    steps: [
      { id: 'pillars', route: '/platform', target: '[data-tour="pillars"]', title: 'Five pillars', body: 'Programs, members, engagement, rewards and reports.' },
      { id: 'sandbox', route: '/platform', target: '[data-tour="sandbox"]', title: 'Change a rule', body: 'Toggle a rule, move a threshold and preview a message. The member card updates.', graphic: 'points' },
      { id: 'studio', route: '/platform/ai-mcp', target: '[data-tour="ai-studio"]', title: 'Four steps', body: 'Brief, Draft, Simulate, Approve. A person approves before anything goes live.', graphic: 'ai' },
      { id: 'mcp', route: '/platform/ai-mcp', target: '[data-tour="mcp-demo"]', title: 'Tool calls stay audited', body: 'Each call is tenant-isolated and writes an audit line.' },
    ],
  },
  {
    id: 'sandbox',
    title: 'Open the sandbox',
    length: '30 seconds',
    blurb: 'A short stop at the sandbox controls.',
    steps: [
      { id: 'sandbox-only', route: '/platform', target: '[data-tour="sandbox"]', title: 'The sandbox', body: 'Three controls change one live member card. Sample data.', graphic: 'points' },
    ],
  },
];

export const QUICK_START: TourDef['id'][] = ['site', 'governance', 'build'];
export const getTour = (id: string) => TOURS.find((t) => t.id === id);
