import React, { memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Checkbox from 'expo-checkbox';

interface Props {
  choices: { label: string; value: any }[];
  values?: any[];
  onChangeValues: (values: any[]) => void;
}

const PACheckBoxGroup = ({ choices, onChangeValues, values: initialValues }: Props) => {
  const [values, setValues] = useState(initialValues || []);

  useEffect(() => {
    initialValues && setValues(initialValues);
  }, [initialValues]);

  return (
    <>
      {choices.map((choice) => {
        const isSelected = values.includes(choice.value);
        const setSelection = () => {
          let next = values;
          if (isSelected) {
            next = values.filter((v) => v !== choice.value);
          } else {
            next = [...values, choice.value];
          }
          setValues(next);
          onChangeValues(next);
        };
        return (
          <Pressable style={styles.checkboxContainer} key={`${choice.value}`} onPress={setSelection}>
            <Checkbox value={isSelected} onValueChange={setSelection} style={styles.checkbox} />
            <Text style={styles.label}>{choice.label}</Text>
          </Pressable>
        );
      })}
    </>
  );
};

export default memo(PACheckBoxGroup);

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
    fontSize: 16
  },
});
