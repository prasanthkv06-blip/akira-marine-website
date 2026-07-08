const items = [
  {
    label: 'Our Vision',
    body: 'To be the global standard of excellence in specialized LNG and marine engineering services, recognized for our unwavering commitment to safety, precision, and the seamless integration of modern innovation with classic maritime craftsmanship.',
  },
  {
    label: 'Our Mission',
    body: 'To be a trusted partner for dual-fuel marine engine maintenance. Through deep specialization and efficient operations, we deliver OEM-quality workmanship that maximizes uptime, extends engine life, and ensures premium quality without premium burden — every time, at your port of call.',
  },
];

export function VisionMission() {
  return (
    <div className="grid gap-x-16 gap-y-16 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <span className="eyebrow text-[var(--color-signal-400)]">{item.label}</span>
          <p className="mt-6 text-xl leading-relaxed text-[var(--color-ink-200)]">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
