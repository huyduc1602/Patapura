import { PAWebView } from '@/components/atoms';
import { MainTemplate } from '@/components/templates';
import { BASE_API_URL, EndPoint } from '@/constants/endpoint';
import { useAuth } from '@/hooks/useAuth';
import { useAxios } from '@/hooks/useAxios';
import { useRoute } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';

const API_URL = BASE_API_URL;

const WebViewScreen = () => {
  const { params }: any = useRoute();
  const { authState, logout } = useAuth();
  const { onRefresh } = useAxios();
  
  return (
    // webviewのheaderは独自なのでmainTemplateのものを利用しない
    <MainTemplate hasHeader={false}>
      <PAWebView
        key={`webview-${authState?.token}`}
        uri={`${API_URL}${params?.url}`}
        token={authState?.token}
        logout={() => logout()}
        refresh={onRefresh}
      />
    </MainTemplate>
  );
};

export default memo(WebViewScreen);
