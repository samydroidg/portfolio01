import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useReducedMotion } from '../../hooks/useMousePosition';
import { DURATION, EASE } from '../../constants/animation';
import { getLenis } from '../../lib/lenis';
import type { ProjectData } from '../../types/projects';

interface ProjectModalProps {
  project: ProjectData;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const reduced = useReducedMotion();
  const [galleryIndex, setGalleryIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = getLenis();
    const root = document.documentElement;
    const body = document.body;
    const previousActive = document.activeElement as HTMLElement | null;

    lenis?.stop();

    const prevRootOverflow = root.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    scrollRef.current?.focus({ preventScroll: true });

    return () => {
      root.style.overflow = prevRootOverflow;
      body.style.overflow = prevBodyOverflow;
      lenis?.start();
      previousActive?.focus?.({ preventScroll: true });
    };
  }, []);

  const techByCategory = project.techStack.reduce<Record<string, { name: string; category: string }[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.modal * 0.5, ease: EASE.inOut }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} project details`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        ref={scrollRef}
        data-lenis-prevent
        tabIndex={-1}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto overscroll-contain glass-strong shadow-elevated rounded-xl outline-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: DURATION.modal, ease: EASE.out }}
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-border glass-strong">
          <div>
            <h2 className="font-medium">{project.name}</h2>
            <p className="text-xs text-text-muted">{project.category} &middot; {project.industry}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-accent-soft transition-colors"
            aria-label="Close modal"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-8">
          {/* Gallery */}
          {project.gallery.length > 0 && (
            <ProjectGallery images={project.gallery} name={project.name} index={galleryIndex} onIndexChange={setGalleryIndex} />
          )}

          <Section title="Overview">
            <p className="text-sm text-text-secondary leading-relaxed">{project.overview}</p>
          </Section>

          <div className="p-4 rounded-lg border border-accent-border bg-accent-soft">
            <p className="text-sm text-text-secondary italic leading-relaxed">"{project.mission}"</p>
          </div>

          <Section title="Problem">
            <p className="text-sm text-text-secondary leading-relaxed">{project.problem}</p>
          </Section>

          <Section title="Solution">
            <p className="text-sm text-text-secondary leading-relaxed">{project.solution}</p>
          </Section>

          <Section title="Features">
            <div className="grid sm:grid-cols-2 gap-2">
              {project.features.map(f => (
                <div key={f} className="flex items-start gap-2.5 text-sm text-text-secondary p-2.5 rounded-lg bg-accent-soft/50">
                  <span className="block w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Technology Stack">
            <div className="space-y-3">
              {Object.entries(techByCategory).map(([category, items]) => (
                <div key={category}>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">{category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map(t => (
                      <Badge key={t.name}>{t.name}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Architecture">
            <p className="text-sm text-text-secondary leading-relaxed">{project.architecture}</p>
          </Section>

          <Section title="Challenges">
            <ul className="space-y-2">
              {project.challenges.map(c => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <span className="block w-1 h-1 rounded-full bg-text-muted mt-2 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Engineering Decisions">
            <ul className="space-y-2">
              {project.engineeringDecisions.map(d => (
                <li key={d} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <span className="block w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </Section>

          {project.lessonsLearned.length > 0 && (
            <Section title="Lessons Learned">
              <ul className="space-y-2">
                {project.lessonsLearned.map(l => (
                  <li key={l} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <span className="block w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {project.roadmap.length > 0 && (
            <Section title="Roadmap">
              <div className="space-y-2">
                {project.roadmap.map(r => (
                  <div key={r.title} className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColor(r.status)} capitalize`}>{r.status}</span>
                    {r.title}
                  </div>
                ))}
              </div>
            </Section>
          )}

          <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg>
                Source
              </a>
            )}
            {project.liveDemo && (
              <Button variant="primary" href={project.liveDemo}><ExternalLink size={14} />Live demo</Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-text-muted mb-3 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function ProjectGallery({ images, name, index, onIndexChange }: { images: string[]; name: string; index: number; onIndexChange: (i: number) => void }) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-surface">
      <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-accent/5 to-accent/10">
        {images[index] ? (
          <img src={images[index]} alt={`${name} screenshot ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="text-text-muted/30 text-lg font-medium">{name}</span>
        )}
      </div>
      {images.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <button
            onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
            className="w-8 h-8 rounded-full glass-strong flex items-center justify-center text-text-muted hover:text-text transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => onIndexChange((index + 1) % images.length)}
            className="w-8 h-8 rounded-full glass-strong flex items-center justify-center text-text-muted hover:text-text transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => onIndexChange(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-accent w-3' : 'bg-text-muted/30'}`}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function statusColor(s: string) {
  if (s === 'completed') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (s === 'planned') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
}
