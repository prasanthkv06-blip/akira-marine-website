import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/forms/ContactForm';
import { PageHero } from '@/components/layout/PageHero';
import { ContactSignature } from '@/components/interactive/PageSignatures';
import { COMPANY } from '@/lib/constants';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Akira Marine Solutions for dual-fuel marine engine maintenance, emergency support, or service inquiries.',
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
    ? [{ icon: Phone, label: 'Phone', value: phoneValue, href: `tel:${primaryTel.replace(/\s+/g, '')}` }]
    : []),
  { icon: Mail, label: 'Email', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  {
    icon: MapPin,
    label: 'Location',
    value: [COMPANY.address.street, COMPANY.address.city, COMPANY.address.state, COMPANY.address.country]
      .filter(Boolean)
      .join(', '),
  },
  {
    icon: Clock,
    label: 'Emergency',
    value: '24/7 Response',
    href: primaryTel
      ? `tel:${primaryTel.replace(/\s+/g, '')}`
      : `mailto:${COMPANY.email}?subject=Emergency%20Service`,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact · Dispatch"
        title="Speak directly with our"
        accent="field engineers."
        lede="Consultations begin with a rigorous performance and warranty audit. No boilerplate, no bots — a real conversation with the team that will board your vessel."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }]}
        signature={<ContactSignature />}
      />

      <section className="py-24 sm:py-32 bg-white">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Form */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-6">
                <span className="signal-rule" />
                <span className="eyebrow">Send a message</span>
              </div>
              <h2 className="serif-display text-[clamp(1.75rem,3vw,2.5rem)] text-[var(--color-ink-400)] leading-[1.1] mb-10">
                Tell us about your{' '}
                <span className="italic text-[var(--color-signal-400)]">engine and situation.</span>
              </h2>
              <ContactForm />
            </div>

            {/* Contact info */}
            <div className="lg:col-span-5">
              <div className="border border-[rgba(31,27,23,0.12)] bg-[var(--color-paper-50)] p-8 lg:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <span className="signal-rule" />
                  <span className="eyebrow">Direct Lines</span>
                </div>
                <div className="space-y-6">
                  {contactInfo.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4 border-b border-[rgba(31,27,23,0.10)] pb-6 last:border-0 last:pb-0">
                      <div className="flex-shrink-0 w-10 h-10 bg-[rgba(168,50,50,0.10)] flex items-center justify-center text-[var(--color-signal-400)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="eyebrow text-[var(--color-ink-100)] text-[0.6rem]">{label}</p>
                        {href ? (
                          <a href={href} className="block mt-1 text-[var(--color-ink-400)] font-medium hover:text-[var(--color-signal-400)] transition-colors break-words">
                            {value}
                          </a>
                        ) : (
                          <p className="mt-1 text-[var(--color-ink-400)] font-medium break-words">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
