import AsyncStorage from "@react-native-async-storage/async-storage";

export const Storage = {
  async set(key, value) {
    try {
      const json = JSON.stringify(value);
      await AsyncStorage.setItem(key, json);
    } catch (e) {
      console.log("Storage set error:", e);
    }
  },

  async get(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.log("Storage get error:", e);
      return null;
    }
  },

  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.log("Storage remove error:", e);
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log("Storage clear error:", e);
    }
  },
};
