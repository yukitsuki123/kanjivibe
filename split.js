const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'kanjany-database.ts');
const dbContent = fs.readFileSync(dbPath, 'utf8');

const extractSection = (startMarker, endMarker) => {
  const startIndex = dbContent.indexOf(startMarker);
  let endIndex;
  if (endMarker) {
    endIndex = dbContent.indexOf(endMarker, startIndex);
  } else {
    endIndex = dbContent.length;
  }
  
  if (startIndex === -1 || endIndex === -1) return '';
  return dbContent.substring(startIndex, endIndex);
};

const interfaces = dbContent.substring(0, dbContent.indexOf('// ─── KANJI'));

const kanjiData = extractSection('// ─── KANJI', '// ─── HIRAGANA');
const hiraganaData = extractSection('// ─── HIRAGANA', '// ─── KATAKANA');
const katakanaData = extractSection('// ─── KATAKANA', '// ─── VOCABULARY');
const vocabData = extractSection('// ─── VOCABULARY', '// ─── CATEGORY MAP');

fs.writeFileSync(path.join(__dirname, 'data', 'db_kanji.ts'), interfaces + kanjiData);
fs.writeFileSync(path.join(__dirname, 'data', 'db_hiragana.ts'), interfaces + hiraganaData);
fs.writeFileSync(path.join(__dirname, 'data', 'db_katakana.ts'), interfaces + katakanaData);
fs.writeFileSync(path.join(__dirname, 'data', 'db_vocabulary.ts'), interfaces + vocabData);

console.log('Successfully split the database!');
