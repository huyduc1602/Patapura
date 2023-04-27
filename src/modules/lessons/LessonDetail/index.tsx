import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { ScrollView, View, Alert, Pressable, Linking, Platform, TextInput, Animated } from 'react-native';
import { MainTemplate } from '@/components/templates';
import { useRoute } from '@react-navigation/native';
import { navigate } from '@/navigation/NavigationService';
import { styles } from './styled';
import { PAIcon, PALoading } from '@/components/atoms';
import { LessonTitle, LessonPlayer, LessonRecords, Collapsible, LessonAudioRecording } from '@/components/molecules';
import useRequest from '@/hooks/useRequest';
import { useLesseonListState } from '@/hooks/useLesseonListState';
import { TOKEN_SECRET, BASE_API_URL, EndPoint } from '@/constants/endpoint';
import { PAText, PAIconLabel } from '@/components/atoms';
import { useAuth } from '@/hooks/useAuth';
import dayjs from 'dayjs';
import WebView from 'react-native-webview';
import { WebViewHttpErrorEvent } from 'react-native-webview/lib/WebViewTypes';
import { LESSON_ROUTE, WEBVIEW_SCREEN } from '@/navigation/config/routes';
import { colors } from '@/constants/colors';
import TrackPlayer from 'react-native-track-player';

const BASE_URL = BASE_API_URL;

const APP_KEY = 'patapura-app';

interface Record {
  sheet_id: number;
  row_id: number;
  record_id: number;
  record_date: string;
}

const LessonDetailScreen = () => {
  const { params }: any = useRoute();
  const [recorded, setRecorded] = useState(false);
  const { authState } = useAuth();
  const { setUpdateLesson } = useLesseonListState();

  const { _lessonDetailExecute, _lessonDetailApiData, _lessonDetailLoading } = useRequest({
    url: EndPoint.LESSON_DETAIL,
    method: 'GET',
    key: 'lessonDetail',
  });

  const { _createRecordExecute, _createRecordApiData, _createRecordLoading } = useRequest({
    url: EndPoint.CREATE_RECORD,
    key: 'createRecord',
  });

  const { _cancelRecordExecute, _cancelRecordApiData, _cancelRecordLoading } = useRequest({
    url: EndPoint.CANCEL_RECORD,
    key: 'cancelRecord',
  });

  const { _uploadRecordingExecute, _uploadRecordingApiData, _uploadRecordingLoading } = useRequest({
    url: EndPoint.UPLOAD_RECORDING,
    key: 'uploadRecording',
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  const { _bookmarkExecute, _bookmarkApiData, _bookmarkLoading } = useRequest({
    url: EndPoint.BOOKMARK,
    key: 'bookmark',
  });
  
  const { _memoExecute, _memoApiData, _memoLoading } = useRequest({
    url: EndPoint.MEMO,
    key: 'memo',
  });
  
  const _lesson = useMemo(() => {
    return _lessonDetailApiData?.lesson;
  }, [_lessonDetailApiData?.lesson?.lesson_id]);

  const { _audio, _audioCaches, _materials, _option, _tweet_url } = useMemo(() => {
    return {
      _audio: _lessonDetailApiData?.audio,
      _audioCaches: _lessonDetailApiData?.audio_caches,
      _tweet_url: _lessonDetailApiData?.tweet_url,
      _option: _lessonDetailApiData?.option,
      _materials: _lessonDetailApiData?.materials,
    };
  }, [_lessonDetailApiData]);
  

  const [recordingFileUri, setRecordingFileUri] = useState<string | null>();

  const onGetLesson = useCallback(() => {
    if (_lessonDetailExecute) {
      _lessonDetailExecute({ params: { lesson_id: params?.id } });
      
      // 更新時に再生は停止する
      TrackPlayer.pause().catch((error) => {
        console.error(error);
      });
    }
  }, [_lessonDetailExecute, params]);

  const onCreateRecord = useCallback(
    (date: Date) => {
      _createRecordExecute({ lesson_id: _lesson?.lesson_id, record_date: dayjs(date).format('YYYY-MM-DD') });
    },
    [_createRecordExecute, _lesson],
  );

  const onDeleteRecord = useCallback(
    (record: Record) => {
      return new Promise<void>((resolve, reject) => {
        Alert.alert('確認', 'レッスン記録を削除します。よろしいですか？', [
          {
            text: 'キャンセル',
            onPress: () => reject(),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              _cancelRecordExecute({ ...record, lesson_id: _lesson?.lesson_id });
              resolve();
            },
          },
        ]);
      });
    },
    [_cancelRecordExecute, _lesson],
  );
  
  const onStartRecording = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      if (recordingFileUri || _audio) {
        Alert.alert('確認', '前回の録音ファイルを上書きします。よろしいですか？', [
          {
            text: 'キャンセル',
            style: 'cancel',
            onPress: () => reject()
          },
          { text: 'OK', onPress: () => resolve() },
        ]);
      } else {
        resolve();
      }
    });
  }, [recordingFileUri, _audio]);

  const onStopRecording = useCallback(
    (fileUri: string) => {
      const uriParts = fileUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const bodyFormData = new FormData();
      bodyFormData.append('lesson_id', _lesson?.lesson_id);
      bodyFormData.append('audio', {
        uri: fileUri,
        name: `recording_${_lesson?.lesson_id}.${fileType}`,
        type: `audio/${fileType}`,
      } as unknown as Blob);
      _uploadRecordingExecute(bodyFormData);
      setRecordingFileUri(fileUri);
    },
    [_lesson?.lesson_id, _uploadRecordingExecute],
  );
  
  const _webviewRef = React.useRef<any>();
  const cardUrl = BASE_URL + '/api/application/timeline';
  const headers = useMemo(() => {
    return {
      'X-Request-Token': TOKEN_SECRET,
      'X-Request-App': APP_KEY,
      Authorization: `Bearer ${authState?.token}`
    };
  }, [authState?.token]);
  
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  const animatedSaveMessageStyle = {
    opacity: animatedValue
  };
  
  const onError = useCallback(
    async (e: WebViewHttpErrorEvent) => {
      if (e?.nativeEvent?.statusCode === 401) {
        console.log('permission denied.');
      }
    }, []
  );
  
  const twitterCard = useCallback(() => {
    return (
      <WebView
        key={`${cardUrl}`}
        ref={_webviewRef}
        style={styles.twitter}
        viewportContent={'width=device-width, user-scalable=no'}
        onHttpError={onError}
        startInLoadingState={true}
        sharedCookiesEnabled
        source={{
          uri: cardUrl,
          headers: {
            Accept: '*/*',
            ...headers,
          },
        }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
        injectedJavaScriptForMainFrameOnly={false}
        decelerationRate={1.2} // iosでのスクロールが遅すぎる問題の調整
      />
    );
  }, [headers]);
  
  const twitterCardReload = useCallback(() => {
    _webviewRef.current?.injectJavaScript(`
      App.onMessage({action: 'reload-card'});
    `);
  }, [_webviewRef.current]);

  useEffect(() => {
    if (!_createRecordApiData) {
      return;
    }

    if (!_createRecordApiData?.status) {
      Alert.alert(
        'メッセージ',
        '上限数を越えているため記録に失敗しました。\n設定ページから上限数の変更をお願いします。',
      );
      return;
    }

    Alert.alert('メッセージ', '記録完了しました', [{ text: 'OK', onPress: onGetLesson }]);
    setRecorded(true);
  }, [_createRecordApiData]);

  useEffect(() => {
    if (!_cancelRecordApiData) {
      return;
    }

    if (!_cancelRecordApiData?.status) {
      Alert.alert('メッセージ', '削除に失敗しました');
      return;
    }

    onGetLesson();
    Alert.alert('メッセージ', '取消しました');
  }, [_cancelRecordApiData]);

  useEffect(() => {
    if (!params?.id) return;
    onGetLesson();
  }, [params]);
  
  const onPressTweet = useCallback(() => {
    Linking.openURL(_tweet_url);
  }, [_tweet_url]);

  const onPressPrev = useCallback(() => {
    if (_materials[_lesson.lesson_id - 1]) {
      navigate(WEBVIEW_SCREEN, { url: `/lesson/material/${_materials[_lesson.lesson_id - 1].material_id}/` });
    } else {
      navigate(LESSON_ROUTE.LESSON_DETAIL, { id: _option?.page - 1 });
    }
  }, [_lesson?.lesson_id, _materials, _option?.page]);

  const onPressNext = useCallback(() => {
    if (_materials[_lesson.lesson_id]) {
      navigate(WEBVIEW_SCREEN, { url: `/lesson/material/${_materials[_lesson.lesson_id].material_id}/` });
    } else {
      navigate(LESSON_ROUTE.LESSON_DETAIL, { id: _option?.page + 1 });
    }
  }, [_lesson?.lesson_id, _materials, _option?.page]);

  const onPressList = useCallback(() => {
    navigate(LESSON_ROUTE.LESSON_LIST);
  }, []);
  
  const onPressOnePointLink = useCallback((url: string) => {
    const checkIfInternalLink = url.startsWith('/');
    if (checkIfInternalLink) {
      navigate(WEBVIEW_SCREEN, { url });
    } else {
      Linking.openURL(url);
    }
  }, []);
  
  const onPressBookmark = useCallback(async () => {
    // ここでブックマークデータを送信
    
    _lesson.bookmarked = ! _lesson.bookmarked;
    
    setUpdateLesson(_lesson);
    
    await _bookmarkExecute({
      lesson_id: _lesson?.lesson_id,
      bookmarked: _lesson.bookmarked,
      type: 'lesson'
    });
    
  }, [_lesson?.lesson_id, setUpdateLesson]);

  const onSaveMemo = useCallback(async (memo: string) => {
    _lesson.memo = memo;
    
    setUpdateLesson(_lesson);
    
    await _memoExecute({
      lesson_id: _lesson?.lesson_id,
      memo: memo,
      type: 'lesson'
    });
    
    console.log('save memo');
    
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start(() => Animated.timing(animatedValue, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true
    }).start());
  }, [_lesson?.lesson_id, setUpdateLesson]);

  const renderAndroidNotice = useCallback(() => {
    if (Platform.OS === 'ios') {
      return null;
    }

    return (
      <PAText style={styles.androidNotice}>
        Androidスマートフォンでアプリをご利用の際に、バックグラウンド再生中に途中で止まってしまう場合は、以下の端末の設定をお試しください。
        {'\n\n'}
        1．スマートフォンの設定アプリを開きます。{'\n'}
        2．「アプリ」から「すべてのアプリ」 をタップします。{'\n'}
        3．「パタプライングリッシュ」を選択し、「バッテリー」 をタップします。{'\n'}
        4．「バッテリー使用量の管理」で「制限なし」をタップします。{'\n\n'}
        参考：{' '}
        <PAText
          size={'small'}
          isLink
          onPress={() => Linking.openURL('https://support.google.com/pixelphone/answer/7015477?hl=ja')}
        >
          自動調整バッテリーと電池の最適化をオンにしておく
        </PAText>
        {'\n'}
        ※こちらの設定ではスマートフォンの電池の最適化を行っておりますので、設定を変更することで電池の減少量が大きくなってしまう可能性がございます。
      </PAText>
    );
  }, []);

  const renderNote = useCallback(() => {
    if (!_lesson?.one_point_advice_text1) return null;

    return (
      <View style={styles.noteWrapper}>
        <PAIconLabel name="pen" label="ワンポイントアドバイス" buttonStyle={styles.noteTitle} size={18} />
        <PAText>{_lesson?.one_point_advice_text1}</PAText>

        {_lesson?.one_point_advice_url1 && (
          <Pressable onPress={() => onPressOnePointLink(_lesson?.one_point_advice_url1)}>
            <PAText style={styles.onePointLink}>{_lesson.one_point_advice_text_link1}</PAText>
          </Pressable>
        )}

        {_lesson?.one_point_advice_url2 && (
          <Pressable onPress={() => onPressOnePointLink(_lesson?.one_point_advice_url2)}>
            <PAText style={styles.onePointLink}>{_lesson.one_point_advice_text_link2}</PAText>
          </Pressable>
        )}
      </View>
    );
  }, [
    _lesson?.one_point_advice_text1,
    _lesson?.one_point_advice_text_link1,
    _lesson?.one_point_advice_text_link2,
    _lesson?.one_point_advice_url1,
    _lesson?.one_point_advice_url2,
    onPressOnePointLink,
  ]);

  const _renderHiddenText2 = useCallback(() => {
    return (
      <Collapsible title="音声の書き起こしテキスト">
        <PAText>{_lesson?.hidden_test2}</PAText>
        {_lesson?.rollplay_text2 && <PAText style={styles.hiddenText}>{_lesson?.rollplay_text2}</PAText>}
      </Collapsible>
    );
  }, [_lesson]);

  const renderHiddenText = useCallback(() => {
    return (
      <Collapsible title="音声の書き起こしテキスト">
        <PAText>{_lesson?.hidden_test1}</PAText>
        {_lesson?.rollplay_text1 && <PAText style={styles.hiddenText}>{_lesson?.rollplay_text1}</PAText>}
        {_lesson?.hidden_test2 && _renderHiddenText2()}
      </Collapsible>
    );
  }, [_lesson, _renderHiddenText2]);

  const renderLessonInfo = useCallback(() => {
    if (!_lesson) return null;
    
    return (
      <>
        <LessonTitle bookmarked={!!_lesson?.bookmarked} onBookmark={onPressBookmark}>{_lesson?.title}</LessonTitle>
        <View style={[styles.noteWrapper, styles.viewBorder]}>
          <PAText>{_lesson?.body_title}</PAText>
        </View>
        <PAText>{_lesson?.body}</PAText>
        {renderAndroidNotice()}
        <PAText
          style={styles.lessonTrackDuration}
        >{`【初回用レッスン音声（約${_lesson?.lesson_track_duration}分）】`}</PAText>
        {_lesson?.lesson_audio && (
          <LessonPlayer
            title={`【初回用レッスン音声（約${_lesson?.lesson_track_duration}分）】`}
            backgroundTitle={_lesson?.title}
            audioUrl={`${BASE_URL}/protected/account/load-hls/lesson/${_lesson.lesson_audio}.m3u8`}
            nextSeconds={_lesson?.rollplay_start1 ? _lesson?.rollplay_start1 : 0}
            restartSeconds={_audioCaches['lesson'] ? _audioCaches['lesson']['current_time'] : 0}
            cachedDuration={_audioCaches['lesson'] ? _audioCaches['lesson']['duration'] : 0}
            skipDownloading
          />
        )}

        {renderHiddenText()}

        <LessonAudioRecording onStartRecording={onStartRecording} onStopRecording={onStopRecording} />
        {!!recordingFileUri && (
          <LessonPlayer
            key={recordingFileUri}
            title={'【レッスン録音】'}
            backgroundTitle={_lesson?.title}
            audioUrl={recordingFileUri}
            playLabel="最初から再生"
            skipDownloading
            shouldCloseModalWhenUnmount={false}
          />
        )}
        {!recordingFileUri && !!_audio && (
          <LessonPlayer
            title={'【レッスン録音】'}
            backgroundTitle={_lesson?.title}
            audioUrl={`${BASE_URL}/protected/account/load?type=account-record&subtype=lesson&lesson_id=${_lesson.lesson_id}`}
            playLabel="最初から再生"
            filePrefix="recording_"
            isCheckExists={false}
            skipDownloading
            shouldCloseModalWhenUnmount={false}
          />
        )}

        <PAText
          style={styles.lessonTrackDuration}
        >{`【復習用レッスン音声（約${_lesson?.download_audio_duration}分）】`}</PAText>
        {_lesson?.lesson_audio && (
          <LessonPlayer
            title={`【復習用レッスン音声（約${_lesson?.download_audio_duration}分）】`}
            backgroundTitle={_lesson?.title}
            audioUrl={`${BASE_URL}/protected/account/load-hls/lesson-review/${_lesson.lesson_audio}.m3u8`}
            filePrefix="review_"
            restartSeconds={_audioCaches['lesson-review'] ? _audioCaches['lesson-review']['current_time'] : 0}
            cachedDuration={_audioCaches['lesson-review'] ? _audioCaches['lesson-review']['duration'] : 0}
            skipDownloading
          />
        )}
      </>
    );
  }, [_lesson, onPressBookmark, renderAndroidNotice, _audioCaches, renderHiddenText, onStopRecording, recordingFileUri, _audio]);

  return (
    <MainTemplate isBack title={`レッスン${_lesson?.lesson_id || ''}`} hasMenu={false}>
      <View style={styles.container}>
        <PALoading
          isLoading={_lessonDetailLoading || _cancelRecordLoading || _createRecordLoading || _uploadRecordingLoading || _bookmarkLoading}
        />
        {!_lessonDetailLoading && (
          <ScrollView style={styles.wrapper} contentContainerStyle={{ paddingBottom: 100 }}>
            {renderLessonInfo()}
            {renderNote()}
            {!!_lessonDetailApiData && (
              <LessonRecords
                data={_lessonDetailApiData?.records}
                onCreateRecord={onCreateRecord}
                onDeleteRecord={onDeleteRecord}
                recorded={recorded}
                setRecorded={setRecorded}
              />
            )}
            
            <View style={styles.titleWrapper}>
              <PAText size="large" style={styles.title}>
                メモを残す
              </PAText>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput multiline numberOfLines={6} style={styles.input} maxLength={2000} defaultValue={_lesson?.memo} onEndEditing={(e) => onSaveMemo(e.nativeEvent.text)} placeholder={'自由にメモを入力することができます。（自動保存）'} />
              <Animated.View style={animatedSaveMessageStyle}>
                <PAText style={styles.inputSaveMessageText}>
                  <PAIcon name="check" color={colors.black} size={16} /> 保存しました
                </PAText>
              </Animated.View>
            </View>

            {!!_lessonDetailApiData && (
              // ref: androidでcrashする不具合のworkaround
              // https://github.com/react-native-webview/react-native-webview/issues/811#issuecomment-748611465
              <View renderToHardwareTextureAndroid={true}>
                <PAText size="large" weight="semibold" style={styles.twitterTitle}>
                  トレーニング完了をTwitterでシェアしよう
                </PAText>
                <Pressable style={styles.tweetButton} onPress={onPressTweet}>
                  <PAText weight="bold" style={styles.tweetButtonLabel}>
                    ツイートする
                  </PAText>
                </Pressable>
                
                {twitterCard()}

              </View>
            )}

            {!!_lessonDetailApiData && !!_option && (
              <View style={styles.navigationButtonContainer}>
                <Pressable style={styles.navigationButton} onPress={onPressPrev}>
                  {!!_materials[_lesson.lesson_id - 1] && (
                    <>
                      <PAIcon name="navPrev" color={colors.blue} size={16} />
                      <PAText style={styles.navigationButtonLabel}>前の番外編</PAText>
                    </>
                  )}
                  {!_materials[_lesson.lesson_id - 1] && _option.page > 1 && (
                    <>
                      <PAIcon name="navPrev" color={colors.blue} size={16} />
                      <PAText style={styles.navigationButtonLabel}>前レッスン</PAText>
                    </>
                  )}
                </Pressable>
                <Pressable style={styles.navigationButton} onPress={onPressList}>
                  <PAText style={styles.navigationButtonLabel}>{`レッスン一覧\n(${_option.count})`}</PAText>
                </Pressable>
                <Pressable style={styles.navigationButton} onPress={onPressNext}>
                  {!!_materials[_lesson.lesson_id] && (
                    <>
                      <PAText style={styles.navigationButtonLabel}>次の番外編</PAText>
                      <PAIcon name="navNext" color={colors.blue} size={16} />
                    </>
                  )}
                  {!_materials[_lesson.lesson_id] && _option.page < _option.last_page && (
                    <>
                      <PAText style={styles.navigationButtonLabel}>次レッスン</PAText>
                      <PAIcon name="navNext" color={colors.blue} size={16} />
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </MainTemplate>
  );
};

export default React.memo(LessonDetailScreen);
