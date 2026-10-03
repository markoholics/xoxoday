import { useLocation } from 'react-router-dom';
import { CTA, pathToCtaKey } from '@/content/cta';
import { useScrolledPast } from '@/lib/hooks';
import { trackEvent } from '@/lib/events';
import { useEffect } from 'react';
import { uiStore, useUi } from '@/lib/ui';
import { Button, ButtonLink } from '../ui/Button';
import { useGhostAction } from '../ui/CtaPair';

/** Mobile bottom bar after 400px of scroll. */
export function StickyCta() {
  const { pathname } = useLocation();
  const past = useScrolledPast(400);
  const { menuOpen } = useUi();
  const key = pathToCtaKey(pathname);
  const def = CTA[key];
  const run = useGhostAction(key);
  const show = past && !menuOpen;
  useEffect(() => {
    uiStore.set({ stickyVisible: show });
  }, [show]);
  return (
    <div
      data-sticky-cta
      data-no-print
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t bg-canvas/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur transition-[transform,opacity] duration-200 ease-calm lg:hidden ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}
    >
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="ghost"
          size="sm"
          tabIndex={show ? 0 : -1}
          className="!px-2 text-[13px] leading-tight"
          onClick={() => {
            trackEvent('cta_click', { page: pathname, variant: 'sticky', label: def.ghost, kind: 'ghost' });
            run();
          }}
        >
          {def.ghost}
        </Button>
        <ButtonLink
          to={def.solidTo}
          size="sm"
          className="!px-2 text-[13px] leading-tight"
          onClick={() => trackEvent('cta_click', { page: pathname, variant: 'sticky', label: def.solid, kind: 'solid' })}
        >
          {def.solid}
        </ButtonLink>
      </div>
    </div>
  );
}
