import { atom } from 'recoil';

type AuthStateType = {
  token?: string | null;
  refreshToken?: string | null;
};

export const initialState = {
  token: '',
  refreshToken: ''
};

export const AuthAtom = atom<AuthStateType>({
  key: 'auth',
  default: initialState,
});
