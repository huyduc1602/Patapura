/* eslint-disable react-native/no-unused-styles */
import { colors } from '@/constants/colors';
import React, { ReactElement, ReactNode, useState } from 'react';
import {
  ColorValue,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import PAText from '../PAText';
import { autoCompleteType, textContentType } from './inputType';

export interface InputProps {
  containerStyle?: StyleProp<ViewStyle>;
  customStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  customLabelStyle?: StyleProp<TextStyle>;
  customErrorStyle?: StyleProp<TextStyle>;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  customUnderlineColor?: ColorValue;
  customReturnKeyType?: ReturnKeyTypeOptions;
  ref?: any;
  errorMessage?: string;
  label?: string;
  textContentType?: textContentType;
  autoCompleteType?: autoCompleteType;
  onChangeText?: (keyword: string) => void;
  text?: string;
  icon?: ReactElement;
  rightText?: ReactElement;
  renderLeft?: () => ReactNode;
  renderRight?: () => ReactNode;
  renderLabel?: () => ReactNode;
  secureTextEntry?: boolean;
  defaultValue?: string;
  onFocus?: Function;
}

const PAInput: React.ForwardRefRenderFunction<InputProps, any> = (
  {
    renderLeft,
    renderRight,
    renderLabel,
    containerStyle,
    customLabelStyle,
    inputContainerStyle,
    label,
    customStyle,
    placeholder,
    placeholderTextColor,
    customReturnKeyType,
    customUnderlineColor,
    customErrorStyle,
    errorMessage = '',
    autoCompleteType,
    textContentType,
    onChangeText,
    text: textProps,
    icon,
    rightText,
    defaultValue,
    onFocus,
    ...rest
  },
  ref,
) => {
  const [isFocused, setIsFocused] = useState(false);

  const styles = buildStyles(isFocused, errorMessage?.length > 0);

  const renderLeftInput = () => {
    if (renderLeft) return renderLeft();
    return !!icon ? icon : null;
  };

  const renderRightInput = () => {
    if (renderRight) return renderRight();
    return rightText ? rightText : null;
  };

  const renderCustomLabel = () => {
    if (renderLabel) return renderLabel();
    return <View>{!!label && <PAText style={[styles.label, customLabelStyle]}>{label}</PAText>}</View>;
  };

  const _focusHandler = React.useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (onFocus) onFocus(e);

      setIsFocused(true);
    },
    [onFocus],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {renderCustomLabel()}

      <View style={[styles.inputContainer, inputContainerStyle]}>
        {renderLeftInput()}
        <TextInput
          ref={ref}
          onFocus={_focusHandler}
          onBlur={() => setIsFocused(false)}
          style={[styles.textInput, customStyle]}
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholder}
          underlineColorAndroid={customUnderlineColor || 'transparent'}
          autoCompleteType={autoCompleteType || 'off'}
          textContentType={textContentType || 'none'}
          importantForAutofill="yes"
          autoCorrect={false}
          returnKeyType={customReturnKeyType || 'next'}
          blurOnSubmit={!!customReturnKeyType}
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          {...rest}
        />
        {renderRightInput()}
      </View>
      {!!errorMessage && <PAText style={[styles.errorMessage, customErrorStyle]}>{errorMessage}</PAText>}
    </View>
  );
};

const buildStyles = (isFocused: boolean, isError: boolean) => {
  return StyleSheet.create({
    label: {
      color: colors.darkPrimary,
      marginBottom: 8,
    },
    textInput: {
      display: 'flex',
      flex: 1,
      width: '90%',
      height: '100%',
      color: colors.darkPrimary,
      paddingRight: 5,
    },
    errorMessage: {
      fontSize: 13,
      color: colors.alertRed,
      marginTop: 5,
    },
    container: {
      width: '100%',
    },
    inputContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      height: 40.0,
      justifyContent: 'space-between',
      width: '100%',
      borderColor: colors.darkPrimary,
      borderWidth: 1,
      borderRadius: 4,
      paddingLeft: 10,
    },
    errIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
  });
};
export default React.forwardRef(PAInput);
