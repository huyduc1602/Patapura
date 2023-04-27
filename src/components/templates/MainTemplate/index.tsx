import PAHeader from '@/components/atoms/PAHeader';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styled';

interface Props {
  children: JSX.Element;
  isBack?: boolean;
  isMyPage?: boolean;
  hasMenu?: boolean;
  hasHeader?: boolean;
  title?: string;
}

const MainTemplate = ({ children, isBack, isMyPage, hasHeader = true, hasMenu, title = '', ...rest }: Props) => {
  const renderHeader = useCallback(() => {
    return <PAHeader title={title} isBack={isBack} isMyPage={isMyPage} hasMenu={hasMenu}/>;
  }, [hasMenu, title, isBack, isMyPage]);

  return (
    <View style={styles.container} {...rest}>
      <SafeAreaView style={styles.container}>
        {hasHeader && renderHeader()}
        <View style={styles.bodyWrapper}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

export default MainTemplate;
