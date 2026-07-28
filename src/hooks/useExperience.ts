import { useJson } from './useJson';
import type { ExperienceItem } from '../types/experience';

export function useExperience() {
  const { data, loading, error, retry } = useJson<ExperienceItem[]>('/experience.json', 'experience');
  return { experience: data ?? [], loading, error, retry };
}
