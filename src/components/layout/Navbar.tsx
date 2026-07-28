import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Command, Monitor, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../../hooks/useNavigation';
import { DURATION, EASE } from '../../constants/animation';

interface NavbarProps {
  mode: 'dark' | 'light' | 'system';
  onToggleTheme: () => void;
  onOpenPalette?: () => void;
}

export default function Navbar({ mode, onToggleTheme, onOpenPalette }: NavbarProps) {
  const { nav } = useNavigation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 200 && y > lastScroll.current);
      lastScroll.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const ThemeIcon = mode === 'dark' ? Sun : mode === 'light' ? Monitor : Moon;
  const themeLabel = mode === 'dark' ? 'Light' : mode === 'light' ? 'System' : 'Dark';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled ? 'glass-strong shadow-soft' : ''}`}
        style={{ transitionDuration: '0.3s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <nav className="section-container">
          <div
            className="flex items-center justify-between transition-all"
            style={{ transitionDuration: '0.3s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', height: scrolled ? '56px' : '64px' }}
          >
            <Link to="/" className="text-sm font-medium tracking-tight text-text hover:opacity-70 transition-opacity" style={{ transitionDuration: `${DURATION.hover}s` }}>
              Gourav Ojha
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {nav.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm transition-colors text-text-muted hover:text-text"
                  style={{ transitionDuration: `${DURATION.hover}s` }}
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={onOpenPalette}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
                style={{ transitionDuration: `${DURATION.hover}s` }}
                aria-label="Open command palette"
              >
                <Command size={12} />
                <span>K</span>
              </button>
              <button
                onClick={onToggleTheme}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-text transition-all"
                style={{ transitionDuration: `${DURATION.hover}s` }}
                aria-label={`Switch to ${themeLabel} mode`}
                title={`${mode === 'dark' ? 'Switch to light' : mode === 'light' ? 'Switch to system' : 'Switch to dark'}`}
              >
                <ThemeIcon size={13} />
              </button>
            </div>

            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={onToggleTheme}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-text transition-colors"
                style={{ transitionDuration: `${DURATION.hover}s` }}
                aria-label={`Switch to ${themeLabel} mode`}
              >
                <ThemeIcon size={13} />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-text transition-colors"
                style={{ transitionDuration: `${DURATION.hover}s` }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.micro }}
          >
            <div className="absolute inset-0 bg-bg/95 backdrop-blur-xl" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-medium text-text-muted hover:text-text transition-colors"
                  style={{ transitionDuration: `${DURATION.hover}s` }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DURATION.sectionReveal * 0.6, ease: EASE.out, delay: i * 0.06 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.button
                onClick={onOpenPalette}
                className="flex items-center gap-2 text-sm text-text-muted mt-4 hover:text-text transition-colors"
                style={{ transitionDuration: `${DURATION.hover}s` }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.sectionReveal * 0.6, ease: EASE.out, delay: 0.4 }}
              >
                <Command size={14} />
                <span>Command palette</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
