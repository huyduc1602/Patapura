import { atom } from 'recoil';

type LesseonListType = {
  update: boolean;
  updateCount: number;
  lessons: Array<{
    lesson_id: number;
    bookmarked?: boolean;
    memo?: string;
  }>;
  materials: Array<{
    material_id: number;
    bookmarked?: boolean;
    memo?: string;
  }>;
};

export const initialState = {
  update: false,
  updateCount: 0,
  lessons: [],
  materials: [],
};

export const LesseonListAtom = atom<LesseonListType>({
  key: 'lessonList',
  default: initialState,
});
