import { useRef, useCallback } from 'react';

import useAppState from '@/hooks/useAppState';

export interface Settings {
  refreshInterval?: number
  onRefresh?: () => void
  onForeground?: () => void
}

const DEFAULT_REFRESH_INTERVAL = 5 * 60 * 1000; // 5min

export default function useIntervalRefresh(settings: Settings) {
  const { onRefresh, onForeground } = settings || {};
  const lastRefresh = useRef(Date.now());
  const _onForeground = useCallback(() => {
    const now = Date.now();
    const refreshInterval = settings.refreshInterval || DEFAULT_REFRESH_INTERVAL;
    if (
      // Check that the last refresh happened long enough ago.
      lastRefresh.current + refreshInterval <
      now
    ) {
      onRefresh && onRefresh();
      lastRefresh.current = now;
    }

    onForeground && onForeground();
  }, [onForeground, onRefresh, settings.refreshInterval]);

  const { appState } = useAppState({ onForeground: _onForeground });

  return { appState };
}
