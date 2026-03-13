import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { FadeIn } from '@/components/animations/FadeIn';
import { CTABanner } from '@/components/sections/CTABanner';
import { caseStudies } from '@/data/case-studies';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Case Studies',
  description: 'Real-world success stories from our specialized Wärtsilä dual-fuel engine services across global ports.',
  path: '/case-studies',
});

export default function CaseStudiesPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-900 to-navy-800">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Case Studies', href: '/case-studies' }]} />
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4">Case Studies</h1>
            <p className="mt-4 text-xl text-navy-300 max-w-2xl">
              Real-world results from our specialized dual-fuel engine services.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-white">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study, index) => (
              <FadeIn key={study.slug} delay={index * 0.15}>
                <Card
                  title={study.title}
                  description={study.summary}
                  tags={study.tags}
                  href={`/case-studies/${study.slug}`}
                />
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
