export interface NavLinkDef {
  label: string;
  detail: string;
  to: string;
}
export interface NavColumn {
  label: string;
  links: NavLinkDef[];
}
export interface NavItemDef {
  id: 'platform' | 'solutions' | 'resources' | 'pricing';
  label: string;
  to: string;
  columns?: NavColumn[];
}

export const NAV: NavItemDef[] = [
  {
    id: 'platform',
    label: 'Platform',
    to: '/platform',
    columns: [
      {
        label: 'Platform & deployment',
        links: [
          {
            label: 'Infrastructure, white-labelling & deployment',
            detail: 'On-prem, hybrid & cloud · VPC, Active-Active DR, multi-tenant',
            to: '/platform/infrastructure',
          },
          {
            label: 'Loyalife AI & MCP',
            detail: 'On-prem LLM + MCP · tenant-isolated, audited tool-calling',
            to: '/platform/ai-mcp',
          },
        ],
      },
      {
        label: 'Security & developer',
        links: [
          {
            label: 'Security, fraud & governance',
            detail: 'PCI-DSS · SOC 2 Type II · ISO 27001, dual-control, audit & ML fraud',
            to: '/platform/security',
          },
          {
            label: 'APIs',
            detail: 'REST-first · OAuth 2.0 → JWT for members, transactions & points',
            to: '/platform/apis',
          },
        ],
      },
    ],
  },
  {
    id: 'solutions',
    label: 'Solutions',
    to: '/solutions',
    columns: [
      {
        label: 'By audience',
        links: [
          { label: 'Customers', detail: 'Retain customers and grow basket size', to: '/solutions/customers' },
          { label: 'Channel partners', detail: 'Dealers, distributors and installers', to: '/solutions/channel-partners' },
          { label: 'Influencers', detail: 'Advocates, missions and referrals', to: '/solutions/influencers' },
        ],
      },
      {
        label: 'By industry',
        links: [
          { label: 'Banking and cards', detail: 'Cardholder engagement and spend', to: '/solutions/banking-and-cards' },
          { label: 'Manufacturing and channel', detail: 'Repeat sales across partner networks', to: '/solutions/manufacturing-and-channel' },
          { label: 'Travel and energy', detail: 'Booker and fuel retail programs', to: '/solutions/travel-and-energy' },
        ],
      },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    to: '/resources',
    columns: [
      {
        label: 'Learn',
        links: [
          { label: 'Case studies', detail: 'Banks, partner networks and global travel', to: '/resources/case-studies' },
          { label: 'Guided tours', detail: 'Site, governance and program building', to: '/resources/tours' },
          { label: 'Recorded demos', detail: '90 second walkthroughs by role', to: '/resources/demos' },
          { label: 'FAQ and guides', detail: 'Answers to common buyer questions', to: '/resources/faq' },
        ],
      },
      {
        label: 'Build',
        links: [
          { label: 'Documentation', detail: 'Developer docs and API reference', to: '/resources/docs' },
          { label: 'Security pack', detail: 'Certifications, architecture and controls', to: '/resources/security-pack' },
        ],
      },
    ],
  },
  { id: 'pricing', label: 'Pricing', to: '/pricing' },
];
