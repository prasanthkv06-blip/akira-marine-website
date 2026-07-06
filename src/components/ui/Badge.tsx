import { cn } from '@/lib/utils';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'accent' | 'muted';
  className?: string;
}

const variants = {
  primary: 'bg-[var(--color-ink-300)] text-white',
  accent: 'bg-orange-500 text-white',
  muted: 'bg-[rgba(31,27,23,0.08)] text-[var(--color-ink-200)]',
};

export function Badge({ text, variant = 'muted', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-sans font-semibold',
      variants[variant],
      className
    )}>
      {text}
    </span>
  );
}
