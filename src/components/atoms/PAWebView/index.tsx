import { colors } from '@/constants/colors';
import { TOKEN_SECRET, BASE_API_URL, WEB_HOST } from '@/constants/endpoint';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Linking, Platform, View } from 'react-native';
import { WebView, WebViewProps } from 'react-native-webview';
import { WebViewHttpErrorEvent, WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes';
import { navigate, goBack } from '@/navigation/NavigationService';
import { styles } from './styled';
import { PROFILE_ROUTE } from '@/navigation/config/routes';
import Header from '@/components/atoms/PAHeader';
import { useDrawerMenuState } from '@/hooks/useDrawerMenuState';
import { useNavigation } from '@react-navigation/native';
import { navigateApp } from '@/navigation/LinkNavigator';
import { useLesseonListState } from '@/hooks/useLesseonListState';

interface Props extends WebViewProps {
  isPrivate?: boolean;
  needLogin?: boolean;
  title?: string;
  onBack?: () => void;
  isShare?: boolean;
  uri: string;
  token?: string | null;
  logout?: () => void;
  refresh?: () => Promise<void>;
}

const replaceUrl = `
  var atags = document.querySelectorAll('a[target="_blank"]');
  for (var i = atags.length; i--;) {
    atags[i].href = atags[i].href + (atags[i].href.indexOf('?') >= 0 ? '&' : '?') + '_is_open_browser=1';
  }
`;

const _injectedScript = `
  window.ReactNativeWebView.postMessage(JSON.stringify({action: 'title', title: document.title, url: document.URL}));
  ${replaceUrl}
`;

// ドメイン入りの自ドメインか、パスのみ
const buildInjectedScriptBeforeLoaded = (token: string) => `
  XMLHttpRequest.prototype.open = (function(open) {
    return function(method,url,async) {
      open.apply(this,arguments);
      console.log('open', method,url,async);

      if (location.host === '${WEB_HOST}' && (url.match(/^\\/\\w/i) || url.includes('${WEB_HOST}'))) {
        this.setRequestHeader('Authorization', 'Bearer ${token}');
        this.setRequestHeader('X-Request-App', 'patapura-app');
        this.setRequestHeader('X-Request-Token', '${TOKEN_SECRET}');
      }
    };
  })(XMLHttpRequest.prototype.open);
`;

const MYPAGE_URL = `${BASE_API_URL}/my/`;
const APP_KEY = 'patapura-app';

const PAWebView = ({
  title,
  token,
  isShare = true,
  isPrivate = true,
  needLogin = true, // ログイン前提かどうか
  logout,
  uri,
  onBack,
  refresh,
  ...others
}: Props) => {
  const _webviewRef = React.useRef<any>();
  const [isLoading, setLoading] = React.useState<Boolean>(true);
  const isLock = useRef<Boolean>(false);
  const [histories, setHistries] = React.useState<string[]>([uri]);
  const [headerTitle, setHeaderTitle] = React.useState<string>('');
  const { setWebviewUrl } = useDrawerMenuState();
  const navigation = useNavigation();
  const lastRefresh = useRef(Date.now());

  const { setUpdateMaterial } = useLesseonListState();

  const handleLoadRequest = React.useCallback((request: any) => {
    const iosNavTypeLoad = Platform.OS === 'ios' && request.navigationType !== 'click';

    if (checkifLinkingToOutsideApp(request.url)) {
      return false;
    }

    if (iosNavTypeLoad) {
      return true;
    }

    if (request.url === MYPAGE_URL) {
      navigate(PROFILE_ROUTE.MY_PAGE);
      return false;
    }

    return true;
  }, []);

  const onError = useCallback(
    async (e: WebViewHttpErrorEvent) => {
      if (e?.nativeEvent?.statusCode === 401) {
        console.log(e);

        if (refresh) {
          await refresh();
          return;
        }

        logout && logout();
      }

      setLoading(false);
    },
    [logout, refresh],
  );

  const onPressBack = useCallback(async () => {
    if (histories.length <= 1) {
      goBack();
      return;
    }

    setHistries(histories.slice(0, -1));
  }, [histories]);

  const onCheck = useCallback(async () => {
    setLoading(true);

    const now = Date.now();
    const refreshable = (lastRefresh.current + 3600000) < now; // 1時間経過

    if (refresh && refreshable && !isLock.current) {
      isLock.current = true;

      await refresh();

      lastRefresh.current = now;

      isLock.current = false;
      setLoading(false);
    }
  }, [refresh]);

  const _injectedScriptBeforeLoaded = useMemo(() => {
    return buildInjectedScriptBeforeLoaded(token || '');
  }, [token]);

  const currectUri = useMemo(() => {
    return histories[histories.length - 1];
  }, [histories]);

  const onPageChanged = useCallback(
    async (state: { url: string }) => {
      if (currectUri === state.url) return;

      setHistries([...histories, state.url]);
      setWebviewUrl(state.url);
    },
    [currectUri, histories, setWebviewUrl],
  );

  useEffect(() => {
    if (uri !== currectUri) {
      setHistries([uri]);
      setWebviewUrl(uri);
    }
  }, [uri]);

  const onMessage = useCallback((event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    const path = data.url?.replace(/^https?:\/\/[^/]+/i, '');
    let title = data.title?.replace(/\s*\|\s*パタプライングリッシュ for Business$/i, '');

    // ログアウト処理を実行
    if (data?.action === 'logout') {
      logout && logout();
    } else if (data?.action === 'log') {
      console.log(data?.dump);
    } else if (data?.action === 'redirect') {
      navigateApp(data?.url);
    } else if (data?.action === 'reload') {
      _webviewRef.current?.reload();
    } else if (data?.action === 'update-material') {
      setUpdateMaterial(data?.material);
    }

    // タイトルのセットじゃない場合は、処理しない
    if (data?.action !== 'title') {
      return;
    }

    let tmp;

    // ここでタイトルの変換
    if ((tmp = path?.match(/^\/lesson\/material\/(\d+)\//))) {
      title = `レッスン番外編${tmp[1]}`;
    } else if ((tmp = path?.match(/^\/my\/test\/(\d+)\//))) {
      title = `テスト${tmp[1]}`;
    } else if ((tmp = path?.match(/^\/my\/lesson\/advanced-[ab]\/$/))) {
      title = title.replace(/レッスン/, '');
    } else if ((tmp = path?.match(/^\/my\/lesson\/advanced-([ab])\/(\d+)\//))) {
      title = `つぶやき応用練習[${tmp[1]}]-${tmp[2]}`;
    } else if ((tmp = path?.match(/^\/meeting\/introduction\//))) {
      title = '会議の英語 はじめに';
    } else if ((tmp = path?.match(/^\/meeting\/unit(\d+)\//))) {
      title = `会議の英語 UNIT ${tmp[1]}`;
    } else if ((tmp = path?.match(/^\/meeting\/(\d+)\//))) {
      title = `会議の英語 CHAPTER ${tmp[1]}`;
    } else if ((tmp = path?.match(/^\/my\/seminar\/(\d+)\//))) {
      title = 'セミナー動画';
    } else if ((tmp = path?.match(/^\/my\/present\/(\d+)\//))) {
      title = `プレゼント教材・${tmp[1] == 1 ? '前編' : '後編'}`;
    } else if ((tmp = path?.match(/^\/my\/info\/(\d+)\//))) {
      title = 'お知らせ';
    } else if ((tmp = path?.match(/^\/interview\//))) {
      title = 'インタビュー';
    }

    setHeaderTitle(title);
  }, [setUpdateMaterial]);

  const _renderWebview = React.useCallback(() => {
    const withAuthHeader = currectUri.includes(WEB_HOST);
    const headers = withAuthHeader
      ? { 'X-Request-Token': TOKEN_SECRET, 'X-Request-App': APP_KEY, Authorization: `Bearer ${token}` }
      : {};

    return !needLogin || token ? (
      <WebView
        // key={`${currectUri}`}
        ref={_webviewRef}
        style={styles.webview}
        injectedJavaScript={_injectedScript}
        onLoadStart={onCheck}
        onLoadEnd={() => {if ( ! isLock.current) {setLoading(false); }}}
        startInLoadingState={true}
        onContentProcessDidTerminate={() => _webviewRef.current?.reload()}
        sharedCookiesEnabled
        onMessage={onMessage}
        onHttpError={onError}
        source={{
          uri: currectUri,
          headers: {
            Accept: '*/*',
            ...headers,
          },
        }}
        onShouldStartLoadWithRequest={handleLoadRequest}
        injectedJavaScriptBeforeContentLoaded={_injectedScriptBeforeLoaded}
        injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
        injectedJavaScriptForMainFrameOnly={false}
        decelerationRate={1.2} // iosでのスクロールが遅すぎる問題の調整
        onNavigationStateChange={onPageChanged}
        {...others}
      />
    ) : (
      <></>
    );
  }, [
    currectUri,
    token,
    needLogin,
    onMessage,
    onError,
    onCheck,
    handleLoadRequest,
    _injectedScriptBeforeLoaded,
    onPageChanged,
    others,
  ]);

  React.useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
        setWebviewUrl('');
    });

    return unsubscribe;
  }, [navigation, setWebviewUrl]);

  return (
    <View style={styles.container}>
      <Header title={headerTitle} isBack={true} needLogin={needLogin} onPressBack={onPressBack} />
      {_renderWebview()}

      {isLoading && (
        <>
          <View style={styles.overlay} />

          <View style={styles.loadingWrapper}>
            <ActivityIndicator size={'large'} color={colors.black} />
          </View>
        </>
      )}
    </View>
  );
};

// Linkingで外部に飛ばすurlたち
const outsideLinkUrls = ['youtube.com/watch', '_is_open_browser=1'];

const checkifLinkingToOutsideApp = (url: string) => {
  const checkIfOutside = outsideLinkUrls.some((outsideUrl) => url.includes(outsideUrl));

  if (checkIfOutside) {
    Linking.openURL(url);
    return true;
  }

  return false;
};

export default memo(PAWebView);
