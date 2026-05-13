/**
 * KanjiVibe — Core Data Types & Interfaces
 */

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type ChallengeType = 'multiple-choice' | 'sentence-builder' | 'flashcard';

export interface BaseEntry {
  id: string | number;
  japanese: string;
  hiragana: string;
  romaji: string;
  english: string;
  category: string;
  challengeType: ChallengeType;
}

export interface KanjiEntry extends BaseEntry {
  onyomi: string[];
  kunyomi: string[];
  strokeCount: number;
  level: JLPTLevel;
  exampleWords: {
    word: string;
    reading: string;
    meaning: string;
  }[];
}

export interface VocabEntry extends BaseEntry {
  katakana?: string;
  partOfSpeech: string;
  exampleSentence?: {
    japanese: string;
    english: string;
    romaji?: string;
  };
}

export interface SentenceEntry extends BaseEntry {
  slots: {
    id: string;
    label: string;
    options: {
      kanji: string;
      hiragana: string;
      romaji: string;
      english: string;
    }[];
  }[];
  template: string; // e.g. "{subject} は {object} を {verb} ます。"
}
