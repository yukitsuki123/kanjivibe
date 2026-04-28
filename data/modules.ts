/**
 * KanjiVibe — Module Definitions
 */

import { Category } from './curriculum';

export interface Module {
  id: string;
  kanji: string;
  title: string;
  subtitle: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'locked';
  categories: Category[];
  accentColor: 'primary' | 'secondary' | 'tertiary' | 'neutral';
  lessonCount: number;
  buttonLabel: string;
  buttonIcon: string;
}

export const modules: Module[] = [
  {
    id: 'hiragana',
    kanji: 'あ',
    title: 'Hiragana',
    subtitle: 'The Phonetic Base',
    description: 'Master the 46 basic characters of the Japanese phonetic script.',
    level: 'beginner',
    categories: ['hiragana'],
    accentColor: 'primary',
    lessonCount: 46,
    buttonLabel: 'Start Hiragana',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'katakana',
    kanji: 'ア',
    title: 'Katakana',
    subtitle: 'Foreign Loanwords',
    description: 'Learn the script used for names, foreign words, and emphasis.',
    level: 'beginner',
    categories: ['katakana'],
    accentColor: 'secondary',
    lessonCount: 46,
    buttonLabel: 'Start Katakana',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'numbers',
    kanji: '一',
    title: 'N5 Kanji',
    subtitle: 'Basic Characters',
    description: 'The foundation of Japanese writing system. Essential N5 Kanji.',
    level: 'beginner',
    categories: ['kanji_basic'],
    accentColor: 'tertiary',
    lessonCount: 80,
    buttonLabel: 'Learn Kanji',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'verbs-n5',
    kanji: '行',
    title: 'Verbs',
    subtitle: 'Action Words',
    description: 'Master essential N5 verbs and their basic forms.',
    level: 'intermediate',
    categories: ['verbs'],
    accentColor: 'primary',
    lessonCount: 50,
    buttonLabel: 'Study Verbs',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'i-adj',
    kanji: '新',
    title: 'I-Adjectives',
    subtitle: 'Descriptive Words',
    description: 'Learn to describe the world with essential N5 i-adjectives.',
    level: 'beginner',
    categories: ['i_adjectives'],
    accentColor: 'secondary',
    lessonCount: 40,
    buttonLabel: 'Learn Adjectives',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'na-adj',
    kanji: '静',
    title: 'Na-Adjectives',
    subtitle: 'States & Quality',
    description: 'Essential N5 na-adjectives for describing states and qualities.',
    level: 'beginner',
    categories: ['na_adjectives'],
    accentColor: 'tertiary',
    lessonCount: 35,
    buttonLabel: 'Study Na-Adj',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'colors-n5',
    kanji: '色',
    title: 'Colors',
    subtitle: 'Vibrant World',
    description: 'Master the primary and secondary colors in Japanese.',
    level: 'beginner',
    categories: ['colors'],
    accentColor: 'primary',
    lessonCount: 12,
    buttonLabel: 'Learn Colors',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'essential-phrases',
    kanji: '話',
    title: 'Greetings',
    subtitle: 'Everyday Speech',
    description: 'Essential greetings and phrases for daily interaction.',
    level: 'beginner',
    categories: ['greetings'],
    accentColor: 'secondary',
    lessonCount: 15,
    buttonLabel: 'Start Speaking',
    buttonIcon: 'ArrowRight',
  },
];

export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}
