import { colors } from '@/constants/colors';
import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import PAButton from '../PAButton';
import PAIcon, { IconProps } from '../PAIcon';
import PAText from '../PAText';
import useStyles from './styled';

interface Props extends IconProps {
  label: string;
  isReverse?: boolean;
  isColorInversion?: boolean;
  direction?: 'row' | 'column';
  buttonStyle?: ViewStyle;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: VoidFunction;
  isRight?: boolean;
}

const PAIconLabel = ({
  name,
  size = 24,
  isReverse = false,
  isColorInversion = false,
  color = isColorInversion ? colors.white : colors.black,
  direction = 'row',
  label,
  buttonStyle,
  style,
  textStyle,
  onPress,
  isRight = false,
}: Props) => {
  const styles = useStyles({ direction, isReverse });

  return (
    <PAButton style={{ ...styles.buttonStyle, ...buttonStyle }} onPress={onPress} disabled={!onPress}>
      <View style={[isColorInversion ? styles.colorInversionContainer : styles.container, style]}>
        {!isRight && <PAIcon name={name} size={size} color={color} />}
        <PAText style={[isColorInversion ? styles.colorInversionTextStyle : styles.textStyle, textStyle]} isColorInversion={isColorInversion}>{label}</PAText>
        {!!isRight && <PAIcon name={name} size={size} color={color} />}
      </View>
    </PAButton>
  );
};

export default React.memo(PAIconLabel);
