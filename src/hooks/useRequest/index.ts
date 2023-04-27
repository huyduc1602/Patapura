import { useAxios } from '@/hooks/useAxios';
import React from 'react';

interface Props {
  url: string;
  key: string;
  isPrivate?: boolean;
  method?: 'post' | 'get' | 'POST' | 'GET';
  headers?: Record<string, string>;
}

const errorMessages: Record<string, string> = {
  'Request failed with status code 500': '通信に失敗しました。少し時間を置いて再度お試しください',
  'Request failed with status code 401': '認証に失敗しました',
};

const useRequest = ({ url, key, method = 'POST', headers = {} }: Props) => {
  const [response, setResponse] = React.useState<any>(null);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const { authAxios, updateError } = useAxios();
  const _method = React.useMemo<'get' | 'post'>(() => method.toLocaleLowerCase() as 'get' | 'post', [method]);

  const _handleExecute = React.useCallback(
    (body: any) => {
      const _handleRequest = async () => {
        try {
          setLoading(true);
          const _response = await authAxios[_method](url, body, { headers });

          setResponse(_response);
          setLoading(false);

          return _response;
        } catch (errors: any) {
          setLoading(false);

          if (errors?.response?.config?._retry) {
            console.log(`refreshing tokena and retry... ${errors.response.config.url}`);
            return;
          }

          const message = errorMessages[errors?.message] || errors?.message;

          updateError(message);
        }
      };

      return _handleRequest();
    },
    [authAxios, _method, url, headers, updateError],
  );

  React.useEffect(() => {
    return () => {
      setResponse(null);
    };
  }, []);

  return {
    [`_${key}Execute`]: _handleExecute,
    [`_${key}ApiData`]: response?.data,
    [`_${key}Loading`]: isLoading,
  };
};

export default useRequest;
