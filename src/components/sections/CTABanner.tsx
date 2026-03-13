'use client';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';

interface CTABannerProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function CTABanner({
  headline = 'Ready to Maximize Your Engine Performance?',
  description = 'Contact our team of Wärtsilä dual-fuel specialists for a consultation on your vessel\'s maintenance needs.',
  buttonText = 'Get In Touch',
  buttonHref = '/contact',
}: CTABannerProps) {
  return (
    <section className="py-24 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
      {/* Accent glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />

      <Container className="relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {headline}
            </h2>
            <p className="mt-6 text-lg text-navy-300 leading-relaxed">
              {description}
            </p>
            <div className="mt-10">
              <Button href={buttonHref} variant="primary" size="lg">
                {buttonText}
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
