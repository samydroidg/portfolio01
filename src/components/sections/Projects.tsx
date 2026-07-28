import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import ErrorState from '../layout/ErrorState';
import ProjectCard from '../projects/ProjectCard';
import ProjectModal from '../projects/ProjectModal';
import { useProjects } from '../../hooks/useProjects';
import { DURATION } from '../../constants/animation';
import type { ProjectData } from '../../types/projects';

const FILTERS = ['all', 'Enterprise SaaS', 'Healthcare SaaS', 'Developer Growth Platform', 'Desktop Software', 'SaaS', 'Desktop'];

export default function Projects() {
  const { projects, loading, error, retry } = useProjects();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<ProjectData | null>(null);

  const filtered = filter === 'all' ? projects : projects.filter(p =>
    p.category.toLowerCase().includes(filter.toLowerCase()) || p.industry.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section id="work" className="section-padding">
      <div className="section-container">
        <SectionHeading title="Work" subtitle="Selected products I've designed and engineered." />

        <Reveal>
          <div className="flex flex-wrap gap-2 mb-10">
            {FILTERS.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filter === cat ? 'bg-accent text-white shadow-soft' : 'glass text-text-muted hover:text-text border-0'
                } ${cat === 'SaaS' || cat === 'Desktop' ? 'hidden sm:inline-flex' : ''}`}
                style={{ transitionDuration: `${DURATION.hover}s` }}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </Reveal>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl bg-surface border border-border p-0 overflow-hidden">
                <div className="h-48 bg-accent-soft/50 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-24 bg-accent-soft/50 rounded animate-pulse" />
                  <div className="h-3 w-full bg-accent-soft/30 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-accent-soft/30 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-text-muted mb-2">No projects yet</p>
            <p className="text-xs text-text-muted/60">Add your projects in <code className="text-accent">public/projects.json</code></p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} onClick={() => setSelected(project)} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
