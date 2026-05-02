/**
 * KanjiVibe — Module Definitions (expanded)
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
  emoji: string;
}

export const modules: Module[] = [
  {
    id: 'hiragana',
    kanji: 'あ',
    emoji: '🔤',
    title: 'Hiragana',
    subtitle: 'The Phonetic Base',
    description: 'Master the 46 basic characters of the Japanese phonetic script. The foundation of all Japanese reading.',
    level: 'beginner',
    categories: ['hiragana'],
    accentColor: 'primary',
    lessonCount: 71,
    buttonLabel: 'Start Hiragana',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'katakana',
    kanji: 'ア',
    emoji: '🔡',
    title: 'Katakana',
    subtitle: 'Foreign Loanwords',
    description: 'Learn the script used for names, foreign words, and modern emphasis in Japanese.',
    level: 'beginner',
    categories: ['katakana'],
    accentColor: 'secondary',
    lessonCount: 71,
    buttonLabel: 'Start Katakana',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'kanji-numbers',
    kanji: '一',
    emoji: '🔢',
    title: 'Numbers',
    subtitle: 'Count in Japanese',
    description: 'Learn kanji for numbers 1–10 plus hundred, thousand, and ten-thousand.',
    level: 'beginner',
    categories: ['kanji_numbers'],
    accentColor: 'tertiary',
    lessonCount: 14,
    buttonLabel: 'Learn Numbers',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'kanji-time',
    kanji: '時',
    emoji: '🕐',
    title: 'Time Kanji',
    subtitle: 'Hours, Days & Years',
    description: 'Master kanji for time expressions — year, month, day, hour, minute, and more.',
    level: 'beginner',
    categories: ['kanji_time'],
    accentColor: 'primary',
    lessonCount: 10,
    buttonLabel: 'Study Time',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'kanji-nature',
    kanji: '山',
    emoji: '🌿',
    title: 'Nature Kanji',
    subtitle: 'Earth & Elements',
    description: 'Mountain, river, fire, water, tree — the essential nature kanji of N5.',
    level: 'beginner',
    categories: ['kanji_nature'],
    accentColor: 'secondary',
    lessonCount: 10,
    buttonLabel: 'Explore Nature',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'kanji-people',
    kanji: '人',
    emoji: '👨‍👩‍👧',
    title: 'People & Family',
    subtitle: 'Who\'s Who',
    description: 'Person, man, woman, child, father, mother — core kanji for talking about people.',
    level: 'beginner',
    categories: ['kanji_people', 'kanji_family'],
    accentColor: 'tertiary',
    lessonCount: 8,
    buttonLabel: 'Meet People',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'kanji-directions',
    kanji: '東',
    emoji: '🧭',
    title: 'Directions',
    subtitle: 'Find Your Way',
    description: 'East, West, North, South, Up, Down, Left, Right — essential direction kanji.',
    level: 'beginner',
    categories: ['kanji_direction'],
    accentColor: 'primary',
    lessonCount: 10,
    buttonLabel: 'Learn Directions',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'kanji-body',
    kanji: '目',
    emoji: '👁️',
    title: 'Body Parts',
    subtitle: 'Head to Toe',
    description: 'Eye, ear, mouth, hand, foot — essential body part kanji for N5.',
    level: 'beginner',
    categories: ['kanji_body'],
    accentColor: 'secondary',
    lessonCount: 8,
    buttonLabel: 'Body Kanji',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'verbs-n5',
    kanji: '行',
    emoji: '⚡',
    title: 'Verbs',
    subtitle: 'Action Words',
    description: 'Master essential N5 verbs and their basic forms — go, come, eat, drink and more.',
    level: 'intermediate',
    categories: ['vocab_verbs'],
    accentColor: 'tertiary',
    lessonCount: 47,
    buttonLabel: 'Study Verbs',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'i-adj',
    kanji: '新',
    emoji: '✨',
    title: 'I-Adjectives',
    subtitle: 'Descriptive Words',
    description: 'Learn to describe the world with essential N5 i-adjectives — big, small, fast, slow.',
    level: 'beginner',
    categories: ['vocab_adjectives'],
    accentColor: 'primary',
    lessonCount: 54,
    buttonLabel: 'Learn Adjectives',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'na-adj',
    kanji: '静',
    emoji: '🎭',
    title: 'Na-Adjectives',
    subtitle: 'States & Quality',
    description: 'Essential N5 na-adjectives for describing states, qualities, and personalities.',
    level: 'beginner',
    categories: ['vocab_adjectives'],
    accentColor: 'secondary',
    lessonCount: 35,
    buttonLabel: 'Study Na-Adj',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'colors-n5',
    kanji: '色',
    emoji: '🎨',
    title: 'Colors',
    subtitle: 'Vibrant World',
    description: 'Master primary and secondary colors in Japanese — red, blue, green, yellow and more.',
    level: 'beginner',
    categories: ['vocab_colors'],
    accentColor: 'tertiary',
    lessonCount: 8,
    buttonLabel: 'Learn Colors',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'greetings',
    kanji: '話',
    emoji: '👋',
    title: 'Greetings',
    subtitle: 'Everyday Speech',
    description: 'Essential greetings and phrases for daily interaction — hello, goodbye, thank you.',
    level: 'beginner',
    categories: ['vocab_greetings'],
    accentColor: 'primary',
    lessonCount: 20,
    buttonLabel: 'Start Speaking',
    buttonIcon: 'ArrowRight',
  },
  {
    id: 'kosado',
    kanji: 'こ',
    emoji: '👈',
    title: 'こそあど',
    subtitle: 'Demonstratives',
    description: 'The Japanese demonstrative system — this, that, which and their various forms.',
    level: 'intermediate',
    categories: ['vocab_kosado'],
    accentColor: 'secondary',
    lessonCount: 16,
    buttonLabel: 'Study こそあど',
    buttonIcon: 'ArrowRight',
  },
];

export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getModuleByCategory(category: string): Module | undefined {
  return modules.find(m => m.categories.includes(category as any));
}
