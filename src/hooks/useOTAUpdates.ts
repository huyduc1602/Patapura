import { useRef, useCallback } from 'react';
import useAppState from '@/hooks/useAppState';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';


export default function useOTAUpdates() {
  const isCheckingOTAUpdate = useRef(false);
  const showedAlert = useRef(false);
  const cancelTime = useRef(0);

  const onConfirmed = useCallback(() => {
    showedAlert.current = false;
    
    Updates.reloadAsync();
  },[]);

  const showConfirmDialog = useCallback(() => {
    showedAlert.current = true;
    
    Alert.alert('アプリの更新', 'アプリの更新があります。再起動してください', [
      { text: "今は更新しない", onPress: () => { cancelTime.current = Date.now(); showedAlert.current = false; }, style: 'cancel' },
      { text: "再起動", onPress: onConfirmed, style: 'default' }
    ]);
  },[onConfirmed]);

  const checkOTAUpdates = useCallback(async () => {
    if (isCheckingOTAUpdate.current === true) {
      return;
    } else if (showedAlert.current) {
      return;
    } else if ((Date.now() - cancelTime.current) < 3600000 ) { // キャンセル後1時間は再度表示させない
      return;
    }

    isCheckingOTAUpdate.current = true;
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        showConfirmDialog();
      }
    } catch (e) {
      // ユーザーへの通知はなし。
      console.log(e);
    }
    isCheckingOTAUpdate.current = false;
  },[]);

  return useAppState({ onForeground: checkOTAUpdates });
}
