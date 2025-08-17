// store/trackMasterStore.ts
import { getTrackMaster } from '@/api/client';
import { TrackMasterResponse } from '@/utils/trackMaster';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface TrackMasterState {
  trackMaster: TrackMasterResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchTrackMaster: () => Promise<void>;
}

const SESSION_KEY = 'trackMasterFetched';

export const useTrackMasterStore = create<TrackMasterState>((set) => ({
  trackMaster: null,
  isLoading: false,
  error: null,

  fetchTrackMaster: async () => {
    try {
      // ✅ Check if API was already called
      const hasFetched = await AsyncStorage.getItem(SESSION_KEY);
      if (hasFetched === 'true') {
        console.log('⚡ Track master already fetched from AsyncStorage');
        return;
      }

      set({ isLoading: true, error: null });

      // ✅ Call API
      const response = await getTrackMaster(); // { msg, data }
      console.log("➡️ Raw TrackMaster response:", response);

      // ✅ Store only the data array
      set({ trackMaster: response.data, isLoading: false });

      // ✅ Mark API as fetched
      await AsyncStorage.setItem(SESSION_KEY, 'true');
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch track master',
        isLoading: false,
      });
      console.error('❌ Track master fetch error:', error);
    }
  },
}));
