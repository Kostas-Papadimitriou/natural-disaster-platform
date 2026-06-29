import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import IncidentFormScreen from '../screens/IncidentFormScreen';
import colors from '../theme/colors';
import RegisterScreen from '../screens/RegisterScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  IncidentForm: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.fireOrange,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: colors.ash,
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Σύνδεση', headerShown: false }}
        />

        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Αρχική' }}
        />
        <Stack.Screen
          name="IncidentForm"
          component={IncidentFormScreen}
          options={{ title: 'Φόρμα Περιστατικού' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
