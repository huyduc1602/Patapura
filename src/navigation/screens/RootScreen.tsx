import React, { useCallback, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MyPageScreen, WalkThroughScreen } from '@/modules/profile';
import VersionInfoScreen from '@/modules/versionInfo';
import navigationConfigs from '../config/options';
import storage from '@/utils/storage';
import { LessonDetailScreen, LessonListScreen } from '@/modules/lessons';
import DebugScreen from '@/modules/debug/Debug';
import LocalNotificationScreen from '@/modules/profile/LocalNotification';
import { CacheDataKeyEnum } from '@/constants/enums';
import { ForgotpassScreen, LoginScreen, SignUpScreen, TermsScreen } from '@/modules/authentication';
import {
  PROFILE_ROUTE,
  LESSON_ROUTE,
  AUTHENTICATE_ROUTE,
  DRAWER_ROUTE,
  WEBVIEW_SCREEN,
  VERSION_INFO_SCREEN,
  LOCAL_NOTIFICATION_SCREEN
} from '../config/routes';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContainer from './DrawerScreen';
import WebViewScreen from './WebViewScreen';
import { useAuth } from '@/hooks/useAuth';

const MainStack: any = createNativeStackNavigator();
const Drawer: any = createDrawerNavigator();

const Navigation: React.FunctionComponent = () => {
  const { authState } = useAuth();
  const [walkThroughState, setWalkThroughState] = useState(false);

  storage.getItem(CacheDataKeyEnum.WALK_THROUGH_IGNORE).then(setWalkThroughState);

  const _myPageStack = useCallback(() => {
    return (
      <React.Fragment>
        <Drawer.Screen name={PROFILE_ROUTE.MY_PAGE} component={MyPageScreen} />
        <Drawer.Screen name={LESSON_ROUTE.LESSON_LIST} component={LessonListScreen} />
        <Drawer.Screen name={WEBVIEW_SCREEN} component={WebViewScreen} />
        <Drawer.Screen name={VERSION_INFO_SCREEN} component={VersionInfoScreen} />
        <Drawer.Screen name={PROFILE_ROUTE.WALK_THROUGH_PAGE} component={WalkThroughScreen} options={{ swipeEnabled: false }} />
      </React.Fragment>
    );
  }, []);

  const DrawerStack = useCallback(() => {
    return (
      <Drawer.Navigator
        drawerContent={(props: any) => <DrawerContainer {...props} />}
        initialRouteName={walkThroughState ? PROFILE_ROUTE.MY_PAGE : PROFILE_ROUTE.WALK_THROUGH_PAGE}
        screenOptions={{
          drawerPosition: 'right',
          headerShown: false,
        }}
      >
        {_myPageStack()}
      </Drawer.Navigator>
    );
  }, [walkThroughState]);
  
  if (!authState?.token || authState?.token === 'invalid') {
    return (
      <SafeAreaProvider>
        <MainStack.Navigator initialRouteName={AUTHENTICATE_ROUTE.LOGIN} screenOptions={navigationConfigs}>
          <MainStack.Screen name={AUTHENTICATE_ROUTE.LOGIN} component={LoginScreen} />
          <MainStack.Screen name={AUTHENTICATE_ROUTE.FORGOT_PASS} component={ForgotpassScreen} />
          <MainStack.Screen name={AUTHENTICATE_ROUTE.SIGN_UP} component={SignUpScreen} />
          <MainStack.Screen name={AUTHENTICATE_ROUTE.TERMS} component={TermsScreen} />
        </MainStack.Navigator>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <MainStack.Navigator initialRouteName={DRAWER_ROUTE.DRAWER_STACK} screenOptions={navigationConfigs}>
        <MainStack.Screen name={DRAWER_ROUTE.DRAWER_STACK} component={DrawerStack} />
        <MainStack.Screen name={LESSON_ROUTE.LESSON_DETAIL} component={LessonDetailScreen} />
        <MainStack.Screen name={'Debug'} component={DebugScreen} />
        <MainStack.Screen name={LOCAL_NOTIFICATION_SCREEN} component={LocalNotificationScreen} />
      </MainStack.Navigator>
    </SafeAreaProvider>
  );
};

export default Navigation;
