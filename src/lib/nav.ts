import type { NavigateFunction } from 'react-router-dom';
import { scrollToSelector } from './scroll';

/** Go to a page and scroll to an anchor on it. */
export function goTo(nav: NavigateFunction, href: string, anchor?: string) {
  const here = window.location.pathname;
  if (here === href && anchor) {
    if (!scrollToSelector('#' + anchor)) nav(`${href}#${anchor}`);
    return;
  }
  nav(anchor ? `${href}#${anchor}` : href);
}
