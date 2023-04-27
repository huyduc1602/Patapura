import { State } from 'react-native-track-player';
import { create } from 'zustand';

export type ProgressState = {
  position: number;
  duration: number;
  state: State;
};

type ProgressStateStore = {
  map: Record<string, ProgressState>;
  setProgress: (url: string, progress: {
    position: number;
    duration: number;
  }) => void;
  setPlaybackState: (url: string,  PlaybackState: State) => void;
};

export const useProgressStateStore = create<ProgressStateStore>((set) => ({
  map: {},
  setProgress: (url: string, progress: {
    position: number;
    duration: number;
  }) =>
    set((state) => {
      const { map } = state;
      const current = map[url] || { position: 0, duration: 0, state: State.None };
      map[url] = {...current, ...progress};
      return { map };
    }),
  setPlaybackState: (url: string, PlaybackState: State) =>
    set((state) => {
      const { map } = state;
      const current = map[url] || { position: 0, duration: 0, state: State.None };
      map[url] = {...current, state: PlaybackState};
      return { map };
    }),
  reset: () => set(() => ({ map: {} })),
}));
