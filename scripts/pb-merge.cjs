// Aplica o practiceBank gerado (/tmp/pb_*.json) ao teacher guide de cada aula.
// Aditivo: só seta lesson.teacher.practiceBank; nunca remove conteúdo existente.
const fs = require('fs');
const path = require('path');

const COUNT = 132;
// 1) agrupa entradas por aluno
const byStudent = {};
let files = 0, missing = [], entries = 0;
for (let i = 0; i < COUNT; i++) {
  const f = `/tmp/pb_${i}.json`;
  if (!fs.existsSync(f)) { missing.push(i); continue; }
  files++;
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  const sid = d.student;
  (byStudent[sid] = byStudent[sid] || []).push(...(d.lessons || []));
}

// 2) aplica por aluno
const report = {};
for (const sid of Object.keys(byStudent)) {
  const file = path.join(__dirname, '../courses/racional/', sid + '.json');
  const course = JSON.parse(fs.readFileSync(file, 'utf8'));
  const byNum = new Map(course.lessons.map((l) => [l.num, l]));
  let applied = 0, under12 = 0;
  for (const e of byStudent[sid]) {
    const l = byNum.get(e.num);
    if (!l) { console.warn(sid, 'num não encontrado:', e.num); continue; }
    if (!Array.isArray(e.practiceBank) || !e.practiceBank.length) continue;
    if (!l.teacher) l.teacher = {};
    l.teacher.practiceBank = e.practiceBank;
    applied++;
    if (e.practiceBank.length < 12) under12++;
    entries++;
  }
  fs.writeFileSync(file, JSON.stringify(course, null, 1));
  const counts = course.lessons.filter((l) => l.teacher?.practiceBank?.length).length;
  report[sid] = { applied, under12, lessonsWithBank: counts };
}

console.log(JSON.stringify({ filesMerged: files, missingBatches: missing, entries, students: report }, null, 2));
