import { useTrackProgress } from '@/hooks/useTrackProgress';
import { playerModalAtom, initialState } from '@/services/recoil/playerModal';
import { useCallback } from 'react';
import TrackPlayer, { State } from 'react-native-track-player';
import { useRecoilState } from 'recoil';

export const TIME_JUMP = 5;

export const usePlayerModal = () => {
  const [playerModalState, setPlayerModalState] = useRecoilState(playerModalAtom);
  const { position, duration, state: playerState } = useTrackProgress(playerModalState.url);

  const closeModal = useCallback(() => {
    setPlayerModalState(initialState);
  }, [setPlayerModalState]);

  const openModal = useCallback(
    (params: { title?: string; url: string }) => {
      console.log('openModal', { params });
      setPlayerModalState({ visible: true, ...params });
    },
    [setPlayerModalState],
  );

  const updateAudioInfo = useCallback(
    (params: { url: string }) => {
      // 現在表示中のもの以外は操作不可
      if (params.url !== playerModalState.url) return;

      setPlayerModalState((playerModalState) => ({ ...playerModalState, ...params }));
    },
    [playerModalState.url, setPlayerModalState],
  );

  const restSeconds = duration && duration - position;
  const isPlaying = playerState === State.Playing;

  const onPlayJumbPosition = useCallback(async (type: 'back' | 'next', jump: number = TIME_JUMP) => {
    const { position } = await TrackPlayer.getProgress();
    const newPosition = type == 'back' ? position - jump : position + jump;
    TrackPlayer.seekTo(newPosition);
  }, []);

  
  return {
    ...playerModalState,
    setPlayerModalState,
    closeModal,
    openModal,
    updateAudioInfo,
    restSeconds,
    isPlaying,
    onPlayJumbPosition,
    pause: TrackPlayer.pause,
    play: TrackPlayer.play,
  };
};
