import { useLocation, useNavigate } from 'react-router-dom';
import { CTA, pathToCtaKey, type CtaKey } from '@/content/cta';
import { trackEvent } from '@/lib/events';
import { startTour } from '@/lib/tour';
import { scrollToSelector } from '@/lib/scroll';
import { openSecurityPack } from '@/lib/ui';
import { Button, ButtonLink } from './Button';
import { Flag } from '@/lib/review';

export type CtaVariant = 'header' | 'hero' | 'mid' | 'closing' | 'sticky' | 'drawer' | 'sheet';

/** Runs the ghost action for a page: start a tour, scroll to an element, or open the security pack dialog. */
export function useGhostAction(key?: CtaKey) {
  const { pathname } = useLocation();
  const k = key ?? pathToCtaKey(pathname);
  return () => {
    const a = CTA[k].action;
    if (a.type === 'tour') startTour(a.id);
    else if (a.type === 'dialog') openSecurityPack();
    else if (!scrollToSelector(a.target, true)) startTour(a.fallbackTour ?? 'site');
  };
}

/** Ghost button to explore yourself beside a solid button to talk to us. One line of reassurance underneath. */
export function CtaPair({
  variant = 'hero', ctaKey, size = 'lg', note = false, className = '', ghostLabel, align = 'start', onGhost,
}: { variant?: CtaVariant; ctaKey?: CtaKey; size?: 'sm' | 'md' | 'lg'; note?: boolean; className?: string; ghostLabel?: string; align?: 'start' | 'center'; onGhost?: () => void }) {
  const { pathname } = useLocation();
  const k = ctaKey ?? pathToCtaKey(pathname);
  const def = CTA[k];
  const run = useGhostAction(k);
  const nav = useNavigate();
  void nav;
  const page = pathname;
  return (
    <div className={className} data-cta-pair={variant}>
      <div className={`flex flex-wrap items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
        <Button
          variant="ghost"
          size={size}
          arrow
          onClick={() => {
            trackEvent('cta_click', { page, variant, label: ghostLabel ?? def.ghost, kind: 'ghost' });
            (onGhost ?? run)();
          }}
        >
          {ghostLabel ?? def.ghost}
        </Button>
        <ButtonLink
          to={def.solidTo}
          size={size}
          arrow
          onClick={() => trackEvent('cta_click', { page, variant, label: def.solid, kind: 'solid' })}
        >
          {def.solid}
        </ButtonLink>
      </div>
      {note && (
        <p className={`mt-3 text-sm text-muted ${align === 'center' ? 'text-center' : ''}`}>
          {def.ghostNote} <span aria-hidden>·</span> {def.solidNote}
          <Flag id="replyTime" />
        </p>
      )}
    </div>
  );
}
