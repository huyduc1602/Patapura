/* eslint-disable no-unused-expressions */
import React, { useCallback } from 'react';
import { Controller, ControllerRenderProps, RegisterOptions, useFormContext, UseFormReturn } from 'react-hook-form';
import SPInput, { InputProps } from '../PAInput';

interface FormInputProps extends InputProps {
  name: string;
  rules?: RegisterOptions;
  defaultValue?: string;
  form?: UseFormReturn;
  ref?: HTMLInputElement;
  autoCapitalize?: string;
  rightText?: any;
  keyboardType?: string;
}

const SPFormInput = (props: FormInputProps, ref: any) => {
  const { name, rules, defaultValue = '', onChangeText, form, ...inputProps } = props;
  const formContext = useFormContext();

  if (!(formContext || form)) {
    console.log('ERR');
  }

  const {
    control,
    formState: { errors },
  } = formContext || form;

  const errorMessage = errors?.[name]?.message || '';

  const onChangeInput = (text: string, onChangeControl: any) => {
    onChangeText ? onChangeText(text) : onChangeControl(text);
  };
  const renderBaseInput = useCallback(
    ({ field: { onChange, value } }: { field: ControllerRenderProps }) => {
      return (
        <SPInput
          ref={ref}
          defaultValue={value}
          onChangeText={(text: string) => onChangeInput(text, onChange)}
          errorMessage={errorMessage}
          {...inputProps}
        />
      );
    },
    [onChangeInput],
  );

  return (
    <Controller
      control={control}
      name={name as any}
      defaultValue={defaultValue}
      rules={rules}
      render={renderBaseInput}
    />
  );
};

export default React.forwardRef(SPFormInput);
