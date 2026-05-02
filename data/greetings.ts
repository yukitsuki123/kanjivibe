/**
 * KanjiVibe — Greetings & Essential Phrases
 * N5 level greetings and daily expressions
 */

export interface GreetingWord {
  kanji: string;
  hiragana: string;
  romaji: string;
  english: string;
  example?: {
    japanese: string;
    romaji: string;
    english: string;
  };
}

export const greetingsData: GreetingWord[] = [
  {
    kanji: 'こんにちは',
    hiragana: 'こんにちは',
    romaji: 'konnichiwa',
    english: 'Hello / Good afternoon',
    example: { japanese: 'こんにちは！元気ですか？', romaji: 'Konnichiwa! Genki desu ka?', english: 'Hello! How are you?' },
  },
  {
    kanji: 'おはようございます',
    hiragana: 'おはようございます',
    romaji: 'ohayou gozaimasu',
    english: 'Good morning (formal)',
    example: { japanese: 'おはようございます、先生。', romaji: 'Ohayou gozaimasu, sensei.', english: 'Good morning, teacher.' },
  },
  {
    kanji: 'おはよう',
    hiragana: 'おはよう',
    romaji: 'ohayou',
    english: 'Good morning (casual)',
    example: { japanese: 'おはよう！', romaji: 'Ohayou!', english: 'Good morning!' },
  },
  {
    kanji: 'こんばんは',
    hiragana: 'こんばんは',
    romaji: 'konbanwa',
    english: 'Good evening',
    example: { japanese: 'こんばんは、田中さん。', romaji: 'Konbanwa, Tanaka-san.', english: 'Good evening, Mr. Tanaka.' },
  },
  {
    kanji: 'おやすみなさい',
    hiragana: 'おやすみなさい',
    romaji: 'oyasumi nasai',
    english: 'Good night (formal)',
    example: { japanese: 'おやすみなさい。', romaji: 'Oyasumi nasai.', english: 'Good night.' },
  },
  {
    kanji: 'さようなら',
    hiragana: 'さようなら',
    romaji: 'sayounara',
    english: 'Goodbye',
    example: { japanese: 'さようなら、また明日。', romaji: 'Sayounara, mata ashita.', english: 'Goodbye, see you tomorrow.' },
  },
  {
    kanji: 'ありがとうございます',
    hiragana: 'ありがとうございます',
    romaji: 'arigatou gozaimasu',
    english: 'Thank you very much',
    example: { japanese: 'ありがとうございます！', romaji: 'Arigatou gozaimasu!', english: 'Thank you very much!' },
  },
  {
    kanji: 'ありがとう',
    hiragana: 'ありがとう',
    romaji: 'arigatou',
    english: 'Thank you (casual)',
    example: { japanese: 'ありがとう！', romaji: 'Arigatou!', english: 'Thanks!' },
  },
  {
    kanji: 'すみません',
    hiragana: 'すみません',
    romaji: 'sumimasen',
    english: 'Excuse me / I\'m sorry',
    example: { japanese: 'すみません、駅はどこですか？', romaji: 'Sumimasen, eki wa doko desu ka?', english: 'Excuse me, where is the station?' },
  },
  {
    kanji: 'ごめんなさい',
    hiragana: 'ごめんなさい',
    romaji: 'gomen nasai',
    english: 'I\'m sorry (apology)',
    example: { japanese: 'ごめんなさい、遅れました。', romaji: 'Gomen nasai, okuremashita.', english: 'I\'m sorry, I was late.' },
  },
  {
    kanji: 'はじめまして',
    hiragana: 'はじめまして',
    romaji: 'hajimemashite',
    english: 'Nice to meet you (first meeting)',
    example: { japanese: 'はじめまして、田中です。', romaji: 'Hajimemashite, Tanaka desu.', english: 'Nice to meet you, I\'m Tanaka.' },
  },
  {
    kanji: 'よろしくおねがいします',
    hiragana: 'よろしくおねがいします',
    romaji: 'yoroshiku onegai shimasu',
    english: 'Please treat me well / Nice to meet you',
    example: { japanese: 'どうぞよろしくおねがいします。', romaji: 'Douzo yoroshiku onegai shimasu.', english: 'Please treat me kindly.' },
  },
  {
    kanji: 'おげんきですか',
    hiragana: 'おげんきですか',
    romaji: 'ogenki desu ka',
    english: 'How are you?',
    example: { japanese: 'おげんきですか？', romaji: 'Ogenki desu ka?', english: 'How are you?' },
  },
  {
    kanji: 'げんきです',
    hiragana: 'げんきです',
    romaji: 'genki desu',
    english: 'I am fine / I\'m doing well',
    example: { japanese: 'はい、げんきです。', romaji: 'Hai, genki desu.', english: 'Yes, I\'m fine.' },
  },
  {
    kanji: 'いただきます',
    hiragana: 'いただきます',
    romaji: 'itadakimasu',
    english: 'Let\'s eat / I humbly receive (before eating)',
    example: { japanese: 'いただきます！', romaji: 'Itadakimasu!', english: 'Let\'s eat!' },
  },
  {
    kanji: 'ごちそうさまでした',
    hiragana: 'ごちそうさまでした',
    romaji: 'gochisousama deshita',
    english: 'Thank you for the meal (after eating)',
    example: { japanese: 'ごちそうさまでした。', romaji: 'Gochisousama deshita.', english: 'Thank you for the meal.' },
  },
  {
    kanji: 'いってきます',
    hiragana: 'いってきます',
    romaji: 'ittekimasu',
    english: 'I\'m leaving (I\'ll go and come back)',
    example: { japanese: 'いってきます！', romaji: 'Ittekimasu!', english: 'I\'m off!' },
  },
  {
    kanji: 'いってらっしゃい',
    hiragana: 'いってらっしゃい',
    romaji: 'itterasshai',
    english: 'Take care / Have a good trip',
    example: { japanese: 'いってらっしゃい！', romaji: 'Itterasshai!', english: 'Take care!' },
  },
  {
    kanji: 'ただいま',
    hiragana: 'ただいま',
    romaji: 'tadaima',
    english: 'I\'m home / I\'m back',
    example: { japanese: 'ただいま！', romaji: 'Tadaima!', english: 'I\'m home!' },
  },
  {
    kanji: 'おかえり',
    hiragana: 'おかえり',
    romaji: 'okaeri',
    english: 'Welcome back (casual)',
    example: { japanese: 'おかえり！', romaji: 'Okaeri!', english: 'Welcome back!' },
  },
];
