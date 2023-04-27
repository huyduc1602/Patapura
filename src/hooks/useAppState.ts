import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface AppStateHookSettings {
  onChange?: (status: AppStateStatus) => void
  onForeground?: () => void
  onBackground?: () => void
}

export default function useAppState(settings: AppStateHookSettings) {
  const { onChange, onForeground, onBackground } = settings || {};
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    function handleAppStateChange(nextAppState: AppStateStatus) {
      if (nextAppState === 'active') {
        onForeground && isValidFunction(onForeground) && onForeground();
      } else if (
        appState === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        onBackground && isValidFunction(onBackground) && onBackground();
      }
      setAppState(nextAppState);
      onChange && isValidFunction(onChange) && onChange(nextAppState);
    }
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [onChange, onForeground, onBackground, appState]);

  return { appState };
}

// settings validation
function isValidFunction(func: any) {
  return func && typeof func === 'function';
}
