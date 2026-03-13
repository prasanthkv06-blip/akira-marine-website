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
  accentLine = true,
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
          'mb-4 h-1 w-16 rounded-full bg-orange-500',
          alignment === 'center' && 'mx-auto'
        )} />
      )}
      <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg text-navy-600 leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
