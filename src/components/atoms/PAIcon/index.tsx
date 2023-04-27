import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';
import OldAwesome from 'react-native-vector-icons/FontAwesome';
import Awesome from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors } from '@/constants/colors';
export interface IconProps {
  name:
    | 'list'
    | 'calendar'
    | 'calendarCheck'
    | 'checkSquare'
    | 'check'
    | 'infoCircle'
    | 'back'
    | 'exclamation'
    | 'play'
    | 'pause'
    | 'playBack'
    | 'playForward'
    | 'pen'
    | 'close'
    | 'rotateLeft'
    | 'caretright'
    | 'caretdown'
    | 'mic'
    | 'stop'
    | 'navPrev'
    | 'navNext'
    | 'star'
    | 'staro';
  size?: number;
  color?: string;
}

const PAIcon = ({ name, size = 24, color = colors.black }: IconProps) => {
  const _icons: any = React.useMemo(
    () => ({
      back: <IonIcons name={'chevron-back'} size={size} color={color} />,
      list: <IonIcons name={'list'} size={size} color={color} />,
      calendar: <Awesome name={'calendar-alt'} size={size} color={color} />,
      calendarCheck: <Awesome name={'calendar-check'} size={size} color={color} />,
      check: <Awesome name={'check'} size={size} color={color} />,
      checkSquare: <Awesome name={'check-square'} size={size} color={color} />,
      infoCircle: <Awesome name={'info-circle'} size={size} color={color} />,
      arrowLeft: <IonIcons name={'arrow-back-outline'} size={size} color={color} />,
      exclamation: <Awesome name={'exclamation-circle'} size={size} color={color} />,
      play: <IonIcons name={'play'} size={size} color={color} />,
      pause: <IonIcons name={'pause'} size={size} color={color} />,
      playBack: <IonIcons name={'play-back'} size={size} color={color} />,
      playForward: <IonIcons name={'play-forward'} size={size} color={color} />,
      pen: <Awesome name={'pen'} size={size} color={color} />,
      close: <IonIcons name={'close'} size={size} color={color} />,
      rotateLeft: <OldAwesome name={'rotate-left'} size={size} color={color} />,
      caretright: <AntDesign name={'caretright'} size={size} color={color} />,
      caretdown: <AntDesign name={'caretdown'} size={size} color={color} />,
      mic: <IonIcons name={'mic'} size={size} color={color} />,
      stop: <IonIcons name={'stop'} size={size} color={color} />,
      navPrev: <Awesome name={'chevron-circle-left'} size={size} color={color} />,
      navNext: <Awesome name={'chevron-circle-right'} size={size} color={color} />,
      star: <AntDesign name={'star'} size={size} color={color} />,
      staro: <AntDesign name={'staro'} size={size} color={color} />,
    }),
    [name, size, color],
  );

  return _icons[name];
};

export default React.memo(PAIcon);
