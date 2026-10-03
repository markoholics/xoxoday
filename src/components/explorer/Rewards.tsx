import { useNavigate } from 'react-router-dom';
import { TEMPLATES } from '@/content/explorer';
import { BENCHMARKS } from '@/content/site';
import { sandboxStore } from '@/lib/sandbox';
import { Overlay } from '../ui/Overlay';
import { Button } from '../ui/Button';
import { SampleLabel } from '../ui/Bits';

export function TemplatePack({ open, onClose, onDuplicate }: { open: boolean; onClose: () => void; onDuplicate: () => void }) {
  const nav = useNavigate();
  return (
    <Overlay open={open} onClose={onClose} label="Program template pack" side="center" widthClass="max-w-2xl">
      <div className="p-6">
        <h2 className="h3">Program template pack</h2>
        <p className="mt-1 text-sm text-muted">Three starting points. Each previews its rules.</p>
        <div className="mt-2"><SampleLabel>Sample data</SampleLabel></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {TEMPLATES.map((tpl) => (
            <div key={tpl.id} className="flex flex-col rounded-xl border p-4">
              <h3 className="text-sm font-semibold">{tpl.name}</h3>
              <p className="text-xs text-muted">{tpl.audience}</p>
              <ul className="mt-3 list-disc space-y-1 pl-4 text-xs">
                {tpl.rules.map((r) => <li key={r}>{r}</li>)}
              </ul>
              <p className="mt-3 text-xs text-muted">Tiers: {tpl.tiers.join(', ')}</p>
              <Button
                size="sm"
                variant="ghost"
                className="mt-auto !mt-4"
                onClick={() => {
                  sandboxStore.set({ programName: tpl.name, threshold: tpl.threshold, doublePoints: tpl.doublePoints, note: `Duplicated from the ${tpl.name} template.`, source: 'template' });
                  onDuplicate();
                  nav('/platform#sandbox');
                }}
              >
                Duplicate into sandbox
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Overlay>
  );
}

export function OnePager({ open, onClose }: { open: boolean; onClose: () => void }) {
  const print = () => {
    document.body.classList.add('print-one-pager');
    window.setTimeout(() => {
      window.print();
      document.body.classList.remove('print-one-pager');
    }, 50);
  };
  return (
    <Overlay open={open} onClose={onClose} label="Build versus buy benchmark one pager" side="center" widthClass="max-w-xl">
      <div className="p-8">
        <p className="label-mono">Loyalife by Xoxoday</p>
        <h2 className="h2 mt-2">Build versus buy benchmark</h2>
        <table className="mt-6 w-full border-collapse text-left text-sm">
          <caption className="sr-only">Build versus buy benchmarks</caption>
          <thead>
            <tr className="border-b">
              <th scope="col" className="py-2 pr-3 font-medium text-muted">Measure</th>
              <th scope="col" className="py-2 pr-3 font-medium">Loyalife</th>
              <th scope="col" className="py-2 font-medium">In house build</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr><th scope="row" className="py-2 pr-3 font-normal text-muted">Launch to first redemption</th><td className="py-2 pr-3">{BENCHMARKS.loyalife.launch}</td><td className="py-2">{BENCHMARKS.inHouse.launch}</td></tr>
            <tr><th scope="row" className="py-2 pr-3 font-normal text-muted">Engineering</th><td className="py-2 pr-3">{BENCHMARKS.loyalife.staff}</td><td className="py-2">{BENCHMARKS.inHouse.staff}</td></tr>
            <tr><th scope="row" className="py-2 pr-3 font-normal text-muted">Country reach</th><td className="py-2 pr-3">{BENCHMARKS.loyalife.reach}</td><td className="py-2">{BENCHMARKS.inHouse.reach} at best</td></tr>
            <tr><th scope="row" className="py-2 pr-3 font-normal text-muted">Reward options</th><td className="py-2 pr-3">{BENCHMARKS.loyalife.options}</td><td className="py-2">{BENCHMARKS.inHouse.options}</td></tr>
          </tbody>
        </table>
        <p className="mt-4 text-xs text-muted">Benchmarks from Xoxoday enterprise customers. Your results will vary.</p>
        <Button className="no-print mt-6" onClick={print}>Print this page</Button>
      </div>
    </Overlay>
  );
}
