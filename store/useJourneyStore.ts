import { create } from "zustand";

interface JourneyState {
  odometerUploaded: boolean;
  destinationReached: boolean;
  imageUploaded: boolean;
  consentFormUploaded: boolean;
  treatmentStarted: boolean;
  currentStep: number;
  setOdometerUploaded: (status: boolean) => void;
  setDestinationReached: (status: boolean) => void;
  setImageUploaded: (status: boolean) => void;
  setConsentFormUploaded: (status: boolean) => void;
  setTreatmentStarted: (status: boolean) => void;
  setCurrentStep: (step: number) => void;
  progressToNextStep: () => void;
  resetJourney: () => void;
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  odometerUploaded: false,
  destinationReached: false,
  imageUploaded: false,
  consentFormUploaded: false,
  treatmentStarted: false,
  currentStep: 0,
  setOdometerUploaded: (status) => set({ odometerUploaded: status }),
  setDestinationReached: (status) => set({ destinationReached: status }),
  setImageUploaded: (status) => set({ imageUploaded: status }),
  setConsentFormUploaded: (status) => set({ consentFormUploaded: status }),
  setTreatmentStarted: (status) => set({ treatmentStarted: status }),
  setCurrentStep: (step) => set({ currentStep: step }),
  progressToNextStep: () => {
    const { currentStep } = get();
    if (currentStep < 4) { // Max step is 4 (End)
      set({ currentStep: currentStep + 1 });
    }
  },
  resetJourney: () => set({
    odometerUploaded: false,
    destinationReached: false,
    imageUploaded: false,
    consentFormUploaded: false,
    treatmentStarted: false,
    currentStep: 0,
  }),
}));
