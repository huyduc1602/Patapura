import { useRef, useCallback, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-modules-core';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { WeeklyTriggerInput } from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useLocalNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [scheduledNotifications, setScheduledNotifications] = useState<Notifications.NotificationRequest[]>([]);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const getNotifications = useCallback(async () => {
    const notifs = await Notifications.getAllScheduledNotificationsAsync();
    console.log({ notifs });

    notifs && setScheduledNotifications(notifs);
  }, []);

  const cancelNotification = async (notifId: string) => {
    await Notifications.cancelScheduledNotificationAsync(notifId);
    getNotifications();
  };

  const cancelNotifications = async (ids: string[]) => {
    await Promise.all(
      ids.map(async (id) => {
        await Notifications.cancelScheduledNotificationAsync(id);
      }),
    );
    getNotifications();
  };

  const schedulePushNotification = async (
    title: string,
    body: string,
    hour: number,
    minutes: number,
    weekdays: number[],
  ) => {
    await Promise.all(
      weekdays.map(async (weekday) => {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
          },
          trigger: {
            weekday: weekday,
            hour: hour,
            minute: minutes,
            repeats: true,
          } as WeeklyTriggerInput,
        });
        console.log('notif id on scheduling', id);
      }),
    );

    getNotifications();
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: string | undefined) => setExpoPushToken(token));
    getNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current!);
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    getNotifications,
    scheduledNotifications,
    cancelNotification,
    cancelNotifications,
    schedulePushNotification,
  };
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // alert("Failed to get push token for push notification!");
      return;
    }
    // NOTE: 開発中は「 No experienceId or projectId found」 というpromiseの警告出るが無視してOKのよう
    // ref: https://github.com/expo/expo/issues/10369#issuecomment-1235330242
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: '#FF231F7C',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });
  }

  return token;
}
