import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { COMPANY } from '@/lib/constants';

const footerLinks = {
  services: [
    { label: 'Planned Maintenance', href: '/services#planned-maintenance' },
    { label: 'Engine Overhauls', href: '/services#major-maintenance' },
    { label: 'LNG Fuel Systems', href: '/services#lng-support' },
    { label: 'Emergency Response', href: '/services#emergency-service' },
  ],
  expertise: [
    { label: 'Our Capabilities', href: '/expertise/capabilities' },
    { label: 'Technical Expertise', href: '/expertise/technical' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#101214] text-white/70">
      <Container className="relative z-10">
        {/* colophon statement */}
        <p className="max-w-3xl pb-16 pt-24 text-[clamp(1.7rem,3.2vw,2.9rem)] font-semibold leading-[1.1] tracking-tight text-white">
          Marine engineering executed with workshop discipline — wherever your
          fleet operates.
        </p>

        <div className="grid grid-cols-1 gap-12 border-t border-white/12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/logo-light.png"
                alt="AKIRA Marine Solutions"
                width={200}
                height={130}
                className="h-9 w-auto object-contain"
              />
              <div className="border-l border-white/20 pl-3">
                <span className="font-sans text-base font-semibold leading-none tracking-tight text-white">
                  AKIRA
                </span>
                <span className="eyebrow mt-1 block text-[0.55rem] text-white/55">Marine Solutions</span>
              </div>
            </Link>
            <address className="mt-8 space-y-1 not-italic text-sm leading-relaxed text-white/65">
              {COMPANY.address.street && <div>{COMPANY.address.street}</div>}
              <div>{[COMPANY.address.city, COMPANY.address.state].filter(Boolean).join(', ')}</div>
              <div>{COMPANY.address.country}</div>
            </address>
            <div className="mt-6 flex flex-col gap-1 text-sm text-white/65">
              <a href={`mailto:${COMPANY.email}`} className="transition-colors hover:text-[var(--color-signal-300)]">
                {COMPANY.email}
              </a>
              {!/[Xx]/.test(COMPANY.phone) && (
                <a
                  href={`tel:${COMPANY.phone.replace(/\s+/g, '')}`}
                  className="tabular transition-colors hover:text-[var(--color-signal-300)]"
                >
                  {COMPANY.phone}
                </a>
              )}
              {COMPANY.phoneAlt && !/[Xx]/.test(COMPANY.phoneAlt) && (
                <a
                  href={`tel:${COMPANY.phoneAlt.replace(/\s+/g, '')}`}
                  className="tabular transition-colors hover:text-[var(--color-signal-300)]"
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

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/12 py-8 sm:flex-row">
          <p className="text-xs tracking-wide text-white/45">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/45">
            <Link href="/privacy" className="uppercase tracking-[0.2em] transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="uppercase tracking-[0.2em] transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </Container>

      {/* oversized signature wordmark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <div className="translate-y-[18%] text-center text-[22vw] font-extrabold leading-none tracking-[-0.04em] text-white/[0.035]">
          AKIRA
        </div>
      </div>
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
      <h3 className="eyebrow mb-6 text-white/45">{title}</h3>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
            >
              <span className="h-px w-0 bg-[var(--color-signal-400)] transition-all duration-500 group-hover:w-4" />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
