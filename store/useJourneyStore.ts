import { getSlotTrack } from "@/api/client";
import { create } from "zustand";

interface JourneyState {
  currentStep: number;

  // Flags
  odometerUploaded: boolean;
  destinationReached: boolean;
  imageUploaded: boolean;
  consentFormUploaded: boolean;
  treatmentStarted: boolean;
  progressNoteUploaded: boolean;
  feedbackSubmitted: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  setOdometerUploaded: (value: boolean) => void;
  setDestinationReached: (value: boolean) => void;
  setImageUploaded: (value: boolean) => void;
  setConsentFormUploaded: (value: boolean) => void;
  setTreatmentStarted: (value: boolean) => void;
  setProgressNoteUploaded: (value: boolean) => void;
  setFeedbackSubmitted: (value: boolean) => void;
  progressToNextStep: () => void;

  resetJourney: () => void;
  refreshSlotTrack: (slotId: string) => Promise<void>;
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  currentStep: 0,

  // Flags
  odometerUploaded: false,
  destinationReached: false,
  imageUploaded: false,
  consentFormUploaded: false,
  treatmentStarted: false,
  progressNoteUploaded: false,
  feedbackSubmitted: false,

  // Setters
  setCurrentStep: (step) => set({ currentStep: step }),
  setOdometerUploaded: (value) => set({ odometerUploaded: value }),
  setDestinationReached: (value) => set({ destinationReached: value }),
  setImageUploaded: (value) => set({ imageUploaded: value }),
  setConsentFormUploaded: (value) => set({ consentFormUploaded: value }),
  setTreatmentStarted: (value) => set({ treatmentStarted: value }),
  setProgressNoteUploaded: (value) => set({ progressNoteUploaded: value }),
  setFeedbackSubmitted: (value) => set({ feedbackSubmitted: value }),
  progressToNextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

  // Reset
  resetJourney: () =>
    set({
      currentStep: 0,
      odometerUploaded: false,
      destinationReached: false,
      imageUploaded: false,
      consentFormUploaded: false,
      treatmentStarted: false,
      progressNoteUploaded: false,
      feedbackSubmitted: false,
    }),

  // Unified refresh method
  refreshSlotTrack: async (slotId: string) => {
    try {
      const res = await getSlotTrack(slotId);
      const completedSteps = res.data.filter(
        (t: any) => t.status === "completed"
      ).length;

      // Update step
      set({ currentStep: completedSteps });

      // Sync flags
      set({
        odometerUploaded: completedSteps >= 1,
        destinationReached: completedSteps >= 2,
        imageUploaded: completedSteps >= 2,
        consentFormUploaded: completedSteps >= 3,
        treatmentStarted: completedSteps >= 3,
        progressNoteUploaded: completedSteps >= 4,
        feedbackSubmitted: completedSteps >= 5,
      });
    } catch (err) {
      console.error("❌ refreshSlotTrack failed:", err);
    }
  },
}));
