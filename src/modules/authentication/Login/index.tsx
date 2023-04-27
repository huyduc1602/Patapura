import { DEBUG_USER_EMAIL, DEBUG_USER_PASSWORD, EndPoint } from '@/constants/endpoint';
import { PAButton, PAFormInput, PALoading, PAText, PALogo } from '@/components/atoms';
import useRequest from '@/hooks/useRequest';
import { AUTHENTICATE_ROUTE } from '@/navigation/config/routes';
import { navigate } from '@/navigation/NavigationService';
import { yupResolver } from '@hookform/resolvers/yup';
import Checkbox from 'expo-checkbox';
import React, { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styled';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/utils/yupScheme';
import { SecureStoreEnum } from '@/constants/enums';
import storage from '@/utils/storage';

const DEFAULT_FORM: any = {
  email: DEBUG_USER_EMAIL || '',
  password: DEBUG_USER_PASSWORD || '',
};

const LoginScreen = () => {
  const { saveToken } = useAuth();
  // const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const { _loginExecute, _loginApiData, _loginLoading } = useRequest({ url: EndPoint.LOGIN, key: 'login' });
  
  const form = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(loginSchema),
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

  const loginWithEmail = useCallback(
    (body: any) => {
      body.auto_login = 1;
      
      // メアドを保存する
      storage.setSecureItem(SecureStoreEnum.AUTH_LOGIN_EMAIL, body.email);
      
      _loginExecute(body);
    },
    [_loginExecute],
  );
  
  React.useEffect(() => {
    // メアドを復元
    storage.getSecureItem(SecureStoreEnum.AUTH_LOGIN_EMAIL).then((email) => {
      if (email) {
        form.setValue('email', email);
      }
    });
  }, []);

  React.useEffect(() => {
    const _token = _loginApiData?.token;

    if (_token?.access) {
      saveToken(_token?.access, _token?.refresh);
    }
  }, [_loginApiData, _loginLoading]);

  const renderLoginForm = useCallback(() => {
    return (
      <View style={styles.formWrapper}>
        <FormProvider {...form}>
          <PAFormInput
            name="email"
            inputContainerStyle={styles.inputContainer}
            renderLabel={() => renderInputLabel('メールアドレス')}
            autoCapitalize="none"
          />
          <PAFormInput
            name="password"
            inputContainerStyle={styles.inputContainer}
            renderLabel={() => renderInputLabel('パスワード')}
            autoCapitalize="none"
            secureTextEntry
          />
        </FormProvider>
        {_loginApiData && !_loginApiData?.status && (
          <PAText style={styles.loginErr}>{_loginApiData?.errors?.password}</PAText>
        )}

        <PALoading isLoading={_loginLoading} />

        {/* <View style={styles.rememberLoginWrapper}>
          <Checkbox style={styles.checkbox} value={toggleCheckBox} onValueChange={setToggleCheckBox} />
          <PAText size="large">30日間ログインを保持する</PAText>
        </View> */}

        <PAButton onPress={handleSubmit(loginWithEmail)} style={styles.loginBtn}>
          <PAText style={styles.loginTxt} size={'xl'}>
            ログイン
          </PAText>
        </PAButton>

        <Pressable style={styles.forgotWrapper} onPress={() => navigate(AUTHENTICATE_ROUTE.FORGOT_PASS)}>
          <PAText style={styles.forgotText}>パスワードを忘れた方はこちら</PAText>
        </Pressable>

        {Platform.OS === 'ios' && (
          <Pressable style={styles.forgotWrapper} onPress={() => navigate(AUTHENTICATE_ROUTE.SIGN_UP)}>
            <PAText style={styles.forgotText}>新規会員登録はこちら</PAText>
          </Pressable>
        )}

        <PAText style={styles.version}>
          version {Application.nativeApplicationVersion}
          {'\n'}
          {Updates.updateId}
        </PAText>
      </View>
    );
  }, [form, _loginApiData, _loginLoading, handleSubmit, loginWithEmail, renderInputLabel]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.wrapper}>
          <PALogo wrapperStyle={styles.loginLogo} />
          {renderLoginForm()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(LoginScreen);
