import {
  PAButton,
  PAIconLabel,
  PALevel,
  PALinear,
  PALoading,
  PALogo,
  PASectionWrapper,
  PAText,
} from '@/components/atoms';
import { MainTemplate } from '@/components/templates';
import { EndPoint } from '@/constants/endpoint';
import { menus, MenuType } from '@/constants/mypage';
import useRequest from '@/hooks/useRequest';
import { LESSON_ROUTE, WEBVIEW_SCREEN } from '@/navigation/config/routes';
import { navigate } from '@/navigation/NavigationService';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import styles from './styled';
import { Helpers } from '@/utils/helpers';
import { WebviewRouteEnum } from '@/constants/enums';
import { linkNavigate } from '@/navigation/LinkNavigator';
import { NavigationProp } from '@react-navigation/native';
import useIntervalRefresh from '@/hooks/useIntervalRefresh';

interface Props {
  navigation: NavigationProp<any>;
}

type CampaignItem = {
  campaign_name: string;
  application_to: string;
}

type ReminderItem = {
  type: string;
  id: number;
  r: number;
  t: number;
}

type InfoItem = {
  title: string;
  url: string;
}

const MyPageScreen = ({ navigation }: Props) => {
  const { _myPageExecute, _myPageApiData, _myPageLoading } = useRequest({
    url: EndPoint.MY_PAGE,
    key: 'myPage',
    method: 'get',
  });

  const _reminder = useMemo(() => _myPageApiData?.reminder, [_myPageApiData?.reminder]);
  const _option = useMemo(() => _myPageApiData?.option, [_myPageApiData?.option]);
  const _campaigns = useMemo(() => _myPageApiData?.campaigns ?? [], [_myPageApiData?.campaigns]);
  const _referrals = useMemo(() => _myPageApiData?.referrals ?? [], [_myPageApiData?.referrals]);
  const _user = useMemo(() => _myPageApiData?.user ?? [], [_myPageApiData?.user]);
  const _lessons = useMemo(() => _myPageApiData?.lessons ?? {}, [_myPageApiData?.lessons]);
  const _materials = useMemo(() => _myPageApiData?.materials ?? {}, [_myPageApiData?.materials]);
  const _infos = useMemo(() => _myPageApiData?.infos ?? [], [_myPageApiData?.infos]);

  const _onGetMyPage = useCallback(async () => {
    if (_myPageExecute) {
      await _myPageExecute();
    }
  }, [_myPageExecute]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await _onGetMyPage();
    setRefreshing(false);
  }, [_onGetMyPage]);

  // foregroundになった時に一定時間前回から時間がたってたらrefresh
  useIntervalRefresh({
    refreshInterval: 5 * 60 * 1000, // 5min
    onRefresh: _onGetMyPage,
  });

  useEffect(() => { linkNavigate(); }, []);

  // このページに戻るたびに際読み込み
  useEffect(() => {
    navigation.addListener('focus', () => {
      _onGetMyPage();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _renderMenu = useCallback(({ item, index }: {item: MenuType, index: number}) => {
    const _item = item.call(item, {});
    const _isMargin = index % 2 !== 0;

    return (
      <PAButton
        style={[styles.menuItemWrapper, _isMargin ? styles.marginLeft : {}]}
        onPress={() => navigate(_item.screen, _item.params)}
      >
        <Image style={styles.menuImg} source={_item.icon} />
        <PAText weight={'bold'} style={styles.menuTitle}>
          {_item.title}
        </PAText>
        <PAText size="small" style={[styles.mt5, styles.menuDescription]}>
          {_item.description}
        </PAText>
      </PAButton>
    );
  }, []);

  const _renderCampaignItem = useCallback(
    ({ item }: {item: CampaignItem}) => (
      <View style={styles.campaignItemWrapper}>
        <PAText style={styles.campaignText}>{`${item.campaign_name} の申請ができるようになりました。`}</PAText>
        <PAText style={styles.campaignApplication}>{`申請期限（日本時間 ${Helpers.toDateTimeFormat(
          item.application_to,
          {
            output: 'Y年M月d日HH時mm分',
          },
        )} を過ぎると申請できなくなるのでご注意ください。`}</PAText>
      </View>
    ),
    [],
  );

  const _renderCampaign = useCallback(() => {
    if (_campaigns.length <= 0 && _referrals.length <= 0) return;

    return (
      <View style={styles.campaignWrapper}>
        <FlatList
          ListHeaderComponent={() => (
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <PAIconLabel name={'exclamation'} label="特典付与のお知らせ" textStyle={styles.campaignTitleStyle} />
            </View>
          )}
          listKey={'campaign'}
          data={_campaigns}
          renderItem={_renderCampaignItem}
          keyExtractor={(item, index) => `campaign--${item}--${index}`}
          ListFooterComponent={() =>
            _campaigns.length > 0 ? (
              <PAButton
                onPress={() => navigate(WEBVIEW_SCREEN, { url: WebviewRouteEnum.campaign })}
                style={styles.transparentButton}
              >
                <PAText isLink style={styles.campaignText}>
                  キャンペーン申請ページ
                </PAText>
                <PAText style={styles.campaignText}>から手続きをお願い致します。</PAText>
              </PAButton>
            ) : null
          }
        />

        {_referrals.length > 0 && (
          <View style={styles.referralWrapper}>
            <PAText style={styles.campaignText}>紹介プログラムの特典受け取りが確定しました。</PAText>
            <PAButton
              onPress={() => navigate(WEBVIEW_SCREEN, { url: WebviewRouteEnum.referral })}
              style={styles.transparentButton}
            >
              <PAText isLink style={styles.campaignText}>
                紹介プログラムページ
              </PAText>
              <PAText style={styles.campaignText}>から手続きをお願い致します。</PAText>
            </PAButton>
          </View>
        )}
      </View>
    );
  }, [_campaigns, _referrals, _renderCampaignItem]);

  const _renderSortLession = useCallback(
    ({ item }: { item: ReminderItem }) => {
      const _isFirstTime = (item?.r ?? 0) === 0;
      const _preExtraLabel =
        item?.type == 'lesson'
          ? _isFirstTime
            ? `${_lessons[item?.id]?.lesson_track_duration}分/`
            : `${_lessons[item?.id]?.download_audio_duration}分/`
          : '';
      const _extraLabel = _isFirstTime ? `（${_preExtraLabel}初回）` : `（${_preExtraLabel}復習${item?.r}）`;

      const _option = buildNavigationOptionsForLessonLink(item);

      return (
        <PAButton
          style={styles.sortLessonItemWrapper}
          textStyle={styles.linkText}
          onPress={() => navigate(_option.url, _option.params)}
          hitSlop={4}
        >
          {_option.label + _extraLabel}
        </PAButton>
      );
    },
    [_lessons],
  );

  const _renderLesson = useCallback(
    ({ item, index }: { item: ReminderItem, index: number } ) => {
      const _isFirstTime = (item?.r ?? 0) === 0;
      const _extraLabel =
        item?.type == 'lesson'
          ? _isFirstTime
            ? `（${_lessons[item?.id]?.lesson_track_duration}分）`
            : `（${_lessons[item?.id]?.download_audio_duration}分）`
          : '';

      const _option = buildNavigationOptionsForLessonLink(item);

      return (
        <PAButton onPress={() => navigate(_option.url, _option.params)} style={[styles.lessonItemButton]} hitSlop={0}>
          <PAText isLink style={styles.lessonItemLink}>
            {_option.label + _extraLabel}
          </PAText>
        </PAButton>
      );
    },
    [_lessons],
  );

  const _renderLessonSection = useCallback(
    ({ item }: { item: string }) => (
      <View style={[styles.mt5, styles.lessonItemSection]}>
        <PAText style={styles.lessonCountLabel}>{`復習${item}回目`}</PAText>

        <FlatList
          style={styles.flex1}
          numColumns={2}
          listKey={`need-lesson-section-${item}`}
          data={(_reminder?.needs ?? {})[item] ?? []}
          renderItem={_renderLesson}
          keyExtractor={(item, index) => `Lesson section-${item}-${index}-->`}
        />
      </View>
    ),
    [_reminder?.needs, _renderLesson],
  );

  const _renderLinearCover = useCallback(() => {
    const _count = _option?.count ?? 0;
    const _consecutiveTxt =
      _option?.consecutive_days == _option?.max_consecutive_days
        ? '最高記録更新中'
        : `最高${_option?.max_consecutive_days}日連続`;

    return (
      <PALinear style={styles.coverWrapper}>
        <PALogo />

        <PAText style={styles.coverTitle}>{`${_myPageApiData?.today || ''}のトレーニング状況`}</PAText>

        <View style={styles.coverDescriptionWrapper}>
          <View style={styles.coverDescriptionPrimary}>
            <PAText weight="bold" size="xs">
              {`${_option?.consecutive_days ?? 0}日連続達成（${_consecutiveTxt}）`}
            </PAText>
            <PAText weight="bold" style={styles.paddingVer5} size="xs">
              {`累計レッスン回数${_count}回`}
            </PAText>
            <PAText weight="bold" size="xs">
              {`推奨レッスン回数クリアまで残り${Math.max(0, 615 - _count)}！`}
            </PAText>
          </View>
          <View style={styles.coverImageWrapper}>
            <PALevel count={_count} />
          </View>
        </View>

        <View style={styles.coverFooter}>
          <PAText size="xxs">{`トレーニング開始日: ${Helpers.toDateTimeFormat(_option?.first_record)}`}</PAText>
          <PAText size="xxs">@patapura_eng</PAText>
        </View>
      </PALinear>
    );
  }, [
    _option?.count,
    _option?.consecutive_days,
    _option?.max_consecutive_days,
    _option?.first_record,
    _myPageApiData?.today,
  ]);

  const _renderInfoItem = useCallback(({ item, index }: { item: InfoItem, index: number }) => {
    return (
      <PAText>
        <PAText style={styles.infoNew}> NEW </PAText>
        <PAText> {item.title}</PAText>
        <PAText isLink onPress={() => navigate(WEBVIEW_SCREEN, { url: item.url })}>
          詳細と予約はこちら
        </PAText>
      </PAText>
    );
  }, []);

  const _renderInfo = useCallback(() => {
    return (
      <View style={styles.mt15}>
        <PAText style={styles.coverTitle} isColorInversion={true}>
          お知らせ
        </PAText>
        <FlatList
          style={styles.mt15}
          listKey={'info-section'}
          data={_infos}
          numColumns={1}
          renderItem={_renderInfoItem}
          keyExtractor={(item, index) => `info-${item}-${index}-->`}
        />
      </View>
    );
  }, [_infos, _renderInfoItem]);

  const _renderSetting = useCallback(() => {
    return (
      <PASectionWrapper
        name={'calendar'}
        label={'本日取り組む推奨レッスン'}
        isColorInversion={true}
        contentStyle={styles.mt7}
      >
        <FlatList
          data={_reminder?.sorts ?? []}
          numColumns={2}
          listKey={'sort-lesson-section'}
          renderItem={_renderSortLession}
          keyExtractor={(item, index) => `sort-lesson-${item}-${index}`}
        />

        <PAButton
          onPress={() => navigate(WEBVIEW_SCREEN, { url: WebviewRouteEnum.setting })}
          style={[styles.mt15, styles.settingButton]}
        >
          <PAText isLink>推奨レッスンをメールで受け取る</PAText>
        </PAButton>
      </PASectionWrapper>
    );
  }, [_reminder, _renderSortLession]);
  
  const _renderNotFoundSorts = useCallback(() => {
    return (
      <PASectionWrapper
        name={'calendar'}
        label={'本日取り組む推奨レッスン'}
        isColorInversion={true}
        contentStyle={styles.mt7}
      >
        <PAText>
          忘却曲線に沿った推奨レッスンはありません。{"\n"}
          つぶやき応用練習、会議の英語、レッスン番外編、テスト、マイチャンク作りなどに取り組んでみてください。{"\n"}
        </PAText>
        
        <PAText>
          応用練習の取り組み方に不安がある方は「<PAText isLink onPress={() => navigate(WEBVIEW_SCREEN, { url: "/my/seminar/8/"})}>つぶやき応用練習セミナー - 開発者の松尾先生に聞く活用のコツと実演</PAText>」セミナー動画をぜひ一度ご確認ください。
        </PAText>
        
      </PASectionWrapper>
    );
  }, []);

  const _renderPatapuraMethod = useCallback(
    () => (
      <View style={styles.mt15}>
        <PAText>
          全て取り組む時間がない場合は、復習を優先して取り組んでください。{"\n"}
          パタプラはフレーズの暗記ではなく、
          <PAText weight="bold">英語回路を作るためのトレーニング教材</PAText>
          です。効果を出すためには一つのレッスンに対して
          <PAText weight="bold">8回以上の復習</PAText>
          を推奨しています。
        </PAText>

        <View style={[styles.mt5, styles.patapuraWrapper]}>
          <PAText>⇒ </PAText>
          <PAButton
            onPress={() => navigate(WEBVIEW_SCREEN, { url: WebviewRouteEnum.patapuraMethod })}
            style={styles.patapuraButton}
          >
            <PAText isLink>なぜ反復練習が重要なのか科学的根拠の解説</PAText>
          </PAButton>
        </View>
      </View>
    ),
    [],
  );

  const _renderForgeting = useCallback(
    () => (
      <PAText style={styles.mt10}>
        <PAText>
          記憶の定着のためにエビングハウスの忘却曲線を元に、翌日に1回目の復習、1週間後に2回目の復習、2週間後に3回目の復習、4週間後に4回目の復習...のサイクルで復習が必要なレッスンとして表示しています。詳しくは
        </PAText>
        <PAText isLink onPress={() => navigate(WEBVIEW_SCREEN, { url: WebviewRouteEnum.forgettingCurve })}>
          こちらの記事
        </PAText>

        <PAText>でご確認ください。</PAText>
      </PAText>
    ),
    [],
  );

  const _renderTodayRecords = useCallback(() => {
    return (
      <PASectionWrapper
        name={'calendarCheck'}
        label={'本日記録をつけたレッスン'}
        isColorInversion={true}
        contentStyle={styles.mt7}
      >
        <FlatList
          data={_reminder?.todays ?? []}
          numColumns={2}
          listKey={'today-lesson-section'}
          renderItem={_renderSortLession}
          keyExtractor={(item, index) => `today-lesson-${item}-${index}`}
        />
      </PASectionWrapper>
    );
  }, [_reminder?.todays]);
  
  const _renderBookmarkLessonSection = useCallback(
    () => {
      const bookmarks = [];
      
      for (const lessonId in _lessons) {
        if (_lessons[lessonId].bookmarked) {
          bookmarks.push({
            id: lessonId,
            type: 'lesson',
            title: _lessons[lessonId].title,
          });
        }
        
        if (_materials[lessonId] && _materials[lessonId].bookmarked) {
          bookmarks.push({
            id: _materials[lessonId].material_id,
            type: 'material',
            title: _materials[lessonId].title,
          });
        }
      }
      
      if (bookmarks.length === 0) {
        return null;
      }
      
      return (
        <PASectionWrapper
          name={'staro'}
          label={'ブックマーク済みのレッスン'}
          isColorInversion={true}
          contentStyle={styles.mt7}
        >
          <FlatList
            listKey={'bookmark-lession-section'}
            data={bookmarks}
            renderItem={({ item }) => {
              const url = item.type === 'material' ? WEBVIEW_SCREEN : LESSON_ROUTE.LESSON_DETAIL;
              const params = item.type === 'material' ? { url: '/lesson/material/' + item.id + '/' } : {id: item.id};
              
              return (
                <PAButton onPress={() => navigate(url, params)} style={[styles.bookmarkButton]} hitSlop={0}>
                  <PAText>
                    <PAText isLink style={styles.bookmarkButtonText}>{item.title}</PAText>
                  </PAText>
                </PAButton>
              );
            }}
            keyExtractor={(item, index) => `bookmark-lesson-${item}-${index}`}
          />
        </PASectionWrapper>
    );},
    [_reminder?.needs, _renderLesson],
  );

  const _renderHeader = useCallback(() => {
    const needKeys: string[] = Object.keys(_reminder?.needs ?? {}) ?? [];
    
    return (
      <View style={styles.container}>
        {_renderCampaign()}
        <View style={styles.headerWrapper}>
          <PAText>こんにちは、{_user?.name || ''}さん</PAText>
          <PAText style={styles.mt10}>今日もパタプラトレーニング頑張りましょう！</PAText>
        </View>

        {_renderLinearCover()}
        {_infos.length >= 1 && _renderInfo()}
        {_reminder?.sorts?.length >= 1 && _renderSetting()}
        {_reminder?.sorts?.length >= 1 && _renderPatapuraMethod()}
        
        {_reminder?.sorts?.length === 0 && _renderNotFoundSorts()}

        {needKeys.length >= 1 && (<PASectionWrapper
          name={'checkSquare'}
          label={'復習が必要なレッスン（推奨除く）'}
          isColorInversion={true}
          contentStyle={styles.mt7}
        >
          <FlatList
            listKey={'lession-section'}
            data={needKeys}
            renderItem={_renderLessonSection}
            keyExtractor={(item, index) => `need-lesson-${item}-${index}`}
          />
        </PASectionWrapper>)}

        {needKeys.length >= 1 && _renderForgeting()}
        {_reminder?.todays?.length >= 1 && _renderTodayRecords()}
        
        {_renderBookmarkLessonSection()}
        
        <PASectionWrapper name={'infoCircle'} label={'メニュー'} isColorInversion={true} />
      </View>
    );
  }, [
    _renderCampaign,
    _user?.name,
    _renderLinearCover,
    _infos.length,
    _renderInfo,
    _renderSetting,
    _renderPatapuraMethod,
    _reminder?.sorts,
    _reminder?.needs,
    _reminder?.todays,
    _renderLessonSection,
    _renderForgeting,
    _renderTodayRecords,
  ]);

  return (
    <MainTemplate isMyPage={true}>
      <View style={styles.wrapper}>
        <PALoading isLoading={!refreshing && _myPageLoading} />
        <FlatList
          ListHeaderComponent={_renderHeader}
          numColumns={2}
          data={menus}
          renderItem={_renderMenu}
          listKey={'menu-section'}
          ItemSeparatorComponent={() => <View style={styles.pd5} />}
          keyExtractor={(item, index) => `menu---${index}--${item}`}
          style={styles.list}
          contentContainerStyle={styles.content}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>
    </MainTemplate>
  );
};

const buildNavigationOptionsForLessonLink = (item?: { id: number; type: string }) => {
  let _option: {
    url: string;
    label: string;
    params: any;
  } = {
    url: LESSON_ROUTE.LESSON_DETAIL,
    label: `Lesson-${item?.id}`,
    params: item,
  };

  if (item?.type == 'meeting') {
    _option = {
      url: WEBVIEW_SCREEN,
      label: '会議英語-' + `${item?.id}`,
      params: {
        url: `/meeting/${item?.id}/`,
      },
    };
  } else if (item?.type === 'advanced-a' || item?.type === 'advanced-b') {
    _option = {
      url: WEBVIEW_SCREEN,
      label: '応用練習[' + item?.type.replace('advanced-', '') + `]#${item?.id}`,
      params: {
        url: `/my/lesson/${item?.type}/${item?.id}/`,
      },
    };
  } else if (item?.type === 'test') {
    _option = {
      url: WEBVIEW_SCREEN,
      label: 'Test#' + `${item?.id}`,
      params: {
        url: `/my/test/${item.id}/`,
      },
    };
  } else if (item?.type === 'material') {
    _option = {
      url: WEBVIEW_SCREEN,
      label: '番外編-' + `${item?.id}`,
      params: {
        url: `/lesson/material/${item.id}/`,
      },
    };
  }

  return _option;
};

export default MyPageScreen;
