import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 *
 * used for unsecure things
 */
const getItem = async (key: string) => {
  const result = await AsyncStorage.getItem(key);
  try {
    const { data, expiredAt } = JSON.parse(result as string);
    if (!expiredAt) return data;
    if (expiredAt > new Date().getTime()) {
      return data;
    }
    removeSecureItem(key);
    return null;
  } catch (e) {
    return result;
  }
};

const setItem = async (key: string, value: any, duration?: number) => {
  try {
    const expiredAt = duration ? new Date().getTime() + duration : null;
    const item = JSON.stringify({ data: value, expiredAt });

    return await AsyncStorage.setItem(key, `${item}`);
  } catch (e) {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  }
};

const removeItem = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

/**
 *
 * used for secure things like token
 *
 */

const getSecureItem = async (key: string) => {
  
  // GET SECURE ITEM ERORR [Error: Could not encrypt/decrypt the value for SecureStore] のエラーが出る可能性の対応
  try {
    return await SecureStore.getItemAsync(key);
  } catch (e) {
    return null;
  }
};

const setSecureItem = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

const removeSecureItem = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};

export default {
  getItem,
  setItem,
  removeItem,
  getSecureItem,
  setSecureItem,
  removeSecureItem,
};
