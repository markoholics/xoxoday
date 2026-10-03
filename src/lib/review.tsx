import { createContext, useContext, type ReactNode } from 'react';
import { reviewModeFromUrl } from '@/config/features';
import { FLAGS, type FlagId } from '@/content/flags';

const ReviewContext = createContext(false);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const on = typeof window !== 'undefined' && reviewModeFromUrl();
  return <ReviewContext.Provider value={on}>{children}</ReviewContext.Provider>;
}

export const useReview = () => useContext(ReviewContext);

const tone: Record<string, string> = {
  confirm: 'Confirm',
  simulated: 'Simulated',
  placeholder: 'Placeholder',
  cert: 'Attach certificate or report',
};

/** Small amber flag, visible only in review mode (?review=1). */
export function Flag({ id, className = '' }: { id: FlagId; className?: string }) {
  const on = useReview();
  if (!on) return null;
  const f = FLAGS[id];
  return (
    <span
      data-review-flag={id}
      title={f.label}
      className={`ml-1.5 inline-flex items-center gap-1 rounded border border-amber-500/60 bg-amber-100 px-1.5 py-px align-middle font-mono text-[10px] font-medium leading-4 text-amber-900 ${className}`}
    >
      <span aria-hidden>⚑</span>
      <span>{tone[f.kind]}</span>
      <span className="sr-only">: {f.label}</span>
    </span>
  );
}
