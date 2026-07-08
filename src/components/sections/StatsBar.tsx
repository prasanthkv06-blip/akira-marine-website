import { Container } from '@/components/ui/Container';
import { SheetHead } from '@/components/ui/SheetHead';
import { valueProps } from '@/data/stats';

export function StatsBar() {
  return (
    <section className="border-y border-[rgba(23,25,27,0.08)] bg-[var(--color-paper-50)] py-28 sm:py-36">
      <Container>
        <SheetHead category="Capabilities" title="What a single accountable service partner covers." />

        <div className="mt-20 grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((item, i) => (
            <div key={item.id}>
              <div
                className="tabular text-3xl font-semibold text-[var(--color-signal-400)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-snug tracking-tight text-[var(--color-ink-400)]">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink-100)]">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
