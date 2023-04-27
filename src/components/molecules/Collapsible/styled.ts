import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: colors.blue,
  },
});
