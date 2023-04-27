import React, { useState, useEffect, useCallback } from 'react';
import { PAButton, PAIcon, PAText } from '@/components/atoms';
import { View, Pressable, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from './styled';
import dayjs from 'dayjs';
import { navigate } from '@/navigation/NavigationService';
import { WebviewRouteEnum } from '@/constants/enums';
import { WEBVIEW_SCREEN } from '@/navigation/config/routes';

interface Record {
  sheet_id: number;
  row_id: number;
  record_id: number;
  record_date: string;
}

interface Props {
  data: any;
  onDeleteRecord: (record: Record) => Promise<void>;
  onCreateRecord: (date: Date) => void;
  recorded: boolean;
  setRecorded: (flag: boolean) => void;
}

const LessonRecords = ({ data, onDeleteRecord, onCreateRecord, recorded, setRecorded, ...rest }: Props) => {
  const [keys, setKeys] = useState<string[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!data) return;
    const _keys = Object.keys(data);
    setKeys(_keys);
  }, [data]);

  const deleteLatestRecord = useCallback( async () => {
    const latestKey = keys[keys.length - 1];
    const recordData: Record = data[latestKey] || null;

    if (recordData) {
      try {
        await onDeleteRecord(recordData);
        setRecorded(false);
      } catch (e) {
        // canceled
      }
    }
  }, [data, keys, onDeleteRecord, setRecorded]);

  const onPressConfig = useCallback(() => {
    navigate(WEBVIEW_SCREEN, {
      url: WebviewRouteEnum.setting,
    });
  }, [onDeleteRecord]);

  const renderRecordItem = useCallback(
    (item: string, index: number) => {
      const recordData: Record = data[item] || null;
      if (!recordData) return null;

      const _id = recordData?.record_id - 1;
      return (
        <View key={`${item}--${_id}--${index}`} style={styles.recordWrapper}>
          <PAText style={styles.recordId}>{_id == 0 ? '初レッスン' : `復習${_id}回目`}</PAText>
          <PAText style={styles.recordDate}>{dayjs(recordData?.record_date).format('YYYY年MM月DD日')}</PAText>
          <Pressable onPress={() => onDeleteRecord(recordData)}>
            <View style={styles.deleteRecord}>
              <PAIcon name="close" size={16} />
              <PAText style={styles.recordId}>記録を取消</PAText>
            </View>
          </Pressable>
        </View>
      );
    },
    [data],
  );

  return (
    <View style={styles.container} {...rest}>
      <View style={styles.titleWrapper}>
        <PAText size="large" style={styles.title}>
          トレーニングを記録
        </PAText>
      </View>

      {recorded ? (
        <View style={styles.datePickerWrapper}>
          <PAButton style={styles.submitButton} onPress={() => deleteLatestRecord()}>
            取消する
          </PAButton>
        </View>
      ) : (
        <View style={styles.datePickerWrapper}>
          <PAButton style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
            <PAText>{dayjs(date).format('YYYY年MM月DD日')}</PAText>
          </PAButton>
          <PAButton style={styles.submitButton} onPress={() => onCreateRecord(date)}>
            記録する
          </PAButton>
        </View>
      )}

      <PAText style={styles.notice}>
        ※{' '}
        <Text style={styles.link} onPress={onPressConfig}>
          設定ページのタイムゾーン
        </Text>
        で初期値の調整ができます
      </PAText>

      {!!keys.length && keys?.map(renderRecordItem)}

      <DateTimePickerModal
        isVisible={showDatePicker}
        date={date}
        onConfirm={(date) => {
          setDate(date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
        maximumDate={new Date()}
        isDarkModeEnabled={false}
        cancelTextIOS={'キャンセル'}
        confirmTextIOS={'選択'}
        locale="ja_JP"
      />
    </View>
  );
};

export default LessonRecords;
