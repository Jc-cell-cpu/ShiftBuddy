// useJourneyStore.ts
import { create } from "zustand";

interface JourneyState {
  odometerUploaded: boolean;
  destinationReached: boolean;
  imageUploaded: boolean;
  consentFormUploaded: boolean;
  treatmentStarted: boolean;
  progressNoteUploaded: boolean;
  feedbackSubmitted: boolean;
  currentStep: number;
  journeyId: string | null;
  setOdometerUploaded: (status: boolean) => void;
  setDestinationReached: (status: boolean) => void;
  setImageUploaded: (status: boolean) => void;
  setConsentFormUploaded: (status: boolean) => void;
  setTreatmentStarted: (status: boolean) => void;
  setProgressNoteUploaded: (status: boolean) => void;
  setFeedbackSubmitted: (status: boolean) => void;
  setCurrentStep: (step: number) => void;
  setJourneyId: (id: string | null) => void;
  progressToNextStep: () => void;
  resetJourney: () => void;
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  odometerUploaded: false,
  destinationReached: false,
  imageUploaded: false,
  consentFormUploaded: false,
  treatmentStarted: false,
  progressNoteUploaded: false,
  feedbackSubmitted: false,
  currentStep: 0,
  journeyId: null,
  setOdometerUploaded: (status) => set({ odometerUploaded: status }),
  setDestinationReached: (status) => set({ destinationReached: status }),
  setImageUploaded: (status) => set({ imageUploaded: status }),
  setConsentFormUploaded: (status) => set({ consentFormUploaded: status }),
  setTreatmentStarted: (status) => set({ treatmentStarted: status }),
  setProgressNoteUploaded: (status) => set({ progressNoteUploaded: status }),
  setFeedbackSubmitted: (status) => set({ feedbackSubmitted: status }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setJourneyId: (id) => set({ journeyId: id }),
  progressToNextStep: () => {
    const { currentStep } = get();
    if (currentStep < 5) { // Max step is 5 (Share Feedback) - feedback is the final step
      set({ currentStep: currentStep + 1 });
    }
  },
  resetJourney: () => set({
    odometerUploaded: false,
    destinationReached: false,
    imageUploaded: false,
    consentFormUploaded: false,
    treatmentStarted: false,
    progressNoteUploaded: false,
    feedbackSubmitted: false,
    currentStep: 0,
    journeyId: null,
  }),
}));