import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { FadeIn } from '@/components/animations/FadeIn';
import { CTABanner } from '@/components/sections/CTABanner';
import { engineModels } from '@/data/technical-specs';
import { EngineView } from '@/components/interactive/EngineView';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Technical Expertise',
  description: 'Deep technical knowledge of Wärtsilä 34DF, 46DF, and 31DF engines, UNIGEN controls, and LNGPac fuel systems.',
  path: '/expertise/technical',
});

export default function TechnicalPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-900 to-navy-800">
        <Container>
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Dual-Fuel Specialists', href: '/expertise' },
            { label: 'Technical Expertise', href: '/expertise/technical' },
          ]} />
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4">Technical Expertise</h1>
            <p className="mt-4 text-xl text-navy-300 max-w-2xl">
              Deep knowledge of Wärtsilä dual-fuel engine platforms and supporting systems.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Engine Models */}
      <section className="py-24 bg-white">
        <Container>
          <SectionHeading
            title="Engine Platforms We Service"
            subtitle="Specialized expertise across the full range of Wärtsilä 4-stroke dual-fuel engines."
          />
          <div className="grid gap-8 lg:grid-cols-3">
            {engineModels.map((engine, index) => (
              <FadeIn key={engine.id} delay={index * 0.15}>
                <div className="rounded-xl border border-navy-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-navy-800 to-navy-900 p-8 text-center">
                    <h3 className="text-2xl font-sans font-bold text-white">{engine.name}</h3>
                    <p className="text-navy-300 text-sm mt-1">{engine.type}</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-navy-600 text-sm leading-relaxed">{engine.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-navy-500 font-sans">Configurations</span>
                        <span className="text-navy-800 font-medium font-sans">{engine.cylinders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-navy-500 font-sans">Power Range</span>
                        <span className="text-navy-800 font-medium font-sans">{engine.power}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-navy-500 font-sans">Speed</span>
                        <span className="text-navy-800 font-medium font-sans">{engine.speed}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-navy-100">
                      <p className="text-xs font-sans font-medium text-navy-500 mb-2">Fuel Modes</p>
                      <div className="flex flex-wrap gap-2">
                        {engine.fuelModes.map((mode) => (
                          <Badge key={mode} text={mode} variant="muted" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Interactive Engine Diagram */}
      <section className="py-24 bg-white">
        <Container>
          <SectionHeading
            title="Interactive Engine Diagram"
            subtitle="Explore the key components of a Wärtsilä dual-fuel engine and discover our specialized services for each."
          />
          <EngineView />
        </Container>
      </section>

      {/* Control Systems & LNG */}
      <section className="py-24 bg-navy-50">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2">
            <FadeIn>
              <div>
                <div className="mb-4 h-1 w-16 rounded-full bg-orange-500" />
                <h2 className="text-3xl font-sans font-bold text-navy-900 mb-6">UNIGEN Control Systems</h2>
                <p className="text-navy-600 leading-relaxed mb-6">
                  Our engineers are extensively trained on the Wärtsilä UNIGEN engine control platform,
                  covering all aspects of engine management, fuel-air optimization, and safety system configuration.
                </p>
                <ul className="space-y-3">
                  {['Engine management software calibration', 'Safety parameter configuration', 'Gas/diesel mode switching logic', 'Sensor diagnostics and replacement', 'Remote monitoring system integration'].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                      <span className="text-navy-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div>
                <div className="mb-4 h-1 w-16 rounded-full bg-orange-500" />
                <h2 className="text-3xl font-sans font-bold text-navy-900 mb-6">LNGPac Fuel Systems</h2>
                <p className="text-navy-600 leading-relaxed mb-6">
                  Comprehensive service capabilities for the complete LNG fuel gas supply chain,
                  from storage tanks to engine admission valves.
                </p>
                <ul className="space-y-3">
                  {['LNG storage and handling systems', 'Fuel gas supply system maintenance', 'Gas valve unit reconditioning', 'Boil-off gas management', 'Safety shutdown system testing'].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                      <span className="text-navy-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
