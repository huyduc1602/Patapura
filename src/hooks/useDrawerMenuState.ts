import { DrawerMenuAtom } from '@/services/recoil/drawerMenu';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';

export const useDrawerMenuState = () => {
  const [drawerState, setDrawerState] = useRecoilState(DrawerMenuAtom);

  const checkIfUrlFocus = useCallback(
    (itemUrl: string) => {
      if (!drawerState.webviewItemName) return false;

      return drawerState.webviewItemName.includes(itemUrl);
    },
    [drawerState.webviewItemName],
  );

  const setWebviewUrl = (url: string) => {
    setDrawerState({ webviewItemName: url });
  };

  return {
    setWebviewUrl,
    checkIfUrlFocus,
  };
};
