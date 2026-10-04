import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { submitDemoRequest } from '@/lib/demo';
import { trackEvent } from '@/lib/events';
import { explorerAvailable, explorerSummary, useExplorer } from '@/lib/explorer';
import { REGIONS } from '@/lib/region';
import { t } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { Flag } from '@/lib/review';

const PROGRAM_TYPES = ['Customer', 'Channel partner', 'Influencer', 'Not sure'] as const;
const emailSchema = z.object({ email: z.string().min(1, 'Enter your work email.').email('Enter a valid email, like name@company.com.') });
const detailSchema = z.object({
  name: z.string().min(2, 'Enter your name.'),
  company: z.string().min(2, 'Enter your company.'),
  region: z.string().min(1, 'Choose a region.'),
  programType: z.enum(PROGRAM_TYPES, { errorMap: () => ({ message: 'Choose a program type.' }) }),
  share: z.boolean(),
});
type EmailV = z.infer<typeof emailSchema>;
type DetailV = z.infer<typeof detailSchema>;

const TOPICS: Record<string, { h: string; lead: string }> = {
  security: { h: 'Book a security review', lead: 'Two short steps. Tell us who you are and we will plan the review.' },
  sales: { h: 'Talk to sales', lead: 'Two short steps. Tell us about your program.' },
};

const Err = ({ id, msg }: { id: string; msg?: string }) => (msg ? <p id={id} role="alert" className="mt-1 text-sm text-danger">{msg}</p> : null);
const input = 'mt-1 h-11 w-full rounded-lg border bg-canvas px-3 text-base';

export default function DemoPage() {
  const [params] = useSearchParams();
  const topic = params.get('topic') ?? '';
  const head = TOPICS[topic] ?? { h: 'Book a demo', lead: 'Two short steps. Start with your work email.' };
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [ref, setRef] = useState('');
  const ex = useExplorer();
  const showExplorer = explorerAvailable() && ex.enabled;
  const priority = showExplorer && ex.tier === 'Architect';
  const summary = explorerSummary();

  const f1 = useForm<EmailV>({ resolver: zodResolver(emailSchema) });
  const f2 = useForm<DetailV>({ resolver: zodResolver(detailSchema), defaultValues: { share: true, region: '', name: '', company: '' } });

  const onStep1 = f1.handleSubmit((v) => {
    setEmail(v.email);
    trackEvent('demo_form_step1', { hasEmail: true });
    setStep(2);
  });
  const onStep2 = f2.handleSubmit(async (v) => {
    const explorerSummaryValue = v.share && showExplorer ? summary : undefined;
    const r = await submitDemoRequest({ email, name: v.name, company: v.company, region: v.region, programType: v.programType, topic: topic || undefined, explorerSummary: explorerSummaryValue, prioritySlot: priority || undefined });
    trackEvent('demo_form_submit', { programType: v.programType, shared: !!explorerSummaryValue });
    setRef(r.reference);
    setStep(3);
  });

  return (
    <section className="py-14 sm:py-20" data-section="hero">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="label-mono mb-4">Demo</p>
          <h1 className="h1">{head.h}</h1>
          <p className="lead mt-5">{head.lead}</p>
          <ul className="mt-8 space-y-2 text-sm text-muted">
            <li>Step 1 asks for a work email.</li>
            <li>Step 2 asks for name, company, region and program type.</li>
            <li>Reply time to be confirmed.<Flag id="replyTime" /></li>
          </ul>
          {priority && (
            <p role="status" className="mt-6 inline-flex items-center gap-2 rounded-full border border-success/60 bg-success/10 px-4 py-2 text-sm font-medium">
              <span aria-hidden className="h-2 w-2 rounded-full bg-success" />Priority slot reserved<Flag id="prioritySlot" />
            </p>
          )}
        </div>

        <div className="rounded-xl2 border bg-surface p-6 sm:p-8">
          <ol className="mb-6 flex items-center gap-3 text-sm" aria-label="Progress">
            {['Work email', 'Your program', 'Done'].map((l, i) => (
              <li key={l} aria-current={step === i + 1 ? 'step' : undefined} className={`flex items-center gap-2 ${step >= i + 1 ? 'text-ink' : 'text-muted'}`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full border font-mono text-xs ${step > i + 1 ? 'border-success bg-success text-canvas' : step === i + 1 ? 'border-ink bg-ink text-canvas' : ''}`}>{i + 1}</span>
                <span className="hidden sm:inline">{l}</span>
                {i < 2 && <span aria-hidden className="mx-1 h-px w-6 bg-ink/20" />}
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.form key="s1" noValidate onSubmit={onStep1} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t.base} className="space-y-4">
                <div>
                  <label htmlFor="d-email" className="text-sm font-medium">Work email</label>
                  <input id="d-email" type="email" autoComplete="email" inputMode="email" placeholder="name@company.com" aria-invalid={!!f1.formState.errors.email} aria-describedby="d-email-err" className={input} {...f1.register('email')} />
                  <Err id="d-email-err" msg={f1.formState.errors.email?.message} />
                </div>
                <Button type="submit" arrow>Continue</Button>
              </motion.form>
            )}
            {step === 2 && (
              <motion.form key="s2" noValidate onSubmit={onStep2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t.base} className="space-y-4">
                <p className="text-sm text-muted">Booking for <strong className="text-ink">{email}</strong>. <button type="button" className="link" onClick={() => setStep(1)}>Change</button></p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="d-name" className="text-sm font-medium">Name</label>
                    <input id="d-name" autoComplete="name" aria-invalid={!!f2.formState.errors.name} aria-describedby="d-name-err" className={input} {...f2.register('name')} />
                    <Err id="d-name-err" msg={f2.formState.errors.name?.message} />
                  </div>
                  <div>
                    <label htmlFor="d-company" className="text-sm font-medium">Company</label>
                    <input id="d-company" autoComplete="organization" aria-invalid={!!f2.formState.errors.company} aria-describedby="d-company-err" className={input} {...f2.register('company')} />
                    <Err id="d-company-err" msg={f2.formState.errors.company?.message} />
                  </div>
                </div>
                <div>
                  <label htmlFor="d-region" className="text-sm font-medium">Region</label>
                  <select id="d-region" aria-invalid={!!f2.formState.errors.region} aria-describedby="d-region-err" className={input} {...f2.register('region')}>
                    <option value="">Choose a region</option>
                    {[...REGIONS, 'Other'].map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <Err id="d-region-err" msg={f2.formState.errors.region?.message} />
                </div>
                <fieldset>
                  <legend className="text-sm font-medium">Program type</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {PROGRAM_TYPES.map((p) => (
                      <label key={p} className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-sunken">
                        <input type="radio" value={p} className="accent-[rgb(var(--brand))]" {...f2.register('programType')} />
                        {p}
                      </label>
                    ))}
                  </div>
                  <Err id="d-type-err" msg={f2.formState.errors.programType?.message} />
                </fieldset>
                {showExplorer && (
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[rgb(var(--brand))]" {...f2.register('share')} />
                    <span>
                      <span className="font-medium">Share what I explored so the demo fits me.</span>
                      <span className="mt-0.5 block text-xs text-muted">{summary ?? 'Nothing explored yet.'}</span>
                    </span>
                  </label>
                )}
                <div className="flex items-center gap-3">
                  <Button type="submit" arrow disabled={f2.formState.isSubmitting}>{f2.formState.isSubmitting ? 'Sending' : head.h}</Button>
                  <Button type="button" variant="plain" onClick={() => setStep(1)}>Back</Button>
                </div>
              </motion.form>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t.base} role="status" className="space-y-3">
                <h2 className="h3">Thank you. Your request is in.</h2>
                <p className="text-muted">We will reply to {email}. Reply time to be confirmed.</p>
                {priority && <p className="font-medium">Priority slot reserved.</p>}
                <p className="rounded-lg border border-dashed bg-sunken p-3 text-sm">Prototype: nothing is sent. Reference {ref}.</p>
              </motion.div>
            )}
          </AnimatePresence>
          {step !== 3 && <p className="mt-5 text-xs text-muted">Prototype: nothing is sent.<Flag id="demoForm" /></p>}
        </div>
      </div>
    </section>
  );
}
