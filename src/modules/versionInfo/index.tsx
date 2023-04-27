import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MainTemplate } from '@/components/templates';
import { styles } from './styled';
import { PAText } from '@/components/atoms';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';

const VersionInfoScreen = () => {
  return (
    <MainTemplate title={'バージョン情報'} isBack>
      <View style={styles.container}>
        <PAText style={styles.version}>
          version {Application.nativeApplicationVersion}
          {'\n'}
          {Updates.updateId}
        </PAText>
      </View>
    </MainTemplate>
  );
};

export default React.memo(VersionInfoScreen);
