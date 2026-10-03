import { ClosingCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section, SectionHead } from '@/components/ui/Section';
import { ApiExplorer } from '@/components/platform/ApiExplorer';
import { Flag } from '@/lib/review';

export default function Docs() {
  return (
    <>
      <PageHero eyebrow="Resources · Documentation" title="Developer docs, in brief." lead="Loyalife APIs are REST-first. OAuth 2.0 to JWT secures access to members, transactions and points." ctaKey="resources" />
      <Section tone="plain" className="!pt-6" label="Overview">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Authenticate', 'Request a token with OAuth 2.0 and receive a JWT.'],
            ['Call the API', 'Use the JWT to read members, record transactions and read points.'],
            ['Connect your stack', 'Integrations include Salesforce, Shopify, HubSpot, MoEngage, Stripe, Twilio, Magento and Microsoft Dynamics.'],
          ].map(([a, b]) => <div key={a} className="card p-5"><h2 className="font-semibold">{a}</h2><p className="mt-1 text-sm text-muted">{b}</p></div>)}
        </div>
        <p className="mt-6 text-sm text-muted">Docs link to be confirmed.<Flag id="docsLink" /></p>
      </Section>
      <Section tone="sunken" label="API explorer">
        <SectionHead title="Try a request" />
        <ApiExplorer />
      </Section>
      <PageFaq ids={['integrations', 'data-protection']} />
      <ClosingCta ctaKey="resources" />
      <PageFoot />
    </>
  );
}
