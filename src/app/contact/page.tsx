import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/forms/ContactForm';
import { PageHero } from '@/components/layout/PageHero';
import { COMPANY } from '@/lib/constants';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Akira Marine Solutions for dual-fuel marine engine maintenance, overhauls, and service enquiries.',
  path: '/contact',
});

const hasRealPhone = !/[Xx]/.test(COMPANY.phone);
const hasRealAlt = !!COMPANY.phoneAlt && !/[Xx]/.test(COMPANY.phoneAlt);

const phoneValue = hasRealPhone && hasRealAlt
  ? `${COMPANY.phone} / ${COMPANY.phoneAlt}`
  : hasRealPhone ? COMPANY.phone : (hasRealAlt ? COMPANY.phoneAlt : '');

const primaryTel = hasRealPhone ? COMPANY.phone : (hasRealAlt ? COMPANY.phoneAlt : '');

const contactInfo = [
  ...(phoneValue
    ? [{ label: 'Phone', value: phoneValue, href: `tel:${primaryTel.replace(/\s+/g, '')}` }]
    : []),
  { label: 'Email', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  {
    label: 'Location',
    value: [COMPANY.address.street, COMPANY.address.city, COMPANY.address.state, COMPANY.address.country]
      .filter(Boolean)
      .join(', '),
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact · Abu Dhabi"
        title="Speak directly with our"
        accent="engineers."
        lede="Tell us your engine platform, your port, and your requirement — we'll respond with a clear scope, timeline, and plan."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }]}
        image={{ src: "/images/engineer-workshop.jpg", alt: "A marine engineer beside a large engine under overhaul in the workshop", objectPosition: "22% 50%" }}
      />

      <section className="py-24 sm:py-32 bg-white">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Form */}
            <div className="lg:col-span-7">
              <span className="eyebrow text-[var(--color-signal-400)]">Service enquiry</span>
              <h2 className="mt-5 text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-[var(--color-ink-400)]">
                Tell us about your engine and situation.
              </h2>
              <div className="mt-10">
                <ContactForm />
              </div>
            </div>

            {/* Contact info */}
            <div className="lg:col-span-5">
              <span className="eyebrow text-[var(--color-signal-400)]">Direct Lines</span>
              <dl className="mt-8">
                {contactInfo.map(({ label, value, href }) => (
                  <div
                    key={label}
                    className="border-t border-[rgba(23,25,27,0.10)] py-6 first:border-t-0 first:pt-0"
                  >
                    <dt className="eyebrow text-[var(--color-steel-400)]">{label}</dt>
                    <dd className="mt-2">
                      {href ? (
                        <a
                          href={href}
                          className="break-words font-medium text-[var(--color-ink-400)] transition-colors hover:text-[var(--color-signal-400)]"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="break-words font-medium text-[var(--color-ink-400)]">{value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
