/**
 * KanjiVibe — Complete Curriculum Data Engine
 */

import { kanji as masterKanji, hiragana as masterHiragana, katakana as masterKatakana } from './kanjany-database';
import * as Categories from './categories';
import { sentenceTemplates } from './sentences';
import { VocabEntry, KanjiEntry, SentenceEntry } from './types';

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
  | 'vocab_adjectives'
  | 'vocab_anatomy'
  | 'vocab_animals'
  | 'vocab_colors'
  | 'vocab_daily'
  | 'vocab_family'
  | 'vocab_food'
  | 'vocab_grammar'
  | 'vocab_greetings'
  | 'vocab_kosado'
  | 'vocab_math'
  | 'vocab_months'
  | 'vocab_nature'
  | 'vocab_numbers'
  | 'vocab_particles'
  | 'vocab_phrases'
  | 'vocab_possessives'
  | 'vocab_time'
  | 'vocab_times'
  | 'vocab_verbs'
  | 'vocab_weather'
  | 'vocab_weekdays'
  | 'sentences'
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
  challengeType: 'multiple-choice' | 'sentence-builder' | 'flashcard';
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

// Aggregate all vocabulary from category files
const allVocab: VocabEntry[] = Object.values(Categories).flat() as VocabEntry[];

export const allWords: JapaneseWord[] = [
  ...masterKanji.map((k) => ({
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
    challengeType: 'multiple-choice' as 'multiple-choice' | 'sentence-builder' | 'flashcard',
    exampleSentence: k.exampleWords[0] ? {
      japanese: k.exampleWords[0].word,
      romaji: k.exampleWords[0].reading,
      english: k.exampleWords[0].meaning,
    } : undefined,
  })),
  ...masterHiragana.map((h) => ({
    id: `hiragana-${h.id}`,
    kanji: h.character,
    hiragana: h.character,
    romaji: h.romaji,
    english: h.romaji,
    category: 'hiragana' as Category,
    jlptLevel: 'N5' as JLPTLevel,
    challengeType: 'multiple-choice' as 'multiple-choice' | 'sentence-builder' | 'flashcard',
  })),
  ...masterKatakana.map((k) => ({
    id: `katakana-${k.id}`,
    kanji: k.character,
    hiragana: k.character,
    romaji: k.romaji,
    english: k.romaji,
    category: 'katakana' as Category,
    jlptLevel: 'N5' as JLPTLevel,
    challengeType: 'multiple-choice' as 'multiple-choice' | 'sentence-builder' | 'flashcard',
  })),
  ...allVocab.map((v) => ({
    id: `vocab-${v.id}`,
    kanji: v.japanese,
    hiragana: v.hiragana,
    romaji: v.romaji,
    english: v.english,
    category: `vocab_${v.category}` as Category,
    jlptLevel: 'N5' as JLPTLevel,
    challengeType: v.challengeType as 'multiple-choice' | 'sentence-builder' | 'flashcard',
    exampleSentence: v.exampleSentence,
  })),
  // Add Sentence Templates as their own category
  ...sentenceTemplates.map((st) => ({
    id: `sentence-${st.id}`,
    kanji: st.pattern,
    hiragana: st.pattern,
    romaji: '',
    english: st.id,
    category: 'sentences' as Category,
    jlptLevel: 'N5' as JLPTLevel,
    challengeType: 'sentence-builder' as 'multiple-choice' | 'sentence-builder' | 'flashcard',
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
