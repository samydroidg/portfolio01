import { useEffect, useState } from 'react';
import type { Config } from '../types/config';

const CACHE_KEY = 'portfolio-config';

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try { setConfig(JSON.parse(cached)); setLoading(false); return; }
      catch { /* ignore stale cache */ }
    }

    fetch('/config.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load config');
        return r.json() as Promise<Config>;
      })
      .then(data => {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { config, loading, error };
}
