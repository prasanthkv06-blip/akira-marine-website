import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SheetHead } from '@/components/ui/SheetHead';
import { services } from '@/data/services';

// Honest display overrides for a Feb-2026 firm: no unstaffed "24/7 hotline" or
// "global port coverage" claims we can't yet back.
const TITLE_OVERRIDES: Record<string, string> = {
  'emergency-service': 'Emergency Field Response',
};
const EXCLUDE_FEATURE = /24\/7|global port/i;

export function ServicesOverview() {
  return (
    <section className="bg-white py-28 sm:py-36">
      <Container>
        <SheetHead category="Services" title="Four service lines, one operating standard." />

        <div className="mt-20">
          {services.map((service, index) => {
            const title = TITLE_OVERRIDES[service.id] ?? service.title;
            const features = service.features.filter((f) => !EXCLUDE_FEATURE.test(f)).slice(0, 4);
            return (
              <article
                key={service.id}
                className="group grid gap-8 border-t border-[rgba(23,25,27,0.14)] py-14 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-12"
              >
                <div className="md:col-span-5">
                  <div className="flex items-baseline gap-5">
                    <span
                      className="tabular text-2xl font-semibold text-[var(--color-steel-200)] transition-colors duration-300 group-hover:text-[var(--color-signal-400)]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-[1.7rem] font-semibold leading-tight tracking-tight text-[var(--color-ink-400)]">
                      {title}
                    </h3>
                  </div>
                  <p className="mt-5 max-w-md leading-relaxed text-[var(--color-ink-100)]">
                    {service.shortDescription}
                  </p>
                  <Link
                    href={`/services#${service.id}`}
                    className="mt-6 inline-block text-sm font-medium text-[var(--color-ink-400)] underline decoration-[var(--color-steel-200)] decoration-1 underline-offset-[6px] transition-colors hover:text-[var(--color-signal-400)] hover:decoration-[var(--color-signal-400)]"
                  >
                    View specification
                  </Link>
                </div>

                <div className="md:col-span-6 md:col-start-7 md:pt-1">
                  <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
                    {features.map((f) => (
                      <li key={f} className="text-[15px] leading-relaxed text-[var(--color-ink-200)]">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
