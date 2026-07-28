import { useJson } from './useJson';
import type { SocialItem } from '../types/socials';

export function useSocials() {
  const { data, loading } = useJson<SocialItem[]>('/socials.json', 'socials');
  return { socials: data ?? [] };
}
