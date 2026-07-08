import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { StatsBar } from '@/components/sections/StatsBar';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { ExpertisePreview } from '@/components/sections/ExpertisePreview';
import { CTABanner } from '@/components/sections/CTABanner';
import { ParallaxFigure } from '@/components/marine/ParallaxFigure';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  alternates: { canonical: SITE.url },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ParallaxFigure
        src="/images/tanker-at-sea.jpg"
        alt="Aerial view of a loaded tanker under way at sea at dusk"
        aspect="21 / 9"
      />
      <ServicesOverview />
      <ExpertisePreview />
      <CTABanner />
    </>
  );
}
