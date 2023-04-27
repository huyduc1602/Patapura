import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: { marginTop: 15, display: 'flex' },
  darkWrapper: { marginTop: 30, display: 'flex' },
  titleWrapper: { display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', width: '100%', paddingVertical: 2 },
  darkTitleWrapper: { display: 'flex', justifyContent: 'center', flexDirection: 'row', width: '100%', backgroundColor: colors.darkPrimary, paddingVertical: 2 },
  textStyle: { fontWeight: 'bold' },
});
