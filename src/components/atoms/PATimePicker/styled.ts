import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
  submitButton: {
    padding: 10,
    borderRadius: 4,
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
  checkBoxWrapper: {
    marginLeft: 8,
  }
});
