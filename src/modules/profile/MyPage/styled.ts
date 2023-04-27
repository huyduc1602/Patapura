import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 15,
  },
  menuItemWrapper: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.gray,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    backgroundColor: colors.transparent,
    flexDirection: 'column',
    height: 160
  },
  marginLeft: {
    marginLeft: 10,
  },
  menuImg: { width: 36, height: 36 },
  menuTitle: { marginTop: 10, textAlign: 'center', lineHeight: 18 },
  menuDescription: { color: colors.link, textAlign: 'center', lineHeight: 14 },
  mt5: { marginTop: 5 },
  mt10: { marginTop: 10 },
  mt15: { marginTop: 15 },
  mt7: { marginTop: 7 },
  sortLessonItemWrapper: {
    marginTop: 4,
    display: 'flex',
    backgroundColor: colors.transparent,
    justifyContent: 'flex-start',
    height: 24,
  },
  linkText: { color: colors.link },
  lessonItemButton: { backgroundColor: colors.transparent, width: '50%', justifyContent: 'flex-start' },
  lessonItemLink: { textDecorationLine: 'none', textAlign: 'left', height: 26 },
  lessonItemSection: { display: 'flex', flexDirection: 'row' },
  bookmarkButton: {
    backgroundColor: colors.transparent,
    justifyContent: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    flex: 1,
  },
  bookmarkButtonText: {
    textDecorationLine: 'none',
    textAlign: 'left',
    height: 26,
    fontSize: 14,
  },
  flex1: { flex: 1 },
  headerWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  coverWrapper: {
    marginTop: 15,
    padding: 10,
    backgroundColor: colors.primary,
    borderWidth: 0.5,
    borderColor: colors.gray,
    borderStyle: 'solid',
  },
  coverTitle: { fontWeight: '500', fontSize: 14 },
  coverDescriptionWrapper: { display: 'flex', flexDirection: 'row', marginTop: 15, alignItems: 'center' },
  coverDescriptionPrimary: { display: 'flex', flexDirection: 'column', flex: 1 },
  paddingVer5: { paddingVertical: 5 },
  coverImageWrapper: { width: '40%', height: 91 },
  img: { width: '100%', height: '100%' },
  coverFooter: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100%',
  },
  infoNew: { backgroundColor: colors.vermilion, color: colors.white, fontSize: 12 },
  infoText: {lineHeight: 14 * 1.8},
  settingButton: { display: 'flex', alignItems: 'center', backgroundColor: colors.transparent },
  patapuraWrapper: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
  patapuraButton: { backgroundColor: colors.transparent, justifyContent: 'flex-start' },
  forgettingCurve: { display: 'flex', flexDirection: 'row' },
  forgettingCurveButton: { backgroundColor: colors.transparent, justifyContent: 'center', alignItems: 'center' },
  wrapper: { flex: 1, position: 'relative' },
  list: {padding: 15, paddingBottom: 100},
  pd5: { padding: 5 },
  transparentButton: {
    backgroundColor: colors.transparent,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  campaignItemWrapper: { display: 'flex', flexDirection: 'column', marginTop: 10 },
  campaignWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    borderColor: colors.gray,
    borderWidth: 1,
    padding: 10,
    marginBottom: 16
  },
  campaignApplication: {
    color: colors.alertRed,
    lineHeight: 22,
  },
  campaignText: {
    lineHeight: 22,
  },
  campaignTitleStyle: {
    fontWeight: 'bold',
  },
  referralWrapper: { display: 'flex', flexDirection: 'column', marginTop: 5 },
  content: {
    paddingBottom: 80
  },
  lessonCountLabel: {
    width: 86,
    fontWeight: "500"
  }
});
