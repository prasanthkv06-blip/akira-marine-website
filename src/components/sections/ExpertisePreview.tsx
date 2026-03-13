'use client';

import { Shield, Zap, Globe, Award } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { SlideIn } from '@/components/animations/SlideIn';

const highlights = [
  { icon: Shield, text: 'Wärtsilä Certified Engineers' },
  { icon: Zap, text: '24/7 Global Response' },
  { icon: Globe, text: '30+ Countries Covered' },
  { icon: Award, text: '99% Uptime Rate' },
];

export function ExpertisePreview() {
  return (
    <section className="py-24 bg-navy-50">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <SlideIn from="left">
            <div>
              <div className="mb-4 h-1 w-16 rounded-full bg-orange-500" />
              <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
                Why Choose Our{' '}
                <span className="text-orange-600">Dual-Fuel</span>{' '}
                Expertise?
              </h2>
              <p className="mt-6 text-lg text-navy-600 leading-relaxed">
                The complexity of LNG-powered vessels requires more than just
                general mechanical knowledge; it demands a deep understanding of
                integrated fuel systems, electronic controls, and combustion dynamics.
              </p>
              <p className="mt-4 text-lg text-navy-600 leading-relaxed">
                Our team brings the workshop to your vessel, performing precision
                overhauls, diagnostics, and repairs on the world&apos;s most sophisticated
                marine engines.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {highlights.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="text-sm font-sans font-medium text-navy-800">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Button href="/expertise" variant="primary">
                  Explore Our Expertise
                </Button>
              </div>
            </div>
          </SlideIn>

          <SlideIn from="right">
            <div className="relative">
              <div className="rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 p-8 aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-sans font-bold text-orange-500 mb-4">
                    W34DF
                  </div>
                  <div className="text-navy-300 font-sans text-lg">
                    Wärtsilä Dual-Fuel Engine
                  </div>
                  <div className="mt-6 flex justify-center gap-4 flex-wrap">
                    {['Gas Mode', 'Diesel Mode', 'Fuel Switching'].map((mode) => (
                      <span
                        key={mode}
                        className="px-3 py-1 rounded-full bg-navy-700 text-navy-200 text-xs font-sans"
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-orange-500/10 -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl bg-navy-200/50 -z-10" />
            </div>
          </SlideIn>
        </div>
      </Container>
    </section>
  );
}
