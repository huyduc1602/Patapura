import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  twitter: {
    height: 300,
    width: '100%'
  },
  twitterTitle: {
    marginTop: 30
  },
  tweetButton: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "rgb(29, 155, 240)",
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16
  },
  tweetButtonLabel: {
    color: 'white'
  }
});
