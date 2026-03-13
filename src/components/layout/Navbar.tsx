'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { navigation } from '@/data/navigation';
import { NavLink } from './NavLink';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {navigation.map((item) => (
        <div
          key={item.href}
          className="relative"
          onMouseEnter={() => item.children && setOpenDropdown(item.href)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {item.children ? (
            <>
              <button
                className={cn(
                  'flex items-center gap-1 font-sans text-sm font-medium transition-colors duration-200',
                  'text-navy-100 hover:text-orange-400'
                )}
              >
                {item.label}
                <ChevronDown className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  openDropdown === item.href && 'rotate-180'
                )} />
              </button>
              {openDropdown === item.href && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="w-64 rounded-xl bg-white shadow-xl border border-navy-100 py-2 overflow-hidden">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-3 text-sm font-sans text-navy-700 hover:bg-navy-50 hover:text-orange-600 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <NavLink href={item.href}>{item.label}</NavLink>
          )}
        </div>
      ))}
    </nav>
  );
}
