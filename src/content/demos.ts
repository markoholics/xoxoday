import type { GraphicKey } from './tours';

export interface DemoChapter {
  at: number; // seconds
  title: string;
  caption: string;
  graphic: GraphicKey;
}

export interface DemoDef {
  id: string;
  title: string;
  seconds: number;
  label: string;
  blurb: string;
  chapters: DemoChapter[];
}

const mk = (id: string, title: string, seconds: number, blurb: string, chapters: DemoChapter[]): DemoDef => ({
  id,
  title,
  seconds,
  label: seconds >= 120 ? `${Math.round(seconds / 60)} min` : `${seconds} sec`,
  blurb,
  chapters,
});

export const DEMOS: DemoDef[] = [
  mk('role-marketers', 'Walkthrough for marketers', 90, 'Launch a program, reach members and approve campaigns.', [
    { at: 0, title: 'Launch', caption: 'Launch a program in 8 to 12 weeks.', graphic: 'points' },
    { at: 30, title: 'Approve', caption: 'Every campaign change is approved before it goes live.', graphic: 'approval' },
    { at: 60, title: 'Reward', caption: 'Rewards reach members in 150+ countries.', graphic: 'global' },
  ]),
  mk('role-finance', 'Walkthrough for finance and risk', 90, 'Trace a point from earn to redeem, with approvals on every change.', [
    { at: 0, title: 'Approve', caption: 'Maker checker approvals cover every change.', graphic: 'approval' },
    { at: 30, title: 'Trace', caption: 'The reward ledger is idempotent and replayable.', graphic: 'ledger' },
    { at: 60, title: 'Watch', caption: 'Anomaly detection flags unusual activity.', graphic: 'ledger' },
  ]),
  mk('role-cx', 'Walkthrough for CX teams', 90, 'See what members see on the app and the WhatsApp bot.', [
    { at: 0, title: 'Earn', caption: 'A purchase becomes points on a member card.', graphic: 'points' },
    { at: 30, title: 'Redeem', caption: 'Members browse and redeem in 30+ languages.', graphic: 'global' },
    { at: 60, title: 'Partner claims', caption: 'Partners scan a code and rewards follow validation.', graphic: 'partner' },
  ]),
  mk('governance', 'Governance in 90 seconds', 90, 'Follow a change from draft to checker to live.', [
    { at: 0, title: 'Draft', caption: 'A maker drafts a change.', graphic: 'approval' },
    { at: 30, title: 'Check', caption: 'A checker approves. The audit trail records it.', graphic: 'approval' },
    { at: 60, title: 'Replay', caption: 'Replay the ledger to rebuild a balance.', graphic: 'ledger' },
  ]),
  mk('ai-studio', 'AI studio in 90 seconds', 90, 'A brief becomes a draft and a simulation. A person decides.', [
    { at: 0, title: 'Brief', caption: 'Describe the program you want.', graphic: 'ai' },
    { at: 30, title: 'Draft and simulate', caption: 'A draft and a simulation appear as proposals.', graphic: 'ai' },
    { at: 60, title: 'Approve', caption: 'A person approves this before anything goes live.', graphic: 'approval' },
  ]),
  mk('build', 'Build a program in 2 minutes', 120, 'Start from a template and change rules in the sandbox.', [
    { at: 0, title: 'Start', caption: 'Pick an audience and a mechanic.', graphic: 'points' },
    { at: 40, title: 'Tune', caption: 'Change a rule and a tier threshold.', graphic: 'points' },
    { at: 80, title: 'Approve', caption: 'Send the change for approval.', graphic: 'approval' },
  ]),
];

export const getDemo = (id: string) => DEMOS.find((d) => d.id === id);
