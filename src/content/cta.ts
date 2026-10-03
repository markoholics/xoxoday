export type CtaKey =
  | 'home' | 'platform' | 'infrastructure' | 'ai' | 'security' | 'apis'
  | 'solutions' | 'caseStudies' | 'resources' | 'pricing';

/** Ghost action kinds: start a tour, scroll to an element on the page, or open the security pack dialog. */
export type GhostAction =
  | { type: 'tour'; id: 'site' | 'sandbox' | 'governance' | 'build' }
  | { type: 'scroll'; target: string; fallbackTour?: 'site' }
  | { type: 'dialog'; id: 'security-pack' };

export interface CtaDef {
  ghost: string;
  solid: string;
  solidTo: string;
  action: GhostAction;
  ghostNote: string;
  solidNote: string;
}

export const CTA: Record<CtaKey, CtaDef> = {
  home: { ghost: 'Take the 3 minute tour', solid: 'Book a demo', solidTo: '/demo', action: { type: 'tour', id: 'site' }, ghostNote: 'Takes 3 minutes. No sign up.', solidNote: 'Reply time to be confirmed' },
  platform: { ghost: 'Open the sandbox', solid: 'Book a demo', solidTo: '/demo', action: { type: 'tour', id: 'sandbox' }, ghostNote: 'Runs in your browser. No sign up.', solidNote: 'Reply time to be confirmed' },
  infrastructure: { ghost: 'Compare deployment options', solid: 'Book a demo', solidTo: '/demo', action: { type: 'scroll', target: '#deployment' }, ghostNote: 'Takes 1 minute. No sign up.', solidNote: 'Reply time to be confirmed' },
  ai: { ghost: 'Try the AI studio', solid: 'Book a demo', solidTo: '/demo', action: { type: 'scroll', target: '#ai-studio' }, ghostNote: 'Sample output. No sign up.', solidNote: 'Reply time to be confirmed' },
  security: { ghost: 'Download the security pack', solid: 'Book a security review', solidTo: '/demo?topic=security', action: { type: 'dialog', id: 'security-pack' }, ghostNote: 'Work email needed.', solidNote: 'Reply time to be confirmed' },
  apis: { ghost: 'Try the API explorer', solid: 'Book a demo', solidTo: '/demo', action: { type: 'scroll', target: '#api-explorer' }, ghostNote: 'Illustrative requests. No sign up.', solidNote: 'Reply time to be confirmed' },
  solutions: { ghost: 'Watch the 90 second demo for your role', solid: 'Book a demo', solidTo: '/demo', action: { type: 'scroll', target: '#demo-slot' }, ghostNote: 'Takes 90 seconds. No sign up.', solidNote: 'Reply time to be confirmed' },
  caseStudies: { ghost: 'Explore the story', solid: 'Book a demo', solidTo: '/demo', action: { type: 'scroll', target: '#stories' }, ghostNote: 'Takes 1 minute. No sign up.', solidNote: 'Reply time to be confirmed' },
  resources: { ghost: 'Start a guided tour', solid: 'Book a demo', solidTo: '/demo', action: { type: 'tour', id: 'site' }, ghostNote: 'Takes 3 minutes. No sign up.', solidNote: 'Reply time to be confirmed' },
  pricing: { ghost: 'Estimate your cost', solid: 'Talk to sales', solidTo: '/demo?topic=sales', action: { type: 'scroll', target: '#estimator' }, ghostNote: 'Uses published benchmarks. No sign up.', solidNote: 'Reply time to be confirmed' },
};

export function pathToCtaKey(path: string): CtaKey {
  if (path === '/' || path === '/demo') return 'home';
  if (path === '/platform') return 'platform';
  if (path.startsWith('/platform/infrastructure')) return 'infrastructure';
  if (path.startsWith('/platform/ai-mcp')) return 'ai';
  if (path.startsWith('/platform/security')) return 'security';
  if (path.startsWith('/platform/apis')) return 'apis';
  if (path.startsWith('/solutions')) return 'solutions';
  if (path.startsWith('/resources/case-studies')) return 'caseStudies';
  if (path.startsWith('/resources')) return 'resources';
  if (path.startsWith('/pricing')) return 'pricing';
  return 'home';
}
