import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { IconArrow } from './Icons';

type Variant = 'solid' | 'ghost' | 'subtle' | 'plain';
type Size = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  solid: 'bg-accent text-[#0C0A09] border-transparent hover:bg-accent-soft',
  ghost: 'bg-transparent text-ink border-ink/30 hover:border-ink hover:bg-ink/[0.04]',
  subtle: 'bg-sunken text-ink border-transparent hover:bg-ink/10',
  plain: 'bg-transparent text-brand border-transparent hover:underline underline-offset-4 px-0',
};
const SIZES: Record<Size, string> = {
  sm: 'min-h-9 px-3.5 py-1.5 text-sm gap-1.5',
  md: 'min-h-11 px-5 py-2 text-[15px] gap-2',
  lg: 'min-h-12 px-6 py-2.5 text-base gap-2',
};

function cls(variant: Variant, size: Size, extra = '') {
  return `group inline-flex max-w-full select-none items-center justify-center rounded-full text-center leading-snug border font-medium transition-[transform,background-color,border-color] duration-200 ease-calm active:scale-[0.98] disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${extra}`;
}

const Arrow = () => <IconArrow size={16} className="transition-transform duration-200 ease-calm group-hover:translate-x-0.5" />;

export const Button = forwardRef<HTMLButtonElement, CommonProps & ButtonHTMLAttributes<HTMLButtonElement>>(function Button(
  { variant = 'solid', size = 'md', arrow, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cls(variant, size, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
});

export function ButtonLink({
  to, variant = 'solid', size = 'md', arrow, className, children, onClick, external,
}: CommonProps & { to: string; onClick?: () => void; external?: boolean }) {
  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer noopener" onClick={onClick} className={cls(variant, size, className)}>
        {children}
        {arrow && <Arrow />}
      </a>
    );
  }
  return (
    <Link to={to} onClick={onClick} className={cls(variant, size, className)}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}
