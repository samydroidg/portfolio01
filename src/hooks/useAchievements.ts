import { useJson } from './useJson';
import type { AchievementItem } from '../types/achievements';

export function useAchievements() {
  const { data, loading, error, retry } = useJson<AchievementItem[]>('/achievements.json', 'achievements');
  return { achievements: data ?? [], loading, error, retry };
}
