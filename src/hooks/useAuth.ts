import { PALoading } from '@/components/atoms';
import { SecureStoreEnum } from '@/constants/enums';
import { AuthAtom, initialState } from '@/services/recoil/auth';
import storage from '@/utils/storage';
import React from 'react';
import { useRecoilState } from 'recoil';

export const useAuth = () => {
  const [authState, setAuthState] = useRecoilState(AuthAtom);

  const getToken = async () => {
    const token = await storage.getSecureItem(SecureStoreEnum.AUTH_TOKEN_VALUE);
    const refreshToken = await storage.getSecureItem(SecureStoreEnum.AUTH_REFRESH_TOKEN);
    const refreshTokenStoredAtStr = await storage.getSecureItem(SecureStoreEnum.AUTH_REFRESH_TOKEN_STORED_AT);
    const refreshTokenStoredAt = new Date(refreshTokenStoredAtStr as string);
    const now = new Date();

    return {
      token,
      refreshToken,
      refreshTokenStoredAt,
      isExpired: now.getTime() - refreshTokenStoredAt.getTime() > 1000 * 60 * 60, // 1時間
    };
  };

  const onSaveToken = React.useCallback((token: string, refreshToken: string) => {
    setAuthState({
      token,
      refreshToken,
    });

    const now = new Date();

    storage.setSecureItem(SecureStoreEnum.AUTH_TOKEN_VALUE, token);
    storage.setSecureItem(SecureStoreEnum.AUTH_REFRESH_TOKEN, refreshToken);
    storage.setSecureItem(SecureStoreEnum.AUTH_REFRESH_TOKEN_STORED_AT, now.toISOString());
  }, []);

  const logoutUser = React.useCallback(async () => {
    try {
      storage.removeSecureItem(SecureStoreEnum.AUTH_TOKEN_VALUE);
      storage.removeItem(SecureStoreEnum.AUTH_USER_INFO);
      storage.removeItem(SecureStoreEnum.AUTH_REFRESH_TOKEN);

      setAuthState(initialState);
    } catch (error) {
      console.log('LOG OUT ERR', error);
    }
  }, []);

  const resetToken = React.useCallback(() => setAuthState(initialState), []);

  return {
    authState,
    resetToken,
    getToken,
    saveToken: onSaveToken,
    logout: logoutUser,
  };
};
