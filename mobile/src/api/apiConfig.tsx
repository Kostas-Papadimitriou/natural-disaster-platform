import axios from 'axios';
import { Platform } from 'react-native';

type ApiMode = 'emulator' | 'usb' | 'wifi';

const API_MODE: ApiMode = 'usb';
const LOCAL_PC_IP = '192.168.2.3';
const PORT = 8000;

const ANDROID_URLS: Record<ApiMode, string> = {
  emulator: `http://10.0.2.2:${PORT}`,
  usb: `http://${LOCAL_PC_IP}:${PORT}`,
  wifi: `http://${LOCAL_PC_IP}:${PORT}`,
};

const getBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    return ANDROID_URLS[API_MODE];
  }

  return `http://localhost:${PORT}`;
};

export const BASE_URL = getBaseUrl();

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default apiClient;
