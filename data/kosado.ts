/**
 * KanjiVibe — KOSADO Demonstrative Pronoun System
 * Ko-re, So-re, A-re, Do-re (こそあど)
 */

export interface KOSADOEntry {
  id: string;
  prefix: 'ko' | 'so' | 'a' | 'do';
  type: 'thing' | 'place' | 'direction' | 'manner' | 'kind';
  kanji: string;
  hiragana: string;
  romaji: string;
  english: string;
  description: string;
  exampleSentence: {
    japanese: string;
    romaji: string;
    english: string;
  };
}

export const kosadoData: KOSADOEntry[] = [
  // ─── Ko- (Near speaker) ──────────────────────────────
  {
    id: 'ks01', prefix: 'ko', type: 'thing',
    kanji: 'これ', hiragana: 'これ', romaji: 'kore',
    english: 'This (thing)',
    description: 'Refers to something near the speaker',
    exampleSentence: { japanese: 'これは本です。', romaji: 'Kore wa hon desu.', english: 'This is a book.' },
  },
  {
    id: 'ks02', prefix: 'ko', type: 'place',
    kanji: 'ここ', hiragana: 'ここ', romaji: 'koko',
    english: 'Here (this place)',
    description: 'A place near the speaker',
    exampleSentence: { japanese: 'ここは学校です。', romaji: 'Koko wa gakkou desu.', english: 'This place is a school.' },
  },
  {
    id: 'ks03', prefix: 'ko', type: 'direction',
    kanji: 'こちら', hiragana: 'こちら', romaji: 'kochira',
    english: 'This way / This person (polite)',
    description: 'Polite form referring to this direction or this person',
    exampleSentence: { japanese: 'こちらへどうぞ。', romaji: 'Kochira e douzo.', english: 'This way, please.' },
  },
  {
    id: 'ks04', prefix: 'ko', type: 'manner',
    kanji: 'こう', hiragana: 'こう', romaji: 'kou',
    english: 'Like this / In this way',
    description: 'Describes a manner near the speaker',
    exampleSentence: { japanese: 'こうしてください。', romaji: 'Kou shite kudasai.', english: 'Please do it like this.' },
  },
  {
    id: 'ks05', prefix: 'ko', type: 'kind',
    kanji: 'この', hiragana: 'この', romaji: 'kono',
    english: 'This (+ noun)',
    description: 'Modifies a noun near the speaker',
    exampleSentence: { japanese: 'この猫は可愛いです。', romaji: 'Kono neko wa kawaii desu.', english: 'This cat is cute.' },
  },

  // ─── So- (Near listener) ──────────────────────────────
  {
    id: 'ks06', prefix: 'so', type: 'thing',
    kanji: 'それ', hiragana: 'それ', romaji: 'sore',
    english: 'That (thing near you)',
    description: 'Refers to something near the listener',
    exampleSentence: { japanese: 'それは何ですか？', romaji: 'Sore wa nan desu ka?', english: 'What is that?' },
  },
  {
    id: 'ks07', prefix: 'so', type: 'place',
    kanji: 'そこ', hiragana: 'そこ', romaji: 'soko',
    english: 'There (near you)',
    description: 'A place near the listener',
    exampleSentence: { japanese: 'そこに座ってください。', romaji: 'Soko ni suwatte kudasai.', english: 'Please sit there.' },
  },
  {
    id: 'ks08', prefix: 'so', type: 'direction',
    kanji: 'そちら', hiragana: 'そちら', romaji: 'sochira',
    english: 'That way (near you) / You (polite)',
    description: 'Polite form referring to that direction or the listener',
    exampleSentence: { japanese: 'そちらはお元気ですか？', romaji: 'Sochira wa ogenki desu ka?', english: 'How are you? (polite)' },
  },
  {
    id: 'ks09', prefix: 'so', type: 'manner',
    kanji: 'そう', hiragana: 'そう', romaji: 'sou',
    english: 'Like that / So',
    description: 'Describes a manner near the listener',
    exampleSentence: { japanese: 'そうですね。', romaji: 'Sou desu ne.', english: "That's right." },
  },
  {
    id: 'ks10', prefix: 'so', type: 'kind',
    kanji: 'その', hiragana: 'その', romaji: 'sono',
    english: 'That (+ noun, near you)',
    description: 'Modifies a noun near the listener',
    exampleSentence: { japanese: 'その本を見せてください。', romaji: 'Sono hon wo misete kudasai.', english: 'Please show me that book.' },
  },

  // ─── A- (Far from both) ──────────────────────────────
  {
    id: 'ks11', prefix: 'a', type: 'thing',
    kanji: 'あれ', hiragana: 'あれ', romaji: 'are',
    english: 'That (thing over there)',
    description: 'Refers to something far from both speaker and listener',
    exampleSentence: { japanese: 'あれは富士山です。', romaji: 'Are wa Fujisan desu.', english: 'That over there is Mt. Fuji.' },
  },
  {
    id: 'ks12', prefix: 'a', type: 'place',
    kanji: 'あそこ', hiragana: 'あそこ', romaji: 'asoko',
    english: 'Over there',
    description: 'A place far from both speaker and listener',
    exampleSentence: { japanese: 'あそこに行きましょう。', romaji: 'Asoko ni ikimashou.', english: "Let's go over there." },
  },
  {
    id: 'ks13', prefix: 'a', type: 'direction',
    kanji: 'あちら', hiragana: 'あちら', romaji: 'achira',
    english: 'That way (over there)',
    description: 'Polite form referring to that far direction',
    exampleSentence: { japanese: 'あちらの部屋です。', romaji: 'Achira no heya desu.', english: "It's the room over there." },
  },
  {
    id: 'ks14', prefix: 'a', type: 'manner',
    kanji: 'ああ', hiragana: 'ああ', romaji: 'aa',
    english: 'Like that (over there) / In that way',
    description: 'Describes a manner distant from both parties',
    exampleSentence: { japanese: 'ああしないでください。', romaji: 'Aa shinaide kudasai.', english: "Please don't do it like that." },
  },
  {
    id: 'ks15', prefix: 'a', type: 'kind',
    kanji: 'あの', hiragana: 'あの', romaji: 'ano',
    english: 'That (+ noun, over there)',
    description: 'Modifies a noun far from both speaker and listener',
    exampleSentence: { japanese: 'あの人は先生です。', romaji: 'Ano hito wa sensei desu.', english: 'That person over there is a teacher.' },
  },

  // ─── Do- (Question) ──────────────────────────────────
  {
    id: 'ks16', prefix: 'do', type: 'thing',
    kanji: 'どれ', hiragana: 'どれ', romaji: 'dore',
    english: 'Which one?',
    description: 'Asks about which thing',
    exampleSentence: { japanese: 'どれが好きですか？', romaji: 'Dore ga suki desu ka?', english: 'Which one do you like?' },
  },
  {
    id: 'ks17', prefix: 'do', type: 'place',
    kanji: 'どこ', hiragana: 'どこ', romaji: 'doko',
    english: 'Where?',
    description: 'Asks about location',
    exampleSentence: { japanese: 'トイレはどこですか？', romaji: 'Toire wa doko desu ka?', english: 'Where is the toilet?' },
  },
  {
    id: 'ks18', prefix: 'do', type: 'direction',
    kanji: 'どちら', hiragana: 'どちら', romaji: 'dochira',
    english: 'Which way? / Which one? (polite)',
    description: 'Polite form asking about direction or choice',
    exampleSentence: { japanese: 'どちらが良いですか？', romaji: 'Dochira ga ii desu ka?', english: 'Which one is better?' },
  },
  {
    id: 'ks19', prefix: 'do', type: 'manner',
    kanji: 'どう', hiragana: 'どう', romaji: 'dou',
    english: 'How?',
    description: 'Asks about manner or method',
    exampleSentence: { japanese: 'どうですか？', romaji: 'Dou desu ka?', english: 'How is it?' },
  },
  {
    id: 'ks20', prefix: 'do', type: 'kind',
    kanji: 'どの', hiragana: 'どの', romaji: 'dono',
    english: 'Which (+ noun)?',
    description: 'Asks which specific noun',
    exampleSentence: { japanese: 'どの色が好きですか？', romaji: 'Dono iro ga suki desu ka?', english: 'Which color do you like?' },
  },
];

/** Get KOSADO entries by prefix group */
export function getKOSADOByPrefix(prefix: 'ko' | 'so' | 'a' | 'do'): KOSADOEntry[] {
  return kosadoData.filter(entry => entry.prefix === prefix);
}

/** Get KOSADO entries by type */
export function getKOSADOByType(type: KOSADOEntry['type']): KOSADOEntry[] {
  return kosadoData.filter(entry => entry.type === type);
}

/** KOSADO prefix descriptions */
export const kosadoPrefixInfo = {
  ko: { label: 'Ko-series (こ)', description: 'Near the speaker', color: '#d2bbff' },
  so: { label: 'So-series (そ)', description: 'Near the listener', color: '#d3fbff' },
  a: { label: 'A-series (あ)', description: 'Far from both', color: '#ecb2ff' },
  do: { label: 'Do-series (ど)', description: 'Question form', color: '#ffb4ab' },
} as const;
