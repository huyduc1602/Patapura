import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {},
  titleWrapper: {
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  title: {
    fontWeight: '600',
  },
  recordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    height: 34
  },
  recordId: {
    flex: 1,
    lineHeight: 16
  },
  recordDate: {
    flex: 2,
  },
  datePickerWrapper: {
    flexDirection: 'row',
    marginBottom: 8
  },
  datePicker: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray,
    padding: 10,
    justifyContent: 'flex-start',
    marginRight: 10,
  },
  submitButton: {
    padding: 10,
    borderRadius: 4,
  },
  deleteRecord: {
    flexDirection: 'row',
    width: 90,
    backgroundColor: '#eee',
    paddingVertical: 4
  },
  link: {
    color: colors.blue,
    textDecorationLine: 'underline'
  },
  notice: {
    marginTop: 4,
    marginBottom: 16
  }
});
