import { isPlatform } from "@ionic/core";
import { useCallback } from "react";
import { NativeStorage } from "@ionic-native/native-storage";

const useDatabase = () => {
  const mobileWeb = !isPlatform("cordova");
  const setItem = useCallback(
    <T = any>(key: string, value: T): Promise<T> => {
      if (mobileWeb) {
        localStorage.setItem(key, JSON.stringify(value));
        return Promise.resolve(value);
      }
      return NativeStorage.setItem(key, value);
    },
    [mobileWeb]
  );

  const getItem = useCallback(
    <T = any>(key: string): Promise<T | undefined> => {
      if (mobileWeb) {
        const valueStorage = localStorage.getItem(key);
        if (!valueStorage) {
          return Promise.resolve(undefined);
        }
        return Promise.resolve(JSON.parse(valueStorage));
      }
      return NativeStorage.getItem(key);
    },
    [mobileWeb]
  );

  return {
    setItem,
    getItem,
  };
};

export default useDatabase;
