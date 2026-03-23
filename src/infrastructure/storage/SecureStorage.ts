import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@shared/constants/api.constants';

export class SecureStorage {
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw error;
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
      throw error;
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  // Auth specific methods
  static async saveToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.TOKEN, token);
  }

  static async getToken(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.TOKEN);
  }

  static async saveWorkspaceId(workspaceId: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.WORKSPACE_ID, workspaceId);
  }

  static async getWorkspaceId(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.WORKSPACE_ID);
  }

  static async saveUserId(userId: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_ID, userId);
  }

  static async getUserId(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.USER_ID);
  }

  static async saveSalesRepId(salesRepId: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.SALES_REP_ID, salesRepId);
  }

  static async getSalesRepId(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.SALES_REP_ID);
  }

  static async saveUserData(data: object): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
  }

  static async getUserData<T>(): Promise<T | null> {
    const data = await this.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  static async clearAuthData(): Promise<void> {
    await Promise.all([
      this.removeItem(STORAGE_KEYS.TOKEN),
      this.removeItem(STORAGE_KEYS.WORKSPACE_ID),
      this.removeItem(STORAGE_KEYS.USER_ID),
      this.removeItem(STORAGE_KEYS.SALES_REP_ID),
      this.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
  }
}
