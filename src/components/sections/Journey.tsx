import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import Reveal from '../ui/Reveal';
import ErrorState from '../layout/ErrorState';
import { useExperience } from '../../hooks/useExperience';

export default function Journey() {
  const { experience, loading, error, retry } = useExperience();

  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <section id="journey" className="section-padding">
      <div className="section-container max-w-4xl">
        <SectionHeading title="Engineering Journey" subtitle="My path from first line of code to building production systems." />

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-accent-soft/50 mt-1 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-20 bg-accent-soft/30 rounded animate-pulse" />
                  <div className="h-6 w-48 bg-accent-soft/20 rounded animate-pulse" />
                  <div className="h-3 w-full bg-accent-soft/20 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : experience.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-12">No experience entries yet.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
            <div className="space-y-10">
              {experience.map((item, i) => (
                <Reveal key={item.year} delay={i * 0.08}>
                  <div className="relative pl-12">
                    <div className="absolute left-3 top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-bg z-10" />
                    <Card className="p-6">
                      <span className="text-xs font-mono text-accent mb-1 block">{item.year}</span>
                      <h3 className="font-medium mb-2">{item.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
                    </Card>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
