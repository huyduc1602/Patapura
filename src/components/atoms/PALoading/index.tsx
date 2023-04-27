import React from 'react';
import { ActivityIndicator, ViewStyle } from 'react-native';
import styles from './styled';

interface Props {
  isLoading: boolean;
  style?: ViewStyle;
}

export default ({ isLoading, style }: Props) => (
  <React.Fragment>{isLoading && <ActivityIndicator size={'large'} style={[styles.container, style]} />}</React.Fragment>
);
