import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SheetHead } from '@/components/ui/SheetHead';
import { ParallaxFigure } from '@/components/marine/ParallaxFigure';
import { engineModels } from '@/data/technical-specs';

export function ExpertisePreview() {
  return (
    <section className="bg-[var(--color-paper-50)] py-28 sm:py-36">
      <Container>
        <SheetHead category="Platforms" title="Built around the platforms you operate." />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-100)]">
          Our field engineers work across the 4-stroke dual-fuel classes deployed
          on LNG carriers and offshore vessels — from mid-bore units to the
          largest platforms in current fleet service. Every class runs on natural
          gas (LNG), marine diesel oil, or heavy fuel oil.
        </p>
      </Container>

      {/* full-bleed cinematic cutaway */}
      <div className="mt-16">
        <ParallaxFigure
          src="/images/marine-engine-cylinders.jpg"
          alt="Cylinder units and braided fuel lines of a large dual-fuel marine engine in an engine room"
          caption="Dual-fuel 4-stroke marine engine — cylinder units in service"
          aspect="21 / 9"
        />
      </div>

      <Container className="mt-20">
        {/* refined hairline spec table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">Dual-fuel 4-stroke engine platform specifications</caption>
            <thead>
              <tr className="border-b border-[rgba(23,25,27,0.22)]">
                {['Platform', 'Bore', 'Cylinder config', 'Output', 'Speed'].map((h) => (
                  <th key={h} className="eyebrow px-1 pb-4 font-medium text-[var(--color-steel-400)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {engineModels.map((m) => {
                const bore = m.type.match(/~(\d+)\s*cm/)?.[1];
                return (
                  <tr key={m.id} className="border-b border-[rgba(23,25,27,0.10)] align-baseline">
                    <th scope="row" className="whitespace-nowrap px-1 py-6 pr-8 text-lg font-semibold tracking-tight text-[var(--color-ink-400)]">
                      {m.name}
                    </th>
                    <td className="tabular whitespace-nowrap px-1 py-6 text-[15px] text-[var(--color-ink-200)]">
                      {bore ? `~${bore} cm` : '—'}
                    </td>
                    <td className="tabular px-1 py-6 text-[15px] text-[var(--color-ink-200)]">{m.cylinders}</td>
                    <td className="tabular whitespace-nowrap px-1 py-6 text-[15px] font-medium text-[var(--color-ink-400)]">{m.power}</td>
                    <td className="tabular whitespace-nowrap px-1 py-6 text-[15px] text-[var(--color-ink-200)]">{m.speed}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <span className="eyebrow">Fuel modes — LNG · MDO · HFO</span>
          <Link
            href="/expertise/technical"
            className="text-sm font-medium text-[var(--color-ink-400)] underline decoration-[var(--color-steel-200)] decoration-1 underline-offset-[6px] transition-colors hover:text-[var(--color-signal-400)] hover:decoration-[var(--color-signal-400)]"
          >
            Full technical detail
          </Link>
        </div>
      </Container>
    </section>
  );
}
