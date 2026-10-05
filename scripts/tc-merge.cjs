// Aplica os cartões de tarefa guiada (scripts/taskcards/<aluno>.json) às aulas.
// Aditivo: só seta lesson.taskCard; nunca remove nem altera conteúdo existente.
// Uso: node scripts/tc-merge.cjs julio
const fs = require('fs');
const path = require('path');

const sid = process.argv[2];
if (!sid) { console.error('uso: node scripts/tc-merge.cjs <aluno>'); process.exit(1); }

const src = JSON.parse(fs.readFileSync(path.join(__dirname, 'taskcards', sid + '.json'), 'utf8'));
const file = path.join(__dirname, '../courses/racional/', sid + '.json');
const course = JSON.parse(fs.readFileSync(file, 'utf8'));
const byNum = new Map(course.lessons.map((l) => [l.num, l]));

const applied = [];
for (const e of src.lessons) {
  const l = byNum.get(e.num);
  if (!l) { console.warn(sid, 'num não encontrado:', e.num); continue; }
  l.taskCard = e.taskCard;
  applied.push(e.num);
}
fs.writeFileSync(file, JSON.stringify(course, null, 1));
console.log(JSON.stringify({ student: sid, applied, total: course.lessons.filter((l) => l.taskCard).length }));
