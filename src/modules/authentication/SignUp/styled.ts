import { colors } from '@/constants/colors';
import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapper: {
    marginTop: 40,
    alignItems: 'center'
  },
  formWrapper: {
    marginHorizontal: 15,
    marginTop: 10
  },
  inputContainer: {
    borderColor: colors.gray,
    height: 45,
  },
  labelWrapper: {
    marginBottom: 10,
    marginTop: 30
  },
  submitTxt: {
    color: colors.white
  },
  indicator: {
    marginTop: 15
  },
  linkWrapper: {
    marginTop: 30,
    alignSelf: 'flex-end'
  },
  linkText: {
    color: colors.blue,
    textDecorationLine: 'underline'
  },
  termsLinkText: {
    textDecorationLine: 'underline'
  },
  submitBtn: {
    marginTop: 20,
    height: 50
  },
  errTxt: {
    textAlign: 'center',
    color: colors.alertRed,
    marginTop: 15,
    marginBottom: -10
  },
  logo: {
    width: 200,
    height: 45
  },
  termaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    marginTop: 16,
    marginBottom: 8
  },
  notice: {
    marginTop: 16
  }
});
