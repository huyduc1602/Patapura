import { PALoading, PAText, PAIcon } from '@/components/atoms';
import { LessonTitle } from '@/components/molecules';
import { MainTemplate } from '@/components/templates';
import { EndPoint } from '@/constants/endpoint';
import useRequest from '@/hooks/useRequest';
import { useLesseonListState } from '@/hooks/useLesseonListState';
import { LESSON_ROUTE, WEBVIEW_SCREEN } from '@/navigation/config/routes';
import { navigate } from '@/navigation/NavigationService';
import { colors } from '@/constants/colors';
import toArray from 'lodash/toArray';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, View, FlatList } from 'react-native';
import { styles } from './styled';
import { NavigationProp } from '@react-navigation/native';

interface ILessonList {
  lesson_id: number;
  title: string;
  bookmarked: boolean;
  memo: string;
}

interface IMaterialList {
  material_id: number;
  title: string;
  bookmarked: boolean;
  memo: string;
}

interface ISimpleList {
  lesson_id?: number;
  material_id?: number;
  title: string;
  bookmarked: boolean;
  memo: string;
}

interface Props {
  navigation: NavigationProp<any>;
}

const LessonListScreen = ({ navigation }: Props) => {
  const [filteredBookmark, setFilteredBookmark] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { updateLessons } = useLesseonListState();
  
  const { _lessonExecute, _lessonApiData, _lessonLoading } = useRequest({
    url: EndPoint.LESSON_LIST,
    method: 'GET',
    key: 'lesson',
  });
  
  const { _bookmarkExecute, _bookmarkApiData, _bookmarkLoading } = useRequest({
    url: EndPoint.BOOKMARK,
    key: 'bookmark',
  });
  
  const onPressBookmark = useCallback(async (item: ISimpleList) => {
    // ここでブックマークデータを送信
    
    item.bookmarked = ! item.bookmarked;
    
    await _bookmarkExecute({
      lesson_id: item.lesson_id ? item.lesson_id : item.material_id,
      bookmarked: item.bookmarked,
      type: item.lesson_id ? 'lesson' : 'material'
    });
    
    setReloadKey(Math.random() + '');
    
  }, []);
  
  const onGetLessons = useCallback(async () => {
    if (_lessonExecute) await _lessonExecute();
  }, [_lessonExecute]);
  
  const onRefresh = useCallback(async () => {
    console.log('Lesson list refreshing.');
    
    setRefreshing(true);
    await onGetLessons();
    setRefreshing(false);
  }, [onGetLessons]);

  let _lessons = useMemo(() => {
    if (_lessonApiData?.lessons) {
      return toArray(_lessonApiData?.lessons);
    }

    return [];
  }, [_lessonApiData?.lessons]);
  
  let _materials: Record<number, IMaterialList[]> = useMemo(() => {
    if (_lessonApiData?.materials) {
      return _lessonApiData?.materials;
    }

    return {};
  }, [_lessonApiData?.materials]);
  
  const listData = useMemo((): ISimpleList[] => {
    const res: ISimpleList[] = [];
    
    _lessons.forEach((item: ILessonList) => {
      const materials = _materials[item.lesson_id];
      
      if ( ! filteredBookmark || item.bookmarked) {
        res.push(item);
      }
      
      if ( ! materials) {
        return;
      }
      
      for (var i = 0, l = materials.length; i < l; i++) {
        if (filteredBookmark && ! materials[i].bookmarked) {
          continue;
        }
        
        res.push(materials[i]);
      }
    });
    
    return res;
  }, [filteredBookmark, _lessons, _materials]);
  
  const [reloadKey, setReloadKey] = useState<string>('');
  
  const refreshLessons = useCallback(() => {
    if (updateLessons(_lessons, _materials)) {
      setReloadKey(Math.random() + '');
    }
  }, [_lessons, _materials, updateLessons]);
  
  // データの読み込み
  useEffect(() => {
    navigation.addListener('focus', refreshLessons);
    
    return () => {
      navigation.removeListener('focus', refreshLessons);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshLessons]);

  const _keyExtractor = useCallback((item: ISimpleList, index: number) => `PALessonList-${item.lesson_id ? 'lesson' : 'material'}--${item.lesson_id || item.material_id}--${index}-->`, []);

  const _renderItem = useCallback(({ item }: { item: ISimpleList }) => {
    return (
      <View style={styles.lessonItemWraper} key={`${item.lesson_id ? 'lesson' : 'material'}-${item.lesson_id || item.material_id}`}>
        <Pressable style={styles.bookmarkIcon} onPress={() => onPressBookmark(item)}>
          <PAText>
            {item.bookmarked ? (<PAIcon name={'star'} color={colors.yellow} />) : (<PAIcon name={'staro'} color={colors.gray} />) }
          </PAText>
        </Pressable>
        <Pressable style={styles.lessonItem} onPress={item.lesson_id ? () => navigate(LESSON_ROUTE.LESSON_DETAIL, { id: item.lesson_id}) : () => navigate(WEBVIEW_SCREEN, { url: `/lesson/material/${item.material_id}` })}>
          <PAText style={styles.lessonItemText} size={'large'}>
            {item.title}
          </PAText>
          {!!item.memo && (<PAText style={styles.lessonMemo} numberOfLines={1}>{item.memo.replace(/\n/g, ' ')}</PAText>)}
        </Pressable>
      </View>
    );
  }, [_materials]);

  const _renderLessonTitle = useCallback(() => {
    return (
      <View>
        <LessonTitle>レッスン一覧</LessonTitle>
        <View style={styles.bookmarkFilterTabWraper}>
          <Pressable onPress={() => setFilteredBookmark(false)}>
            <PAText style={filteredBookmark ? styles.bookmarkFilterTabDeactive : styles.bookmarkFilterTabActive}>全レッスン</PAText>
          </Pressable>
          <Pressable onPress={() => setFilteredBookmark(true)}>
            <PAText style={filteredBookmark ? styles.bookmarkFilterTabActive : styles.bookmarkFilterTabDeactive}>ブックマーク済み</PAText>
          </Pressable>
        </View>
      </View>);
  }, [filteredBookmark]);

  useEffect(() => {
    onGetLessons();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainTemplate title={'レッスン一覧'} isBack>
      <View style={styles.container}>
        <PALoading isLoading={!refreshing && _lessonLoading} />
        <FlatList
          data={listData}
          listKey={`lesson-list-section`}
          keyExtractor={_keyExtractor}
          renderItem={_renderItem}
          ListHeaderComponent={_renderLessonTitle}
          contentContainerStyle={styles.content}
          style={styles.list}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>
    </MainTemplate>
  );
};

export default LessonListScreen;
