import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { CTABanner } from '@/components/sections/CTABanner';
import { caseStudies } from '@/data/case-studies';
import { createMetadata } from '@/lib/metadata';

export async function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) return {};
  return createMetadata({
    title: study.title,
    description: study.summary,
    path: `/case-studies/${study.slug}`,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) notFound();

  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-900 to-navy-800">
        <Container>
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Case Studies', href: '/case-studies' },
            { label: study.title, href: `/case-studies/${study.slug}` },
          ]} />
          <FadeIn>
            <div className="flex flex-wrap gap-2 mt-4 mb-4">
              {study.tags.map((tag) => (
                <Badge key={tag} text={tag} variant="accent" />
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{study.title}</h1>
            <p className="mt-4 text-xl text-navy-300 max-w-3xl">{study.summary}</p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto space-y-16">
            <FadeIn>
              <div>
                <h2 className="text-2xl font-sans font-bold text-navy-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">1</span>
                  The Challenge
                </h2>
                <p className="text-navy-700 leading-relaxed text-lg">{study.challenge}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div>
                <h2 className="text-2xl font-sans font-bold text-navy-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">2</span>
                  Our Solution
                </h2>
                <p className="text-navy-700 leading-relaxed text-lg">{study.solution}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div>
                <h2 className="text-2xl font-sans font-bold text-navy-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">3</span>
                  The Result
                </h2>
                <p className="text-navy-700 leading-relaxed text-lg">{study.result}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="text-center pt-8">
                <Button href="/case-studies" variant="outline">
                  &larr; Back to Case Studies
                </Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
