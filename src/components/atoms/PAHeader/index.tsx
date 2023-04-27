import PAButton from '@/components/atoms/PAButton';
import PAIcon from '@/components/atoms/PAIcon';
import PALogo from '@/components/atoms/PALogo';
import PAIconLabel from '@/components/atoms/PAIconLabel';

import { PROFILE_ROUTE } from '@/navigation/config/routes';
import { drawerToggle, goBack, navigate } from '@/navigation/NavigationService';
import React, { useCallback } from 'react';
import { Pressable, View, Text } from 'react-native';
import styles from './styled';

interface Props {
  title?: string;
  isBack?: boolean;
  isMyPage?: boolean;
  hasMenu?: boolean;
  needLogin?: boolean;
  onPressBack?: () => void;
}

const Header = ({ title = '', isBack, isMyPage, onPressBack, hasMenu = true, needLogin = true }: Props) => {
  
  return (
    <View style={[styles.shadow, styles.headerWrapper]}>
      {isBack ? (
        <View style={styles.row}>
          <Pressable
            onPress={() => {
              if (onPressBack) {
                onPressBack();
              } else {
                goBack();
              }
            }}
            style={styles.backIconWrapper}
            hitSlop={10}
          >
            <PAIcon name="back" />
          </Pressable>
          <View style={styles.title}><Text style={styles.titleText} numberOfLines={1} ellipsizeMode={'tail'}>{title}</Text></View>
        </View>
      ) : (
        <View style={styles.row}>
          <PALogo />
        </View>
      )}
      
      {needLogin && (
        <View style={styles.actionWrapper}>
          {isMyPage || hasMenu ? (
            <PAIconLabel
              style={styles.drawerStyle}
              name="list"
              direction="column"
              label="メニュー"
              textStyle={styles.labelStyle}
              onPress={() => drawerToggle()}
            />
          ) : null}
        </View>
      )}

      {/* shadowが上側にも漏れてしまうので、隠す用のviewをabsoluteで配置して無理やり隠す */}
      <View style={styles.dummyBg} />
    </View>
  );
};

export default Header;
