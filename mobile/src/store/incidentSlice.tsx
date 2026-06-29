import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IncidentType =
  | 'Πυρκαγιά'
  | 'Τροχαίο'
  | 'Διάσωση'
  | 'Πλημμύρα'
  | 'Άλλο';

type IncidentState = {
  videoUri: string;
  photoUri: string;
  audioUri: string;
  incidentType: IncidentType;
  title: string;
  description: string;
  area: string;
  reporterName: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  submitted: boolean;
};

const initialState: IncidentState = {
  videoUri: '',
  photoUri: '',
  audioUri: '',
  incidentType: 'Άλλο',
  title: '',
  description: '',
  area: '',
  reporterName: '',
  phone: '',
  latitude: null,
  longitude: null,
  submitted: false,
};

const incidentSlice = createSlice({
  name: 'incident',
  initialState,
  reducers: {
    setVideoUri: (state, action: PayloadAction<string>) => {
      state.videoUri = action.payload;
    },
    setPhotoUri: (state, action: PayloadAction<string>) => {
      state.photoUri = action.payload;
    },
    setAudioUri: (state, action: PayloadAction<string>) => {
      state.audioUri = action.payload;
    },
    setIncidentType: (state, action: PayloadAction<IncidentType>) => {
      state.incidentType = action.payload;
    },
    setCoordinates: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>,
    ) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    updateIncidentField: (
      state,
      action: PayloadAction<{ field: keyof IncidentState; value: string }>,
    ) => {
      const { field, value } = action.payload;
      (state[field] as any) = value;
    },
    markSubmitted: state => {
      state.submitted = true;
    },
    clearIncident: () => initialState,
  },
});

export const {
  setVideoUri,
  setPhotoUri,
  setAudioUri,
  setIncidentType,
  setCoordinates,
  updateIncidentField,
  markSubmitted,
  clearIncident,
} = incidentSlice.actions;

export default incidentSlice.reducer;
