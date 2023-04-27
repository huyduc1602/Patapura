import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  deleteRecord: {
    flexDirection: 'row',
    width: 60,
    backgroundColor: '#eee',
    paddingVertical: 4,
    justifyContent: 'center',
  },
  recordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  recordId: {
    lineHeight: 16,
  },
  recordDate: {
    flex: 2,
    fontSize: 16
  },
  spacer: { height: 16 },
});
