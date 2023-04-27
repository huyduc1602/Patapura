import useOTAUpdates from '@/hooks/useOTAUpdates';
import Constants from 'expo-constants';
import { LogBox } from 'react-native';
import { navigationRef } from '@/navigation/NavigationService';
import Navigation from '@/navigation/screens/RootScreen';
import AuthProvider from '@/services/provider/AuthProvider';
import PlayerModalProvider from '@/services/provider/PlayerModalProvider';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import TrackPlayer from 'react-native-track-player';
import { StatusBar } from 'expo-status-bar';
import analytics from "@react-native-firebase/analytics";

export default function App() {
  useOTAUpdates();
  
  if ( ! Constants.expoConfig?.extra?.DEBUG_MODE) {
    console.log = () => {};
    LogBox.ignoreAllLogs();
  }
  
  const setupPlayer = async () => {
    // iosが遅すぎる問題への対処？
    await TrackPlayer.setupPlayer({
      maxCacheSize: 5000
    });
  };

  useEffect(() => {
    setupPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      try {
        TrackPlayer.reset();
      } catch (e) {
        console.log(e);
      }
    };
  }, []);

  return (
    <RecoilRoot>
      <StatusBar style="dark" />
      <AuthProvider>
        <>
          <NavigationContainer independent ref={navigationRef}>
            <Navigation />
          </NavigationContainer>
          <PlayerModalProvider />
        </>
      </AuthProvider>
    </RecoilRoot>
  );
}
