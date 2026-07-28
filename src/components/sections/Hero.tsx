import { useState, useEffect } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useSocials } from '../../hooks/useSocials';
import { DURATION, EASE } from '../../constants/animation';

const titles = ['Product Engineer', 'Software Engineer', 'Full Stack Developer'];

function Typewriter() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = titles[index];
    let t: number;
    if (!deleting) {
      if (text.length < current.length) {
        t = window.setTimeout(() => setText(current.slice(0, text.length + 1)), 60);
      } else {
        t = window.setTimeout(() => setDeleting(true), 2200);
      }
    } else {
      if (text.length > 0) {
        t = window.setTimeout(() => setText(text.slice(0, -1)), 30);
      } else {
        setDeleting(false);
        setIndex(prev => (prev + 1) % titles.length);
      }
    }
    return () => clearTimeout(t);
  }, [text, deleting, index]);

  return <span>{text}<span className="animate-pulse">|</span></span>;
}

const floatingBadges = [
  { name: 'React', emoji: '⚛️', x: 75, y: 25, delay: 0 },
  { name: 'TypeScript', emoji: 'TS', x: 85, y: 55, delay: 0.3 },
  { name: 'Node.js', emoji: '🟢', x: 70, y: 75, delay: 0.6 },
  { name: 'PostgreSQL', emoji: '🐘', x: 12, y: 35, delay: 0.2 },
  { name: 'Python', emoji: '🐍', x: 10, y: 70, delay: 0.5 },
  { name: 'Electron', emoji: '⚡', x: 20, y: 85, delay: 0.7 },
];

export default function Hero() {
  const { data } = usePortfolio();
  const { socials } = useSocials();
  const person = data?.personal;

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION.sectionReveal * 0.8, ease: EASE.out, delay },
  });

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      <CursorGlow />

      <div className="section-container w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
            <motion.p {...fadeUp(0.05)} className="text-sm text-text-muted mb-4 font-medium">
              {person?.greeting}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: EASE.out, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.08] mb-4"
            >
              {person?.name}
              <br />
              <span className="text-text-muted"><Typewriter /></span>
            </motion.h1>

            <motion.p {...fadeUp(0.15)} className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
              {person?.bio}
            </motion.p>

            <motion.div {...fadeUp(0.2)} className="flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-white hover:brightness-110 shadow-soft hover:shadow-elevated transition-all"
                style={{ transitionDuration: `${DURATION.hover}s` }}
              >
                Explore my work
                <ArrowRight size={14} />
              </a>
              <a
                href={person?.resumeUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium glass hover:bg-white/10 dark:hover:bg-white/8 text-text-secondary hover:text-text transition-all"
                style={{ transitionDuration: `${DURATION.hover}s` }}
              >
                Resume
              </a>
            </motion.div>

            <motion.div {...fadeUp(0.25)} className="flex items-center gap-6 mt-10">
              {socials.filter(s => s.url).map(link => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-text transition-colors"
                  style={{ transitionDuration: `${DURATION.hover}s` }}
                >
                  {link.label}
                </a>
              ))}
              {socials.some(s => s.url) && <span className="text-text-muted/30">|</span>}
              <span className="text-sm text-text-muted">{person?.location || 'India'}</span>
            </motion.div>
          </div>

          <div className="hidden lg:flex justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE.out, delay: 0.3 }}
              className="relative w-72 h-72"
            >
              <div className="absolute inset-0 rounded-2xl glass-strong shadow-elevated overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-accent/10 via-accent/5 to-transparent flex items-center justify-center">
                  <span className="text-5xl font-medium text-text-muted/30">{person?.initials || 'GO'}</span>
                </div>
                <div className="absolute inset-0 rounded-2xl border border-accent-border" />
              </div>
              <div className="absolute -inset-4 rounded-3xl bg-accent/5 blur-3xl -z-10 animate-pulse-soft" />
            </motion.div>

            {floatingBadges.map((badge, i) => (
              <motion.div
                key={badge.name}
                className="absolute glass shadow-soft rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5"
                style={{ left: `${badge.x}%`, top: `${badge.y}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, y: [0, -3, 0] }}
                transition={{
                  opacity: { delay: 0.8 + badge.delay, duration: 0.4, ease: EASE.out },
                  scale: { delay: 0.8 + badge.delay, duration: 0.4, ease: EASE.out },
                  y: { duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: badge.delay },
                }}
              >
                <span>{badge.emoji}</span>
                <span className="text-text-muted">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <ArrowDown size={16} className="text-text-muted" />
      </div>
    </section>
  );
}

function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handle, { passive: true });
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none -z-10 opacity-[0.04] dark:opacity-[0.06]"
      style={{
        transform: `translate(${pos.x - 300}px, ${pos.y - 300}px)`,
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
      }}
    />
  );
}
