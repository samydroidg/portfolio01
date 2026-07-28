import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import Badge from '../ui/Badge';
import Reveal from '../ui/Reveal';
import ErrorState from '../layout/ErrorState';
import { useSkills } from '../../hooks/useSkills';
import { DURATION, EASE } from '../../constants/animation';

export default function Skills() {
  const [active, setActive] = useState('all');
  const { categories, filtered, loading, error, retry } = useSkills();
  const items = filtered(active);

  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <section id="skills" className="section-padding">
      <div className="section-container">
        <SectionHeading title="Skills" subtitle="Technologies and tools I work with regularly." />

        <Reveal>
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  active === cat.key ? 'bg-accent text-white shadow-soft' : 'glass text-text-muted hover:text-text border-0'
                }`}
                style={{ transitionDuration: `${DURATION.hover}s` }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-8 w-20 bg-accent-soft/30 rounded-full animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2" style={{ perspective: '800px' }}>
              <AnimatePresence mode="popLayout">
                {items.map((skill, i) => (
                  <motion.span
                    key={skill.name + skill.category}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: DURATION.hover, delay: i * 0.02, ease: EASE.out }}
                  >
                    <Badge variant="default" className="cursor-default">{skill.name}</Badge>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
