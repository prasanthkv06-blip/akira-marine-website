import type { Metadata } from 'next';
import { Award } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';
import { CTABanner } from '@/components/sections/CTABanner';
import { PageHero } from '@/components/layout/PageHero';
import { CertificationsSignature } from '@/components/interactive/PageSignatures';
import { certifications } from '@/data/certifications';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Certifications & Training',
  description: 'Industry-recognized certifications and continuous training programs ensuring the highest standards of dual-fuel engine service.',
  path: '/expertise/certifications',
});

export default function CertificationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Certifications · Attested"
        title="Qualifications that"
        accent="validate the discipline."
        lede="Industry-leading certifications and continuous professional development — the standards by which every field engineer is measured."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dual-Fuel Specialists', href: '/expertise' },
          { label: 'Certifications & Training', href: '/expertise/certifications' },
        ]}
        signature={<CertificationsSignature />}
      />

      <section className="py-24 sm:py-32 bg-white">
        <Container>
          <div className="mb-16 text-center">
            <span className="eyebrow">Our Certifications</span>
            <h2 className="mt-3 serif-display text-[clamp(1.75rem,3vw,2.75rem)] text-[var(--color-ink-400)] leading-[1.1]">
              Recognised by leading maritime and{' '}
              <span className="italic text-[var(--color-signal-400)]">engineering bodies.</span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, index) => (
              <FadeIn key={cert.id} delay={index * 0.08}>
                <div className="border border-[rgba(31,27,23,0.12)] bg-[var(--color-paper-50)] p-8 h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(168,50,50,0.10)] text-[var(--color-signal-400)] mb-6">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="serif-display text-lg text-[var(--color-ink-400)] leading-tight">
                    {cert.name}
                  </h3>
                  <p className="mt-2 eyebrow text-[var(--color-signal-400)] text-[0.6rem]">
                    {cert.issuer}
                  </p>
                  <p className="mt-4 text-sm text-[var(--color-ink-100)] leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Continuous training */}
      <section className="py-24 sm:py-32 bg-[var(--color-paper-50)]">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="eyebrow">Continuous Training</span>
            <h2 className="mt-3 serif-display text-[clamp(1.75rem,3vw,2.75rem)] text-[var(--color-ink-400)] leading-[1.1]">
              Every technician boarding your vessel represents the{' '}
              <span className="italic text-[var(--color-signal-400)]">highest level of competence.</span>
            </h2>
            <div className="mt-10 space-y-6 text-lg text-[var(--color-ink-100)] leading-relaxed font-light text-left">
              <p>
                We maintain a rigorous continuous professional development program that ensures
                all field engineers are trained on the latest dual-fuel engine technologies,
                control system updates, and safety procedures.
              </p>
              <p>
                Our training partnerships with leading OEMs and recognized maritime training institutions
                guarantee that every technician who boards your vessel represents the highest level
                of competence and professionalism in the industry.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
