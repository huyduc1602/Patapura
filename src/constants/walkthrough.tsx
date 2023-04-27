import { PAText } from '@/components/atoms';

export const BUTTON_NEXT_SRC = require('@/assets/walkthrough/btn-next.png');
export const BUTTON_CLOSE1_SRC = require('@/assets/walkthrough/btn-close-1.png');
export const BUTTON_CLOSE2_SRC = require('@/assets/walkthrough/btn-close-2.png');
export const SKIP_SRC = require('@/assets/walkthrough/skip.png');
export const STEPS = [{
  step: 1,
  titleSrc: require('@/assets/walkthrough/title/01.png'),
  titleSize: {
    width: 288,
    height: 311,
    marginTop: 160
  },
  stepSrc: require('@/assets/walkthrough/step/01.png'),
  buttonType: 'next',
  description: (<PAText size={'large'}>
    パタプライングリッシュは「チャンク」と「パターンプラクティス」に着目した、{"\n"}
    <PAText size={'large'} weight={'bold'}>スピーキング特化のビジネス英語</PAText>教材です。
  </PAText>)
}, {
  step: 2,
  titleSrc: require('@/assets/walkthrough/title/02.png'),
  titleSize: {
    width: 342,
    height: 379,
    marginTop: 30
  },
  stepSrc: require('@/assets/walkthrough/step/02.png'),
  buttonType: 'next',
  description: (<PAText size={'large'}>
    レッスン音声案内に沿って英文を声に出します。{"\n"}
    テキストは見ず、<PAText size={'large'} weight={'bold'}>まずは音声だけで</PAText>取り組んでください。{"\n"}
    実際のシーンをイメージしながら発話しましょう。
  </PAText>)
}, {
  step: 3,
  titleSrc: require('@/assets/walkthrough/title/03.png'),
  titleSize: {
    width: 346,
    height: 430,
    marginTop: 30
  },
  stepSrc: require('@/assets/walkthrough/step/03.png'),
  buttonType: 'next',
  description: (<PAText size={'large'}>
    音声だけでわからない時はスクリプトを見て確認します。スクリプトを読むだけだとリーディングの練習となってしまうので<PAText size={'large'} weight={'bold'}>確認したら音声だけで</PAText>取り組みましょう。
  </PAText>)
}, {
  step: 4,
  titleSrc: require('@/assets/walkthrough/title/04.png'),
  titleSize: {
    width: 280,
    height: 430,
    marginTop: 30
  },
  stepSrc: require('@/assets/walkthrough/step/04.png'),
  buttonType: 'next',
  description: (<PAText size={'large'}>
    レッスンが終わったら「記録」ボタンを押します。{"\n"}
    レッスンを記録することで、システムが忘却曲線に沿って<PAText size={'large'} weight={'bold'}>最適なタイミングで復習レッスン</PAText>をリマインドします。
  </PAText>)
}, {
  step: 5,
  titleSrc: require('@/assets/walkthrough/title/05.png'),
  titleSize: {
    width: 355,
    height: 418,
    marginTop: 30
  },
  stepSrc: require('@/assets/walkthrough/step/05.png'),
  buttonType: 'next',
  description: (<PAText size={'large'}>
    スポーツや楽器の練習と同じで、知識を技能に変えるために繰り返しの復習が不可欠です。{"\n"}
    推奨レッスンにて<PAText size={'large'} weight={'bold'}>最適なタイミングで復習レッスンが提示</PAText>されます。
  </PAText>)
}, {
  step: 6,
  titleSrc: require('@/assets/walkthrough/title/06.png'),
  titleSize: {
    width: 346,
    height: 451,
    marginTop: 20
  },
  stepSrc: require('@/assets/walkthrough/step/06.png'),
  buttonType: 'next',
  description: (<PAText>
    設定ページから通知メールをセットすると、{"\n"}
    その日にやるべき<PAText weight={'bold'}>推奨レッスンがメール</PAText>で届きます。{"\n"}
    英語学習を習慣化させましょう！
  </PAText>)
}, {
  step: 7,
  titleSrc: require('@/assets/walkthrough/title/07.png'),
  titleSize: {
    width: 371,
    height: 72,
    marginTop: 250
  },
  stepSrc: null,
  buttonType: 'close',
  description: null
}];
