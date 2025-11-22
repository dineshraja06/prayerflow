export enum ProgramType {
  START_PRAYER = 'Start Prayer',
  SONG = 'Song',
  BIBLE_READING = 'Bible Session',
  SOSTHRA_PALLI = 'Sosthra Palli',
  PRAYER_SESSION = 'Prayer Session',
  END_PRAYER = 'End Prayer',
  OTHER = 'Other'
}

export interface ProgramEntry {
  id: string;
  type: ProgramType;
  personName: string;
  details: string; // Song name, Bible verse, etc.
  timestamp: number;
  completed: boolean;
}

export interface GenerateSummaryResponse {
  openingSpeech: string;
  agendaSummary: string;
  closingRemarks: string;
}