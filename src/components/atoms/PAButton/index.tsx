import React from 'react';
import { Pressable, ViewStyle, TextStyle, PressableProps, ActivityIndicator } from 'react-native';
import styles from './styled';
import PAText from '../PAText';

interface Props extends PressableProps {
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  indicatorStyle?: ViewStyle;
  children?: JSX.Element | JSX.Element[] | string;
  isLoading?: boolean;
}

const PAButton = ({ style, textStyle, indicatorStyle, isLoading, children, ...rest }: Props) => {
  return (
    <Pressable style={({ pressed }) => [styles.wrapper, style, pressed && { opacity: 0.7 }]} hitSlop={10} {...rest}>
      {typeof children === 'string' ? (
        <PAText weight="bold" style={[styles.textStyle, textStyle]}>
          {children}
        </PAText>
      ) : (
        children
      )}

      {isLoading && <ActivityIndicator style={[styles.indicator, indicatorStyle]} />}
    </Pressable>
  );
};

export default React.memo(PAButton);
