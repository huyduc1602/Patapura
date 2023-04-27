import { REGEX_EMAIL } from '@/utils/validation';
import { object, string } from 'yup';

const _safeEmail = string()
  .required('メールアドレスを入力してください')
  .test('email', 'メールアドレスの形式が正しくありません', (value) => {
    const _isValidEmail = REGEX_EMAIL.test(`${value}`);

    return !!_isValidEmail;
  });

export const loginSchema = object().shape({
  email: _safeEmail,
  password: string().required('パスワードを入力してください').min(8, 'パスワードは8文字以上で入力してください'),
});

export const registerSchema = object().shape({
  name: string().required('名前を入力してください'),
  email: _safeEmail,
});
