import type { Metadata } from 'next';
import Link from 'next/link';
import { Wrench, Cpu, Award } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { FadeIn } from '@/components/animations/FadeIn';
import { CTABanner } from '@/components/sections/CTABanner';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Wärtsilä Expertise',
  description: 'Discover our specialized expertise in Wärtsilä dual-fuel 4-stroke engine maintenance, technical capabilities, and industry certifications.',
  path: '/expertise',
});

const expertiseAreas = [
  {
    title: 'Our Capabilities',
    description: 'Field service, engine overhauls, troubleshooting, and retrofits — all delivered on-site to your vessel.',
    icon: Wrench,
    href: '/expertise/capabilities',
  },
  {
    title: 'Technical Expertise',
    description: 'Deep knowledge of Wärtsilä 34DF, 46DF, and 31DF engines, UNIGEN controls, and LNGPac fuel systems.',
    icon: Cpu,
    href: '/expertise/technical',
  },
  {
    title: 'Certifications & Training',
    description: 'Industry-recognized certifications and continuous training ensure the highest standards of service.',
    icon: Award,
    href: '/expertise/certifications',
  },
];

export default function ExpertisePage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-900 to-navy-800">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Dual-Fuel Specialists', href: '/expertise' }]} />
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4">
              Wärtsilä Dual-Fuel Expertise
            </h1>
            <p className="mt-4 text-xl text-navy-300 max-w-2xl">
              Your trusted partner for the world&apos;s most advanced marine propulsion systems.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <FadeIn>
              <p className="text-lg text-navy-700 leading-relaxed">
                As global shipping transitions toward cleaner fuels, Akira Marine stands at
                the forefront of LNG-powered vessel maintenance. Our exclusive focus on
                Wärtsilä dual-fuel technology means deeper knowledge, faster diagnostics,
                and more reliable outcomes for your fleet.
              </p>
            </FadeIn>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {expertiseAreas.map((area, index) => (
              <FadeIn key={area.href} delay={index * 0.15}>
                <Link href={area.href} className="group block">
                  <div className="rounded-xl border border-navy-100 p-8 h-full transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 bg-white">
                    <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                      <area.icon className="h-7 w-7" />
                    </div>
                    <h2 className="text-xl font-sans font-bold text-navy-900 mb-3">{area.title}</h2>
                    <p className="text-navy-600 leading-relaxed">{area.description}</p>
                    <span className="inline-block mt-4 text-sm font-sans font-semibold text-orange-600 group-hover:translate-x-1 transition-transform">
                      Learn more &rarr;
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
