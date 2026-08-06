import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ErrorState from '../components/layout/ErrorState';
import { DURATION, EASE } from '../constants/animation';
import { getLenis } from '../lib/lenis';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { projects, loading, error, retry } = useProjects();
  const project = projects.find(p => p.slug === slug);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = getLenis();
    const root = document.documentElement;
    const body = document.body;

    lenis?.scrollTo(0, { immediate: true, force: true });
    lenis?.stop();

    const prevBodyOverflow = body.style.overflow;
    const prevRootOverflow = root.style.overflow;
    const prevBodyOverscroll = body.style.overscrollBehavior;

    body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';

    scrollRef.current?.scrollTo(0, 0);

    return () => {
      body.style.overflow = prevBodyOverflow;
      root.style.overflow = prevRootOverflow;
      body.style.overscrollBehavior = prevBodyOverscroll;
      lenis?.start();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={retry} />;

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl font-medium text-text-muted/20 mb-4">404</p>
        <p className="font-medium mb-2">Project not found</p>
        <p className="text-sm text-text-muted mb-6">The project you're looking for doesn't exist.</p>
        <Button variant="primary" href="/">
          <ArrowLeft size={14} />
          Back to home
        </Button>
      </div>
    );
  }

  const techByCategory = project.techStack.reduce<Record<string, typeof project.techStack>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 z-0 overflow-y-auto overscroll-contain pt-24"
      style={{ touchAction: 'pan-y' }}
    >
      <div className="section-container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.sectionReveal, ease: EASE.out }}
        >
          <Link to="/#work" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors mb-8" style={{ transitionDuration: `${DURATION.hover}s` }}>
            <ArrowLeft size={14} />
            Back to projects
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs px-2.5 py-1 rounded-full glass text-text-muted font-medium">{project.category}</span>
            <span className="text-xs px-2.5 py-1 rounded-full glass text-text-muted">{project.status}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight mb-2">{project.name}</h1>
          <p className="text-text-secondary text-lg mb-8">{project.overview}</p>

          {/* Hero Image */}
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5 mb-12 aspect-video flex items-center justify-center border border-border">
            {project.coverImage ? (
              <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <span className="text-5xl font-medium text-text-muted/20">{project.name.charAt(0)}</span>
            )}
          </div>
        </motion.div>

        <div className="space-y-12">
          {/* Mission */}
          <Section>
            <p className="text-lg text-text-secondary italic leading-relaxed p-6 rounded-lg border border-accent-border bg-accent-soft">"{project.mission}"</p>
          </Section>

          {/* Problem & Solution */}
          <div className="grid md:grid-cols-2 gap-8">
            <Section title="The Problem">
              <p className="text-sm text-text-secondary leading-relaxed">{project.problem}</p>
            </Section>
            <Section title="The Solution">
              <p className="text-sm text-text-secondary leading-relaxed">{project.solution}</p>
            </Section>
          </div>

          {/* Features */}
          <Section title="Key Features">
            <div className="grid sm:grid-cols-2 gap-3">
              {project.features.map(f => (
                <div key={f} className="flex items-start gap-3 text-sm text-text-secondary p-3 rounded-lg bg-accent-soft/50">
                  <span className="block w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </Section>

          {/* Tech Stack */}
          <Section title="Technology Stack">
            <div className="space-y-4">
              {Object.entries(techByCategory).map(([category, items]) => (
                <div key={category}>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-2">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(t => (
                      <Badge key={t.name}>{t.name}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Architecture */}
          <Section title="Architecture">
            <p className="text-sm text-text-secondary leading-relaxed">{project.architecture}</p>
          </Section>

          {/* Engineering Challenges */}
          <Section title="Engineering Challenges">
            <ul className="space-y-3">
              {project.challenges.map(c => (
                <li key={c} className="flex items-start gap-3 text-sm text-text-secondary">
                  <span className="block w-1 h-1 rounded-full bg-text-muted mt-2 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </Section>

          {/* Engineering Decisions */}
          <Section title="Key Engineering Decisions">
            <ul className="space-y-3">
              {project.engineeringDecisions.map(d => (
                <li key={d} className="flex items-start gap-3 text-sm text-text-secondary">
                  <span className="block w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </Section>

          {/* Lessons Learned */}
          {project.lessonsLearned.length > 0 && (
            <Section title="Lessons Learned">
              <ul className="space-y-3">
                {project.lessonsLearned.map(l => (
                  <li key={l} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="block w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Roadmap */}
          {project.roadmap.length > 0 && (
            <Section title="Roadmap">
              <div className="space-y-3">
                {project.roadmap.map(r => (
                  <div key={r.title} className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColor(r.status)}`}>{r.status}</span>
                    {r.title}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium glass hover:bg-white/10 dark:hover:bg-white/8 text-text-secondary hover:text-text transition-all"
                style={{ transitionDuration: `${DURATION.hover}s` }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg>
                Source code
              </a>
            )}
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-white hover:brightness-110 shadow-soft transition-all"
                style={{ transitionDuration: `${DURATION.hover}s` }}
              >
                <ExternalLink size={14} />
                Live demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: EASE.out }}
    >
      {title && <h2 className="text-xs font-medium text-text-muted mb-4 uppercase tracking-wider">{title}</h2>}
      {children}
    </motion.div>
  );
}

function statusColor(s: string) {
  if (s === 'completed') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (s === 'planned') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
}
