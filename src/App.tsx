import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { useTheme } from './hooks/useTheme';
import { useReducedMotion } from './hooks/useMousePosition';
import { setLenis } from './lib/lenis';

import Navbar from './components/layout/Navbar';
import Background from './components/layout/Background';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/layout/ScrollProgress';
import CustomCursor from './components/layout/CustomCursor';
import LoadingScreen from './components/layout/LoadingScreen';
import SEOHead from './components/layout/SEOHead';
import ErrorBoundary from './components/layout/ErrorBoundary';
import ParticleField from './components/effects/ParticleField';

import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';

const CommandPalette = lazy(() => import('./components/ui/CommandPalette'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const { theme, mode, toggle } = useTheme();
  const reduced = useReducedMotion();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
    });
    setLenis(lenis);
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  useEffect(() => {
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(p => !p);
      }
      if (e.key === 'Escape') setPaletteOpen(false);

      if (e.key === konami[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konami.length) {
          konamiIndex = 0;
          document.documentElement.classList.toggle('secret');
          console.log('%c🎯 Easter egg unlocked!', 'font-size:20px; font-weight:bold; color:#6366f1;');
        }
      } else {
        konamiIndex = 0;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <div className={`${theme} min-h-screen bg-bg text-text transition-colors duration-300`}>
      <ScrollToTop />
      <SEOHead />
      <LoadingScreen />
      {isHome && <ScrollProgress />}
      <CustomCursor />
      <ParticleField />
      <Background />

      <div className="relative z-10">
        <Navbar
          mode={mode}
          onToggleTheme={toggle}
          onOpenPalette={() => setPaletteOpen(true)}
        />

        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>

        {isHome && <Footer />}
      </div>

      <Suspense fallback={null}>
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      </Suspense>
    </div>
  );
}
