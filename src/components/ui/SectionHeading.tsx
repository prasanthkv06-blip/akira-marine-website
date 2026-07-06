import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
  accentLine?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  alignment = 'center',
  accentLine = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(
      'mb-12',
      alignment === 'center' && 'text-center',
      className
    )}>
      {accentLine && (
        <div className={cn(
          'mb-4 h-px w-16 bg-[var(--color-ink-400)]',
          alignment === 'center' && 'mx-auto'
        )} />
      )}
      <h2 className="text-3xl font-bold text-[var(--color-ink-400)] uppercase sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-ink-100)] leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
