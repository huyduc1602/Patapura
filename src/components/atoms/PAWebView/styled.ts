import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    zIndex: 8,
    top: 60,
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  loadingWrapper: {
    position: 'absolute',
    zIndex: 9,
    left: '40%',
    top: '40%',
    width: 100,
    display: 'flex',
    justifyContent: 'center',
  },
});
