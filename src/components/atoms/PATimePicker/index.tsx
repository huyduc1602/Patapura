import React, { memo, useState } from 'react';
import { StyleSheet, TextProps, Text, View, Button, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { PAButton, PAText } from '@/components/atoms';
import PACheckBoxGroup from '@/components/atoms/PACheckBox';
import dayjs from 'dayjs';
import styles from './styled';

interface Props extends TextProps {
  onPressDone: (hours: number, minutes: number, weekdays?: number[]) => void;
  withWeekdayPicker?: boolean;
}

const _d = new Date();

const dayOfWeekList = [
  {
    label: '日曜日',
    value: 1,
  },
  {
    label: '月曜日',
    value: 2,
  },
  {
    label: '火曜日',
    value: 3,
  },
  {
    label: '水曜日',
    value: 4,
  },
  {
    label: '木曜日',
    value: 5,
  },
  {
    label: '金曜日',
    value: 6,
  },
  {
    label: '土曜日',
    value: 7,
  },
];
const initialWeekendValues = [1, 2, 3, 4, 5, 6, 7];

const PATimePicker = ({ onPressDone, withWeekdayPicker }: Props) => {
  const [date, setDate] = useState(new Date(_d.getFullYear(), _d.getMonth(), _d.getDate(), 8, 0, 0));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weekdays, setWeekdays] = useState<number[]>(initialWeekendValues);

  const _onPressDone = () => {
    if (withWeekdayPicker && !weekdays.length) {
      Alert.alert('エラー', '曜日を選択してください');
    }

    onPressDone(date.getHours(), date.getMinutes(), weekdays);
    setDate(new Date(_d.getFullYear(), _d.getMonth(), _d.getDate(), 8, 0, 0));
    setWeekdays(initialWeekendValues);
  };

  return (
    <>
      <View style={styles.datePickerWrapper}>
        <PAButton style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
          <PAText>{dayjs(date).format('HH時mm分')}</PAText>
        </PAButton>
      </View>

      {withWeekdayPicker && (
        <View style={styles.checkBoxWrapper}>
          <PACheckBoxGroup choices={dayOfWeekList} onChangeValues={setWeekdays} values={weekdays} />
        </View>
      )}
      <PAButton style={styles.submitButton} onPress={_onPressDone}>
        追加
      </PAButton>

      <DateTimePickerModal
        isVisible={showDatePicker}
        date={date}
        onConfirm={(date) => {
          setDate(date);
          setShowDatePicker(false);
        }}
        mode="time"
        onCancel={() => setShowDatePicker(false)}
        isDarkModeEnabled={false}
        cancelTextIOS={'キャンセル'}
        confirmTextIOS={'選択'}
        minuteInterval={5}
        locale="ja_JP"
      />
    </>
  );
};

export default memo(PATimePicker);
