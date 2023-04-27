import * as React from 'react';
import { Image, View, ViewStyle, ImageStyle } from 'react-native';
import styles from './styled';

interface Props {
  wrapperStyle?: ViewStyle;
  style?: ImageStyle;
}

export default ({ wrapperStyle, style, ...rest }: Props) => (
  <View style={[styles.wrapper, wrapperStyle]}>
    <Image
      style={[styles.image, style]}
      {...rest}
      resizeMode={'contain'}
      source={require('@/assets/patapura_logo.png')}
    />
  </View>
);
