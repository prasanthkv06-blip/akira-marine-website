import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { COMPANY } from '@/lib/constants';

interface CTABannerProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

const hasPhone = !/[Xx]/.test(COMPANY.phone);

export function CTABanner({
  headline = 'Request our service.',
  description = 'Send us your engine platform and port of call. We respond with scope, timeline, and a documented service plan — no obligation.',
  buttonText = 'Request service',
  buttonHref = '/contact',
}: CTABannerProps) {
  return (
    <section className="relative overflow-hidden bg-[#0a1418] text-white">
      {/* cinematic engine-room close */}
      <div aria-hidden className="absolute inset-0">
        <Image src="/images/engine-room.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgba(10,20,24,0.95) 0%, rgba(10,20,24,0.82) 46%, rgba(10,20,24,0.58) 100%)' }}
      />

      <Container className="relative z-10 py-28 sm:py-40">
        <span className="eyebrow text-[var(--color-signal-300)]">Contact</span>

        <div className="mt-10 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="max-w-2xl text-[clamp(2.2rem,4.6vw,4.25rem)] font-extrabold leading-[1.0] tracking-[-0.025em] text-white">
              {headline}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">{description}</p>
            <div className="mt-10">
              <Link
                href={buttonHref}
                className="group relative inline-flex items-center overflow-hidden px-8 py-4 text-sm font-medium uppercase tracking-[0.14em] text-white"
                style={{ backgroundColor: 'var(--color-signal-400)' }}
              >
                <span className="relative z-10">{buttonText}</span>
                <span
                  aria-hidden
                  className="absolute inset-0 translate-y-full bg-[var(--color-signal-600)] transition-transform duration-300 ease-out group-hover:translate-y-0"
                />
              </Link>
            </div>
          </div>

          <dl className="self-start border-t border-white/20 lg:col-span-4 lg:col-start-9">
            <ContactRow k="BASE" v={`${COMPANY.address.city}, ${COMPANY.address.country}`} />
            {hasPhone && (
              <ContactRow k="TEL" v={COMPANY.phone} href={`tel:${COMPANY.phone.replace(/\s+/g, '')}`} />
            )}
            <ContactRow k="EMAIL" v={COMPANY.email} href={`mailto:${COMPANY.email}`} />
            <ContactRow k="EST." v="2026" />
          </dl>
        </div>
      </Container>
    </section>
  );
}

function ContactRow({ k, v, href }: { k: string; v: string; href?: string }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] gap-4 border-b border-white/15 py-3">
      <dt className="ds-meta text-white/50">{k}</dt>
      <dd className="tabular text-sm font-medium text-white/90 sm:text-base">
        {href ? (
          <a href={href} className="transition-colors hover:text-[var(--color-signal-300)]">
            {v}
          </a>
        ) : (
          v
        )}
      </dd>
    </div>
  );
}
