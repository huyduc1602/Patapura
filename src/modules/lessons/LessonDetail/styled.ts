import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleWrapper: {
    paddingBottom: 10,
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  title: {
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
    height: 100,
  },
  input: {
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.gray,
    height: 100,
    padding: 5
  },
  inputSaveMessageText: {
    textAlign: 'right'
  },
  wrapper: {
    paddingHorizontal: 15,
  },
  indicator: {
    marginTop: 15,
  },
  noteWrapper: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: colors.lightGray,
  },
  androidNotice: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.red
  },
  viewBorder: {
    borderWidth: 1,
    borderColor: colors.gray,
  },
  lessonTrackDuration: {
    marginTop: 40,
  },
  noteTitle: {
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    paddingBottom: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  hiddenText: {
    paddingTop: 45,
  },
  twitter: {
    height: 410,
    width: '100%',
  },
  twitterTitle: {
    marginTop: 30,
  },
  tweetButton: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgb(29, 155, 240)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  tweetButtonLabel: {
    color: 'white',
    width: '100%',
    textAlign: 'center',
  },
  navigationButtonContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: colors.lightGray,
    marginTop: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.gray
  },
  navigationButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: colors.gray,
    flexDirection: 'row'
  },
  navigationButtonLabel: {
    color: colors.blue,
    textAlign: "center",
    paddingHorizontal: 4
  },
  onePointLink: {
    color: colors.blue,
    textDecorationLine:'underline',
     marginBottom: 4
  }
});
