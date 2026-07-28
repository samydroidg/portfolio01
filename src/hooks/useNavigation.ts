import { useJson } from './useJson';
import type { NavItem } from '../types/navigation';

export function useNavigation() {
  const { data } = useJson<NavItem[]>('/navigation.json', 'navigation');
  return { nav: data ?? [] };
}
