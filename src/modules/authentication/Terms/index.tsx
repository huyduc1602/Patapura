import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styled';
import { PAText } from '@/components/atoms';
import PAHeader from '@/components/atoms/PAHeader';

const TermsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PAHeader isBack={true} needLogin={false} />
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.wrapper}>
          <PAText style={styles.title}>特定商取引法に基づく表示</PAText>

          <PAText style={styles.sectionTile}>販売業者名</PAText>
          <PAText>アブログ合同会社</PAText>

          <PAText style={styles.sectionTile}>運営統括責任者</PAText>
          <PAText>内田 誠</PAText>

          <PAText style={styles.sectionTile}>所在地</PAText>
          <PAText>東京都品川区西五反田5-9-20</PAText>

          <PAText style={styles.sectionTile}>電話番号</PAText>
          <PAText>050-5579-3057</PAText>

          <PAText style={styles.sectionTile}>メールアドレス</PAText>
          <PAText>info@ablogg.jp</PAText>

          <PAText style={styles.sectionTile}>販売価格</PAText>
          <PAText>58,800円（税込）</PAText>

          <PAText style={styles.sectionTile}>商品代金以外の必要料金</PAText>
          <PAText>なし</PAText>

          <PAText style={styles.sectionTile}>販売数量</PAText>
          <PAText>個数限定販売はなし</PAText>

          <PAText style={styles.sectionTile}>商品引渡し時期</PAText>
          <PAText>代金決済完了直後</PAText>

          <PAText style={styles.sectionTile}>商品引渡し方法</PAText>
          <PAText>購入者用マイページよりご利用いただきます。</PAText>

          <PAText style={styles.sectionTile}>表現、及び商品に関する注意書き</PAText>
          <PAText>本商品の効果には個人差があります。必ずしも効果を保証したものではございません。</PAText>

          <PAText style={styles.sectionTile}>個人情報保護</PAText>
          <PAText>
            ご注文に際し収集した個人情報の利用は、弊社お知らせ等最低限にとどめ厳重に管理、ご本人の承諾なしに第3者に開示することはありません。（法令等により官公署から個人情報開示を命令された場合を除く。）
            詳細に関しては、弊社プライバシーポリシーを併せてご確認ください。
          </PAText>

          <PAText style={styles.sectionTile}>禁止事項</PAText>
          <PAText>・第三者への譲渡（有償・無償問わず） {'\n'}・教材内容及び音声ファイルのアップロード</PAText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(TermsScreen);
