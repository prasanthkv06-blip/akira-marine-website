import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { COMPANY } from '@/lib/constants';

const footerLinks = {
  services: [
    { label: 'Planned Maintenance', href: '/services#planned-maintenance' },
    { label: 'Engine Overhauls',    href: '/services#major-maintenance' },
    { label: 'LNG Fuel Systems',    href: '/services#lng-support' },
    { label: '24/7 Emergency',      href: '/services#emergency-service' },
  ],
  expertise: [
    { label: 'Our Capabilities',    href: '/expertise/capabilities' },
    { label: 'Technical Expertise', href: '/expertise/technical' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact',  href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-[var(--color-paper-100)] text-[var(--color-ink-100)] overflow-hidden border-t border-[rgba(31,27,23,0.10)]">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-signal-400)]/40 to-transparent"
      />

      <Container className="relative z-10">
        {/* Editorial statement */}
        <div className="pt-24 pb-12 border-b border-[rgba(31,27,23,0.10)]">
          <div className="flex items-center gap-4 mb-6">
            <span className="signal-rule" />
            <span className="eyebrow">AKIRA · Abu Dhabi</span>
          </div>
          <p className="serif-display text-[var(--color-ink-400)] text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.15] max-w-3xl">
            Marine engineering,{' '}
            <span className="italic text-[var(--color-signal-400)]">
              executed with the discipline of a workshop
            </span>{' '}
            — anywhere your fleet operates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/logo-icon.png"
                alt="AKIRA Marine Solutions"
                width={200}
                height={130}
                className="h-9 w-auto object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
              <div className="border-l border-[rgba(31,27,23,0.12)] pl-3">
                <span className="font-sans text-base font-semibold text-[var(--color-ink-400)] tracking-tight leading-none">
                  AKIRA
                </span>
                <span className="block eyebrow text-[var(--color-signal-400)] text-[0.55rem] mt-1">
                  Marine Solutions
                </span>
              </div>
            </Link>
            <address className="mt-8 not-italic text-sm leading-relaxed text-[var(--color-ink-100)] space-y-1">
              {COMPANY.address.street && <div>{COMPANY.address.street}</div>}
              <div>
                {[COMPANY.address.city, COMPANY.address.state]
                  .filter(Boolean)
                  .join(', ')}
              </div>
              <div>{COMPANY.address.country}</div>
            </address>
            <div className="mt-6 flex flex-col gap-1 text-sm text-[var(--color-ink-100)]">
              <a
                href={`mailto:${COMPANY.email}`}
                className="hover:text-[var(--color-signal-400)] transition-colors"
              >
                {COMPANY.email}
              </a>
              {!/[Xx]/.test(COMPANY.phone) && (
                <a
                  href={`tel:${COMPANY.phone.replace(/\s+/g, '')}`}
                  className="hover:text-[var(--color-signal-400)] transition-colors font-variant-numeric-tabular"
                >
                  {COMPANY.phone}
                </a>
              )}
              {COMPANY.phoneAlt && !/[Xx]/.test(COMPANY.phoneAlt) && (
                <a
                  href={`tel:${COMPANY.phoneAlt.replace(/\s+/g, '')}`}
                  className="hover:text-[var(--color-signal-400)] transition-colors font-variant-numeric-tabular"
                >
                  {COMPANY.phoneAlt}
                </a>
              )}
            </div>
          </div>

          <FooterColumn title="Services" links={footerLinks.services} />
          <FooterColumn title="Expertise" links={footerLinks.expertise} />
          <FooterColumn title="Company" links={footerLinks.company} />
        </div>

        <div className="border-t border-[rgba(31,27,23,0.10)] py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-ink-50)] tracking-wide">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-[var(--color-ink-50)]">
            <Link href="/privacy" className="hover:text-[var(--color-signal-400)] transition-colors uppercase tracking-[0.2em]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--color-signal-400)] transition-colors uppercase tracking-[0.2em]">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow text-[var(--color-signal-400)] mb-6">{title}</h3>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-sm text-[var(--color-ink-100)] hover:text-[var(--color-ink-400)] transition-colors"
            >
              <span className="h-px w-0 group-hover:w-4 bg-[var(--color-signal-400)] transition-all duration-500" />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
