import * as Linking from 'expo-linking';
import { PROFILE_ROUTE, LESSON_ROUTE, WEBVIEW_SCREEN, LOCAL_NOTIFICATION_SCREEN } from '@/navigation/config/routes';
import { navigate } from '@/navigation/NavigationService';
import { useEffect } from 'react';

interface UrlPrms {
  type: string;
  id: string;
}

const parseUrl = (url: string): UrlPrms => {
  const path = url
    .replace(/^exp:\/\/.+?--\//, '/')
    .replace(/^https?:\/\/[^\/]+/, '')
    .replace(/^\w+:\/\//, '/');
  let tmp;

  if ((tmp = path.match(/^\/([\w\-]+)\/(\d+)\/$/))) {
    return {
      type: tmp[1],
      id: tmp[2],
    };
  } else if ((tmp = path.match(/^\/(my|lesson|notification)\/$/))) {
    return {
      type: tmp[1],
      id: '',
    };
  }

  return {
    type: '',
    id: '',
  };
};

export async function navigateApp (url: string | null = null) {
  // 空だった場合初期遷移
  if (!url) {
    url = await Linking.getInitialURL();

    if (!url) {
      return;
    }
  }

  const prms: UrlPrms = parseUrl(url);
  const TYPES = ['my', 'notification', 'lesson', 'material', 'advanced-a', 'advanced-b', 'meeting', 'test'];

  // 非対応ページだった場合は何もしない
  if (!TYPES.some((item) => item === prms.type)) {
    return;
  }

  if (prms.type === 'my') {
    navigate(PROFILE_ROUTE.MY_PAGE);
  } else if (prms.type === 'notification') {
    navigate(LOCAL_NOTIFICATION_SCREEN);
  } else if (prms.type === 'lesson') {
    if (prms.id === '') {
      navigate(LESSON_ROUTE.LESSON_LIST);
    } else {
      navigate(LESSON_ROUTE.LESSON_DETAIL, { id: prms.id });
    }
  } else {
    let url = null;

    switch (prms.type) {
      case 'advanced-a':
      case 'advanced-b':
        url = `/my/lesson/${prms.type}/${prms.id}/`;
        break;

      case 'material':
        url = `/lesson/material/${prms.id}/`;
        break;

      case 'meeting':
        url = `/meeting/${prms.id}/`;
        break;

      case 'test':
        url = `/my/test/${prms.id}/`;
        break;
    }

    if (url) {
      navigate(WEBVIEW_SCREEN, { url: url });
    }
  }
}

export function linkNavigate() {
  navigateApp();

  Linking.addEventListener('url', (event) => {
    navigateApp(event.url);
  });
}
