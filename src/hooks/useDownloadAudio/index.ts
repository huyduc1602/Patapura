import { useCallback, useContext, useState } from 'react';
import { Alert, PermissionsAndroid, Platform, Rationale } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { TOKEN_SECRET } from '@/constants/endpoint';
import { useAuth } from '@/hooks/useAuth';


const _alert: Rationale = {
  title: 'ストレージ許可',
  message: 'レッスン録音ファイルをダウンロードするため、ストレージのアクセス許可を有効にする必要となります。',
  buttonPositive: 'OK',
};

interface Props {
  onSuccess: (path: string, position: number) => void;
  onError?: () => void;
}

const useDownloadAudio = ({ onSuccess, onError }: Props) => {
  const { authState } = useAuth()
  const [isLoading, setLoading] = useState(false);

  const _showError = useCallback(
    (message: string) =>
      Alert.alert('Error', message, [
        {
          text: 'OK',
          style: 'cancel',
          onPress: () => {
            if (onError) onError();
          },
        },
      ]),
    [onError],
  );

  const genFileName = useCallback((url: string, pathPrefix: string) => {
    const _splitText = pathPrefix === 'recording_' ? 'lesson_id=' : 'file=';
    const _name = url.split(_splitText)[1];
    const _extension = _name.split('.')[1] ? '' : '.mp3';
    return pathPrefix + _name + _extension;
  }, []);

  const _download = useCallback(
    ({ dir, url, millisecond, pathPrefix, isCheckExists }: any) => {
      const _filename = genFileName(url, pathPrefix);
      const _filepath = dir + '/' + _filename;

      const _execute = async() => {
        setLoading(true);

        const fileInfo = await FileSystem.getInfoAsync(_filepath);

        if (fileInfo.exists && isCheckExists) {
          onSuccess(_filepath, millisecond);
          setLoading(false);
          return;
        }

        const _downloadResumable = await FileSystem.createDownloadResumable(url, _filepath, {
          headers: {
              Accept: '*/*',
              'X-Request-Token': TOKEN_SECRET,
              Authorization: `Bearer ${authState.token}`,
            },
        });

        try {
          const result = await _downloadResumable.downloadAsync();
          
          if (result) {
            onSuccess(result.uri, millisecond);
          }
          setLoading(false);
        } catch (e) {
          console.error(e);
          _showError('音声ファイルのダウンロードに失敗しました。');
          setLoading(false);
        }
      };

      if (_filename && authState?.token) _execute();
    },
    [_showError, authState?.token, onSuccess],
  );

  const _onAndroidDownload = useCallback(
    async (url: string, millisecond: number, pathPrefix: string, isCheckExists: boolean) => {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, _alert);

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          _download({ dir: FileSystem.cacheDirectory, url, millisecond, pathPrefix, isCheckExists });

          return;
        }

        _showError('ファイルの保存に失敗しました。権限がありません。');
      } catch (err) {
        //To handle permission related issue
        console.warn(err);
      }
    },
    [_download],
  );

  const play = useCallback(
    (url: string, millisecond: number, pathPrefix: string, isCheckExists: boolean = true) => {
      if (!url) {
        _showError('音声のダウンロードに失敗しました。ファイルが指定されていません');

        return;
      }

      if (Platform.OS === 'ios') {
        _download({ dir: FileSystem.cacheDirectory, url, millisecond, pathPrefix, isCheckExists });

        return;
      }

      _onAndroidDownload(url, millisecond, pathPrefix, isCheckExists);
    },
    [_onAndroidDownload, _download],
  );

  return { isLoading, play };
};

export default useDownloadAudio;
