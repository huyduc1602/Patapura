import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Button, StyleSheet } from 'react-native';
import { MainTemplate } from '@/components/templates';
import { styles } from './styled';
import { PALoading } from '@/components/atoms';
import { LessonPlayer } from '@/components/molecules';
import useRequest from '@/hooks/useRequest';
import { BASE_API_URL, EndPoint, TOKEN_SECRET } from '@/constants/endpoint';
import { PAText, PAIconLabel } from '@/components/atoms';
import { Audio, ResizeMode, Video } from 'expo-av';
import { useAuth } from '@/hooks/useAuth';
import { useAxios } from '@/hooks/useAxios';
import { WebviewRouteEnum, SecureStoreEnum, CacheDataKeyEnum } from '@/constants/enums';
import { WEBVIEW_SCREEN } from '@/navigation/config/routes';
import { navigate } from '@/navigation/NavigationService';
import storage from '@/utils/storage';

const BASE_URL = BASE_API_URL;
interface Record {
  sheet_id: number;
  row_id: number;
  record_id: number;
  record_date: string;
}

const LESSON_ID = 1;
const demo_API = `${BASE_URL}/api/application/test-range?file=lesson03.mp3`;
const Lesson03 = `${BASE_URL}/protected/account/load?type=lesson&file=lesson03.mp3`;
const EXTERNAL_URL = 'https://filesamples.com/samples/audio/mp3/sample4.mp3';

const DebugScreen = () => {
  const { authState, logout, saveToken } = useAuth();
  const { authAxios, updateError }: any = useAxios();

  const { _lessonDetailExecute, _lessonDetailApiData, _lessonDetailLoading } = useRequest({
    url: EndPoint.LESSON_DETAIL,
    method: 'GET',
    key: 'lessonDetail',
  });

  const _lesson = useMemo(() => _lessonDetailApiData?.lesson, [_lessonDetailApiData?.lesson]);
  const _audio = useMemo(() => _lessonDetailApiData?.audio, [_lessonDetailApiData?.audio]);

  const [defaultEmail, setDefaultEmailState] = useState<string | null>('');

  storage.getSecureItem(SecureStoreEnum.AUTH_LOGIN_EMAIL).then(setDefaultEmailState);

  const onGetLesson = useCallback(() => {
    if (_lessonDetailExecute) _lessonDetailExecute({ params: { lesson_id: LESSON_ID } });
  }, [_lessonDetailExecute]);

  const onGetLesson2 = useCallback(() => {
    if (_lessonDetailExecute) _lessonDetailExecute({ params: { lesson_id: LESSON_ID } });
    if (_lessonDetailExecute) _lessonDetailExecute({ params: { lesson_id: LESSON_ID } });
  }, [_lessonDetailExecute]);

  useEffect(() => {
    if (!LESSON_ID) return;
    onGetLesson();
  }, []);

  useEffect(() => {
    console.log('authState updated', authState);
  }, [authState]);

  const sound = React.useRef<Audio.Sound | null>();
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const playSound = useCallback(async (url: string) => {
    console.log('Loading Sound');
    setIsLoading(true);
    try {
      const { sound: _sound } = await Audio.Sound.createAsync({
        uri: url,
        headers: {
          Authorization: `Bearer ${authState?.token}`,
          'X-Request-Token': TOKEN_SECRET,
        },
      });
      sound.current = _sound;

      console.log('Playing Sound');
      sound.current?.playAsync();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    return sound.current
      ? () => {
          console.log('Unloading Sound');
          sound.current?.unloadAsync();
        }
      : undefined;
  }, []);

  React.useEffect(() => {
    Audio.requestPermissionsAsync();
    void Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
  }, []);

  const stopSound = useCallback(async () => {
    if (sound.current) {
      console.log('Unloading Sound');
      await sound.current?.pauseAsync();
    }
  }, [sound]);

  const refreshToken = useCallback(() => {
    console.log('trying to refresh token', `${EndPoint.REFRESH_TOKEN}?token=${authState?.refreshToken}`);

    return authAxios
      .post(`${EndPoint.REFRESH_TOKEN}?token=${authState?.refreshToken}`)
      .then(async (rsp: any) => {
        console.log(rsp?.data);

        const _token = rsp?.data?.token;

        if (_token?.access) {
          saveToken(_token?.access ?? 'invalid', _token?.refresh);
        } else {
          logout();
        }

        return Promise.resolve();
      })
      .catch((e: any) => {
        // authContext.logout();

        console.log('[refreshAuthLogic]--->', e);
      });
  }, [authState]);

  const brokeToken = useCallback(() => {
    saveToken(authState.token + 'a', authState.refreshToken!);
  }, [authState]);

  const resetWalkThrough = useCallback(() => {
    storage.removeItem(CacheDataKeyEnum.WALK_THROUGH_IGNORE);
  }, []);

  const renderLessonInfo = useCallback(() => {
    if (!_lesson) return null;

    return (
      <>
        <PAText>TOKEN: </PAText>
        <PAText>{authState?.token}</PAText>
        <PAText style={{ marginTop: 30 }}>REFRESH_TOKEN: </PAText>
        <PAText>{authState?.refreshToken}</PAText>

        <PAText>email: </PAText>
        <PAText>{defaultEmail}</PAText>

        <Button title="token refresh" onPress={refreshToken} />

        <Button title="tokenを壊す" onPress={brokeToken} />

        <Button title="ウォークスルーのリセット" onPress={resetWalkThrough} />

        <Button title="lesson取得" onPress={onGetLesson} />
        <Button title="lesson取得(2回実行)" onPress={onGetLesson2} />
        <Button title="webviewへ遷移" onPress={() => navigate(WEBVIEW_SCREEN, { url: WebviewRouteEnum.setting })} />

        <Button title="Lesson03再生" onPress={() => playSound(Lesson03)} />
        <Button title="外部の素材再生" onPress={() => playSound(EXTERNAL_URL)} />
        <Button title="test-range再生" onPress={() => playSound(demo_API)} />

        <Button title="停止" onPress={stopSound} />

        <PAText>Videoコンポネント</PAText>
        <Video
          ref={video}
          style={styles2.video}
          source={{
            uri: demo_API,
          }}
          useNativeControls
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          onError={(e) => {
            console.log(e);
          }}
          resizeMode={ResizeMode.CONTAIN}
        />

        <PAText>◆共通プレイヤー</PAText>
        <PAText
          style={styles.lessonTrackDuration}
        >{`【初回用レッスン音声（約${_lesson?.lesson_track_duration}分）】`}</PAText>
        {_lesson?.lesson_audio && (
          <LessonPlayer
            audioUrl={`${BASE_URL}/protected/account/load?type=lesson&file=${_lesson.lesson_audio}`}
            nextSeconds={_lesson?.rollplay_start1 ? _lesson?.rollplay_start1 : 0}
            skipDownloading={true}
          />
        )}

        <PAText>◆共通プレイヤー(ダウンロードオフ)</PAText>
        <PAText
          style={styles.lessonTrackDuration}
        >{`【初回用レッスン音声（約${_lesson?.lesson_track_duration}分）】`}</PAText>
        {_lesson?.lesson_audio && (
          <LessonPlayer
            audioUrl={`${BASE_URL}/protected/account/load?type=lesson&file=${_lesson.lesson_audio}`}
            nextSeconds={_lesson?.rollplay_start1 ? _lesson?.rollplay_start1 : 0}
            skipDownloading={true}
          />
        )}
        
        <PAText>{`◆共通プレイヤー(外部url)(ダウンロードオフ)`}</PAText>
        <LessonPlayer
          title={'外部テスト'}
          audioUrl={EXTERNAL_URL}
          playLabel="最初から再生"
          isCheckExists={false}
          skipDownloading
        />

        <PAText>{`◆共通プレイヤー(テストurl: '/api/application/test-range')(ダウンロードオフ)`}</PAText>
        <LessonPlayer
          audioUrl={`${BASE_URL}/api/application/test-range`}
          nextSeconds={_lesson?.rollplay_start1 ? _lesson?.rollplay_start1 : 0}
          skipDownloading={true}
        />
        
        <PAText>{`◆共通プレイヤー(HLSテスト: '/api/application/')(ダウンロードオフ)`}</PAText>
        <LessonPlayer
          audioUrl={`${BASE_URL}/protected/account/load-hls/lesson/Lesson01.mp3.m3u8`}
          skipDownloading={true}
        />
      </>
    );
  }, [
    _lesson,
    authState?.token,
    authState?.refreshToken,
    defaultEmail,
    refreshToken,
    brokeToken,
    onGetLesson,
    stopSound,
    playSound,
  ]);

  return (
    <MainTemplate title={'開発用画面'} isBack>
      <View style={styles.container}>
        <PALoading isLoading={_lessonDetailLoading || isLoading} />

        <ScrollView style={styles.wrapper} contentContainerStyle={{ paddingBottom: 100 }}>
          {renderLessonInfo()}
        </ScrollView>
      </View>
    </MainTemplate>
  );
};

export default React.memo(DebugScreen);

const styles2 = StyleSheet.create({ video: { width: '100%', height: 100 } });
