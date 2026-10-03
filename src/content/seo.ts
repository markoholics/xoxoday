export interface SeoMeta {
  title: string;
  description: string;
  faq?: boolean;
}

export const SEO: Record<string, SeoMeta> = {
  '/': { title: 'Loyalty programs members love and finance can audit', description: 'Loyalife by Xoxoday runs customer, channel partner and influencer loyalty programs. Every rule is approved and every point is traceable.', faq: true },
  '/platform': { title: 'Platform overview', description: 'One platform for every audience. Five pillars, a live sandbox and four deep dives into deployment, AI, security and APIs.' },
  '/platform/infrastructure': { title: 'Infrastructure, white-labelling and deployment', description: 'Run Loyalife on-prem, hybrid or cloud with VPC, Active-Active DR, multi-tenant and white-labelling.' },
  '/platform/ai-mcp': { title: 'Loyalife AI and MCP', description: 'AI that drafts and watches. People who decide. On-prem LLM + MCP with tenant-isolated, audited tool-calling.' },
  '/platform/security': { title: 'Security, fraud and governance', description: 'Maker checker approvals, an audit trail, a replayable reward ledger and anomaly detection.', faq: true },
  '/platform/apis': { title: 'APIs', description: 'REST-first APIs with OAuth 2.0 to JWT for members, transactions and points.' },
  '/solutions': { title: 'Solutions', description: 'Programs for customers, channel partners and influencers, in banking, manufacturing, travel and energy.' },
  '/resources': { title: 'Resources', description: 'Case studies, guided tours, recorded demos, FAQ, documentation and the security pack.' },
  '/resources/case-studies': { title: 'Case studies', description: 'Stories from banks, partner networks and global travel and energy programs.' },
  '/resources/tours': { title: 'Guided tours', description: 'Three guided tours: the site, governance and building a program.' },
  '/resources/demos': { title: 'Recorded demos', description: '90 second walkthroughs by role.' },
  '/resources/faq': { title: 'FAQ and guides', description: 'Answers to common buyer questions about Loyalife.', faq: true },
  '/resources/docs': { title: 'Documentation', description: 'Developer docs overview with an embedded API explorer.' },
  '/resources/security-pack': { title: 'Security pack', description: 'Certifications, architecture and controls. Request the pack with a work email.' },
  '/pricing': { title: 'Pricing', description: 'How pricing works, plus a build versus buy estimator based on published benchmarks.' },
  '/demo': { title: 'Book a demo', description: 'Book a Loyalife demo in two short steps.' },
};
