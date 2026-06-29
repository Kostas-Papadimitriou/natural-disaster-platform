import { PermissionsAndroid, Platform } from 'react-native';

export const requestCameraAndAudioPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const camera = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    const audio = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );

    return (
      camera === PermissionsAndroid.RESULTS.GRANTED &&
      audio === PermissionsAndroid.RESULTS.GRANTED
    );
  } catch {
    return false;
  }
};

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const fineLocation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return fineLocation === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
};
