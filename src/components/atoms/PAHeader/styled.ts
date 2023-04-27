import { colors } from '@/constants/colors';
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    backgroundColor: colors.white,
    shadowColor: 'rgb(51, 51, 51)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 4,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 999 // ヘッダーは十分に上に配置
  },
  title: {
    width: width - 168,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  titleText: {
    fontWeight: 'bold'
  },
  dummyBg: {
    backgroundColor: colors.white,
    position: 'absolute',
    top: -20,
    width: width,
    height: 20
  },
  actionWrapper: { width: 70, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: colors.white },
  button: { backgroundColor: colors.black, padding: 10, borderRadius: 4 },
  drawerStyle: { marginLeft: 10 },
  labelStyle: { fontSize: 11, lineHeight: 11 },
  backIconWrapper: {
    paddingRight: 45,
    paddingLeft: 0,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
