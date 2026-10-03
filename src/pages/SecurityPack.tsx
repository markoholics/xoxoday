import { ClosingCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section } from '@/components/ui/Section';
import { SecurityPackForm } from '@/components/platform/SecurityPackForm';
import { CERTIFICATIONS } from '@/content/site';
import { Flag } from '@/lib/review';

export default function SecurityPack() {
  return (
    <>
      <PageHero eyebrow="Resources · Security pack" title="Review our controls with your risk team." lead="Certifications, architecture and controls in one pack. Request it with a work email." ctaKey="resources" />
      <Section tone="plain" className="!pt-6" label="Security pack">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card p-6">
            <h2 className="h3">What the pack covers</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><strong>Certifications.</strong> {CERTIFICATIONS.map((c) => c.label).join(', ')}.<Flag id="certPci" /><Flag id="certSoc2" /><Flag id="certIso" /></li>
              <li><strong>Architecture.</strong> On-prem, hybrid and cloud deployment, VPC and Active-Active DR.</li>
              <li><strong>Controls.</strong> Dual-control, maker checker approvals, audit trail, ML fraud and anomaly detection.</li>
              <li><strong>Privacy.</strong> Consent, access and deletion workflows by channel.</li>
            </ul>
          </div>
          <div id="request" className="card p-6">
            <h2 className="h3">Request our security pack</h2>
            <p className="mt-1 text-sm text-muted">One field. A work email.</p>
            <div className="mt-4"><SecurityPackForm id="pack" /></div>
          </div>
        </div>
      </Section>
      <PageFaq ids={['data-protection', 'fraud']} />
      <ClosingCta ctaKey="resources" />
      <PageFoot />
    </>
  );
}
