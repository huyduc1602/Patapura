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
import { STEPS, BUTTON_NEXT_SRC, BUTTON_CLOSE1_SRC, BUTTON_CLOSE2_SRC, SKIP_SRC } from '@/constants/walkthrough';
import { LESSON_ROUTE, PROFILE_ROUTE, WEBVIEW_SCREEN } from '@/navigation/config/routes';
import { navigate } from '@/navigation/NavigationService';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, View, Dimensions } from 'react-native';
import storage from '@/utils/storage';
import styles from './styled';
import { WebviewRouteEnum, CacheDataKeyEnum } from '@/constants/enums';
import { NavigationProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

interface Props {

  navigation: NavigationProp<any>;
}

const WalkThroughScreen = ({ navigation }: Props) => {
  const { width, height } = Dimensions.get('window');
  let rate = width / 430;
  const { params }: any = useRoute();
  const step = useMemo(() => STEPS[(params?.step || 1) - 1], [params?.step]);
  
  const _setIgnore = useCallback(async () => {
    storage.setItem(CacheDataKeyEnum.WALK_THROUGH_IGNORE, true);
  }, []);
  
  const _onNav = useCallback(async (name: string, params = {}) => {
    // マイページじゃない場合、マイページへの遷移を挟んで履歴を書き換える
    await _onMyPage();
    navigate(name, params);
  }, [_setIgnore]);
  
  const _onMyPage = useCallback(async () => {
    _setIgnore();
    navigate(PROFILE_ROUTE.MY_PAGE);
  }, []);
  
  const titleSize = Object.create(step?.titleSize);
  const hRate = titleSize.height * rate / height;
  
  if (hRate > 0.7) {
    rate = 0.7 * height / titleSize.height;
  }
  
  titleSize.width = Math.round(titleSize.width * rate);
  titleSize.height = Math.round(titleSize.height * rate);

  return (
    <MainTemplate isMyPage={true} hasHeader={false}>
      <View style={styles.wrapper}>
        <View style={styles.topWrapper}>
          <Image style={[styles.topImg, titleSize]} source={step?.titleSrc} />
          {step?.description && (<View style={styles.descriptionWrapper}>{step?.description}</View>)}
        </View>
        <View style={styles.footerWrapper}>
          {step?.buttonType === 'next' && (<View style={styles.stepWrapper}>
            <Image style={styles.stepImg} source={step?.stepSrc} />
          </View>)}
          <View style={styles.centerWrapper}>
            {step?.buttonType === 'next' ? (<PAButton
              style={styles.button}
              onPress={() => navigate(PROFILE_ROUTE.WALK_THROUGH_PAGE, {step: step?.step + 1})}
            ><Image style={styles.nextImg} source={BUTTON_NEXT_SRC} /></PAButton>) : (<PAButton
              style={styles.button}
              onPress={() => _onNav(WEBVIEW_SCREEN, { url: WebviewRouteEnum.navigate2 })}
            ><Image style={styles.closeImg} source={BUTTON_CLOSE1_SRC} /></PAButton>)}
          </View>
          {step?.buttonType === 'next' ? (<View style={styles.skipWrapper}>
            <PAButton
                style={styles.button}
                onPress={_onMyPage}
              ><Image style={styles.skipImg} source={SKIP_SRC} /></PAButton>
          </View>) : (<View style={styles.lessonWrapper}>
            <PAButton
                style={styles.button}
                onPress={() => _onNav(LESSON_ROUTE.LESSON_DETAIL, {id: 1})}
              ><Image style={styles.lessonImg} source={BUTTON_CLOSE2_SRC} /></PAButton>
          </View>)}
        </View>
      </View>
    </MainTemplate>
  );
};

export default WalkThroughScreen;
