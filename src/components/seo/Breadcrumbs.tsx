import Link from 'next/link';
import { StructuredData } from './StructuredData';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `https://akiramarinesolutions.com${item.href}`,
    })),
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-medium text-[var(--color-ink-100)]">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true" className="text-[var(--color-signal-400)]/60">·</span>}
              {index === items.length - 1 ? (
                <span className="text-[var(--color-ink-400)]" aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-[var(--color-signal-400)] transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
