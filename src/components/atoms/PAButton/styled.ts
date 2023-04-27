import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkPrimary,
  },
  textStyle: {
    color: colors.white,
  },
  indicator: {
    marginLeft: 5,
    color: colors.white,
  },
});
