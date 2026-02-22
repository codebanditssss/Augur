import { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from './usePortfolio';

interface UseRealtimePortfolioOptions {
  userId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useRealtimePortfolio(options: UseRealtimePortfolioOptions = {}) {
  const {
    userId,
    autoRefresh = true,
    refreshInterval = 5000
  } = options;

  // Use base portfolio hook for initial data and polling
  const portfolioData = usePortfolio();

  // State for real-time updates
  const [realtimeUpdates, setRealtimeUpdates] = useState<{
    lastUpdate: Date;
    type: 'balance' | 'position' | 'order' | null;
  }>({
    lastUpdate: new Date(),
    type: null
  });

  // Handle real-time updates (DISABLED: SSE removed in favor of optimized polling)
  /*
  const handleRealtimeEvent = useCallback((event: MessageEvent) => {
    ...
  }, [portfolioData]);

  useEffect(() => {
    ...
  }, [userId, handleRealtimeEvent]);
  */

  // No-op for backward compatibility
  useEffect(() => { }, []);

  return {
    ...portfolioData,
    realtimeUpdates
  };
} 