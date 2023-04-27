import { LesseonListAtom } from '@/services/recoil/lesseonList';
import { useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';

type LessonType = {
  lesson_id: number;
  bookmarked?: boolean;
  memo?: string;
};

type MaterialType = {
  material_id: number;
  bookmarked?: boolean;
  memo?: string;
};

export const useLesseonListState = () => {
  const [lesseonListState, setLesseonListState] = useRecoilState(LesseonListAtom);

  const updateLessons = useCallback(
    (lessons: LessonType[], materials: Record<number, MaterialType[]>): boolean => {
      console.log('update lesson start');
      
      if ( ! lesseonListState.update) return false;
      
      console.log(lesseonListState);
      
      for (var i = lesseonListState.lessons.length; i--;) {
        for (var j = lessons.length; j--;) {
          if (lessons[j].lesson_id === lesseonListState.lessons[i].lesson_id) {
            lessons[j].bookmarked = lesseonListState.lessons[i].bookmarked;
            lessons[j].memo = lesseonListState.lessons[i].memo;

            break;
          }
        }
      }
      
      for (var i = lesseonListState.materials.length; i--;) {
        for (var key in materials) {
          for (var j = materials[key].length; j--;) {
            if (materials[key][j].material_id === lesseonListState.materials[i].material_id) {
              materials[key][j].bookmarked = lesseonListState.materials[i].bookmarked;
              materials[key][j].memo = lesseonListState.materials[i].memo;

              break;
            }
          }
        }
      }

      setLesseonListState({update: false, updateCount: 0, lessons: [], materials: []});
      
      return true;
    },
    [lesseonListState.updateCount],
  );

  const setUpdateLesson = (lesson: LessonType) => {
    
    if (lesseonListState.update) {
      let tmp = [...lesseonListState.lessons];
      let materials = [...lesseonListState.materials];
      let update = false;
      
      console.log(tmp);
      
      for (var i = tmp.length; i--;) {
        if (tmp[i].lesson_id == lesson.lesson_id) {
          tmp[i] = {...tmp[i]};
          
          tmp[i].bookmarked = lesson.bookmarked;
          tmp[i].memo = lesson.memo;
          
          update = true;
          break;
        }
      }
      
      if ( ! update) {
        tmp.push({
          lesson_id: lesson.lesson_id,
          bookmarked: lesson.bookmarked,
          memo: lesson.memo
        });
      }
      
      setLesseonListState({
        update: true,
        updateCount: lesseonListState.updateCount + 1,
        lessons: tmp,
        materials: materials
      });
      
    } else {
      setLesseonListState({
        update: true,
        updateCount: 1,
        lessons: [{
          lesson_id: lesson.lesson_id,
          bookmarked: lesson.bookmarked,
          memo: lesson.memo
        }],
        materials: []
      });
    }
  };
  
  const setUpdateMaterial = (material: MaterialType) => {
    
    console.log(material);
    console.log(lesseonListState);
    
    if (lesseonListState.update) {
      let lessons = [...lesseonListState.lessons];
      let tmp = [...lesseonListState.materials];
      let update = false;
      
      console.log(tmp);
      
      for (var i = tmp.length; i--;) {
        if (tmp[i].material_id == material.material_id) {
          tmp[i] = {...tmp[i]};
          
          tmp[i].bookmarked = material.bookmarked;
          tmp[i].memo = material.memo;
          
          update = true;
          break;
        }
      }
      
      if ( ! update) {
        tmp.push({
          material_id: material.material_id,
          bookmarked: material.bookmarked,
          memo: material.memo
        });
      }
      
      setLesseonListState({
        update: true,
        updateCount: lesseonListState.updateCount + 1,
        lessons: lessons,
        materials: tmp
      });
      
    } else {
      setLesseonListState({
        update: true,
        updateCount: 1,
        lessons: [],
        materials: [{
          material_id: material.material_id,
          bookmarked: material.bookmarked,
          memo: material.memo
        }],
      });
    }
  };

  return {
    setUpdateLesson,
    setUpdateMaterial,
    updateLessons,
  };
};
