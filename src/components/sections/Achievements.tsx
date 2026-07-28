import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import Reveal from '../ui/Reveal';
import ErrorState from '../layout/ErrorState';
import { useAchievements } from '../../hooks/useAchievements';
import { useReducedMotion } from '../../hooks/useMousePosition';

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });
  const reduced = useReducedMotion();
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (reduced) { setCount(end); return; }
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 1500, 1);
      setCount(Math.floor(Math.pow(progress, 0.6) * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, reduced]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Achievements() {
  const { achievements, loading, error, retry } = useAchievements();

  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <section className="section-padding">
      <div className="section-container">
        <SectionHeading title="Achievements" subtitle="Some numbers from my engineering journey." />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-6 rounded-xl bg-surface border border-border">
                <div className="h-8 w-16 bg-accent-soft/30 rounded animate-pulse mb-2" />
                <div className="h-4 w-24 bg-accent-soft/20 rounded animate-pulse mb-1" />
                <div className="h-3 w-32 bg-accent-soft/20 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : achievements.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-12">No achievements yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08}>
                <Card className="p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-medium mb-1">
                    <AnimatedCounter end={item.value} suffix={item.suffix} />
                  </div>
                  <p className="text-sm text-text-muted">{item.label}</p>
                  <p className="text-xs text-text-muted/60 mt-1">{item.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
