import axios from "axios";
import keycloak from "../keycloak";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 20000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (keycloak?.authenticated) {
        await keycloak.updateToken(30);
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
    } catch (error) {
      console.error("Keycloak token update failed:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;