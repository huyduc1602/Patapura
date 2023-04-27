import TrackPlayer, { Event } from 'react-native-track-player';
import { useProgressStateStore } from '@/services/progressStateStore';

const {setProgress, setPlaybackState } = useProgressStateStore.getState();

export const PlaybackService = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.reset();
  });
  TrackPlayer.addEventListener(Event.RemoteJumpForward, async (interval) => {
    TrackPlayer.seekTo(await getNewPosition(interval.interval, 'forward'));
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (interval) => {
    TrackPlayer.seekTo(await getNewPosition(interval.interval, 'backward'));
  });
  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async ({ position, duration }: { position: number, duration: number }) => {
    const track = await TrackPlayer.getActiveTrack();
    track?.url && setProgress(track?.url.toString(), {position, duration});
  });
  TrackPlayer.addEventListener(Event.PlaybackState, async (state) => {
    const track = await TrackPlayer.getActiveTrack();
    track?.url && setPlaybackState(track?.url.toString(), state.state);
  });
};

async function getNewPosition(jumpInterval: number, jumpDirection: string) {
  const progress = await TrackPlayer.getProgress();
  const maxPosition = progress.duration;
  const currentPosition = progress.position;
  let newPosition = jumpDirection === 'forward' ? currentPosition + jumpInterval : currentPosition - jumpInterval;
  if (newPosition > maxPosition) newPosition = maxPosition;
  if (newPosition < 0) newPosition = 0;
  return newPosition;
}
