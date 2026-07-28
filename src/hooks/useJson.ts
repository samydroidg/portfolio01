import { useState, useEffect } from 'react';

interface UseJsonResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

const cache = new Map<string, unknown>();

export function useJson<T>(url: string, key: string): UseJsonResult<T> {
  const cached = cache.get(key) as T | undefined;
  const [data, setData] = useState<T | null>(cached ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load ${key}`);
        return r.json() as Promise<T>;
      })
      .then(json => {
        cache.set(key, json);
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => { if (!cached) load(); }, [url, key]);

  return { data, loading, error, retry: load };
}
