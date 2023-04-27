import { useCallback } from 'react';
import { ProgressState, useProgressStateStore } from '@/services/progressStateStore';
import { State } from 'react-native-track-player';

export const useTrackProgress = (url: string | null | undefined): ProgressState => {
  return useProgressStateStore(useCallback(state => {
    return (url && state.map[url.toString()]) || {
      position: 0,
      duration: 0,
      state: State.None
    };
  }, [url]));
};
