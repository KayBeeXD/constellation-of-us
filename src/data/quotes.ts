import type { StarNode, LoveLetterContent } from '../types';

export const DEFAULT_STARS: StarNode[] = [
  {
    id: 1,
    name: "The First Spark",
    quote: "In a galaxy of billions, my eyes found yours, and suddenly the universe made quiet sense.",
    detail: "Remember the very first moment our eyes met? It felt as though time briefly paused just to let us notice each other.",
    xPct: 34,
    yPct: 32,
  },
  {
    id: 2,
    name: "Gravitational Pull",
    quote: "Like celestial bodies bound by gravity, I found myself effortlessly drawn into your orbit.",
    detail: "Every conversation with you drew me closer, turning quiet curiosity into deep adoration.",
    xPct: 50,
    yPct: 40,
  },
  {
    id: 3,
    name: "Constellation of Memories",
    quote: "Each smile we share is a star pinned to the night sky of my heart.",
    detail: "From late-night laughter to quiet glances, every single memory with you shines with pure magic.",
    xPct: 66,
    yPct: 32,
  },
  {
    id: 4,
    name: "My Dream",
    quote: "One day, morning will arrive and distance won’t be the first thing between us...",
    detail: "Walking beside you makes every dream feel reachable, every horizon bright and welcoming.",
    xPct: 76,
    yPct: 54,
  },
  {
    id: 5,
    name: "Anchor of My Soul",
    quote: "In a world of constant motion, you are my steady northern star.",
    detail: "No matter how turbulent the waves outside may be, holding your hand restores my peace instantly.",
    xPct: 50,
    yPct: 78,
  },
  {
    id: 6,
    name: "My Promise",
    quote: "I cannot quiet every wind that blows against you, but I will stand beside you until the air turns still.",
    detail: "Some feelings need no loud words—they are written into every heartbeat and quiet breeze.",
    xPct: 24,
    yPct: 54,
  },
  {
    id: 7,
    name: "The Eternal Tune",
    quote: "I would never fall in love until I found her\nI said, 'I would never fall, unless it's you I fall into'...",
    detail: "Our constellation is now complete. Every line drawn leads right back to where my heart belongs.",
    xPct: 50,
    yPct: 56,
  },
];

export const DEFAULT_LOVE_LETTER: LoveLetterContent = {
  title: "A Letter Written in the Stars 💫",
  salutation: "My Dearest Love,",
  bodyParagraphs: [
    "As I look up at the night sky, I realize that every single star connected tonight was just a reflection of how deeply you have changed my world. Before you entered my life, the sky was just darkness and distant points of light. Now, every twinkling star carries the sound of your laughter and the warmth of your touch.",
    "Thank you for being my haven, my greatest adventure, and my favorite place to be. You have given my days purpose and my nights comfort. In this vast, infinite cosmos, finding you is the most beautiful miracle that will ever happen to me.",
    "Wherever the universe takes us, I promise to hold your hand, stare at the stars with you, and love you more with every passing day."
  ],
  closing: "Forever & Always,",
  signature: "Yours, Mr. Interest ✨"
};

// Storage helper functions for live customizer
const QUOTES_STORAGE_KEY = 'constellation_us_quotes_v5';
const LETTER_STORAGE_KEY = 'constellation_us_letter';

export function getStoredStars(): StarNode[] {
  try {
    const data = localStorage.getItem(QUOTES_STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_STARS;
  } catch (e) {
    return DEFAULT_STARS;
  }
}

export function saveStoredStars(stars: StarNode[]): void {
  try {
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(stars));
  } catch (e) {
    console.error('Failed to save stars', e);
  }
}

export function getStoredLetter(): LoveLetterContent {
  try {
    const data = localStorage.getItem(LETTER_STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_LOVE_LETTER;
  } catch (e) {
    return DEFAULT_LOVE_LETTER;
  }
}

export function saveStoredLetter(letter: LoveLetterContent): void {
  try {
    localStorage.setItem(LETTER_STORAGE_KEY, JSON.stringify(letter));
  } catch (e) {
    console.error('Failed to save letter', e);
  }
}

export function resetStoredData(): void {
  localStorage.removeItem(QUOTES_STORAGE_KEY);
  localStorage.removeItem(LETTER_STORAGE_KEY);
}
