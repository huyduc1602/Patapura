import React, { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { PAButton, PAIconLabel, PAText } from '@/components/atoms';
import { Audio } from 'expo-av';
import styles from './styled';
import { colors } from '@/constants/colors';

interface Props {
  onStartRecording: () => Promise<void>;
  onStopRecording: (fileUri: string) => void;
}

const LessonAudioRecording = ({ onStartRecording, onStopRecording, ...rest }: Props) => {
  const [recordingStatus, setRecordingStatus] = useState<Audio.RecordingStatus>();
  const [durationTime, setDurationTime] = useState<number>(0);
  const [recording, setRecording] = React.useState<Audio.Recording>();

  const _isRecording = useMemo(() => recordingStatus?.canRecord && recordingStatus?.isRecording, [recordingStatus]);

  const startRecording = useCallback(async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      if (recording) {
        recording.setOnRecordingStatusUpdate(null);
        await recording?.stopAndUnloadAsync();
      }

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      newRecording.setOnRecordingStatusUpdate(setRecordingStatus);
      newRecording.setProgressUpdateInterval(100);

      await newRecording.startAsync();

      setRecording(newRecording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }, [recording]);

  const playSuccessSound = useCallback(async () => {
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(require('../../../assets/sounds/success.mp3'));
      await sound.playAsync();
      setTimeout(() => {
        sound.unloadAsync();
      }, 1000);
    } catch (error) {
      console.error('Failed to play complete se', error);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recordingStatus?.canRecord) return;

    await recording?.stopAndUnloadAsync();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording?.getURI();
    recording?.setOnRecordingStatusUpdate(null);
    setRecording(undefined);
    setRecordingStatus(undefined);
    if (uri) {
      onStopRecording(uri);
    }

    playSuccessSound();
  }, [onStopRecording, playSuccessSound, recording, recordingStatus?.canRecord]);

  const pauseRecording = useCallback(async () => {
    if (_isRecording) {
      const pauseStatus = await recording?.pauseAsync();
      setRecordingStatus(pauseStatus);
      return;
    }
    await recording?.startAsync();
  }, [_isRecording, recording]);

  const onPressStartRecording = useCallback(async () => {
    try {
      await onStartRecording();
      startRecording();
      
    } catch (e) {
      // canceled
    }
  }, [onStartRecording]);

  useEffect(() => {
    if (_isRecording) {
      setDurationTime(recordingStatus?.durationMillis || 0);
      return;
    }
  }, [recordingStatus]);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderRecordingStatus = useCallback(() => {
    if (!recordingStatus) return null;

    return (
      <View style={styles.statusWrapper}>
        <View
          style={[
            styles.statusLabelWrapper,
            {
              backgroundColor: _isRecording ? colors.red : colors.black,
            },
          ]}
        >
          <PAText style={styles.statusLabel}>{_isRecording ? '録音中' : '一時停止中'}</PAText>
        </View>
        <PAText>{durationTime ? onFormatTime(durationTime) : '00:00:00'}</PAText>
      </View>
    );
  }, [recordingStatus, _isRecording, durationTime]);

  return (
    <View style={styles.wrapper} {...rest}>
      <PAText size="large" style={styles.title}>
        【レッスン録音】
      </PAText>
      <PAText style={styles.description}>
        リズム、抑揚、発音がレッスン音声に近づけているか録音して確認しましょう。
      </PAText>
      <View style={styles.row}>
        <PAButton style={[styles.playButton, styles.leftButton]} onPress={onPressStartRecording}>
          <PAIconLabel name="mic" label={`録音開始`} />
        </PAButton>
        <PAButton style={[styles.playButton]} onPress={pauseRecording}>
          <PAIconLabel name="pause" label={`一時停止`} />
        </PAButton>
        <PAButton style={[styles.playButton, styles.rightButton]} onPress={stopRecording}>
          <PAIconLabel name="stop" label={`停止`} />
        </PAButton>
      </View>
      {renderRecordingStatus()}
    </View>
  );
};

const onFormatTime = (millis: number) => {
  const hours: number = Math.floor(millis / 3600000);
  const minutes: number = Math.floor((millis % 3600000) / 60000);
  const seconds: number = Math.round(((millis % 3600000) % 60000) / 1000);
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default LessonAudioRecording;
