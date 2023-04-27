import Constants from 'expo-constants';

export const BASE_API_URL = Constants.expoConfig?.extra?.BASE_API_URL || '';
export const WEB_HOST = BASE_API_URL.replace(/^https?:\/\//i, '');
export const TOKEN_SECRET = Constants.expoConfig?.extra?.TOKEN_SECRET || '';
export const DEBUG_USER_PASSWORD = __DEV__ && Constants.expoConfig?.extra?.DEBUG_USER_PASSWORD || '';
export const DEBUG_USER_EMAIL = __DEV__ && Constants.expoConfig?.extra?.DEBUG_USER_EMAIL || '';
export const DEBUG_USER_NAME = __DEV__ ? 'ゲスト' : '';

export enum EndPoint {
  MY_PAGE = '/api/application/mypage',
  LOGIN = '/api/application/login',
  LOGOUT = '/api/application/logout',
  VALIDATE_REGISTER = '/api/application/validate-register',
  REGISTER = '/api/application/register',
  LESSON_LIST = '/api/application/lesson-list',
  LESSON_DETAIL = '/api/application/lesson',
  CREATE_RECORD = '/my/lesson/save-record',
  CANCEL_RECORD = '/my/lesson/cancel-record',
  REFRESH_TOKEN = '/api/application/refresh-token',
  UPLOAD_RECORDING = '/my/lesson/save-lesson-audio',
  UPDATE_AUDIO_CACHE = '/my/lesson/save-audio-cache',
  BOOKMARK = '/my/lesson/save-bookmark',
  MEMO = '/my/lesson/save-memo'
}
