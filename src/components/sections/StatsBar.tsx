import { Container } from '@/components/ui/Container';
import { RevealGroup, RevealChild } from '@/components/animations/Reveal';
import { valueProps } from '@/data/stats';

export function StatsBar() {
  return (
    <section className="py-20 sm:py-28 bg-[var(--color-paper-50)] border-y border-[rgba(31,27,23,0.08)]">
      <Container>
        <RevealGroup
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(31,27,23,0.12)]"
          stagger={0.12}
        >
          {valueProps.map((item, i) => (
            <RevealChild key={item.id} className="px-0 sm:px-8 py-6 sm:py-2 first:pl-0 last:pr-0">
              <div className="flex items-start gap-5">
                <span className="number-outline text-5xl leading-none shrink-0 pt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <span className="eyebrow text-[var(--color-signal-400)] text-[0.65rem]">
                    Pillar {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 font-sans text-lg font-medium text-[var(--color-ink-400)] leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-ink-100)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </RevealChild>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
