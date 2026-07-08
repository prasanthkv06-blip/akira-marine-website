'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { navigation } from '@/data/navigation';
import { NavLink } from './NavLink';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onDark?: boolean;
}

export function Navbar({ onDark = false }: NavbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-10">
      {navigation.map((item) => (
        <div
          key={item.href}
          className="relative"
          onMouseEnter={() => item.children && setOpenDropdown(item.href)}
          onMouseLeave={() => setOpenDropdown(null)}
          onFocus={() => item.children && setOpenDropdown(item.href)}
          onBlur={(e) => {
            if (item.children && !e.currentTarget.contains(e.relatedTarget)) {
              setOpenDropdown(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpenDropdown(null);
          }}
        >
          {item.children ? (
            <>
              <Link
                href={item.href}
                aria-haspopup="menu"
                aria-expanded={openDropdown === item.href}
                className={cn(
                  'flex items-center gap-1 py-2.5 text-xs uppercase tracking-[0.22em] font-medium transition-colors duration-300',
                  onDark
                    ? 'text-white/75 hover:text-white'
                    : 'text-[var(--color-ink-100)] hover:text-[var(--color-signal-400)]',
                )}
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-300',
                    openDropdown === item.href && 'rotate-180',
                  )}
                />
              </Link>
              {openDropdown === item.href && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50">
                  <div className="w-72 bg-[var(--color-paper-50)] border border-[rgba(23,25,27,0.12)] shadow-2xl py-2 overflow-hidden">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-signal-400)]/60 to-transparent" />
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="group flex items-center gap-3 px-5 py-3 text-sm text-[var(--color-ink-200)] hover:bg-white hover:text-[var(--color-ink-400)] transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <span className="h-px w-3 bg-[var(--color-signal-400)]/50 group-hover:w-6 transition-all duration-500" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <NavLink href={item.href} onDark={onDark}>
              {item.label}
            </NavLink>
          )}
        </div>
      ))}
    </nav>
  );
}
