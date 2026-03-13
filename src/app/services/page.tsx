import type { Metadata } from 'next';
import { Wrench, Cog, Flame, Siren, CheckCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { CTABanner } from '@/components/sections/CTABanner';
import { services } from '@/data/services';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Wärtsilä Dual-Fuel Field Service',
  description: 'Maximize the reliability of your LNG-powered vessels with specialized Wärtsilä dual-fuel engine maintenance, overhauls, and 24/7 emergency support.',
  path: '/services',
});

const iconMap: Record<string, React.ElementType> = {
  wrench: Wrench,
  cog: Cog,
  flame: Flame,
  siren: Siren,
};

export default function ServicesPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-900 to-navy-800">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }]} />
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4">
              Onboard Expertise for Wärtsilä 4-Stroke Dual-Fuel Engines
            </h1>
            <p className="mt-4 text-xl text-navy-300 max-w-3xl">
              Maximize the reliability of your LNG-powered vessels with Akira Marine&apos;s specialized field service.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <FadeIn>
              <p className="text-lg text-navy-700 leading-relaxed">
                We focus exclusively on the unique demands of Wärtsilä dual-fuel technology.
                Our technicians possess the specialized training and practical experience
                required to service these advanced platforms, making us the trusted partner
                for operators embracing LNG as a marine fuel.
              </p>
            </FadeIn>
          </div>

          <div className="space-y-16">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] || Wrench;
              return (
                <FadeIn key={service.id}>
                  <div id={service.id} className="scroll-mt-24 rounded-2xl border border-navy-100 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="grid lg:grid-cols-5">
                      <div className="lg:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 p-8 flex flex-col justify-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-600/20 text-orange-400 mb-6">
                          <Icon className="h-7 w-7" />
                        </div>
                        <h2 className="text-2xl font-sans font-bold text-white mb-3">{service.title}</h2>
                        <p className="text-navy-300 leading-relaxed">{service.shortDescription}</p>
                      </div>
                      <div className="lg:col-span-3 p-8">
                        <p className="text-navy-700 leading-relaxed mb-6">{service.fullDescription}</p>
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-navy-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </Container>
      </section>

      <CTABanner
        headline="Need Immediate Engine Support?"
        description="Our 24/7 emergency response team is ready to mobilize to any port worldwide."
        buttonText="Contact Us Now"
      />
    </>
  );
}
