import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { requestSecurityPack } from '@/lib/demo';
import { Button } from '../ui/Button';
import { SampleLabel } from '../ui/Bits';
import { Flag } from '@/lib/review';

const schema = z.object({ email: z.string().min(1, 'Enter your work email.').email('Enter a valid email, like name@company.com.') });
type V = z.infer<typeof schema>;

/** One field request form. Prototype: nothing is sent. */
export function SecurityPackForm({ id = 'sp' }: { id?: string }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<V>({ resolver: zodResolver(schema), mode: 'onSubmit' });
  const [ref, setRef] = useState<string | null>(null);
  if (ref)
    return (
      <div role="status" className="rounded-xl border border-success/50 bg-success/10 p-4 text-sm">
        <p className="font-medium">Request received.</p>
        <p className="mt-1 text-muted">Reference {ref}. Prototype: nothing is sent.</p>
      </div>
    );
  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (v) => {
        const r = await requestSecurityPack(v.email);
        setRef(r.reference);
      })}
      className="space-y-3"
    >
      <div>
        <label htmlFor={`${id}-email`} className="text-sm font-medium">Work email</label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          inputMode="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${id}-err` : undefined}
          placeholder="name@company.com"
          className="mt-1 h-11 w-full rounded-lg border bg-canvas px-3 text-base"
          {...register('email')}
        />
        {errors.email && <p id={`${id}-err`} role="alert" className="mt-1 text-sm text-danger">{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} arrow>{isSubmitting ? 'Sending' : 'Request our security pack'}</Button>
      <p className="flex flex-wrap items-center gap-2 text-xs text-muted">Prototype: nothing is sent. <SampleLabel flag="securityPackForm">Sample data</SampleLabel></p>
      <Flag id="securityPackForm" />
    </form>
  );
}
