import { ClosingCta, MidCta, PageFaq, PageFoot, PageHero } from '@/components/ui/Page';
import { Section, SectionHead } from '@/components/ui/Section';
import { AiStudio } from '@/components/platform/AiStudio';
import { McpDemo } from '@/components/platform/McpDemo';
import { AiStatus, Checkpoint } from '@/components/ui/Bits';
import { Graphic } from '@/components/graphics';
import { Term } from '@/components/ui/Term';

export default function AiMcp() {
  return (
    <>
      <PageHero
        eyebrow="Platform · Loyalife AI & MCP"
        title="AI that drafts and watches. People who decide."
        lead={<>An on-prem LLM + <Term id="mcp">MCP</Term> with tenant-isolated, audited tool-calling. <Term id="anomaly">Anomaly detection</Term> watches for unusual activity.</>}
        ctaKey="ai"
      >
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2">Loyalife AI &amp; MCP <AiStatus id="loyalifeAiMcp" /></span>
          <span className="inline-flex items-center gap-2">On-prem LLM <AiStatus id="onPremLlm" /></span>
          <span className="inline-flex items-center gap-2">Anomaly detection <AiStatus id="anomalyDetection" /></span>
        </div>
        <Checkpoint className="mt-6 max-w-xl" />
      </PageHero>
      <Section tone="plain" label="AI studio">
        <SectionHead title="Build a program in four steps" lead="Brief, Draft, Simulate, Approve. Draft and Simulate are proposed. A person approves." />
        <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
          <AiStudio />
          <div className="space-y-4"><Graphic kind="ai" /></div>
        </div>
      </Section>
      <MidCta title="Want the AI studio on your own brief?" />
      <Section tone="sunken" label="MCP">
        <SectionHead title="Tool calls that stay inside one tenant" lead="An assistant asks. A tenant-isolated tool call runs. An audited log line appears." />
        <McpDemo />
      </Section>
      <PageFaq ids={['fraud', 'deployment', 'separate']} />
      <ClosingCta title="See AI draft and a person decide." ctaKey="ai" />
      <PageFoot />
    </>
  );
}
