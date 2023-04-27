import { PAButton, PAIconLabel, PAText } from '@/components/atoms';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/colors';
import { TIME_JUMP, usePlayerModal } from '@/hooks/usePlayerModal';
import { formatTime } from '@/utils/timeHelper';

const PlayerModalProvider = () => {
  const { visible, title, restSeconds, isPlaying, onPlayJumbPosition, pause, play } = usePlayerModal();

  const onPressMainButton = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  if (!visible) return null;

  return (
    <View style={styles.wrapper}>
      <PAText style={styles.title}>{title || 'asdfasdf'}</PAText>
      {!!restSeconds && <PAText style={styles.title}>{`残り ${formatTime(restSeconds)}`}</PAText>}
      <View style={styles.row}>
        <PAButton
          style={[styles.playButton, styles.leftButton]}
          onPress={() => onPlayJumbPosition && onPlayJumbPosition('back', TIME_JUMP)}
        >
          <PAIconLabel name="playBack" label={`${TIME_JUMP}秒戻る`} />
        </PAButton>
        <PAButton style={[styles.playButton, styles.playButtonCenter]} onPress={onPressMainButton}>
          <PAIconLabel name={isPlaying ? 'pause' : 'play'} label={isPlaying ? `一時停止` : `再生`} />
        </PAButton>
        <PAButton
          style={[styles.playButton, styles.rightButton]}
          onPress={() => onPlayJumbPosition && onPlayJumbPosition('next', TIME_JUMP)}
        >
          <PAIconLabel name="playForward" label={`${TIME_JUMP}秒進む`} isRight />
        </PAButton>
      </View>
    </View>
  );
};

export default PlayerModalProvider;

const styles = StyleSheet.create({
  playButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
  },
  leftButton: {
    marginRight: 5,
  },
  rightButton: {
    marginLeft: 5,
  },
  playButtonCenter: {
    flex: 2,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#000000DD',
    padding: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
});
