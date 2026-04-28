/**
 * KanjiVibe — Complete Curriculum Data Engine
 */

import { WordsN5 } from '../constants/WordN5';
import { Verbs } from '../constants/Verbs';
import { IADJ } from '../constants/Iadj';
import { Naadj } from '../constants/Naadj';
import { ColorsN5 } from '../constants/ColorN5';

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
  | 'adjectives'
  | 'days'
  | 'months'
  | 'counting'
  | 'time_of_day'
  | 'greetings'
  | 'nature'
  | 'verbs'
  | 'i_adjectives'
  | 'na_adjectives';

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

// ─── Data Sources ────────────────────────────────────────────────────

const rawLetters = [
  { hiragana: 'あ', katakana: 'ア', romaji: 'a' },
  { hiragana: 'い', katakana: 'イ', romaji: 'i' },
  { hiragana: 'う', katakana: 'ウ', romaji: 'u' },
  { hiragana: 'え', katakana: 'エ', romaji: 'e' },
  { hiragana: 'お', katakana: 'オ', romaji: 'o' },
  { hiragana: 'か', katakana: 'カ', romaji: 'ka' },
  { hiragana: 'き', katakana: 'キ', romaji: 'ki' },
  { hiragana: 'く', katakana: 'ク', romaji: 'ku' },
  { hiragana: 'け', katakana: 'ケ', romaji: 'ke' },
  { hiragana: 'こ', katakana: 'コ', romaji: 'ko' },
  { hiragana: 'が', katakana: 'ガ', romaji: 'ga' },
  { hiragana: 'ぎ', katakana: 'ギ', romaji: 'gi' },
  { hiragana: 'ぐ', katakana: 'グ', romaji: 'gu' },
  { hiragana: 'げ', katakana: 'ゲ', romaji: 'ge' },
  { hiragana: 'ご', katakana: 'ゴ', romaji: 'go' },
  { hiragana: 'さ', katakana: 'サ', romaji: 'sa' },
  { hiragana: 'し', katakana: 'シ', romaji: 'shi' },
  { hiragana: 'す', katakana: 'ス', romaji: 'su' },
  { hiragana: 'せ', katakana: 'セ', romaji: 'se' },
  { hiragana: 'そ', katakana: 'ソ', romaji: 'so' },
  { hiragana: 'ざ', katakana: 'ザ', romaji: 'za' },
  { hiragana: 'じ', katakana: 'ジ', romaji: 'ji' },
  { hiragana: 'ず', katakana: 'ズ', romaji: 'zu' },
  { hiragana: 'ぜ', katakana: 'ゼ', romaji: 'ze' },
  { hiragana: 'ぞ', katakana: 'ゾ', romaji: 'zo' },
  { hiragana: 'た', katakana: 'タ', romaji: 'ta' },
  { hiragana: 'ち', katakana: 'チ', romaji: 'chi' },
  { hiragana: 'つ', katakana: 'ツ', romaji: 'tsu' },
  { hiragana: 'て', katakana: 'テ', romaji: 'te' },
  { hiragana: 'と', katakana: 'ト', romaji: 'to' },
  { hiragana: 'だ', katakana: 'ダ', romaji: 'da' },
  { hiragana: 'ぢ', katakana: 'ヂ', romaji: 'ji' },
  { hiragana: 'づ', katakana: 'ヅ', romaji: 'zu' },
  { hiragana: 'で', katakana: 'デ', romaji: 'de' },
  { hiragana: 'ど', katakana: 'ド', romaji: 'do' },
  { hiragana: 'ば', katakana: 'バ', romaji: 'ba' },
  { hiragana: 'び', katakana: 'ビ', romaji: 'bi' },
  { hiragana: 'ぶ', katakana: 'ブ', romaji: 'bu' },
  { hiragana: 'べ', katakana: 'ベ', romaji: 'be' },
  { hiragana: 'ぼ', katakana: 'ボ', romaji: 'bo' },
  { hiragana: 'ぱ', katakana: 'パ', romaji: 'pa' },
  { hiragana: 'ぴ', katakana: 'ピ', romaji: 'pi' },
  { hiragana: 'ぷ', katakana: 'プ', romaji: 'pu' },
  { hiragana: 'ぺ', katakana: 'ペ', romaji: 'pe' },
  { hiragana: 'ぽ', katakana: 'ポ', romaji: 'po' },
  { hiragana: 'びゃ', katakana: 'ビャ', romaji: 'bya' },
  { hiragana: 'びゅ', katakana: 'ビュ', romaji: 'byu' },
  { hiragana: 'びょ', katakana: 'ビョ', romaji: 'byo' },
  { hiragana: 'ぴゃ', katakana: 'ピャ', romaji: 'pya' },
  { hiragana: 'ぴゅ', katakana: 'ピュ', romaji: 'pyu' },
  { hiragana: 'ぴょ', katakana: 'ピョ', romaji: 'pyo' }
];

// ─── Helpers ─────────────────────────────────────────────────────────

function transformList(data: any[], category: Category, idPrefix: string): JapaneseWord[] {
  if (!data) return [];
  return data.map((w, i) => ({
    id: `${idPrefix}-${i}`,
    kanji: w.kanji || w.Kanji || '',
    hiragana: w.hiragana || w.Furigana || w.kun?.split('/')[1] || w.on?.split('/')[1] || '',
    romaji: w.romaji || w.Romaji || w.kun?.split('/')[0] || w.on?.split('/')[0] || '',
    english: w.english || w.Meaning || '',
    category,
    jlptLevel: 'N5',
    onyomi: w.on,
    kunyomi: w.kun,
    exampleSentence: w.vocabulary ? {
      japanese: w.vocabulary,
      romaji: w.vocabulary.split('/')[1] || '',
      english: w.vocabenglish
    } : undefined
  }));
}

// ─── Master Curriculum ───────────────────────────────────────────────

export const allWords: JapaneseWord[] = [
  ...rawLetters.map((l, i) => ({
    id: `h-${i}`,
    kanji: l.hiragana,
    hiragana: l.hiragana,
    romaji: l.romaji,
    english: l.romaji,
    category: 'hiragana' as Category,
    jlptLevel: 'N5' as JLPTLevel
  })),
  ...rawLetters.map((l, i) => ({
    id: `k-${i}`,
    kanji: l.katakana,
    hiragana: l.hiragana,
    katakana: l.katakana,
    romaji: l.romaji,
    english: l.romaji,
    category: 'katakana' as Category,
    jlptLevel: 'N5' as JLPTLevel
  })),
  ...transformList(WordsN5, 'kanji_basic', 'w5'),
  ...transformList(Verbs, 'verbs', 'v'),
  ...transformList(IADJ, 'i_adjectives', 'ia'),
  ...transformList(Naadj, 'na_adjectives', 'naa'),
  ...transformList(ColorsN5, 'colors', 'clr'),
];

export function getWordsByCategory(category: Category): JapaneseWord[] {
  return allWords.filter(w => w.category === category);
}

export function getKanjiOfTheDay(): JapaneseWord {
  const kanjiWords = allWords.filter(w => w.category === 'kanji_basic');
  const dayIndex = new Date().getDate() % (kanjiWords.length || 1);
  return kanjiWords[dayIndex] || allWords[0];
}
