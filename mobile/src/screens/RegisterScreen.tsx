import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { registerUser } from '../api/authApi';
import colors from '../theme/colors';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/authSlice';

type RegisterScreenProps = {
  navigation: any;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage('');

    const result = await registerUser({
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirm_password: confirmPassword,
    });

    setLoading(false);

    if (result.success) {
      dispatch(
        loginSuccess({
          user: result.user,
          token: result.token,
        }),
      );
      navigation.replace('Home');
    } else if (result.errors) {
      const firstError = Object.values(result.errors)[0];
      if (Array.isArray(firstError)) {
        setErrorMessage(String(firstError[0]));
      } else {
        setErrorMessage('Η εγγραφή απέτυχε.');
      }
    } else {
      setErrorMessage(result.message || 'Η εγγραφή απέτυχε.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Δημιουργία Χρήστη</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#777"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Όνομα"
        placeholderTextColor="#777"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Επώνυμο"
        placeholderTextColor="#777"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#777"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Επιβεβαίωση Password"
        placeholderTextColor="#777"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Εγγραφή</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.secondaryButtonText}>Πίσω στο Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.fireOrange,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.white,
    marginBottom: 30,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: colors.white,
    color: colors.smoke,
  },
  button: {
    backgroundColor: colors.fireOrangeDark,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.white,
  },
  secondaryButtonText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: colors.white,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
});
