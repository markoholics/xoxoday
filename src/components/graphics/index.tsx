import { lazy, Suspense } from 'react';
import type { GraphicKey } from '@/content/tours';
import { Skeleton } from '../ui/Bits';
import type { LoopProps } from './Loop';

const L = {
  points: lazy(() => import('./Graphics').then((m) => ({ default: m.PointsEarnedLoop }))),
  approval: lazy(() => import('./Graphics').then((m) => ({ default: m.ApprovalLoop }))),
  ledger: lazy(() => import('./Graphics').then((m) => ({ default: m.LedgerReplayLoop }))),
  ai: lazy(() => import('./Graphics').then((m) => ({ default: m.AiDraftLoop }))),
  global: lazy(() => import('./Graphics').then((m) => ({ default: m.GlobalRewardsLoop }))),
  partner: lazy(() => import('./Graphics').then((m) => ({ default: m.PartnerClaimLoop }))),
};

export function Graphic({ kind, ...props }: { kind: GraphicKey } & LoopProps) {
  const C = L[kind];
  return (
    <Suspense fallback={<Skeleton className="aspect-[16/9] w-full" />}>
      <C {...props} />
    </Suspense>
  );
}
