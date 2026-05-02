/**
 * KanjiVibe — Complete Curriculum Data Engine
 */

import { kanji } from './db_kanji';
import { hiragana } from './db_hiragana';
import { katakana } from './db_katakana';
import { vocabulary } from './db_vocabulary';

// ─── SRS Card Type ────────────────────────────────────────────────────

export interface SRSCard {
  wordId: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  dueDate: string;
  lastReview?: string;
}

// ─── Types ───────────────────────────────────────────────────────────

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type Category =
  | 'hiragana'
  | 'katakana'
  | 'kanji_basic'
  | 'food'
  | 'colors'
  | 'animals'
  | 'slang'
  | 'kosado'
  | 'anatomy'
  | 'particles'
  | 'verb_conjugation'
  | 'numbers'
  | 'money'
  | 'time'
  | 'direction'
  | 'size'
  | 'weather'
  | 'people'
  | 'family'
  | 'social'
  | 'education'
  | 'language'
  | 'place'
  | 'body'
  | 'adjectives'
  | 'anatomy'
  | 'animals'
  | 'conjugation'
  | 'daily'
  | 'food'
  | 'grammar'
  | 'greetings'
  | 'kosado'
  | 'math'
  | 'months'
  | 'nature'
  | 'particles'
  | 'phrases'
  | 'possessives'
  | 'times'
  | 'verbs'
  | 'weekdays'
  | string;

export interface JapaneseWord {
  id: string;
  kanji: string;
  hiragana: string;
  katakana?: string;
  romaji: string;
  english: string;
  category: Category;
  jlptLevel: JLPTLevel;
  strokes?: number;
  frequency?: number;
  onyomi?: string;
  kunyomi?: string;
  exampleSentence?: {
    japanese: string;
    romaji: string;
    english: string;
  };
}

// ─── Master Curriculum ───────────────────────────────────────────────

export const allWords: JapaneseWord[] = [
  ...kanji.map((k) => ({
    id: `kanji-${k.id}`,
    kanji: k.character,
    hiragana: k.kunyomi[0] || k.onyomi[0] || '',
    romaji: k.romaji[0] || '',
    english: k.meaning,
    category: `kanji_${k.category}` as Category,
    jlptLevel: k.level as JLPTLevel,
    onyomi: k.onyomi.join(', '),
    kunyomi: k.kunyomi.join(', '),
    strokes: k.strokeCount,
    exampleSentence: k.exampleWords[0] ? {
      japanese: k.exampleWords[0].word,
      romaji: k.exampleWords[0].reading,
      english: k.exampleWords[0].meaning,
    } : undefined,
  })),
  ...hiragana.map((h) => ({
    id: `hiragana-${h.id}`,
    kanji: h.character,
    hiragana: h.character,
    romaji: h.romaji,
    english: h.romaji,
    category: 'hiragana' as Category,
    jlptLevel: 'N5' as JLPTLevel,
  })),
  ...katakana.map((k) => ({
    id: `katakana-${k.id}`,
    kanji: k.character,
    hiragana: k.character,
    romaji: k.romaji,
    english: k.romaji,
    category: 'katakana' as Category,
    jlptLevel: 'N5' as JLPTLevel,
  })),
  ...vocabulary.map((v) => ({
    id: `vocab-${v.id}`,
    kanji: v.japanese,
    hiragana: v.hiragana,
    romaji: v.romaji,
    english: v.english,
    category: `vocab_${v.category}` as Category,
    jlptLevel: 'N5' as JLPTLevel,
  })),
];

export function getWordsByCategory(category: Category): JapaneseWord[] {
  return allWords.filter(w => w.category === category);
}

export function getKanjiOfTheDay(): JapaneseWord {
  const kanjiWords = allWords.filter(w => w.category === 'kanji_basic');
  const dayIndex = new Date().getDate() % (kanjiWords.length || 1);
  return kanjiWords[dayIndex] || allWords[0];
}

export function getCategoryWordCount(category: Category): number {
  return allWords.filter(w => w.category === category).length;
}
