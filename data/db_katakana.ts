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

// ─── KATAKANA (71 entries) ──────────────────────────────────────────
export const katakana: KatakanaEntry[] = [
  { id: 143, character: "ア", romaji: "a", group: "a" },
  { id: 144, character: "イ", romaji: "i", group: "a" },
  { id: 145, character: "ウ", romaji: "u", group: "a" },
  { id: 146, character: "エ", romaji: "e", group: "a" },
  { id: 147, character: "オ", romaji: "o", group: "a" },
  { id: 148, character: "カ", romaji: "ka", group: "ka" },
  { id: 149, character: "キ", romaji: "ki", group: "ka" },
  { id: 150, character: "ク", romaji: "ku", group: "ka" },
  { id: 151, character: "ケ", romaji: "ke", group: "ka" },
  { id: 152, character: "コ", romaji: "ko", group: "ka" },
  { id: 153, character: "サ", romaji: "sa", group: "sa" },
  { id: 154, character: "シ", romaji: "shi", group: "sa" },
  { id: 155, character: "ス", romaji: "su", group: "sa" },
  { id: 156, character: "セ", romaji: "se", group: "sa" },
  { id: 157, character: "ソ", romaji: "so", group: "sa" },
  { id: 158, character: "タ", romaji: "ta", group: "ta" },
  { id: 159, character: "チ", romaji: "chi", group: "ta" },
  { id: 160, character: "ツ", romaji: "tsu", group: "ta" },
  { id: 161, character: "テ", romaji: "te", group: "ta" },
  { id: 162, character: "ト", romaji: "to", group: "ta" },
  { id: 163, character: "ナ", romaji: "na", group: "na" },
  { id: 164, character: "ニ", romaji: "ni", group: "na" },
  { id: 165, character: "ヌ", romaji: "nu", group: "na" },
  { id: 166, character: "ネ", romaji: "ne", group: "na" },
  { id: 167, character: "ノ", romaji: "no", group: "na" },
  { id: 168, character: "ハ", romaji: "ha", group: "ha" },
  { id: 169, character: "ヒ", romaji: "hi", group: "ha" },
  { id: 170, character: "フ", romaji: "fu", group: "ha" },
  { id: 171, character: "ヘ", romaji: "he", group: "ha" },
  { id: 172, character: "ホ", romaji: "ho", group: "ha" },
  { id: 173, character: "マ", romaji: "ma", group: "ma" },
  { id: 174, character: "ミ", romaji: "mi", group: "ma" },
  { id: 175, character: "ム", romaji: "mu", group: "ma" },
  { id: 176, character: "メ", romaji: "me", group: "ma" },
  { id: 177, character: "モ", romaji: "mo", group: "ma" },
  { id: 178, character: "ヤ", romaji: "ya", group: "ya" },
  { id: 179, character: "ユ", romaji: "yu", group: "ya" },
  { id: 180, character: "ヨ", romaji: "yo", group: "ya" },
  { id: 181, character: "ラ", romaji: "ra", group: "ra" },
  { id: 182, character: "リ", romaji: "ri", group: "ra" },
  { id: 183, character: "ル", romaji: "ru", group: "ra" },
  { id: 184, character: "レ", romaji: "re", group: "ra" },
  { id: 185, character: "ロ", romaji: "ro", group: "ra" },
  { id: 186, character: "ワ", romaji: "wa", group: "wa" },
  { id: 187, character: "ヲ", romaji: "wo", group: "wa" },
  { id: 188, character: "ン", romaji: "n", group: "n" },
  { id: 189, character: "ガ", romaji: "ga", group: "ga" },
  { id: 190, character: "ギ", romaji: "gi", group: "ga" },
  { id: 191, character: "グ", romaji: "gu", group: "ga" },
  { id: 192, character: "ゲ", romaji: "ge", group: "ga" },
  { id: 193, character: "ゴ", romaji: "go", group: "ga" },
  { id: 194, character: "ザ", romaji: "za", group: "za" },
  { id: 195, character: "ジ", romaji: "ji", group: "za" },
  { id: 196, character: "ズ", romaji: "zu", group: "za" },
  { id: 197, character: "ゼ", romaji: "ze", group: "za" },
  { id: 198, character: "ゾ", romaji: "zo", group: "za" },
  { id: 199, character: "ダ", romaji: "da", group: "da" },
  { id: 200, character: "ヂ", romaji: "ji", group: "da" },
  { id: 201, character: "ヅ", romaji: "zu", group: "da" },
  { id: 202, character: "デ", romaji: "de", group: "da" },
  { id: 203, character: "ド", romaji: "do", group: "da" },
  { id: 204, character: "バ", romaji: "ba", group: "ba" },
  { id: 205, character: "ビ", romaji: "bi", group: "ba" },
  { id: 206, character: "ブ", romaji: "bu", group: "ba" },
  { id: 207, character: "ベ", romaji: "be", group: "ba" },
  { id: 208, character: "ボ", romaji: "bo", group: "ba" },
  { id: 209, character: "パ", romaji: "pa", group: "pa" },
  { id: 210, character: "ピ", romaji: "pi", group: "pa" },
  { id: 211, character: "プ", romaji: "pu", group: "pa" },
  { id: 212, character: "ペ", romaji: "pe", group: "pa" },
  { id: 213, character: "ポ", romaji: "po", group: "pa" },
];

