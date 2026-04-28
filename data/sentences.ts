/**
 * KanjiVibe — Sentence Builder Templates
 * Daily routine sentence construction with slot-based system
 */

export interface SentenceSlot {
  id: string;
  type: 'subject' | 'time' | 'place' | 'object' | 'verb' | 'particle';
  label: string;
  options: {
    kanji: string;
    hiragana: string;
    romaji: string;
    english: string;
  }[];
}

export interface SentenceTemplate {
  id: string;
  title: string;
  titleRomaji: string;
  description: string;
  pattern: string;
  patternRomaji: string;
  slots: SentenceSlot[];
}

export const sentenceTemplates: SentenceTemplate[] = [
  {
    id: 'st01',
    title: '朝のルーティン',
    titleRomaji: 'Asa no ruutiin',
    description: 'Describe your morning routine',
    pattern: '[Subject]は [Time]に [Verb]ます。',
    patternRomaji: '[Subject] wa [Time] ni [Verb] masu.',
    slots: [
      {
        id: 'sl01', type: 'subject', label: 'Who?',
        options: [
          { kanji: '私', hiragana: 'わたし', romaji: 'watashi', english: 'I' },
          { kanji: '友達', hiragana: 'ともだち', romaji: 'tomodachi', english: 'Friend' },
          { kanji: '先生', hiragana: 'せんせい', romaji: 'sensei', english: 'Teacher' },
        ],
      },
      {
        id: 'sl02', type: 'time', label: 'When?',
        options: [
          { kanji: '六時', hiragana: 'ろくじ', romaji: 'rokuji', english: '6 o\'clock' },
          { kanji: '七時', hiragana: 'しちじ', romaji: 'shichiji', english: '7 o\'clock' },
          { kanji: '八時', hiragana: 'はちじ', romaji: 'hachiji', english: '8 o\'clock' },
          { kanji: '朝', hiragana: 'あさ', romaji: 'asa', english: 'Morning' },
        ],
      },
      {
        id: 'sl03', type: 'verb', label: 'What action?',
        options: [
          { kanji: '起き', hiragana: 'おき', romaji: 'oki', english: 'Wake up' },
          { kanji: '食べ', hiragana: 'たべ', romaji: 'tabe', english: 'Eat' },
          { kanji: '飲み', hiragana: 'のみ', romaji: 'nomi', english: 'Drink' },
          { kanji: '走り', hiragana: 'はしり', romaji: 'hashiri', english: 'Run' },
        ],
      },
    ],
  },
  {
    id: 'st02',
    title: '食事',
    titleRomaji: 'Shokuji',
    description: 'Talk about meals',
    pattern: '[Subject]は [Place]で [Object]を [Verb]ます。',
    patternRomaji: '[Subject] wa [Place] de [Object] wo [Verb] masu.',
    slots: [
      {
        id: 'sl04', type: 'subject', label: 'Who?',
        options: [
          { kanji: '私', hiragana: 'わたし', romaji: 'watashi', english: 'I' },
          { kanji: '家族', hiragana: 'かぞく', romaji: 'kazoku', english: 'Family' },
        ],
      },
      {
        id: 'sl05', type: 'place', label: 'Where?',
        options: [
          { kanji: 'レストラン', hiragana: 'れすとらん', romaji: 'resutoran', english: 'Restaurant' },
          { kanji: '家', hiragana: 'いえ', romaji: 'ie', english: 'Home' },
          { kanji: '学校', hiragana: 'がっこう', romaji: 'gakkou', english: 'School' },
        ],
      },
      {
        id: 'sl06', type: 'object', label: 'What?',
        options: [
          { kanji: '寿司', hiragana: 'すし', romaji: 'sushi', english: 'Sushi' },
          { kanji: 'ラーメン', hiragana: 'らーめん', romaji: 'raamen', english: 'Ramen' },
          { kanji: 'ご飯', hiragana: 'ごはん', romaji: 'gohan', english: 'Rice' },
          { kanji: 'お茶', hiragana: 'おちゃ', romaji: 'ocha', english: 'Tea' },
        ],
      },
      {
        id: 'sl07', type: 'verb', label: 'What action?',
        options: [
          { kanji: '食べ', hiragana: 'たべ', romaji: 'tabe', english: 'Eat' },
          { kanji: '飲み', hiragana: 'のみ', romaji: 'nomi', english: 'Drink' },
        ],
      },
    ],
  },
  {
    id: 'st03',
    title: '日常の勉強',
    titleRomaji: 'Nichijou no benkyou',
    description: 'Describe study habits',
    pattern: '[Subject]は [Time]に [Place]で [Verb]ます。',
    patternRomaji: '[Subject] wa [Time] ni [Place] de [Verb] masu.',
    slots: [
      {
        id: 'sl08', type: 'subject', label: 'Who?',
        options: [
          { kanji: '私', hiragana: 'わたし', romaji: 'watashi', english: 'I' },
          { kanji: '学生', hiragana: 'がくせい', romaji: 'gakusei', english: 'Student' },
        ],
      },
      {
        id: 'sl09', type: 'time', label: 'When?',
        options: [
          { kanji: '毎日', hiragana: 'まいにち', romaji: 'mainichi', english: 'Every day' },
          { kanji: '夜', hiragana: 'よる', romaji: 'yoru', english: 'Night' },
          { kanji: '午後', hiragana: 'ごご', romaji: 'gogo', english: 'Afternoon' },
        ],
      },
      {
        id: 'sl10', type: 'place', label: 'Where?',
        options: [
          { kanji: '図書館', hiragana: 'としょかん', romaji: 'toshokan', english: 'Library' },
          { kanji: '家', hiragana: 'いえ', romaji: 'ie', english: 'Home' },
          { kanji: 'カフェ', hiragana: 'かふぇ', romaji: 'kafe', english: 'Cafe' },
        ],
      },
      {
        id: 'sl11', type: 'verb', label: 'What action?',
        options: [
          { kanji: '勉強し', hiragana: 'べんきょうし', romaji: 'benkyou shi', english: 'Study' },
          { kanji: '読み', hiragana: 'よみ', romaji: 'yomi', english: 'Read' },
          { kanji: '書き', hiragana: 'かき', romaji: 'kaki', english: 'Write' },
        ],
      },
    ],
  },
  {
    id: 'st04',
    title: '夜のルーティン',
    titleRomaji: 'Yoru no ruutiin',
    description: 'Describe your evening routine',
    pattern: '[Time]に [Subject]は [Verb]ます。',
    patternRomaji: '[Time] ni [Subject] wa [Verb] masu.',
    slots: [
      {
        id: 'sl12', type: 'time', label: 'When?',
        options: [
          { kanji: '九時', hiragana: 'くじ', romaji: 'kuji', english: '9 o\'clock' },
          { kanji: '十時', hiragana: 'じゅうじ', romaji: 'juuji', english: '10 o\'clock' },
          { kanji: '十一時', hiragana: 'じゅういちじ', romaji: 'juuichiji', english: '11 o\'clock' },
        ],
      },
      {
        id: 'sl13', type: 'subject', label: 'Who?',
        options: [
          { kanji: '私', hiragana: 'わたし', romaji: 'watashi', english: 'I' },
        ],
      },
      {
        id: 'sl14', type: 'verb', label: 'What action?',
        options: [
          { kanji: '寝', hiragana: 'ね', romaji: 'ne', english: 'Sleep' },
          { kanji: 'お風呂に入り', hiragana: 'おふろにはいり', romaji: 'ofuro ni hairi', english: 'Take a bath' },
          { kanji: '歯を磨き', hiragana: 'はをみがき', romaji: 'ha wo migaki', english: 'Brush teeth' },
        ],
      },
    ],
  },
];
