'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';

/**
 * Header — always solid on paper. The site is a light theme; there is no
 * dark-hero transparency state anymore.
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          scrolled
            ? 'bg-[var(--color-paper-50)]/92 backdrop-blur-md border-b border-[rgba(31,27,23,0.10)] shadow-[0_1px_0_rgba(168,50,50,0.08)]'
            : 'bg-[var(--color-paper-50)]/70 backdrop-blur-sm border-b border-transparent',
        ].join(' ')}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={['flex items-center transition-all duration-500', scrolled ? 'h-[64px]' : 'h-[80px]'].join(' ')}>
            <Link href="/" className="flex items-center gap-3 pr-8 group">
              <Image
                src="/images/logo-icon.png"
                alt="AKIRA Marine Solutions"
                width={200}
                height={130}
                className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                priority
                style={{ mixBlendMode: 'multiply' }}
              />
              <div className="hidden sm:block border-l border-[rgba(31,27,23,0.12)] pl-3">
                <span className="font-sans text-lg font-semibold tracking-tight leading-none text-[var(--color-ink-400)]">
                  AKIRA
                </span>
                <span className="block eyebrow text-[0.55rem] leading-none mt-1.5 text-[var(--color-signal-400)]">
                  Marine Solutions
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center justify-between flex-1 pl-8">
              <Navbar scrolled />
              <Link
                href="/contact"
                className="group ml-8 relative inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-[0.24em] font-medium text-white transition-all duration-300"
                style={{ backgroundColor: 'var(--color-signal-400)' }}
              >
                Contact
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden ml-auto p-2 text-[var(--color-ink-400)] transition-colors"
              aria-label="Open menu"
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
