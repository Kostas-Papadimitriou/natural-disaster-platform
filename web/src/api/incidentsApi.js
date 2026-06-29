import apiClient from "./apiConfig";

export const getIncidentsApi = async () => {
  const response = await apiClient.get("/incidents/");
  return response.data;
};

export const sendIncidentEmailApi = async (incidentId) => {
  const response = await apiClient.post(`/incidents/${incidentId}/send-email/`);
  return response.data;
};