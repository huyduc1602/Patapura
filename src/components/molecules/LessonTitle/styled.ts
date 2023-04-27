import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  titleWrapper: {
    marginVertical: 15,
    borderLeftWidth: 7,
    borderLeftColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 10,
    position: 'relative',
    justifyContent: 'center',
    flex: 1
  },
  
  bookmarkIcon: {
    position: 'absolute',
    paddingHorizontal: 5,
    right: 0,
    flex: 1
  }
});
