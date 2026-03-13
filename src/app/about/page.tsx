import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { VisionMission } from '@/components/about/VisionMission';
import { TeamMemberCard } from '@/components/about/TeamMemberCard';
import { CTABanner } from '@/components/sections/CTABanner';
import { FadeIn } from '@/components/animations/FadeIn';
import { team } from '@/data/team';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'About Us',
  description: 'Learn about Akira Marine Services — bridging advanced marine technology with practical, on-site execution for Wärtsilä dual-fuel engines.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-900 to-navy-800">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about' }]} />
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4">About Akira Marine</h1>
            <p className="mt-4 text-xl text-navy-300 max-w-2xl">
              Bridging advanced marine technology with practical, on-site execution.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <SectionHeading title="Our Story" alignment="left" />
            <FadeIn>
              <div className="space-y-6 text-lg text-navy-700 leading-relaxed">
                <p>
                  Akira Marine Services Private Limited was founded to bridge the gap between
                  advanced marine technology and practical, on-site execution. As global shipping
                  transitions toward cleaner fuels, we have positioned ourselves at the forefront
                  by specializing in the field service maintenance of Wärtsilä dual-fuel,
                  four-stroke engines.
                </p>
                <p>
                  We understand that the complexity of LNG-powered vessels requires more than just
                  general mechanical knowledge; it demands a deep, intrinsic understanding of
                  integrated fuel systems, electronic controls, and combustion dynamics.
                </p>
                <p>
                  Our team brings the workshop to your vessel, performing precision overhauls,
                  diagnostics, and repairs on the world&apos;s most sophisticated marine
                  engines&mdash;ensuring maximum uptime and operational safety.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-navy-50">
        <Container>
          <SectionHeading title="Vision & Mission" />
          <VisionMission />
        </Container>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <Container>
          <SectionHeading
            title="Our Team"
            subtitle="Meet the experienced professionals behind Akira Marine's specialized services."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <TeamMemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
