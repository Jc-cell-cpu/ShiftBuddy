import { create } from "zustand";

interface JourneyState {
  odometerUploaded: boolean;
  currentStep: number;
  setOdometerUploaded: (status: boolean) => void;
  setCurrentStep: (step: number) => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  odometerUploaded: false,
  currentStep: 0,
  setOdometerUploaded: (status) => set({ odometerUploaded: status }),
  setCurrentStep: (step) => set({ currentStep: step }),
}));
