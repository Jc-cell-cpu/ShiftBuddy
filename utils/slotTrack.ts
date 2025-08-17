// types/slotTrack.ts
export interface AddSlotTrackRequest {
  slotId: any;
  trackId: any;
  docId?: any; // Optional, as it might not always be required
  note?: any; // Optional, as it might not always be required
  rating?: any; // Optional, as it might not always be required
}

export interface AddSlotTrackResponse {
  msg: any;
  data: any[]; // Empty array in the response, but using any[] for flexibility
}