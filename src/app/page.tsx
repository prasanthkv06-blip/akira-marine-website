import { Hero } from '@/components/sections/Hero';
import { StatsBar } from '@/components/sections/StatsBar';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { ExpertisePreview } from '@/components/sections/ExpertisePreview';
import { CaseStudyCarousel } from '@/components/sections/CaseStudyCarousel';
import { CTABanner } from '@/components/sections/CTABanner';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesOverview />
      <ExpertisePreview />
      <CaseStudyCarousel />
      <CTABanner />
    </>
  );
}
