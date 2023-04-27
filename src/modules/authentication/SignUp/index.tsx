import { DEBUG_USER_EMAIL, DEBUG_USER_NAME, EndPoint } from '@/constants/endpoint';
import { PAButton, PAFormInput, PALoading, PAText, PALogo } from '@/components/atoms';
import useRequest from '@/hooks/useRequest';
import { AUTHENTICATE_ROUTE } from '@/navigation/config/routes';
import { navigate } from '@/navigation/NavigationService';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Alert, Linking, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styled';
import { useAuth } from '@/hooks/useAuth';
import { useIAP } from '@/hooks/useIAP';
import { APP_PLAN_PROUCT_ID } from '@/constants/iap';
import { AxiosResponse } from 'axios';
import { registerSchema } from '@/utils/yupScheme';
import { PRIVACY_POLICY_URL, TERMS_URL } from '@/constants/url';

type FormValues = {
  name: string;
  email: string;
};

const DEFAULT_FORM = {
  name: DEBUG_USER_NAME,
  email: DEBUG_USER_EMAIL || '',
};

const SignUpScreen = () => {
  const { saveToken } = useAuth();
  const { _validateExecute, _validateApiData, _validateLoading } = useRequest({
    url: EndPoint.VALIDATE_REGISTER,
    key: 'validate',
  });
  const { _registerExecute, _registerApiData, _registerLoading } = useRequest({
    url: EndPoint.REGISTER,
    key: 'register',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { requestPurchase, restorePurchase, purchase } = useIAP({ setIAPError: setErrorMessage });

  const form = useForm<FormValues>({
    mode: 'onSubmit',
    resolver: yupResolver(registerSchema),
    defaultValues: DEFAULT_FORM,
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
  });

  const {
    formState: { isValid },
    handleSubmit,
  } = form;

  const renderInputLabel = useCallback((label: string) => {
    return (
      <View style={styles.labelWrapper}>
        <PAText size={'large'}>{label}</PAText>
      </View>
    );
  }, []);

  const signUp = useCallback((name: string, email: string, receipt: string) => {
    _registerExecute({ name, email, receipt });
  }, []);

  const validateAtServer = useCallback(
    async (body: FormValues) => {
      // サーバーでのemail,name確認
      try {
        const res: AxiosResponse<any, any> | undefined = await _validateExecute(body);
        if (!res || !res.data) {
          throw new Error();
        }

        if (res.data.status === false) {
          throw new Error();
        }

        return true;
      } catch (e) {
        // _validateApiDataにエラーが入るのでここでは握り潰し
        return false;
      }
    },
    [_validateExecute],
  );

  const buyAndSignUp = useCallback(
    async (body: FormValues) => {
      setErrorMessage('');

      if (!body.name || !body.email) {
        // 基本的にはここまでこない
        setErrorMessage('名前もしくはメールアドレスを入力してください');
        return;
      }

      const validationResult = await validateAtServer(body);
      if (!validationResult) return;

      // 購入処理
      try {
        setLoading(true);
        const purchaseResult = await requestPurchase(APP_PLAN_PROUCT_ID);

        if (!purchaseResult) {
          throw new Error();
        }

        const { transactionReceipt } = purchaseResult;

        // 購入成功したらユーザーの作成
        signUp(body.name, body.email, transactionReceipt);
      } catch (e: any) {
        console.log(e);
        Alert.alert('エラー', e?.message || '購入に失敗しました');
      } finally {
        setLoading(false);
      }
    },
    [requestPurchase, signUp, validateAtServer],
  );

  const restoreAndSignUp = useCallback(
    async (body: FormValues) => {
      setErrorMessage('');

      if (!body.name || !body.email) {
        // 基本的にはここまでこない
        setErrorMessage('名前もしくはメールアドレスを入力してください');
        return;
      }

      const validationResult = await validateAtServer(body);
      if (!validationResult) return;

      let receipt = purchase?.transactionReceipt;
      if (!receipt) {
        try {
          setLoading(true);
          const purchaseResult = await restorePurchase();

          if (!purchaseResult || !purchaseResult[0]) {
            throw new Error();
          }

          const { transactionReceipt } = purchaseResult[0];
          receipt = transactionReceipt;
        } catch (e: any) {
          console.log(e);
        } finally {
          setLoading(false);
        }
      }

      if (!receipt) {
        Alert.alert('エラー', '購入情報が見つかりませんでした');
        return;
      }

      signUp(body.name, body.email, receipt);
    },
    [purchase?.transactionReceipt, restorePurchase, signUp, validateAtServer],
  );

  React.useEffect(() => {
    const _token = _registerApiData?.token;

    if (_token?.access) {
      saveToken(_token?.access, _token?.refresh);
    }
  }, [_registerApiData]);


  const renderLoginForm = useCallback(() => {
    return (
      <View style={styles.formWrapper}>
        <PAText style={styles.notice}>{noticeText}</PAText>
        <PAText style={styles.notice}>{productInfoText}</PAText>

        <FormProvider {...form}>
          <PAFormInput
            name="name"
            inputContainerStyle={styles.inputContainer}
            renderLabel={() => renderInputLabel('名前')}
            autoCapitalize="none"
          />
          <PAFormInput
            name="email"
            inputContainerStyle={styles.inputContainer}
            renderLabel={() => renderInputLabel('メールアドレス')}
            autoCapitalize="none"
          />
        </FormProvider>

        <View style={styles.termaRow}>
          <Pressable onPress={() => navigate(AUTHENTICATE_ROUTE.TERMS)}>
            <PAText style={styles.termsLinkText}>特定商取引法の表記</PAText>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
            <PAText style={styles.termsLinkText}>プライバシポリシー</PAText>
          </Pressable>
        </View>

        <PAText style={styles.notice}>{'決済完了後、入力されたメールアドレス宛に教材のログイン情報をご案内します。'}</PAText>

        {_validateApiData && !_validateApiData?.status && (
          <PAText style={styles.errTxt}>{_validateApiData?.errors?.name || _validateApiData?.errors?.email}</PAText>
        )}

        {_registerApiData && !_registerApiData?.status && (
          <PAText style={styles.errTxt}>{_registerApiData?.errors?.email}</PAText>
        )}

        {errorMessage && <PAText style={styles.errTxt}>{errorMessage}</PAText>}

        <PALoading isLoading={loading || _validateLoading || _registerLoading} />

        <PAButton onPress={handleSubmit(buyAndSignUp)} style={styles.submitBtn}>
          <PAText style={styles.submitTxt} size={'xl'}>
            購入して新規登録
          </PAText>
        </PAButton>

        <Pressable style={styles.linkWrapper} onPress={handleSubmit(restoreAndSignUp)}>
          <PAText style={styles.linkText}>リストアして新規登録</PAText>
        </Pressable>

        <Pressable style={styles.linkWrapper} onPress={() => navigate(AUTHENTICATE_ROUTE.LOGIN)}>
          <PAText style={styles.linkText}>ログインページへ</PAText>
        </Pressable>
      </View>
    );
  }, [
    form,
    _validateApiData,
    _registerApiData,
    errorMessage,
    loading,
    _validateLoading,
    _registerLoading,
    handleSubmit,
    buyAndSignUp,
    restoreAndSignUp,
    renderInputLabel,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.wrapper}>
          <PALogo wrapperStyle={styles.logo} />
          {renderLoginForm()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const productInfoText = `商品名： パタプライングリッシュ
有効期限： 期限なし
金額： 68,800円`;

const noticeText = `公式サイトから購入する場合と金額が異なります。
また60日返金保証は公式サイトから購入した場合のみとなりますので、予めご注意ください。`;

export default React.memo(SignUpScreen);
