import { PAIcon, PAText } from '@/components/atoms';
import React from 'react';
import { View } from 'react-native';
import { colors } from '@/constants/colors';
import styles from './styled';

interface Props {
  bookmarked?: boolean | null;
  onBookmark?: () => void;
  children: string;
}

const LessonTitle = ({ children, onBookmark, bookmarked = null, ...rest }: Props) => {
  return (
    <View style={[styles.titleWrapper, {paddingRight: 30}]}>
      <PAText weight="bold" size="xl">
        {children}
      </PAText>
      {bookmarked !== null && (
        <PAText onPress={onBookmark ? onBookmark : () => {}} style={styles.bookmarkIcon}>
          {bookmarked ? (<PAIcon name={'star'} color={colors.yellow} />) : (<PAIcon name={'staro'} color={colors.gray} />) }
        </PAText>
      )}
    </View>
  );
};

export default LessonTitle;
