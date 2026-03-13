'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-900">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Accent glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />

      <Container className="relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn delay={0.2}>
            <span className="inline-block mb-6 px-4 py-2 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-400 font-sans text-sm font-medium tracking-wide uppercase">
              Wärtsilä Dual-Fuel Experts
            </span>
          </FadeIn>

          <FadeIn delay={0.4}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Specialized Field Service for{' '}
              <span className="text-orange-500">Wärtsilä Dual-Fuel</span>{' '}
              4-Stroke Engines.
            </h1>
          </FadeIn>

          <FadeIn delay={0.6}>
            <p className="mt-8 text-lg sm:text-xl text-navy-300 max-w-2xl mx-auto leading-relaxed">
              Akira Marine Services: Precision maintenance, repair, and overhaul
              for LNG-powered vessels and marine propulsion systems.
            </p>
          </FadeIn>

          <FadeIn delay={0.8}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/expertise" variant="primary" size="lg">
                Our Expertise
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white hover:text-navy-900 hover:border-white"
              >
                Get In Touch
              </Button>
            </div>
          </FadeIn>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-8 w-8 text-navy-400" />
      </motion.div>
    </section>
  );
}
