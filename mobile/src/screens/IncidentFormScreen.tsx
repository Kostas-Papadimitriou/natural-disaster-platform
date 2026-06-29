import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import colors from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  clearIncident,
  IncidentType,
  markSubmitted,
  setCoordinates,
  setIncidentType,
  updateIncidentField,
} from '../store/incidentSlice';
import { requestLocationPermission } from '../api/permissions';
import { submitIncidentApi } from '../api/incidentsApi';

type Props = {
  navigation: any;
};

const incidentOptions: IncidentType[] = [
  'Πυρκαγιά',
  'Τροχαίο',
  'Διάσωση',
  'Πλημμύρα',
  'Άλλο',
];

const IncidentFormScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const incident = useAppSelector(state => state.incident);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    const granted = await requestLocationPermission();

    if (!granted) {
      Alert.alert('Τοποθεσία', 'Δεν δόθηκε άδεια για τοποθεσία.');
      return;
    }

    setLoadingLocation(true);

    Geolocation.getCurrentPosition(
      position => {
        dispatch(
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        );
        setLoadingLocation(false);
      },
      error => {
        setLoadingLocation(false);
        Alert.alert('Σφάλμα τοποθεσίας', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const handleChange = (field: string, value: string) => {
    dispatch(
      updateIncidentField({
        field: field as any,
        value,
      }),
    );
  };

  const handleSubmit = async () => {
    if (!incident.title.trim() || !incident.description.trim()) {
      Alert.alert('Συμπλήρωση', 'Βάλε τίτλο και περιγραφή.');
      return;
    }

    try {
      const result = await submitIncidentApi(incident);
      console.log('INCIDENT SUBMIT RESULT:', result);

      dispatch(markSubmitted());

      Alert.alert('Επιτυχία', 'Το περιστατικό αποθηκεύτηκε στη βάση.', [
        {
          text: 'ΟΚ',
          onPress: () => {
            dispatch(clearIncident());
            navigation.replace('Home');
          },
        },
      ]);
    } catch (error: any) {
      console.log(
        'INCIDENT SUBMIT ERROR:',
        error?.response?.data || error?.message,
      );

      Alert.alert(
        'Σφάλμα',
        error?.response?.data
          ? JSON.stringify(error.response.data)
          : 'Απέτυχε η αποστολή στο API.',
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Καταγραφή Περιστατικού</Text>

      <Text style={styles.label}>Τύπος περιστατικού</Text>
      <View style={styles.optionContainer}>
        {incidentOptions.map(option => {
          const selected = incident.incidentType === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.optionButton, selected && styles.optionSelected]}
              onPress={() => dispatch(setIncidentType(option))}
            >
              <Text
                style={[
                  styles.optionText,
                  selected && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Τίτλος</Text>
      <TextInput
        style={styles.input}
        value={incident.title}
        onChangeText={value => handleChange('title', value)}
        placeholder="π.χ. Πυρκαγιά σε δασική έκταση"
        placeholderTextColor="#777"
      />

      <Text style={styles.label}>Περιγραφή</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={incident.description}
        onChangeText={value => handleChange('description', value)}
        placeholder="Γράψε τι συμβαίνει..."
        placeholderTextColor="#777"
        multiline
      />

      <Text style={styles.label}>Περιοχή</Text>
      <TextInput
        style={styles.input}
        value={incident.area}
        onChangeText={value => handleChange('area', value)}
        placeholder="π.χ. Χαλάνδρι"
        placeholderTextColor="#777"
      />

      <Text style={styles.label}>Όνομα αναφέροντος</Text>
      <TextInput
        style={styles.input}
        value={incident.reporterName}
        onChangeText={value => handleChange('reporterName', value)}
        placeholder="π.χ. Πυροσβέστης Α"
        placeholderTextColor="#777"
      />

      <Text style={styles.label}>Τηλέφωνο επικοινωνίας</Text>
      <TextInput
        style={styles.input}
        value={incident.phone}
        onChangeText={value => handleChange('phone', value)}
        placeholder="π.χ. 69XXXXXXXX"
        placeholderTextColor="#777"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Video URI</Text>
      <Text style={styles.infoBox}>{incident.videoUri || '-'}</Text>

      <Text style={styles.label}>Latitude</Text>
      <Text style={styles.infoBox}>
        {incident.latitude
          ? String(incident.latitude)
          : loadingLocation
          ? 'Φόρτωση...'
          : '-'}
      </Text>

      <Text style={styles.label}>Longitude</Text>
      <Text style={styles.infoBox}>
        {incident.longitude
          ? String(incident.longitude)
          : loadingLocation
          ? 'Φόρτωση...'
          : '-'}
      </Text>

      <Text style={styles.label}>Χρήσιμα επιπλέον στοιχεία</Text>
      <Text style={styles.infoBox}>
        Ώρα καταγραφής: {new Date().toLocaleString('el-GR')}
      </Text>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default IncidentFormScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.ash,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.fireOrangeDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.fireOrangeDark,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.fireOrange,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.smoke,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoBox: {
    backgroundColor: '#FFF3E8',
    borderRadius: 10,
    padding: 12,
    color: colors.smoke,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.fireOrange,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: colors.fireOrange,
  },
  optionText: {
    color: colors.fireOrangeDark,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: colors.white,
  },
  submitButton: {
    backgroundColor: colors.fireOrange,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 24,
    marginBottom: 30,
  },
  submitText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
