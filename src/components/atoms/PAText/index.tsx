/* eslint-disable react-native/no-unused-styles */
import React, { memo } from 'react';
import { StyleSheet, TextProps, Text } from 'react-native';

import styles from './styled';

interface Props extends TextProps {
  children: string | string[] | any;
  size?: 'xxs' | 'xs' | 'small' | 'default' | 'large' | 'xl' | 'xxl' | 'xxxl';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: string;
  isLink?: boolean;
  isColorInversion?: boolean;
}

const baseLineHeight = 1.4;
const wideLineHeight = 1.8;
const fontSize = StyleSheet.create({
  default: { fontSize: 14, lineHeight: 14 * wideLineHeight },
  large: { fontSize: 16, lineHeight: 16 * baseLineHeight  },
  small: { fontSize: 12, lineHeight: 12 * baseLineHeight  },
  xxs: { fontSize: 8, lineHeight: 8 * baseLineHeight  },
  xs: { fontSize: 10, lineHeight: 10 * baseLineHeight  },
  xl: { fontSize: 20, lineHeight: 20 * baseLineHeight  },
  xxl: { fontSize: 24, lineHeight: 24 * baseLineHeight  },
  xxxl: { fontSize: 34, lineHeight: 34 * baseLineHeight  },
});

const fontWeight = StyleSheet.create({
  regular: { fontWeight: 'normal' },
  medium: { fontWeight: '300' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: 'bold' },
});

const PAText = ({ weight = 'regular', isLink, isColorInversion, size = 'default', children, style, ...rest }: Props) => {
  const styleFontSize = React.useMemo(() => fontSize[size], [size]);
  const styleFontWeight = React.useMemo(() => fontWeight[weight], [weight]);

  return (
    <Text
      style={[isColorInversion ? styles.darkContainer : styles.container, styleFontSize, styleFontWeight, isLink && styles.link, style]}
      allowFontScaling={false}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default memo(PAText);
