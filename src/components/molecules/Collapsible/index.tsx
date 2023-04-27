import { PAIcon, PAText } from '@/components/atoms';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Pressable } from 'react-native';
import styles from './styled';

interface Props {
  title: string;
  children: JSX.Element | JSX.Element[] | string;
  collapsed?: boolean;
}

const Collapsible = ({ title, children, collapsed = false, ...rest }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed);

  const onChange = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed, setIsCollapsed]);

  const renderHeader = useCallback(() => {
    const _actionLabel = !isCollapsed ? '[展開して表示する]' : '[折りたたんで隠す]';
    return (
      <View style={styles.headerWrapper}>
        <PAIcon name={!isCollapsed ? 'caretright' : 'caretdown'} size={16} />
        <PAText>{title}</PAText>
        <Pressable onPress={onChange} hitSlop={12}>
          <PAText style={styles.actionText}>{_actionLabel}</PAText>
        </Pressable>
      </View>
    );
  }, [isCollapsed, title]);

  const renderContent = useCallback(() => {
    if (typeof children === 'string') {
      return <PAText>{children}</PAText>;
    }
    return children;
  }, [children]);

  return (
    <View style={styles.container} {...rest}>
      {renderHeader()}
      {isCollapsed && renderContent()}
    </View>
  );
};

export default Collapsible;
