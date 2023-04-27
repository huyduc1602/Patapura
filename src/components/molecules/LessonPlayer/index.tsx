import { PAButton, PAIconLabel, PALoading, PAText, PAIcon } from '@/components/atoms';
import { colors } from '@/constants/colors';
import { EndPoint, TOKEN_SECRET, BASE_API_URL } from '@/constants/endpoint';
import usePrevious from '@/hooks/usePrevious';
import useRequest from '@/hooks/useRequest';
import Slider from '@react-native-community/slider';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import styles from './styled';
import { TIME_JUMP, usePlayerModal } from '@/hooks/usePlayerModal';
import { useAuth } from '@/hooks/useAuth';
import TrackPlayer, { TrackType, State, AppKilledPlaybackBehavior, Capability } from 'react-native-track-player';
import { useTrackProgress } from '@/hooks/useTrackProgress';
import { formatTime } from '@/utils/timeHelper';
import { useNavigation } from '@react-navigation/native';
import { useProgressStateStore } from '@/services/progressStateStore';

const BASE_URL = BASE_API_URL;

const { setProgress } = useProgressStateStore.getState();

interface Props {
  title?: string;
  backgroundTitle?: string;
  audioUrl: string;
  nextSeconds?: number;
  restartSeconds?: number;
  cachedDuration?: number;
  filePrefix?: string;
  skipDownloading?: boolean;
  playLabel?: string;
  isCheckExists?: boolean;
  shouldCloseModalWhenUnmount?: boolean;
}

const LessonPlayer = ({
  title,
  backgroundTitle = '',
  audioUrl,
  nextSeconds,
  restartSeconds,
  cachedDuration,
  filePrefix = '',
  skipDownloading,
  playLabel = 'レッスンを最初から再生',
  isCheckExists = true,
  shouldCloseModalWhenUnmount = true,
  ...rest
}: Props) => {
  const { authState } = useAuth();
  const navigation = useNavigation();
  const { openModal, closeModal, url: modalDisplayingAudioUrl } = usePlayerModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 再生中のtrackが自身のものかどうか
  const isMyTrack = useRef(false);
  const { position, duration, state: playerState } = useTrackProgress(audioUrl);

  const isPlaying = isMyTrack.current && (playerState === State.Playing);

  useEffect(() => {
    isMyTrack.current = modalDisplayingAudioUrl === audioUrl;
  }, [audioUrl, modalDisplayingAudioUrl]);

  const { _audioExecute } = useRequest({
    url: EndPoint.UPDATE_AUDIO_CACHE,
    key: 'audio',
  });
  const queries = useMemo(() => {
    const res: {
      [key: string]: any;
    } = {};

    const tmp = audioUrl.match(/\/protected\/account\/load-hls\/([\w\-]+)\/([\w\-\.]+?).m3u8$/i);

    if (tmp && tmp[1] && tmp[2]) {
      res.type = tmp[1];
      res.file = tmp[2];
    } else {
      audioUrl.replace(/^.+\?/, '').replace(/(\w+)=([^&]+)&?/g, ($0, $1, $2) => {
        res[$1] = $2;

        return '';
      });
    }

    return res;
  }, [audioUrl]);


  const pause = useCallback(async () => {
    TrackPlayer.pause();
  }, []);

  const onSoundInitialization = useCallback(
    async (filePath: string, positionMillis = 0) => {
      console.log('loading...', filePath);
      setIsLoading(true);

      const tmp = audioUrl.match(/\.(\w+)$/);
      const ext = tmp && tmp[1];

      const track = {
        url: audioUrl,
        type: ext === 'm3u8' ? TrackType.HLS : TrackType.Default,
        headers: {
          Accept: '*/*',
          'X-Request-Token': TOKEN_SECRET,
          Authorization: `Bearer ${authState.token}`,
        },
        title: backgroundTitle || title || 'レッスン音声',
        artist: 'パタプラ',
        artwork: BASE_URL + '/st/img/patapura-logo.png',
      };

      await TrackPlayer.load(track);
      await TrackPlayer.seekTo(positionMillis);
      await TrackPlayer.play();

      setIsLoading(false);

      openModal({
        title: title || 'レッスン音声',
        url: audioUrl,
      });
    },
    [audioUrl, authState.token, backgroundTitle, title, openModal],
  );

  const onPlaySound = useCallback(
    async (playingPosition = 0) => {
      if (!isMyTrack.current) {
        await TrackPlayer.pause();
        // pause直後だと連続再生の時にstopのeventを取得できないので少し間をあける
        setTimeout(async () => {
          await onSoundInitialization(audioUrl, playingPosition);
          isMyTrack.current = true;
        }, 50);
        return;
      }

      TrackPlayer.seekTo(playingPosition);
      TrackPlayer.play();
    },
    [audioUrl, isMyTrack, onSoundInitialization],
  );

  const onSetPosition = useCallback(
    async (nextPosition: number) => {
      if (isPlaying) {
        TrackPlayer.seekTo(nextPosition);
      } else if (duration) {
        setProgress(audioUrl, {
          position: nextPosition,
          duration: duration,
        });
      }
    },
    [audioUrl, duration, isPlaying],
  );

  const onPlayJumbPosition = useCallback(
    async (type: 'back' | 'next') => {
      const newPosition = type == 'back' ? position - TIME_JUMP : position + TIME_JUMP;
      onPlaySound(newPosition);
    },
    [onPlaySound, position],
  );

  const savePlayPositionServer = useCallback(async () => {
    if (position >= 1 && queries['type'] && queries['file']) {
      console.log('save position', Math.round(position), audioUrl);

      _audioExecute({
        type: queries['type'],
        file: queries['file'],
        duration: duration ? Math.round(duration) : 0,
        current_time: position ? Math.round(position) : 0,
      });
    }
  }, [position, queries, audioUrl, _audioExecute, duration]);



  // 古い値を保存し、再生が終了した場合に処理
  const prevIsPlaying = usePrevious<boolean>(isPlaying);
  useEffect(() => {
    if (prevIsPlaying && !isPlaying) {
      savePlayPositionServer();
    }
  }, [isPlaying, prevIsPlaying]);

  useEffect(() => {
    TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [Capability.JumpBackward, Capability.JumpForward, Capability.Pause, Capability.Play],
      forwardJumpInterval: TIME_JUMP,
      backwardJumpInterval: TIME_JUMP,
      progressUpdateEventInterval: 1,
    });

    if (restartSeconds && cachedDuration) {
      setProgress(audioUrl, {
        position: restartSeconds,
        duration: cachedDuration || 0,
      });
    }

    // 終了時処理
    return () => {
      if (shouldCloseModalWhenUnmount) {
        TrackPlayer.reset();
        closeModal();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

   useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (Math.round(position) !== restartSeconds) {
        savePlayPositionServer();
      }
    });

    return unsubscribe;
  }, [navigation, position, restartSeconds, savePlayPositionServer]);

  const renderAudioSlider = useCallback(() => {
    return (
      <View style={styles.sliderContainer}>
        <PAIconLabel
          name={isPlaying ? 'pause' : 'play'}
          label=""
          onPress={() => (isPlaying ? pause() : onPlaySound(position))}
          size={18}
        />
        <PAText size="xs" style={styles.time}>
          {position ? formatTime(position) : '00:00'}
        </PAText>
        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 1}
            value={position || 0}
            onSlidingComplete={(value) => onSetPosition(value)}
            minimumTrackTintColor={colors.black}
            maximumTrackTintColor={colors.gray}
          />
        </View>
        <PAText size="xs" style={styles.time}>
          {duration ? formatTime(duration) : '00:00'}
        </PAText>
      </View>
    );
  }, [isPlaying, position, duration, pause, onPlaySound, onSetPosition]);

  return (
    <View style={styles.wrapper} {...rest}>
      <PALoading isLoading={isLoading || (isMyTrack.current && playerState === State.Buffering)} />

      {renderAudioSlider()}
      <PAButton style={[styles.playButton, styles.mainPlayButton]} onPress={() => onPlaySound(0)}>
        <PAIconLabel name="rotateLeft" label={playLabel} />
      </PAButton>

      {!!restartSeconds && (
        <PAButton style={[styles.playButton, styles.subPlayButton]} onPress={() => onPlaySound(restartSeconds)}>
          <View style={styles.replayContainer}>
            <View style={styles.replayIcon}>
              <PAIcon name="play" size={18} color={colors.black} />
            </View>
            <View style={styles.replayIcon}>
              <PAIcon name="pause" size={18} color={colors.black} />
            </View>
            <PAText style={styles.replayTextStyle}>レッスンを続きから再生</PAText>
          </View>
        </PAButton>
      )}
      {!!nextSeconds && (
        <PAButton style={styles.playButton} onPress={() => onPlaySound(nextSeconds)}>
          <View style={styles.alignCenter}>
            <PAIconLabel name="play" label="ロールプレイ部分を再生" />
            <PAText size="xxs">※ 再生環境により開始箇所が前後する可能性があります</PAText>
          </View>
        </PAButton>
      )}
      <View style={styles.row}>
        <PAButton
          style={[styles.playButton, styles.subPlayButton, styles.leftButton]}
          onPress={() => onPlayJumbPosition('back')}
        >
          <PAIconLabel name="playBack" label={`${TIME_JUMP}秒戻る`} />
        </PAButton>
        <PAButton
          style={[styles.playButton, styles.subPlayButton, styles.rightButton]}
          onPress={() => onPlayJumbPosition('next')}
        >
          <PAIconLabel name="playForward" label={`${TIME_JUMP}秒進む`} isRight />
        </PAButton>
      </View>
    </View>
  );
};

export default LessonPlayer;
