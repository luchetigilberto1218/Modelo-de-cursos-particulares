// Aplica a gramática + bônus gerados (/tmp/jm_out_*.json) no josemario.json.
// Aditivo: só adiciona lesson.grammar / lesson.bonus; nunca remove conteúdo existente.
const fs = require('fs');
const path = require('path');

const COURSE = path.join(__dirname, '../courses/racional/josemario.json');
const course = JSON.parse(fs.readFileSync(COURSE, 'utf8'));
const byNum = new Map(course.lessons.map((l) => [l.num, l]));

let gApplied = 0, bApplied = 0, files = 0, missing = [];
for (let i = 0; i < 30; i++) {
  const f = `/tmp/jm_out_${i}.json`;
  if (!fs.existsSync(f)) { missing.push(i); continue; }
  files++;
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const entry of data.lessons || []) {
    const l = byNum.get(entry.num);
    if (!l) { console.warn('num não encontrado:', entry.num); continue; }
    if (entry.grammar) { l.grammar = entry.grammar; gApplied++; }
    if (entry.bonus) { l.bonus = entry.bonus; bApplied++; }
  }
}

// Migração: bônus agora vivem DENTRO das aulas → zera os extras "fora da aula".
const oldExtras = (course.extras || []).length;
course.extras = [];

fs.writeFileSync(COURSE, JSON.stringify(course, null, 1));
console.log(JSON.stringify({
  filesMerged: files,
  missingBatches: missing,
  grammarApplied: gApplied,
  bonusApplied: bApplied,
  oldExtrasCleared: oldExtras,
  lessonsWithGrammar: course.lessons.filter((l) => l.grammar).length,
  lessonsWithBonus: course.lessons.filter((l) => l.bonus).length,
}, null, 2));
