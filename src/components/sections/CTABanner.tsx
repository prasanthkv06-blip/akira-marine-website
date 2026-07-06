'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/animations/Reveal';

interface CTABannerProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function CTABanner({
  headline = 'Ready to command precision performance?',
  description = 'Speak directly with our dual-fuel engine specialists. Consultations begin with a rigorous performance and warranty audit — no obligation, no boilerplate.',
  buttonText = 'Get In Touch',
  buttonHref = '/contact',
}: CTABannerProps) {
  return (
    <section
      className="relative py-32 sm:py-44 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--color-ink-400) 0%, var(--color-ink-500) 100%)' }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 120%, rgba(168,50,50,0.28) 0%, transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(168,50,50,0.55), transparent)' }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(168,50,50,0.28), transparent)' }}
      />

      <Container className="relative z-10">
        <Reveal className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="signal-rule" />
            <span className="eyebrow">Consultation</span>
            <span className="signal-rule" />
          </div>
          <h2 className="serif-display text-white text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.02]">
            {headline.split(/(\s+)/).map((word, i) =>
              /performance/i.test(word) ? (
                <span key={i} className="italic text-[var(--color-signal-300)]">
                  {word}
                </span>
              ) : (
                <span key={i}>{word}</span>
              ),
            )}
          </h2>
          <p className="mt-8 text-lg text-[var(--color-paper-300)] leading-relaxed max-w-2xl mx-auto font-light">
            {description}
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            <Link
              href={buttonHref}
              className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-medium uppercase tracking-[0.24em] text-white transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-signal-400)',
                boxShadow: '0 10px 24px -8px rgba(168,50,50,0.5)',
              }}
            >
              {buttonText}
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="tel:+971"
              className="text-sm uppercase tracking-[0.28em] text-white/70 hover:text-[var(--color-signal-300)] transition-colors"
            >
              Or call our team
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
