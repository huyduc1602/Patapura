import { atom } from 'recoil';

type PlayerModalStateType = {
  visible?: boolean;
  title?: string;
  url?: string
};

export const initialState = {
  visible: false,
  title: '',
  url: '',
};

export const playerModalAtom = atom<PlayerModalStateType>({
  key: 'playerModal',
  default: initialState,
});
