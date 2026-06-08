#!/usr/bin/env node
/*
 * Mescla os arquivos /tmp/ts_*.json (gerados pelo teacher-scripts.workflow.js)
 * nos courses/racional/<student>.json:
 *   - teacher.leadIn  (5 perguntas)         → só seta se ainda não existir
 *   - teacher.practiceBank[idx].lines       → só seta se o item ainda não tiver
 * Aditivo e idempotente: nunca remove nem sobrescreve conteúdo já presente.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TMP = '/tmp';
const files = fs.readdirSync(TMP).filter(f => /^ts_\d+\.json$/.test(f));

if (!files.length) { console.error('Nenhum /tmp/ts_*.json encontrado.'); process.exit(1); }

// Carrega os course JSONs sob demanda e mantém em cache.
const courses = {};
function load(student) {
  if (!courses[student]) {
    const p = path.join(ROOT, 'courses/racional', `${student}.json`);
    courses[student] = { p, data: JSON.parse(fs.readFileSync(p, 'utf-8')), dirty: false };
  }
  return courses[student];
}

let leadInSet = 0, linesSet = 0, skipped = 0, mismatch = 0, lessonsSeen = 0;

for (const f of files.sort()) {
  let payload;
  try { payload = JSON.parse(fs.readFileSync(path.join(TMP, f), 'utf-8')); }
  catch (e) { console.error(`✗ ${f}: JSON inválido — ${e.message}`); continue; }
  const student = payload.student;
  if (!student) { console.error(`✗ ${f}: sem "student"`); continue; }
  const c = load(student);

  for (const entry of payload.lessons || []) {
    const lesson = (c.data.lessons || []).find(l => l.num === entry.num);
    if (!lesson || !lesson.teacher) { console.error(`✗ ${student} L${entry.num}: lição/teacher não encontrada`); continue; }
    lessonsSeen++;
    const t = lesson.teacher;

    // lead-in
    if (Array.isArray(entry.leadIn) && entry.leadIn.length && !(t.leadIn && t.leadIn.length)) {
      t.leadIn = entry.leadIn.slice(0, 5);
      leadInSet++; c.dirty = true;
    }

    // lines por item do practiceBank (alinhado por índice)
    const bank = t.practiceBank || [];
    const bl = entry.bankLines || [];
    if (bl.length !== bank.length) mismatch++;
    for (let i = 0; i < bank.length; i++) {
      const lines = bl[i];
      if (Array.isArray(lines) && lines.length && !(bank[i].lines && bank[i].lines.length)) {
        bank[i].lines = lines;
        linesSet++; c.dirty = true;
      } else if (bank[i].lines && bank[i].lines.length) {
        skipped++;
      }
    }
  }
}

let written = 0;
for (const k of Object.keys(courses)) {
  if (courses[k].dirty) {
    fs.writeFileSync(courses[k].p, JSON.stringify(courses[k].data, null, 1));
    written++;
    console.log(`✓ ${k}.json atualizado`);
  }
}

console.log(`\nLições processadas: ${lessonsSeen}`);
console.log(`lead-in setados: ${leadInSet} | exercícios com roteiro setado: ${linesSet} | já existentes (pulados): ${skipped}`);
if (mismatch) console.log(`⚠️ lotes com contagem bankLines≠practiceBank: ${mismatch} (itens sem par ficam sem lines)`);
console.log(`Arquivos salvos: ${written}`);
