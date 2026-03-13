'use client';

import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { caseStudies } from '@/data/case-studies';

export function CaseStudyCarousel() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <SectionHeading
          title="Case Studies"
          subtitle="Real-world results from our specialized dual-fuel engine services across global ports."
        />

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

        <FadeIn delay={0.5}>
          <div className="mt-12 text-center">
            <Button href="/case-studies" variant="outline">
              View All Case Studies
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
