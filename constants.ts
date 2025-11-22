import { ProgramType } from './types';

export const PROGRAM_OPTIONS = [
  { label: 'Start Prayer', value: ProgramType.START_PRAYER, icon: '🙏', allowMultiple: false },
  { label: 'Song', value: ProgramType.SONG, icon: '🎵', allowMultiple: false },
  { label: 'Bible Session', value: ProgramType.BIBLE_READING, icon: '📖', allowMultiple: false },
  { label: 'Sosthra Palli', value: ProgramType.SOSTHRA_PALLI, icon: '🙌', allowMultiple: false },
  { label: 'Prayer Session', value: ProgramType.PRAYER_SESSION, icon: '🕊️', allowMultiple: false },
  { label: 'End Prayer', value: ProgramType.END_PRAYER, icon: '✨', allowMultiple: false },
];

export const APP_STORAGE_KEY = 'prayerflow_entries_v1';