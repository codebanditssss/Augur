import { useState, useEffect, useCallback } from 'react';
import { useTradeHistory } from './useTradeHistory';

interface UseRealtimeTradeHistoryOptions {
  userId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  limit?: number;
  offset?: number;
  sortBy?: 'created_at' | 'updated_at' | 'filled_quantity' | 'price' | 'quantity';
  sortOrder?: 'asc' | 'desc';
}

export function useRealtimeTradeHistory(options: UseRealtimeTradeHistoryOptions = {}) {
  const {
    userId,
    autoRefresh = true,
    refreshInterval = 5000,
    limit = 50,
    offset = 0,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  // Use base trade history hook for initial data and polling
  const tradeHistoryData = useTradeHistory({
    limit,
    offset,
    sortBy,
    sortOrder
  });

  // State for real-time updates
  const [realtimeUpdates, setRealtimeUpdates] = useState<{
    lastUpdate: Date;
    type: 'trade' | null;
    tradeId?: string;
  }>({
    lastUpdate: new Date(),
    type: null
  });

  // Handle real-time updates (DISABLED: SSE removed in favor of optimized polling)
  /*
  const handleRealtimeEvent = useCallback((event: MessageEvent) => {
    ...
  }, [tradeHistoryData]);

  useEffect(() => {
    ...
  }, [userId, handleRealtimeEvent]);
  */

  // No-op for backward compatibility
  useEffect(() => { }, []);

  return {
    ...tradeHistoryData,
    realtimeUpdates
  };
} 