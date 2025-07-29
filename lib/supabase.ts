import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as aesjs from 'aes-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';

// As Expo's SecureStore does not support values larger than 2048
// bytes, an AES-256 key is generated and stored in SecureStore, while
// it is used to encrypt/decrypt values stored in AsyncStorage.
class LargeSecureStore {
  private async _getEncryptionKey(key: string) {
    const keyHex = await SecureStore.getItemAsync(key);
    if (keyHex) {
      return aesjs.utils.hex.toBytes(keyHex);
    }

    const newKey = crypto.getRandomValues(new Uint8Array(256 / 8));
    await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(newKey));
    return newKey;
  }

  private async _encrypt(key: string, value: string) {
    const encryptionKey = await this._getEncryptionKey(key);

    const iv = crypto.getRandomValues(new Uint8Array(16));

    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(iv));
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

    const ivHex = aesjs.utils.hex.fromBytes(iv);
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

    return ivHex + encryptedHex;
  }

  private async _decrypt(key: string, value: string) {
    const encryptionKey = await this._getEncryptionKey(key);

    const ivHex = value.substring(0, 16 * 2);
    const encryptedHex = value.substring(16 * 2);
    const iv = aesjs.utils.hex.toBytes(ivHex);

    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(iv));
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(encryptedHex));

    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async getItem(key: string) {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) { return encrypted; }

    try {
      return await this._decrypt(key, encrypted);
    } catch (error) {
      console.error("Failed to decrypt data, removing corrupted item:", error);
      await this.removeItem(key);
      return null;
    }
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }

  async setItem(key: string, value: string) {
    const encrypted = await this._encrypt(key, value);

    await AsyncStorage.setItem(key, encrypted);
  }
}

const supabaseUrl = "https://mzycksxzknaxeqjqfijs.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16eWNrc3h6a25heGVxanFmaWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MDczMTksImV4cCI6MjA2OTI4MzMxOX0.IOVNEb7OSiFpZpgXqLN6tpkObulunqbBave-3KyCXZo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new LargeSecureStore(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});