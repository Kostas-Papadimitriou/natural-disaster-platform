import apiClient from './apiConfig';

export const submitIncidentApi = async (incident: any) => {
  const formData = new FormData();

  formData.append('incident_type', incident.incidentType || 'Άλλο');
  formData.append('title', incident.title || '');
  formData.append('description', incident.description || '');
  formData.append('area', incident.area || '');
  formData.append('reporter_name', incident.reporterName || '');
  formData.append('phone', incident.phone || '');

  if (incident.latitude !== null && incident.latitude !== undefined) {
    formData.append('latitude', String(incident.latitude));
  }

  if (incident.longitude !== null && incident.longitude !== undefined) {
    formData.append('longitude', String(incident.longitude));
  }

  if (incident.videoUri) {
    formData.append('video', {
      uri: incident.videoUri,
      name: 'incident_video.mp4',
      type: 'video/mp4',
    } as any);
  }

  if (incident.photoUri) {
    formData.append('photo', {
      uri: incident.photoUri,
      name: 'incident_photo.jpg',
      type: 'image/jpeg',
    } as any);
  }

  if (incident.audioUri) {
    formData.append('audio', {
      uri: incident.audioUri,
      name: 'incident_audio.m4a',
      type: 'audio/mp4',
    } as any);
  }

  const response = await apiClient.post('/submit/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
  });

  return response.data;
};
