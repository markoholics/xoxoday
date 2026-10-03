import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 18): SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false,
});

export const IconSearch = ({ size, ...p }: P) => <svg {...base(size)} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
export const IconMenu = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
export const IconClose = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const IconArrow = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const IconChevron = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="m6 9 6 6 6-6" /></svg>;
export const IconSun = ({ size, ...p }: P) => <svg {...base(size)} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
export const IconMoon = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" /></svg>;
export const IconCheck = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
export const IconPlay = ({ size, ...p }: P) => <svg {...base(size)} {...p} fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>;
export const IconPause = ({ size, ...p }: P) => <svg {...base(size)} {...p} fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>;
export const IconCopy = ({ size, ...p }: P) => <svg {...base(size)} {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>;
export const IconHelp = ({ size, ...p }: P) => <svg {...base(size)} {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01" /></svg>;
export const IconExternal = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>;
export const IconGlobe = ({ size, ...p }: P) => <svg {...base(size)} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>;
export const IconSend = ({ size, ...p }: P) => <svg {...base(size)} {...p}><path d="m4 12 16-8-6 16-2.5-6.5L4 12Z" /></svg>;
export const IconCC = ({ size, ...p }: P) => <svg {...base(size)} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M10 10.5a2 2 0 1 0 0 3M17 10.5a2 2 0 1 0 0 3" /></svg>;
