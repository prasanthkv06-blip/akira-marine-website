import { cn } from '@/lib/utils';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'accent' | 'muted';
  className?: string;
}

const variants = {
  primary: 'bg-navy-800 text-white',
  accent: 'bg-orange-500 text-white',
  muted: 'bg-navy-100 text-navy-700',
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
