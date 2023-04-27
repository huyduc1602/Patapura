import { ImageSourcePropType } from 'react-native';
import { LESSON_ROUTE, WEBVIEW_SCREEN } from '@/navigation/config/routes';
import { WebviewRouteEnum } from './enums';

export type MenuType = (params: Object) => {key: string, title: string, description: string, icon: ImageSourcePropType, screen: string, params: Object};

export const menus: MenuType[] = [
  (params: any) => ({
    key: 'lession',
    title: 'レッスン',
    description: 'メインとなる全62レッスン一覧ページ',
    icon: require('@/assets/mypage/lesson.png'),
    screen: LESSON_ROUTE.LESSON_LIST,
    params,
  }),
  (_: any) => ({
    key: 'test',
    title: 'テスト',
    description: 'レッスンの定着度をテスト形式で確認',
    icon: require('@/assets/mypage/test.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.test,
    },
  }),
  (_: any) => ({
    key: 'lession/advance-a',
    title: 'つぶやき応用練習[a]',
    description: '新しいチャンクの組み合わせを練習',
    icon: require('@/assets/mypage/advanced-a.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.advancedA,
    },
  }),
  (_: any) => ({
    key: 'lession/advance-b',
    title: 'つぶやき応用練習[b]',
    description: 'オリジナルのチャンクで練習',
    icon: require('@/assets/mypage/advanced-b.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.advancedB,
    },
  }),
  (_: any) => ({
    key: 'meeting',
    title: '会議の英語',
    description: '会議中に役立つフレーズとマインドセットを学習',
    icon: require('@/assets/mypage/kaigi.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.meeting,
    },
  }),
  (params: any) => ({
    key: 'lession/record',
    title: 'レッスン・テスト記録',
    description: '過去のレッスンとテストの記録を確認',
    icon: require('@/assets/mypage/record.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.record,
    },
  }),
  (_: any) => ({
    key: 'chunk',
    title: 'マイチャンク',
    description: 'チャンクを登録してフラッシュカードで練習',
    icon: require('@/assets/mypage/mychunk.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.chunk,
    },
  }),
  (params: any) => ({
    key: 'lession/download',
    title: 'ダウンロード',
    description: '音声と文書をダウンロードしてオフラインで練習',
    icon: require('@/assets/mypage/download.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.download,
    },
  }),
  (_: any) => ({
    key: 'seminar',
    title: 'セミナー動画',
    description: '過去に開催した購入者限定セミナーを視聴',
    icon: require('@/assets/mypage/seminar.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.seminar,
    },
  }),
  (_: any) => ({
    key: 'present',
    title: 'プレゼント教材',
    description: '購入者特典のプレゼント教材で学習',
    icon: require('@/assets/mypage/present.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.present,
    },
  }),
  (_: any) => ({
    key: 'navigate1',
    title: '教材の特徴・メソッド',
    description: '本教材の特徴やメソッドについての解説',
    icon: require('@/assets/mypage/beginner.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.navigate1,
    },
  }),
  (_: any) => ({
    key: 'navigate2',
    title: '学習ガイド',
    description: '本教材の進め方の案内（必ずご確認ください）',
    icon: require('@/assets/mypage/guide.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.navigate2,
    },
  }),
  (_: any) => ({
    key: 'faq',
    title: 'よくある質問',
    description: '購入者様からよくある質問と回答',
    icon: require('@/assets/mypage/faq.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.faq,
    },
  }),
  (_: any) => ({
    key: 'setting',
    title: '各種設定',
    description: 'アカウント情報、通知メールなどの設定',
    icon: require('@/assets/mypage/setting.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.setting,
    },
  }),
  (_: any) => ({
    key: 'password',
    title: 'パスワード変更',
    description: 'ログインパスワードを変更',
    icon: require('@/assets/mypage/password.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.password,
    },
  }),
  (_: any) => ({
    key: 'referral',
    title: '紹介プログラム',
    description: '友人に紹介してギフト券を獲得',
    icon: require('@/assets/mypage/referral.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.referral,
    },
  }),
  (_: any) => ({
    key: 'interview',
    title: '利用者\nインタビュー',
    description: '実際の利用者の体験談をチェック',
    icon: require('@/assets/mypage/interview.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.interview,
    },
  }),
  (_: any) => ({
    key: 'personal',
    title: 'パーソナルトレーニング',
    description: '専属トレーナーが付くオプションサービス',
    icon: require('@/assets/mypage/personal.png'),
    screen: WEBVIEW_SCREEN,
    params: {
      url: WebviewRouteEnum.personal,
    },
  }),
];
