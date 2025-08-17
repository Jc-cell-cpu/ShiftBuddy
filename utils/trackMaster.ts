// types/trackMaster.ts
export interface Track {
  _id: string;
  trackName: string;
}

export interface TrackMasterResponse {
  msg: string;
  data: Track[];
}