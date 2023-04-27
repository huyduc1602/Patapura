import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 15,
    paddingBottom: 100
  },
  content: {
    paddingBottom: 100,
    paddingRight: 15
  },
  bookmarkFilterTabWraper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bookmarkFilterTabActive: {
    width: 130,
    paddingHorizontal: 4,
    marginHorizontal: 5,
    borderRadius: 4,
    backgroundColor: '#BE9855',
    color: colors.white,
    textAlign: 'center'
  },
  bookmarkFilterTabDeactive: {
    width: 130,
    paddingHorizontal: 4,
    marginHorizontal: 5,
    borderRadius: 4,
    backgroundColor: '#ddd',
    color: colors.black,
    textAlign: 'center'
  },
  lessonItemWraper: {
    marginVertical: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bookmarkIcon: {
    textAlign: 'center',
    width: 30,
    maxWidth: 30,
  },
  lessonItem: {
    paddingRight: 15,
  },
  lessonItemText: {
    textDecorationLine: 'underline',
    color: colors.blue,
  },
  lessonMemo: {
    color: colors.darkGray,
    flex: 1,
  },
});
