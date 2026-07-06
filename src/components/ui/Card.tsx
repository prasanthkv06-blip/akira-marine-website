import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CardProps {
  title: string;
  description: string;
  image?: string;
  href?: string;
  tags?: string[];
  children?: React.ReactNode;
  className?: string;
}

export function Card({ title, description, image, href, tags, children, className }: CardProps) {
  const content = (
    <div className={cn(
      'group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl border border-[rgba(31,27,23,0.08)]',
      href && 'cursor-pointer hover:-translate-y-1',
      className
    )}>
      {image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        {tags && tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[var(--color-paper-50)] px-3 py-1 text-xs font-sans font-medium text-[var(--color-ink-200)]">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="mb-2 text-xl font-sans font-bold text-[var(--color-ink-400)]">{title}</h3>
        <p className="text-[var(--color-ink-200)] leading-relaxed">{description}</p>
        {children}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
