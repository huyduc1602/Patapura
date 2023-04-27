import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    marginTop: 15,
    marginBottom: 20,
  },
  playButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  leftButton: {
    marginRight: 5,
  },
  rightButton: {
    marginLeft: 5,
  },
  title: {
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
    marginBottom: 20,
  },
  statusWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusLabelWrapper: {
    padding: 3,
    marginRight: 3,
  },
  statusLabel: {
    color: colors.white
  }
});
