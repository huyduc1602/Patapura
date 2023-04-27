import { useCallback, useEffect, useState } from 'react';
import { EndPoint } from '@/constants/endpoint';
import { Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { BASE_API_URL, TOKEN_SECRET } from '@/constants/endpoint';
import axios from 'axios';
import EventEmitter from 'events';

const authAxios = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    Accept: '*/*',
    'X-Request-Token': TOKEN_SECRET,
  },
});

interface ErrorType {
  count: number;
  message: string | null;
}

let isRefreshing = false;
const eventEmitter = new EventEmitter();
const EVENT_ACCESS_TOKEN_UPDATED = 'access_token_updated';

export const useAxios = () => {
  const { authState, logout, saveToken, getToken } = useAuth();

  const [retry, setRetry] = useState(2);
  const [error, setError] = useState<ErrorType>({ count: 0, message: null });

  const _decrementRetry = useCallback(() => setRetry((prev) => prev--), []);

  const _applyInterceptor = useCallback(() => {
    const _execute = async () => {
      authAxios.interceptors.request.use(
        (config: any) => {
          if (!config.headers?.Authorization) {
            config.headers.Authorization = `Bearer ${authState?.token}`;
          }

          return config;
        },
        (error) => {
          return Promise.reject(error);
        },
      );
    };

    _execute();
  }, [authState?.token]);

  const _handleLogout = useCallback(() => {
    const _execute = async () => {
      if (authAxios) {
        void authAxios?.post(EndPoint.LOGOUT);
      }

      logout();
    };

    _execute();
  }, [logout]);

  const refreshAuthLogic = useCallback(async () => {
    const { refreshToken } = await getToken();
    if (isRefreshing) {
      const waitForCurrentRefresh = () =>
        new Promise<string>((resolve) =>
          eventEmitter.once(EVENT_ACCESS_TOKEN_UPDATED, (token: string) => resolve(token)),
        );
      return await waitForCurrentRefresh();
    }

    isRefreshing = true;

    return authAxios
      .post(`${EndPoint.REFRESH_TOKEN}?token=${refreshToken}`)
      .then(async (rsp) => {
        isRefreshing = false;

        const _token = rsp?.data?.token;

        if (_token?.access) {
          saveToken(_token?.access ?? 'invalid', _token?.refresh);

          eventEmitter.emit(EVENT_ACCESS_TOKEN_UPDATED, _token?.access);
          return _token?.access;
        } else {
          console.log('refreshAuthLogic => logout');
          eventEmitter.emit(EVENT_ACCESS_TOKEN_UPDATED, '');
          logout();
        }

        return Promise.resolve();
      })
      .catch((e) => {
        isRefreshing = false;
        console.log('[refreshAuthLogic]--->', e);
        eventEmitter.emit(EVENT_ACCESS_TOKEN_UPDATED, '');
        _handleLogout();
      });
  }, [_handleLogout, getToken, logout, saveToken]);

  const updateError = useCallback(
    (err: string) => {
      if (error.count <= 0) {
        setError({ count: 1, message: err });

        return;
      }

      setError({ ...error, count: error.count + 1 });
    },
    [error],
  );

  useEffect(() => _applyInterceptor(), [_applyInterceptor]);

  useEffect(() => {
    authAxios.interceptors.response.use(
      (response) => {
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const access_token = await refreshAuthLogic();
          access_token && (originalRequest.headers['Authorization'] = 'Bearer ' + access_token);

          return authAxios(originalRequest);
        }
        return Promise.reject(error);
      },
    );
  }, [refreshAuthLogic]);

  useEffect(() => {
    if (error.count > 0 && error.message)
      Alert.alert('Error', error.message, [
        {
          text: 'OK',
          onPress: () => setError({ count: 0, message: null }),
        },
      ]);
  }, [error]);

  return {
    authAxios,
    onRefresh: refreshAuthLogic,
    onLogout: _handleLogout,
    updateError,
  };
};
