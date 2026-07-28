import { useMemo } from 'react';
import { useJson } from './useJson';
import type { SkillsData } from '../types/skills';

export function useSkills() {
  const { data, loading, error, retry } = useJson<SkillsData>('/skills.json', 'skills');
  const categories = useMemo(() => data?.categories ?? [], [data]);
  const items = useMemo(() => data?.items ?? [], [data]);
  const filtered = (category: string) =>
    category === 'all' ? items : items.filter(s => s.category === category);
  return { skills: items, categories, filtered, loading, error, retry };
}
