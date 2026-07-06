export function VisionMission() {
  return (
    <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
      <div className="border border-[rgba(31,27,23,0.15)] bg-white p-10 relative">
        <span
          aria-hidden
          className="absolute top-0 left-0 h-px w-12 bg-[var(--color-signal-400)]"
        />
        <div className="eyebrow mb-4">Our Vision</div>
        <p className="text-lg text-[var(--color-ink-200)] leading-relaxed font-light">
          To be the global standard of excellence in specialized LNG and marine engineering
          services, recognized for our unwavering commitment to safety, precision, and the
          seamless integration of modern innovation with classic maritime craftsmanship.
        </p>
      </div>
      <div className="border border-[rgba(31,27,23,0.15)] bg-white p-10 relative">
        <span
          aria-hidden
          className="absolute top-0 left-0 h-px w-12 bg-[var(--color-signal-400)]"
        />
        <div className="eyebrow mb-4">Our Mission</div>
        <p className="text-lg text-[var(--color-ink-200)] leading-relaxed font-light">
          To be the most trusted partner for dual-fuel marine engine maintenance worldwide.
          Through deep specialization and efficient operations, we deliver OEM-quality
          workmanship that maximizes uptime, extends engine life, and ensures premium quality
          without premium burden — every time, at every port.
        </p>
      </div>
    </div>
  );
}
