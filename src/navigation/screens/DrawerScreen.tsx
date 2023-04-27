import Constants from 'expo-constants';
import { useAxios } from '@/hooks/useAxios';
import { drawerData } from '@/services/drawerData';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React, { useCallback, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { LESSON_ROUTE, VERSION_INFO_SCREEN, WEBVIEW_SCREEN, LOCAL_NOTIFICATION_SCREEN } from '../config/routes';
import { drawerToggle } from '@/navigation/NavigationService';
import { useDrawerMenuState } from '@/hooks/useDrawerMenuState';

interface IDrawerData {
  id: number;
  icon?: string;
  name: string;
  url: string;
  isNavInApp?: boolean;
  isLogout?: boolean;
}

interface Props {
  state: any;
  navigation: any;
}

const DrawerContainer = ({ state, navigation }: Props) => {
  const { onLogout } = useAxios();
  const { checkIfUrlFocus, setWebviewUrl } = useDrawerMenuState();

  const _onDrawerItemPress = useCallback(
    (item: IDrawerData, _: number) => {
      setWebviewUrl('');

      if (item.isNavInApp) {
        navigation.navigate(item.url);
      } else if (item.isLogout) {
        onLogout();
      } else {
        setWebviewUrl(item.url);
        navigation.navigate(WEBVIEW_SCREEN, { url: item.url });
      }
    },
    [navigation, onLogout, setWebviewUrl],
  );

  return (
    <DrawerContentScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={styles.wrapper}
    >
      {drawerData.map((item: IDrawerData, index: number) => {
        // デバッグモードがoffであれば、開発者メニューを取り除く
        if (!Constants.expoConfig?.extra?.DEBUG_MODE) {
          if (item.url === 'Debug') {
            return;
          }
        }

        const routeName = state.routeNames[state.index];
        let focused = state.index === index;
        if (!item.isNavInApp && !item.isLogout) {
          focused = checkIfUrlFocus(item.url);
        } else if (item.url === VERSION_INFO_SCREEN) {
          focused = routeName === VERSION_INFO_SCREEN;
        } else if (item.url === LOCAL_NOTIFICATION_SCREEN) {
          focused = routeName === LOCAL_NOTIFICATION_SCREEN;
        } else if (item.url === LESSON_ROUTE.LESSON_LIST) {
          focused = routeName === LESSON_ROUTE.LESSON_LIST || routeName === LESSON_ROUTE.LESSON_DETAIL;
        }

        return (
          <DrawerItem
            key={item.id}
            label={item.name}
            focused={focused}
            onPress={() => _onDrawerItemPress(item, index)}
            style={styles.item}
          />
        );
      })}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 30,
  },
  item: {
    marginBottom: -5,
  },
});

export default DrawerContainer;
