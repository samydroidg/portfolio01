import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';
type ThemeMode = Theme | 'system';

const STORAGE_KEY = 'theme-mode';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getStored(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'dark' || stored === 'light' || stored === 'system') return stored;
  } catch {}
  return 'system';
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.classList.toggle('light', theme === 'light');
  document.documentElement.style.colorScheme = theme;
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(getStored);
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = getStored();
    return stored === 'system' ? getSystemTheme() : stored;
  });

  const toggle = useCallback(() => {
    setMode(prev => {
      const next = prev === 'dark' ? 'light' : prev === 'light' ? 'system' : 'dark';
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    const resolved = mode === 'system' ? getSystemTheme() : mode;
    setTheme(resolved);
    applyTheme(resolved);
  }, [mode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => {
      if (mode === 'system') {
        const resolved = getSystemTheme();
        setTheme(resolved);
        applyTheme(resolved);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  return { theme, mode, toggle };
}
