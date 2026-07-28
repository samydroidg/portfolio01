import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import { useReducedMotion } from '../../hooks/useMousePosition';
import { DURATION, EASE } from '../../constants/animation';
import type { ProjectData } from '../../types/projects';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  onClick: () => void;
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (reduced) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpotlight({ x, y, opacity: 1 });
    const tiltX = (y / rect.height - 0.5) * 4;
    const tiltY = (x / rect.width - 0.5) * -4;
    cardRef.current!.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  };

  const handleLeave = () => {
    if (reduced) return;
    setSpotlight({ x: 0, y: 0, opacity: 0 });
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
      cardRef.current.style.transition = `transform ${DURATION.hover}s cubic-bezier(0.16, 1, 0.3, 1)`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.cardReveal, delay: index * 0.06, ease: EASE.out }}
    >
      <Card className="p-0 h-full flex flex-col overflow-hidden group" hover onClick={onClick}>
        <div
          ref={cardRef}
          className="relative cursor-pointer"
          onMouseMove={handleMouse}
          onMouseLeave={handleLeave}
        >
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5">
            {project.coverImage ? (
              <img
                src={project.coverImage}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl font-medium text-text-muted/20">{project.name.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full glass text-text-muted font-medium">{project.category}</span>
              {project.status && (
                <span className="text-xs px-2.5 py-1 rounded-full glass text-text-muted">{project.status}</span>
              )}
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
              {project.techStack.slice(0, 3).map(t => (
                <span key={t.name} className="text-[10px] px-2 py-0.5 rounded-full bg-accent-soft text-accent border border-accent-border">{t.name}</span>
              ))}
              {project.techStack.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-soft text-accent border border-accent-border">+{project.techStack.length - 3}</span>
              )}
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-medium text-base mb-1.5">{project.name}</h3>
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4 flex-1">{project.overview}</p>
            <div className="flex items-center gap-1.5 text-xs text-accent font-medium">
              View details <ArrowRight size={12} />
            </div>
          </div>

          <div
            className="absolute inset-0 pointer-events-none transition-opacity rounded-xl"
            style={{
              opacity: spotlight.opacity,
              transitionDuration: `${DURATION.hover}s`,
              background: `radial-gradient(400px circle at ${spotlight.x}px ${spotlight.y}px, ${project.accentColor}15, transparent)`,
            }}
          />
          <div
            className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              transitionDuration: `${DURATION.hover}s`,
              boxShadow: `inset 0 0 0 1px ${project.accentColor}30`,
            }}
          />
        </div>
      </Card>
    </motion.div>
  );
}
