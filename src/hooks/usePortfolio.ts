import { useJson } from './useJson';
import type { PortfolioData } from '../types/portfolio';

export function usePortfolio() {
  const result = useJson<PortfolioData>('/portfolio.json', 'portfolio');
  return { data: result.data, loading: result.loading, error: result.error, retry: result.retry };
}
