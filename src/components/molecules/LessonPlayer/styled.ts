import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    marginTop: 15,
    marginBottom: 20,
  },
  playButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
  },
  mainPlayButton: {
    borderWidth: 2,
  },
  subPlayButton: {
    paddingVertical: 5,
  },
  alignCenter: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  leftButton: {
    marginRight: 5,
  },
  rightButton: {
    marginLeft: 5,
  },
  sliderContainer: {
    width: '100%',
    backgroundColor: colors.lightGray,
    padding: 12,
    borderRadius: 50,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderWrapper: {
    flex: 1,
    marginHorizontal: 3,
  },
  slider: {
    width: '100%',
  },
  time: {
    width: 40,
    textAlign: 'center',
  },
  cpWapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 200,
    backgroundColor: '#00000088'
  },
  
  replayContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  replayTextStyle: {
    color: colors.black,
    fontSize: 14,
    paddingHorizontal: 5,
  },
  
  replayIcon: {
    marginHorizontal: -3
  }
});
