import React from 'react';
import { Image, ImageStyle } from 'react-native';
import styles from './styled';

interface Props {
  count: number;
  style?: ImageStyle;
}

export default ({ count, style }: Props) => {
  const _imgSrc = React.useMemo(() => {
    if (!count) return require('@/assets/mypage/levels/level13.png');

    if (count <= 10) {
      return require('@/assets/mypage/levels/level1.png');
    } else if (count <= 30) {
      return require('@/assets/mypage/levels/level2.png');
    } else if (count <= 62) {
      return require('@/assets/mypage/levels/level3.png');
    } else if (count <= 119) {
      return require('@/assets/mypage/levels/level4.png');
    } else if (count <= 181) {
      return require('@/assets/mypage/levels/level5.png');
    } else if (count <= 243) {
      return require('@/assets/mypage/levels/level6.png');
    } else if (count <= 305) {
      return require('@/assets/mypage/levels/level7.png');
    } else if (count <= 367) {
      return require('@/assets/mypage/levels/level8.png');
    } else if (count <= 429) {
      return require('@/assets/mypage/levels/level9.png');
    } else if (count <= 491) {
      return require('@/assets/mypage/levels/level10.png');
    } else if (count <= 553) {
      return require('@/assets/mypage/levels/level11.png');
    } else if (count <= 614) {
      return require('@/assets/mypage/levels/level12.png');
    } else {
      return require('@/assets/mypage/levels/level13.png');
    }
  }, [count]);

  return <Image resizeMode="contain" style={[styles.container, style]} source={_imgSrc} />;
};
