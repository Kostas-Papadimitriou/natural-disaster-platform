import apiClient from "./apiConfig";

export const getKeycloakUsersApi = async () => {
  const response = await apiClient.get("/api/kc-users/");
  return response.data;
};

export const createKeycloakUserApi = async (payload) => {
  const response = await apiClient.post("/api/kc-users/", payload);
  return response.data;
};

export const deleteKeycloakUserApi = async (userId) => {
  const response = await apiClient.delete(`/api/kc-users/${userId}/`);
  return response.data;
};

export const getKeycloakGroupsApi = async () => {
  const response = await apiClient.get("/api/kc-groups/");
  return response.data;
};

export const assignGroupApi = async (userId, groupId) => {
  const response = await apiClient.post(`/api/kc-users/${userId}/assign-group/`, {
    group_id: groupId,
  });
  return response.data;
};

export const removeGroupApi = async (userId, groupId) => {
  const response = await apiClient.post(`/api/kc-users/${userId}/remove-group/`, {
    group_id: groupId,
  });
  return response.data;
};