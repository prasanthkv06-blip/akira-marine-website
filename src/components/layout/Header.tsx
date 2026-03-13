'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Anchor } from 'lucide-react';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-navy-900/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <Anchor className="h-8 w-8 text-orange-500 transition-transform duration-300 group-hover:rotate-12" />
              <div>
                <span className="font-sans text-xl font-bold text-white">
                  AKIRA
                </span>
                <span className="hidden sm:block font-sans text-xs text-navy-300 tracking-widest uppercase">
                  Marine Services
                </span>
              </div>
            </Link>

            <Navbar />

            <div className="hidden lg:flex items-center gap-4">
              <Button href="/contact" variant="primary" size="sm">
                Get In Touch
              </Button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-navy-100 hover:text-orange-400 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
