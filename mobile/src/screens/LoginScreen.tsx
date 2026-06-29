import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { loginUser } from '../api/authApi';
import colors from '../theme/colors';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/authSlice';

type LoginScreenProps = {
  navigation: any;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage('');

    const result = await loginUser(username, password);

    setLoading(false);

    if (result.success) {
      dispatch(
        loginSuccess({
          user: result.user,
          token: result.token,
        }),
      );
      navigation.replace('Home');
    } else {
      setErrorMessage(result.message || 'Αποτυχία σύνδεσης.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Πυροσβεστική - Σύνδεση</Text>

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
        placeholder="Password"
        placeholderTextColor="#777"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.secondaryButtonText}>Δημιουργία Χρήστη</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
