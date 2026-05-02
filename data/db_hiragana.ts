// ============================================================
// Kanjany Database Export
// Generated: 2026-05-02T11:04:45.999Z
// Kanji: 86 | Hiragana: 71 | Katakana: 71 | Vocabulary: 431
// ============================================================

export interface KanjiEntry {
  id: number;
  character: string;
  onyomi: string[];
  kunyomi: string[];
  romaji: string[];
  meaning: string;
  strokeCount: number;
  category: string;
  level: string;
  exampleWords: { word: string; reading: string; meaning: string }[];
}

export interface HiraganaEntry {
  id: number;
  character: string;
  romaji: string;
  group: string;
}

export interface KatakanaEntry {
  id: number;
  character: string;
  romaji: string;
  group: string;
}

export interface VocabularyEntry {
  id: number;
  japanese: string;
  hiragana: string;
  romaji: string;
  english: string;
  category: string;
  partOfSpeech: string;
}

// ─── HIRAGANA (71 entries) ──────────────────────────────────────────
export const hiragana: HiraganaEntry[] = [
  { id: 143, character: "あ", romaji: "a", group: "a" },
  { id: 144, character: "い", romaji: "i", group: "a" },
  { id: 145, character: "う", romaji: "u", group: "a" },
  { id: 146, character: "え", romaji: "e", group: "a" },
  { id: 147, character: "お", romaji: "o", group: "a" },
  { id: 148, character: "か", romaji: "ka", group: "ka" },
  { id: 149, character: "き", romaji: "ki", group: "ka" },
  { id: 150, character: "く", romaji: "ku", group: "ka" },
  { id: 151, character: "け", romaji: "ke", group: "ka" },
  { id: 152, character: "こ", romaji: "ko", group: "ka" },
  { id: 153, character: "さ", romaji: "sa", group: "sa" },
  { id: 154, character: "し", romaji: "shi", group: "sa" },
  { id: 155, character: "す", romaji: "su", group: "sa" },
  { id: 156, character: "せ", romaji: "se", group: "sa" },
  { id: 157, character: "そ", romaji: "so", group: "sa" },
  { id: 158, character: "た", romaji: "ta", group: "ta" },
  { id: 159, character: "ち", romaji: "chi", group: "ta" },
  { id: 160, character: "つ", romaji: "tsu", group: "ta" },
  { id: 161, character: "て", romaji: "te", group: "ta" },
  { id: 162, character: "と", romaji: "to", group: "ta" },
  { id: 163, character: "な", romaji: "na", group: "na" },
  { id: 164, character: "に", romaji: "ni", group: "na" },
  { id: 165, character: "ぬ", romaji: "nu", group: "na" },
  { id: 166, character: "ね", romaji: "ne", group: "na" },
  { id: 167, character: "の", romaji: "no", group: "na" },
  { id: 168, character: "は", romaji: "ha", group: "ha" },
  { id: 169, character: "ひ", romaji: "hi", group: "ha" },
  { id: 170, character: "ふ", romaji: "fu", group: "ha" },
  { id: 171, character: "へ", romaji: "he", group: "ha" },
  { id: 172, character: "ほ", romaji: "ho", group: "ha" },
  { id: 173, character: "ま", romaji: "ma", group: "ma" },
  { id: 174, character: "み", romaji: "mi", group: "ma" },
  { id: 175, character: "む", romaji: "mu", group: "ma" },
  { id: 176, character: "め", romaji: "me", group: "ma" },
  { id: 177, character: "も", romaji: "mo", group: "ma" },
  { id: 178, character: "や", romaji: "ya", group: "ya" },
  { id: 179, character: "ゆ", romaji: "yu", group: "ya" },
  { id: 180, character: "よ", romaji: "yo", group: "ya" },
  { id: 181, character: "ら", romaji: "ra", group: "ra" },
  { id: 182, character: "り", romaji: "ri", group: "ra" },
  { id: 183, character: "る", romaji: "ru", group: "ra" },
  { id: 184, character: "れ", romaji: "re", group: "ra" },
  { id: 185, character: "ろ", romaji: "ro", group: "ra" },
  { id: 186, character: "わ", romaji: "wa", group: "wa" },
  { id: 187, character: "を", romaji: "wo", group: "wa" },
  { id: 188, character: "ん", romaji: "n", group: "n" },
  { id: 189, character: "が", romaji: "ga", group: "ga" },
  { id: 190, character: "ぎ", romaji: "gi", group: "ga" },
  { id: 191, character: "ぐ", romaji: "gu", group: "ga" },
  { id: 192, character: "げ", romaji: "ge", group: "ga" },
  { id: 193, character: "ご", romaji: "go", group: "ga" },
  { id: 194, character: "ざ", romaji: "za", group: "za" },
  { id: 195, character: "じ", romaji: "ji", group: "za" },
  { id: 196, character: "ず", romaji: "zu", group: "za" },
  { id: 197, character: "ぜ", romaji: "ze", group: "za" },
  { id: 198, character: "ぞ", romaji: "zo", group: "za" },
  { id: 199, character: "だ", romaji: "da", group: "da" },
  { id: 200, character: "ぢ", romaji: "ji", group: "da" },
  { id: 201, character: "づ", romaji: "zu", group: "da" },
  { id: 202, character: "で", romaji: "de", group: "da" },
  { id: 203, character: "ど", romaji: "do", group: "da" },
  { id: 204, character: "ば", romaji: "ba", group: "ba" },
  { id: 205, character: "び", romaji: "bi", group: "ba" },
  { id: 206, character: "ぶ", romaji: "bu", group: "ba" },
  { id: 207, character: "べ", romaji: "be", group: "ba" },
  { id: 208, character: "ぼ", romaji: "bo", group: "ba" },
  { id: 209, character: "ぱ", romaji: "pa", group: "pa" },
  { id: 210, character: "ぴ", romaji: "pi", group: "pa" },
  { id: 211, character: "ぷ", romaji: "pu", group: "pa" },
  { id: 212, character: "ぺ", romaji: "pe", group: "pa" },
  { id: 213, character: "ぽ", romaji: "po", group: "pa" },
];

