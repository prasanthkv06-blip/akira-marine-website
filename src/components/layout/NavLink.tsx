'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onDark?: boolean;
}

export function NavLink({ href, children, className, onClick, onDark = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center py-2.5 text-xs uppercase tracking-[0.22em] font-medium transition-colors duration-300',
        onDark
          ? cn(isActive ? 'text-white' : 'text-white/75', 'hover:text-white')
          : cn(
              isActive ? 'text-[var(--color-ink-400)]' : 'text-[var(--color-ink-100)]',
              'hover:text-[var(--color-signal-400)]',
            ),
        className,
      )}
    >
      {children}
      {isActive && (
        <span
          aria-hidden
          className={cn(
            'absolute bottom-1.5 left-0 right-0 h-px',
            onDark ? 'bg-white' : 'bg-[var(--color-signal-400)]',
          )}
        />
      )}
    </Link>
  );
}
