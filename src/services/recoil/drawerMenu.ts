import { atom } from 'recoil';

type DrawerMenuStateType = {
  webviewItemName: string
};

export const initialState = {
  webviewItemName: ''
};

export const DrawerMenuAtom = atom<DrawerMenuStateType>({
  key: 'drawer',
  default: initialState,
});
