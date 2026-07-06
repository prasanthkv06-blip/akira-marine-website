import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { StatsBar } from '@/components/sections/StatsBar';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { ExpertisePreview } from '@/components/sections/ExpertisePreview';
import { CTABanner } from '@/components/sections/CTABanner';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  alternates: { canonical: SITE.url },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesOverview />
      <ExpertisePreview />
      <CTABanner />
    </>
  );
}
