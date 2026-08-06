import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, User, Code2, Briefcase, Mail, Command, BookOpen } from 'lucide-react';
import { DURATION, EASE } from '../../constants/animation';
import { getLenis } from '../../lib/lenis';

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: 'home', label: 'Go to Home', icon: <Home size={14} />, action: () => { scrollTo('hero'); onClose(); } },
    { id: 'work', label: 'Go to Work', icon: <Briefcase size={14} />, action: () => { scrollTo('work'); onClose(); } },
    { id: 'about', label: 'Go to About', icon: <User size={14} />, action: () => { scrollTo('about'); onClose(); } },
    { id: 'skills', label: 'Go to Skills', icon: <Code2 size={14} />, action: () => { scrollTo('skills'); onClose(); } },
    { id: 'journey', label: 'Go to Journey', icon: <BookOpen size={14} />, action: () => { scrollTo('journey'); onClose(); } },
    { id: 'contact', label: 'Go to Contact', icon: <Mail size={14} />, action: () => { scrollTo('contact'); onClose(); } },
    { id: 'github', label: 'Open GitHub', icon: <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" /></svg>, action: () => { window.open('https://github.com', '_blank'); onClose(); } },
  ];

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelected(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    const root = document.documentElement;
    const body = document.body;
    const prevRootOverflow = root.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    lenis?.stop();
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      root.style.overflow = prevRootOverflow;
      body.style.overflow = prevBodyOverflow;
      lenis?.start();
    };
  }, [open]);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) { filtered[selected].action(); }
  }, [filtered, selected]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.micro, ease: EASE.inOut }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <motion.div
            className="relative w-full max-w-lg glass-strong shadow-elevated rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: DURATION.modal, ease: EASE.out }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={14} className="text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0); }}
                onKeyDown={handleKey}
                placeholder="Type a command..."
                className="flex-1 bg-transparent outline-none text-sm text-text placeholder:text-text-muted"
              />
              <kbd className="text-xs text-text-muted bg-accent-soft px-1.5 py-0.5 rounded">ESC</kbd>
            </div>
            <div data-lenis-prevent className="p-2 max-h-60 overflow-y-auto overscroll-contain">
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    i === selected ? 'bg-accent-soft text-text' : 'text-text-muted hover:text-text hover:bg-accent-soft/50'
                  }`}
                  style={{ transitionDuration: `${DURATION.hover}s` }}
                >
                  <span className="text-text-muted">{cmd.icon}</span>
                  {cmd.label}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-text-muted text-center py-8">No results</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
