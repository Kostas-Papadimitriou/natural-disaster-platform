import apiClient from './apiConfig';

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await apiClient.post('/api/auth/login/', {
      username,
      password,
    });

    return response.data;
  } catch (error: any) {
    if (error?.response?.data) {
      return error.response.data;
    }

    return {
      success: false,
      message: 'Αδυναμία σύνδεσης με τον server.',
    };
  }
};

export const registerUser = async (payload: {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}) => {
  try {
    const response = await apiClient.post('/api/auth/register/', payload);
    return response.data;
  } catch (error: any) {
    if (error?.response?.data) {
      return error.response.data;
    }

    return {
      success: false,
      message: 'Αδυναμία σύνδεσης με τον server.',
    };
  }
};
