import { colors } from '@/constants/colors';
import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapper: {
    marginTop: '20%',
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
  rememberLoginWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    flexDirection: 'row',
  },
  loginWrapper: {
    backgroundColor: colors.darkPrimary,
    borderRadius: 2,
    height: 60,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginLogo: {
    width: 200,
    height: 45
  },
  loginTxt: {
    color: colors.white
  },

  indicator: {
    marginTop: 15
  },
  forgotWrapper: {
    marginTop: 30,
    alignSelf: 'flex-end'
  },
  forgotText: {
    color: colors.blue,
    textDecorationLine: 'underline'
  },
  checkbox: {
    width: 20, height: 20, marginRight: 5
  },
  loginBtn: {
    marginTop: 20,
    height: 50
  },
  loginErr: {
    textAlign: 'center',
    color: colors.alertRed,
    marginTop: 15,
    marginBottom: -10
  },
  version: {
    color: colors.gray,
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10
  }
});
