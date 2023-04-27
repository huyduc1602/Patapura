import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { MainTemplate } from '@/components/templates';
import { styles } from './styled';
import { useLocalNotification } from '@/hooks/useLocalNotification';
import PATimePicker from '@/components/atoms/PATimePicker';
import { CalendarNotificationTrigger, WeeklyNotificationTrigger } from 'expo-notifications';
import { PAIcon, PAText } from '@/components/atoms';
import * as Notifications from 'expo-notifications';

const weekdayLabelDict: { [key: number]: string } = {
  1: '日',
  2: '月',
  3: '火',
  4: '水',
  5: '木',
  6: '金',
  7: '土',
};
const daysOfWeekOrder = ['月', '火', '水', '木', '金', '土', '日'];

const LocalNotificationScreen = () => {
  const { scheduledNotifications, schedulePushNotification, cancelNotifications } = useLocalNotification();

  const groupedNotifications = useMemo(() => {
    const grouped: {
      [key: string]: { key: string; notifs: Notifications.NotificationRequest[]; hour: number; minute: number };
    } = {};

    scheduledNotifications.map((notif) => {
      const trigger = notif.trigger as CalendarNotificationTrigger;
      // @ts-ignore
      const hour = trigger?.dateComponents?.hour || trigger?.hour || 0;
      // @ts-ignore
      const minute = trigger?.dateComponents?.minute || trigger?.minute || 0;

      const key = `${hour}-${minute}`;
      grouped[key] = {
        key,
        hour,
        minute,
        notifs: grouped[key] ? [...grouped[key].notifs, notif] : [notif],
      };
    });

    return grouped;
  }, [scheduledNotifications]);

  const addNotification = useCallback(
    (hours: number, minutes: number, weekdays?: number[]) => {
      const key = `${hours}-${minutes}`;

      // すでに同じ時間が設定されている時にはキャンセルして設定し直し
      const existed = groupedNotifications[key];
      if (existed) {
        const ids = existed.notifs.map((notif) => notif.identifier);
        cancelNotifications(ids);
      }

      schedulePushNotification(
        'レッスンの時間になりました',
        '今日もパタプラトレーニング頑張りましょう！',
        hours,
        minutes,
        weekdays || [],
      );
    },
    [cancelNotifications, groupedNotifications, schedulePushNotification],
  );

  return (
    <MainTemplate title={'通知一覧'} isBack hasMenu={false}>
      <View style={styles.container}>
        <ScrollView style={styles.wrapper} contentContainerStyle={{ paddingBottom: 100 }}>
          <PAText>{'プッシュ通知でレッスンをお知らせします。'}</PAText>

          {Object.keys(groupedNotifications).map((k) => {
            const group = groupedNotifications[k];
            const ids = group.notifs.map((notif) => notif.identifier);
            const weekdaysLanbel = group.notifs.map((notif) => {
              const trigger = notif.trigger as CalendarNotificationTrigger;
              // @ts-ignore
              const weekday = trigger?.dateComponents?.weekday || trigger?.weekday;
              return (weekday && weekdayLabelDict[weekday]) || '';
            });
            const sortedWeekdayLabel = weekdaysLanbel.sort(
              (a: string, b: string) => daysOfWeekOrder.indexOf(a) - daysOfWeekOrder.indexOf(b),
            );

            return (
              <View key={group.key} style={styles.recordWrapper}>
                <PAText style={styles.recordDate}>{`${group?.hour}時 ${group?.minute}分 (${sortedWeekdayLabel})`}</PAText>
                <Pressable onPress={() => cancelNotifications(ids)}>
                  <View style={styles.deleteRecord}>
                    <PAIcon name="close" size={16} />
                    <PAText style={styles.recordId}>取消</PAText>
                  </View>
                </Pressable>
              </View>
            );
          })}

          <View style={styles.spacer} />
          <PATimePicker withWeekdayPicker onPressDone={addNotification} />
        </ScrollView>
      </View>
    </MainTemplate>
  );
};

export default React.memo(LocalNotificationScreen);
