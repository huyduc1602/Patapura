import React from 'react';
import { View } from 'react-native';
import { IconProps } from '../PAIcon';
import PAIconLabel from '../PAIconLabel';
import styles from './styled';

interface Props extends IconProps {
  label: string;
  isColorInversion: boolean;
  children?: JSX.Element | JSX.Element[];
  contentStyle?: any;
}

const PASectionWrapper = ({ name, label, isColorInversion, children, contentStyle }: Props) => {
  return (
    <View style={isColorInversion ? styles.darkWrapper : styles.wrapper}>
      <View style={isColorInversion ? styles.darkTitleWrapper : styles.titleWrapper}>
        <PAIconLabel
          size={20}
          name={name}
          label={label}
          isColorInversion={isColorInversion}
          textStyle={styles.textStyle}
        />
      </View>

      <View style={contentStyle}>{children}</View>
    </View>
  );
};

export default React.memo(PASectionWrapper);
