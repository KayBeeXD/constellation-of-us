export interface StarNode {
  id: number;
  name: string;
  quote: string;
  detail?: string;
  xPct: number; // percentage X position (0 to 100)
  yPct: number; // percentage Y position (0 to 100)
}

export type AppStage = 'WELCOME' | 'EXPLORING' | 'COMPLETED';

export interface LoveLetterContent {
  title: string;
  salutation: string;
  bodyParagraphs: string[];
  closing: string;
  signature: string;
}

export interface AudioSettings {
  isMuted: boolean;
  volume: number; // 0 to 1
  soundFxEnabled: boolean;
  trackIndex: number;
}
