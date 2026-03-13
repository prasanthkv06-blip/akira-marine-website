import type { Metadata } from 'next';
import { Award } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { FadeIn } from '@/components/animations/FadeIn';
import { CTABanner } from '@/components/sections/CTABanner';
import { certifications } from '@/data/certifications';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Certifications & Training',
  description: 'Industry-recognized certifications and continuous training programs ensuring the highest standards of Wärtsilä engine service.',
  path: '/expertise/certifications',
});

export default function CertificationsPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-900 to-navy-800">
        <Container>
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Dual-Fuel Specialists', href: '/expertise' },
            { label: 'Certifications & Training', href: '/expertise/certifications' },
          ]} />
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4">Certifications & Training</h1>
            <p className="mt-4 text-xl text-navy-300 max-w-2xl">
              Industry-leading qualifications that validate our expertise and commitment to safety.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-white">
        <Container>
          <SectionHeading
            title="Our Certifications"
            subtitle="Our team holds recognized certifications from leading maritime and engineering bodies."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, index) => (
              <FadeIn key={cert.id} delay={index * 0.1}>
                <div className="rounded-xl border border-navy-100 p-8 hover:shadow-lg transition-shadow duration-300 h-full bg-white">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-50 text-orange-600 mb-6">
                    <Award className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-sans font-bold text-navy-900 mb-2">{cert.name}</h3>
                  <p className="text-sm font-sans text-orange-600 font-medium mb-3">{cert.issuer}</p>
                  <p className="text-sm text-navy-600 leading-relaxed">{cert.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Training */}
      <section className="py-24 bg-navy-50">
        <Container>
          <SectionHeading
            title="Continuous Training"
            subtitle="Our engineers undergo regular training to stay current with the latest Wärtsilä technologies."
          />
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6 text-lg text-navy-700 leading-relaxed">
                <p>
                  We maintain a rigorous continuous professional development program that ensures
                  all field engineers are trained on the latest Wärtsilä dual-fuel engine technologies,
                  control system updates, and safety procedures.
                </p>
                <p>
                  Our training partnerships with Wärtsilä and recognized maritime training institutions
                  guarantee that every technician who boards your vessel represents the highest level
                  of competence and professionalism in the industry.
                </p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
