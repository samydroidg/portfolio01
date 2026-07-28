import { useJson } from './useJson';
import type { ProjectData } from '../types/projects';

export function useProjects() {
  const { data, loading, error, retry } = useJson<ProjectData[]>('/projects.json', 'projects');
  return { projects: data ?? [], loading, error, retry };
}
