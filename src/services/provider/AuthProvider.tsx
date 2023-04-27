import TrackPlayer, { Event } from 'react-native-track-player';
import { PALoading } from '@/components/atoms';
import { useAuth } from '@/hooks/useAuth';
import { useAxios } from '@/hooks/useAxios';
import React from 'react';

interface Props {
  children: JSX.Element;
}

const AuthProvider = ({ children }: Props) => {
  const { onRefresh } = useAxios();
  const { getToken, saveToken, resetToken } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const bootstrapAsync = async () => {
    setLoading(true);
    
    try {
      const data = await getToken();

      if (data?.token !== null) {
        saveToken(data.token, data.refreshToken!);
      } else {
        resetToken();
      }
    } catch (e) {
      console.log('GET SECURE ITEM ERORR', e);
    }

    setLoading(false);
  };
  
  const retryTrackPlayer = async () => {
    const accessToken = await onRefresh();
    const track = await TrackPlayer.getActiveTrack();
    const pos = (await TrackPlayer.getProgress()).position;
    
    // 本来はこのif文に引っかかる事は無いがlint対策
    if ( ! track || ! track.headers) {
      return;
    }
    
    track.headers.Authorization = `Bearer ${accessToken}`;
    
    await TrackPlayer.load(track);
    await TrackPlayer.seekTo(pos);
    await TrackPlayer.play();
  };
  
  React.useEffect(() => {
    const subsc = TrackPlayer.addEventListener(Event.PlaybackError, async (data) => {
      console.log('PlaybackError', data);
      
      // androidの場合、403でこのエラーが出る(iosは403でもエラーは出ないので対処不可)
      if (data.code === 'android-io-bad-http-status') {
        retryTrackPlayer();
      }
    });
    
    return () => {
      subsc.remove();
    };
  }, []);

  React.useEffect(() => {
    bootstrapAsync();
  }, []);

  return (
    <>
      <PALoading isLoading={loading} />
      {children}
    </>
  );
};

export default AuthProvider;
