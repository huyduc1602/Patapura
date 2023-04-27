import { colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

interface Props {
  direction?: 'row' | 'column' | undefined;
  isReverse: boolean;
}

export default ({ direction = 'row', isReverse }: Props) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: `${direction}${isReverse ? '-reverse' : ''}`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    colorInversionContainer: {
      display: 'flex',
      flexDirection: `${direction}${isReverse ? '-reverse' : ''}`,
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 5,
    },
    
    textStyle: {
      color: colors.black,
      fontSize: 14,
      paddingHorizontal: 5,
    },
    colorInversionTextStyle: {
      color: colors.white,
      fontSize: 14,
      paddingHorizontal: 5,
    },
    
    buttonStyle: {
      backgroundColor: colors.transparent,
    },
  });
