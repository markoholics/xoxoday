import { Link } from 'react-router-dom';
import { NAV } from '@/content/nav';
import { SITE } from '@/content/site';
import { REGIONS, regionStore, useRegion, type Region } from '@/lib/region';
import { Logo } from '../ui/Logo';
import { Flag } from '@/lib/review';
import { IconGlobe } from '../ui/Icons';

export function Footer() {
  const region = useRegion();
  return (
    <footer className="mt-8 border-t bg-sunken/60" data-no-print>
      <div className="container-x py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <Logo className="h-6 w-auto text-ink" />
            <p className="mt-4 max-w-xs text-sm text-muted">Loyalty programs members love and finance can audit.</p>
            <label className="mt-6 inline-flex items-center gap-2 rounded-full border bg-surface py-1.5 pl-3 pr-2 text-sm">
              <IconGlobe size={16} className="text-muted" />
              <span className="sr-only">Region</span>
              <select
                value={region}
                onChange={(e) => regionStore.set({ region: e.target.value as Region })}
                className="cursor-pointer bg-transparent pr-1 text-sm outline-none"
                aria-label="Region"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <Flag id="regionChip" />
            </label>
          </div>
          {NAV.filter((n) => n.columns).map((n) => (
            <nav key={n.id} aria-label={`Footer ${n.label}`}>
              <h2 className="text-sm font-semibold"><Link to={n.to} className="hover:underline">{n.label}</Link></h2>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {n.columns!.flatMap((c) => c.links).map((l) => (
                  <li key={l.to}><Link to={l.to} className="transition-colors hover:text-ink">{l.label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label="Footer Company">
            <h2 className="text-sm font-semibold">Company</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link to="/pricing" className="hover:text-ink">Pricing</Link></li>
              <li><Link to="/demo" className="hover:text-ink">Book a demo</Link></li>
              <li>
                <a href="https://www.xoxoday.com" target="_blank" rel="noreferrer noopener" className="hover:text-ink">About Xoxoday</a>
                <Flag id="companyLinks" />
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-12 border-t pt-6 text-sm text-muted">{SITE.legal}</p>
      </div>
    </footer>
  );
}
