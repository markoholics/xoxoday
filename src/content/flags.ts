/** Every item that review mode flags. Mirrored in CONFIRM.md. */
export type FlagKind = 'confirm' | 'simulated' | 'placeholder' | 'cert';

export interface FlagDef {
  kind: FlagKind;
  label: string;
}

export const FLAGS = {
  members: { kind: 'confirm', label: '65M+ members managed: confirm figure and as-of date' },
  rewardsDistributed: { kind: 'confirm', label: '$5B+ rewards distributed to date: confirm figure and as-of date' },
  countries: { kind: 'confirm', label: '150+ countries with localized rewards: confirm' },
  uptime: { kind: 'confirm', label: '99.99% platform uptime, SLA backed: confirm SLA wording' },
  options: { kind: 'confirm', label: '10M+ reward options in 30+ categories: confirm' },
  langCurrency: { kind: 'confirm', label: '30+ languages and 55+ currencies: confirm' },
  benchmarks: { kind: 'confirm', label: 'Speed and cost benchmarks: confirm source and wording' },
  certPci: { kind: 'cert', label: 'PCI-DSS: Attach certificate or report' },
  certSoc2: { kind: 'cert', label: 'SOC 2 Type II: Attach certificate or report' },
  certIso: { kind: 'cert', label: 'ISO 27001: Attach certificate or report' },
  security: { kind: 'confirm', label: 'Security statements (dual-control, audit, ML fraud): supplied, confirm' },
  deployment: { kind: 'confirm', label: 'Deployment options (on-prem, hybrid, cloud, VPC, Active-Active DR): supplied, confirm' },
  deploymentDiagram: { kind: 'simulated', label: 'Deployment diagram is illustrative. Confirm with architecture team' },
  aiMcp: { kind: 'confirm', label: 'Loyalife AI & MCP and on-prem LLM: supplied by Xoxoday team, confirm status' },
  api: { kind: 'confirm', label: 'API facts (REST-first, OAuth 2.0 to JWT): supplied, confirm' },
  integrations: { kind: 'confirm', label: 'Integration list: supplied, confirm' },
  logos: { kind: 'placeholder', label: 'Customer names are text only. Replace with approved logos and confirm permission' },
  logoCategories: { kind: 'confirm', label: 'Industry chips on customer names were assigned by us. Confirm' },
  quotes: { kind: 'confirm', label: 'Quotes exactly as published today. Confirm permission and current wording' },
  caseStory: { kind: 'placeholder', label: 'Full case study text to be supplied. Only the published quote is shown' },
  glossary: { kind: 'confirm', label: 'Glossary definitions written from the facts. Confirm' },
  replyTime: { kind: 'placeholder', label: 'Reply time to be confirmed' },
  priceFactors: { kind: 'placeholder', label: 'Pricing factors are placeholders. No prices published' },
  docsLink: { kind: 'placeholder', label: 'Docs link to be confirmed' },
  residency: { kind: 'placeholder', label: 'Data residency options to be confirmed' },
  guides: { kind: 'placeholder', label: 'Guide placeholders' },
  demoSlots: { kind: 'placeholder', label: 'Demo slots play a code built walkthrough. Replace with recorded videos' },
  controlRoom: { kind: 'simulated', label: 'Control room is simulated with sample data' },
  approvalQueue: { kind: 'simulated', label: 'Approval queue is simulated with sample data' },
  commandBar: { kind: 'simulated', label: 'Command bar output is a deterministic sample, not a live model' },
  aiStudio: { kind: 'simulated', label: 'AI studio is simulated with sample output' },
  mcpDemo: { kind: 'simulated', label: 'MCP tool call is simulated' },
  sandbox: { kind: 'simulated', label: 'Sandbox is simulated with sample data' },
  mockScreens: { kind: 'simulated', label: 'Mock screens are built in code with sample data' },
  regionRewards: { kind: 'simulated', label: 'Reward values and order by region are sample data' },
  securityDemos: { kind: 'simulated', label: 'Dual-control, ledger replay and anomaly demos are simulated' },
  apiExplorer: { kind: 'simulated', label: 'API requests are illustrative, not the production reference' },
  estimator: { kind: 'simulated', label: 'Estimator uses only the supplied benchmarks' },
  concierge: { kind: 'simulated', label: 'Ask Loyalife uses local keyword retrieval, not a live model' },
  leaderboard: { kind: 'simulated', label: 'Leaderboard is sample data' },
  explorerRewards: { kind: 'placeholder', label: 'Explorer rewards are placeholders (features.realRewards is off)' },
  templatePack: { kind: 'placeholder', label: 'Program template pack is a placeholder' },
  onePager: { kind: 'placeholder', label: 'Build versus buy one pager is a placeholder built from the facts' },
  prioritySlot: { kind: 'placeholder', label: 'Priority demo slot is a placeholder. Nothing is booked' },
  demoForm: { kind: 'simulated', label: 'Demo form is a prototype. Nothing is sent' },
  securityPackForm: { kind: 'simulated', label: 'Security pack request is a prototype. Nothing is sent' },
  companyLinks: { kind: 'placeholder', label: 'Company links point to xoxoday.com. Confirm' },
  siteUrl: { kind: 'placeholder', label: 'Canonical site URL is a placeholder' },
  regionChip: { kind: 'placeholder', label: 'Region chip only changes analytics and labels' },
  storyMatch: { kind: 'confirm', label: 'Story shown is the closest available match for this page. Confirm' },
  tourGraphics: { kind: 'simulated', label: 'Tour and motion graphics are illustrations built in code' },
} satisfies Record<string, FlagDef>;

export type FlagId = keyof typeof FLAGS;
