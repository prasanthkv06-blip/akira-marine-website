'use client';

import { Wrench, Cog, Flame, Siren } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { services } from '@/data/services';

const iconMap: Record<string, React.ElementType> = {
  wrench: Wrench,
  cog: Cog,
  flame: Flame,
  siren: Siren,
};

export function ServicesOverview() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <SectionHeading
          title="Our Services"
          subtitle="Comprehensive field service solutions for Wärtsilä dual-fuel engines, delivered directly to your vessel at any port worldwide."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Wrench;
            return (
              <FadeIn key={service.id} delay={index * 0.1}>
                <div className="group rounded-xl border border-navy-100 p-8 transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 bg-white">
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-sans font-bold text-navy-900">
                    {service.title}
                  </h3>
                  <p className="text-navy-600 leading-relaxed text-sm">
                    {service.shortDescription}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.5}>
          <div className="mt-12 text-center">
            <Button href="/services" variant="secondary">
              View All Services
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
