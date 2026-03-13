import { Container } from '@/components/ui/Container';
import { StatCounter } from '@/components/ui/StatCounter';
import { stats } from '@/data/stats';

export function StatsBar() {
  return (
    <section className="relative -mt-16 z-20">
      <Container>
        <div className="rounded-2xl bg-navy-800 shadow-2xl py-12 px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <StatCounter
                key={stat.id}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
