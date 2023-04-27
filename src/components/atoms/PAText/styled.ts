import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    color: colors.darkPrimary,
    letterSpacing: 0.5,
  },
  darkContainer: {
    color: colors.white,
    backgroundColor: colors.darkPrimary,
    letterSpacing: 0.5,
    padding: 5,
    textAlign: 'center'
  },
  link: {
    color: colors.link,
    textDecorationColor: colors.link,
    textDecorationLine: 'underline',
  },
});
