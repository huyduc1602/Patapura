import { linearColors } from '@/constants/colors';
import React from 'react';
import { ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styled';

interface Props {
  children: JSX.Element | JSX.Element[];
  color?: string[];
  style: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
  useAngle?: boolean;
  angleCenter?: { x: number; y: number };
  angle?: number;
}

const PALinear = ({ children, color, style, locations, start, end, ...rest }: Props) => {
  return (
    <React.Fragment>
      <LinearGradient
        style={[styles.container, style]}
        start={start ?? { x: 0, y: 0 }}
        end={end ?? { x: 1, y: 0 }}
        colors={color ?? linearColors.default}
        locations={locations ?? [0.1, 1]}
        {...rest}
      >
        {children}
      </LinearGradient>
    </React.Fragment>
  );
};

export default React.memo(PALinear);
