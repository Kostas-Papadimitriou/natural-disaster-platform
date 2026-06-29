import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import {
  clearIncident,
  setPhotoUri,
  setVideoUri,
} from '../store/incidentSlice';
import colors from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { requestCameraAndAudioPermissions } from '../api/permissions';

type HomeScreenProps = {
  navigation: any;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const handleLogout = () => {
    Alert.alert('Έξοδος', 'Θέλεις σίγουρα να κάνεις logout;', [
      { text: 'Άκυρο', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
          dispatch(clearIncident());
          navigation.replace('Login');
        },
      },
    ]);
  };

  const handleVideoPress = async () => {
    const granted = await requestCameraAndAudioPermissions();

    if (!granted) {
      Alert.alert('Permission', 'Δεν δόθηκε άδεια για κάμερα/ήχο.');
      return;
    }

    launchCamera(
      {
        mediaType: 'video',
        videoQuality: 'high',
        durationLimit: 30,
        saveToPhotos: false,
      },
      response => {
        console.log('CAMERA RESPONSE:', JSON.stringify(response, null, 2));

        if (response.didCancel) {
          Alert.alert('Info', 'Ακύρωσες την εγγραφή βίντεο.');
          return;
        }

        if (response.errorCode) {
          Alert.alert('Σφάλμα', response.errorMessage || 'Αποτυχία κάμερας.');
          return;
        }

        const asset = response.assets?.[0];

        if (asset?.uri) {
          dispatch(setVideoUri(asset.uri));
          Alert.alert('OK', 'Το βίντεο αποθηκεύτηκε προσωρινά.');
          navigation.navigate('IncidentForm');
        } else {
          Alert.alert('Σφάλμα', 'Δεν βρέθηκε video uri.');
        }
      },
    );
  };

  const handlePhotoPress = async () => {
    const granted = await requestCameraAndAudioPermissions();

    if (!granted) {
      Alert.alert('Permission', 'Δεν δόθηκε άδεια για κάμερα.');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: false,
      },
      response => {
        console.log('PHOTO RESPONSE:', JSON.stringify(response, null, 2));

        if (response.didCancel) {
          Alert.alert('Info', 'Ακύρωσες τη φωτογραφία.');
          return;
        }

        if (response.errorCode) {
          Alert.alert('Σφάλμα', response.errorMessage || 'Αποτυχία κάμερας.');
          return;
        }

        const asset = response.assets?.[0];

        if (asset?.uri) {
          dispatch(setPhotoUri(asset.uri));
          navigation.navigate('IncidentForm');
        } else {
          Alert.alert('Σφάλμα', 'Δεν βρέθηκε photo uri.');
        }
      },
    );
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.menuButton}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Καλώς ήρθες, {user?.username}</Text>

      <TouchableOpacity style={styles.button} onPress={handleVideoPress}>
        <Text style={styles.buttonText}>Βίντεο</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handlePhotoPress}>
        <Text style={styles.buttonText}>Εικόνα</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ηχητικό</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.fireOrangeDark }]}
        onPress={() => navigation.navigate('IncidentForm')}
      >
        <Text style={styles.buttonText}>Μετάβαση στη Φόρμα</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.ash,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.fireOrangeDark,
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.fireOrange,
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 14,
  },
  buttonText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menuText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: 'bold',
  },
});
