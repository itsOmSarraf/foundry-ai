'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define current store version for migration handling
const STORE_VERSION = 2;

// Define the store type
interface OnboardingState {
  data: Record<string, any>;
  version: number;
  setData: (data: Record<string, any>) => void;
  updateField: (key: string, value: any) => void;
  clearData: () => void;
  forceRefresh: () => void;
}

// Create the store with localStorage persistence
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      data: {},
      version: STORE_VERSION,
      setData: (data) => set({ data }),
      updateField: (key, value) => 
        set((state) => ({ 
          data: { ...state.data, [key]: value } 
        })),
      clearData: () => set({ data: {} }),
      forceRefresh: () => {
        // Get current data and force a re-render by setting it again
        const currentData = {...get().data};
        // Add a timestamp to ensure state changes
        set({ 
          data: { 
            ...currentData, 
            _lastRefreshed: new Date().toISOString() 
          },
          version: STORE_VERSION, // Ensure version is current
        });
      }
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => localStorage),
      // Handle version migrations
      onRehydrateStorage: () => (state) => {
        // When the store is rehydrated, check if version needs update
        if (state && state.version !== STORE_VERSION) {
          console.log(`Updating store from version ${state.version} to ${STORE_VERSION}`);
          // Force update the version
          state.version = STORE_VERSION;
          // Add refresh timestamp
          if (state.data) {
            state.data._lastRefreshed = new Date().toISOString();
          }
        }
      },
    }
  )
); 