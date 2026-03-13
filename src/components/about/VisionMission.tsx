'use client';

import { Eye, Target } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

export function VisionMission() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <FadeIn delay={0.1}>
        <div className="rounded-xl bg-navy-800 p-8 text-white h-full">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-600/20 mb-6">
            <Eye className="h-6 w-6 text-orange-400" />
          </div>
          <h3 className="text-xl font-sans font-bold mb-4">Our Vision</h3>
          <p className="text-navy-200 leading-relaxed">
            To be the global standard of excellence in specialized LNG and marine engineering
            services, recognized for our unwavering commitment to safety, precision, and the
            seamless integration of modern innovation with classic maritime craftsmanship.
          </p>
        </div>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div className="rounded-xl bg-white border border-navy-100 p-8 h-full">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-50 mb-6">
            <Target className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-sans font-bold text-navy-900 mb-4">Our Mission</h3>
          <p className="text-navy-600 leading-relaxed">
            Our mission is to ensure the operational integrity of our clients&apos; vessels by
            delivering superior on-site workshop services, expert engine maintenance, and
            comprehensive hull care. We are dedicated to protecting our clients&apos; assets and
            the environment through meticulous work, continuous crew training, and an unyielding
            focus on safety.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
