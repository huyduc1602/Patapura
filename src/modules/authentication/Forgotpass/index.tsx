import React, { memo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { PAWebView } from '@/components/atoms';
import { colors } from '@/constants/colors';
import { FORGOT_PASS_URL } from '@/constants/url';

const ForgotpassScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PAWebView uri={FORGOT_PASS_URL} isPrivate={false} needLogin={false} />
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default memo(ForgotpassScreen);
