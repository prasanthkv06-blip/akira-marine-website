'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

/**
 * Header — floats transparent over a page's dark cinematic hero, then
 * solidifies to graphite-on-warm-white once scrolled past it. Pages without a
 * dark hero always render the solid treatment.
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const hasDarkHero = pathname === '/';
  const onDark = hasDarkHero && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-500',
          onDark
            ? 'border-b border-transparent bg-transparent'
            : scrolled
              ? 'border-b border-[rgba(23,25,27,0.10)] bg-[var(--color-paper-50)]/92 backdrop-blur-md'
              : 'border-b border-transparent bg-[var(--color-paper-50)]/80 backdrop-blur-sm',
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 2xl:max-w-[1520px] 2xl:px-16">
          <div className={cn('flex items-center transition-all duration-500', scrolled ? 'h-[64px]' : 'h-[84px]')}>
            <Link href="/" className="group flex items-center gap-3 pr-8">
              <Image
                src={onDark ? '/images/logo-light.png' : '/images/logo-icon.png'}
                alt="AKIRA Marine Solutions"
                width={200}
                height={130}
                className="h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                priority
                style={onDark ? undefined : { mixBlendMode: 'multiply' }}
              />
              <div className={cn('hidden border-l pl-3 sm:block', onDark ? 'border-white/25' : 'border-[rgba(23,25,27,0.14)]')}>
                <span
                  className={cn(
                    'font-sans text-lg font-semibold leading-none tracking-tight',
                    onDark ? 'text-white' : 'text-[var(--color-ink-400)]',
                  )}
                >
                  AKIRA
                </span>
                <span
                  className={cn(
                    'eyebrow mt-1.5 block text-[0.55rem] leading-none',
                    onDark ? 'text-white/70' : 'text-[var(--color-steel-400)]',
                  )}
                >
                  Marine Solutions
                </span>
              </div>
            </Link>

            <div className="hidden flex-1 items-center justify-between pl-8 lg:flex">
              <Navbar onDark={onDark} />
              <Link
                href="/contact"
                className={cn(
                  'ml-8 inline-flex items-center px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-300',
                  onDark
                    ? 'border border-white/40 text-white hover:bg-white hover:text-[var(--color-ink-400)]'
                    : 'bg-[var(--color-signal-400)] text-white hover:bg-[var(--color-signal-500)]',
                )}
              >
                Contact
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={cn(
                'ml-auto p-2 transition-colors lg:hidden',
                onDark ? 'text-white' : 'text-[var(--color-ink-400)]',
              )}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
