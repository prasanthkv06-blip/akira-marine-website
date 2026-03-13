import type { Metadata } from 'next';
import { Wrench, Cog, Search, ArrowUpCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FadeIn } from '@/components/animations/FadeIn';
import { CTABanner } from '@/components/sections/CTABanner';
import { capabilities } from '@/data/capabilities';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Our Capabilities',
  description: 'Field service, engine overhauls, troubleshooting, and retrofits for Wärtsilä dual-fuel 4-stroke engines.',
  path: '/expertise/capabilities',
});

const iconMap: Record<string, React.ElementType> = {
  wrench: Wrench,
  cog: Cog,
  search: Search,
  'arrow-up-circle': ArrowUpCircle,
};

export default function CapabilitiesPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-900 to-navy-800">
        <Container>
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Dual-Fuel Specialists', href: '/expertise' },
            { label: 'Our Capabilities', href: '/expertise/capabilities' },
          ]} />
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4">Our Capabilities</h1>
            <p className="mt-4 text-xl text-navy-300 max-w-2xl">
              Comprehensive on-site service capabilities for Wärtsilä dual-fuel engines.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-white">
        <Container>
          <div className="space-y-24">
            {capabilities.map((cap, index) => {
              const Icon = iconMap[cap.icon] || Wrench;
              const isReversed = index % 2 === 1;
              return (
                <FadeIn key={cap.id}>
                  <div className={`grid items-center gap-12 lg:grid-cols-2 ${isReversed ? 'lg:direction-rtl' : ''}`}>
                    <div className={isReversed ? 'lg:order-2' : ''}>
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-50 text-orange-600 mb-6">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-sans font-bold text-navy-900 mb-4">
                        {cap.title}
                      </h2>
                      <p className="text-navy-600 leading-relaxed mb-6">{cap.description}</p>
                      <ul className="space-y-3">
                        {cap.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                            <span className="text-navy-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={isReversed ? 'lg:order-1' : ''}>
                      <div className="rounded-2xl bg-gradient-to-br from-navy-100 to-navy-50 aspect-[4/3] flex items-center justify-center">
                        <Icon className="h-24 w-24 text-navy-300" />
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
