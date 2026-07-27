#!/usr/bin/env node
/**
 * Valida e mescla lições novas no curso da Baker Hughes.
 *
 *   node scripts/bakerhughes-add-lessons.cjs <arquivo.json>   → valida e grava
 *   node scripts/bakerhughes-add-lessons.cjs --check          → só valida o curso atual
 *
 * Nada é gravado se qualquer checagem falhar. As regras cobrem os erros que
 * quebram a lição em silêncio no renderer: tipo de exercício não suportado,
 * resposta fora do banco de palavras, questão sem (ou com mais de uma)
 * alternativa correta, personagem que não existe no theme.json.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COURSE_PATH = path.join(ROOT, 'courses/bakerhughes/course.json');
const THEME_PATH = path.join(ROOT, 'courses/bakerhughes/theme.json');

// Tipos que o BakerHughesLesson.jsx sabe renderizar. Qualquer outro vira
// `return null` — a lição carrega, mas o exercício some sem aviso.
const RENDERABLE = new Set([
  'wordBank', 'verbFill', 'quickDrill', 'readAloud', 'makeItYourOwn',
  'matching', 'multipleChoice', 'fillGap', 'reorder', 'writing', 'speaking',
  'dictation', 'info',
]);

const REQUIRED_FIELDS = [
  'num', 'level', 'track', 'trackOrder', 'levelLabel', 'trackLabel',
  'character', 'title', 'focus', 'objective', 'intro', 'introPt', 'vocab',
  'exercises', 'celebrate', 'objectiveLabel', 'practiceLabel', 'insights',
];

function validateLessons(lessons, course, theme, { scope }) {
  const errors = [];
  const characters = new Set((theme.characters || []).map((c) => c.id));
  const tracks = new Set((course.tracks || []).map((t) => t.id));
  const levels = new Set((course.levels || []).map((l) => l.id));
  const seenNums = new Set();
  const seenOrder = new Set();

  for (const l of lessons) {
    const tag = `L${l.num}`;

    for (const f of REQUIRED_FIELDS) {
      if (l[f] === undefined) errors.push(`${tag}: falta o campo "${f}"`);
    }

    if (seenNums.has(l.num)) errors.push(`${tag}: num duplicado`);
    seenNums.add(l.num);

    const orderKey = `${l.track}#${l.trackOrder}`;
    if (seenOrder.has(orderKey)) errors.push(`${tag}: trackOrder ${l.trackOrder} repetido em "${l.track}"`);
    seenOrder.add(orderKey);

    if (!characters.has(l.character)) errors.push(`${tag}: character "${l.character}" não existe no theme.json`);
    if (!tracks.has(l.track)) errors.push(`${tag}: track "${l.track}" não existe`);
    if (!levels.has(l.level)) errors.push(`${tag}: level "${l.level}" não existe`);

    if (!l.celebrate?.en || !l.celebrate?.pt) errors.push(`${tag}: celebrate precisa de en e pt`);
    if ((l.intro || []).length !== (l.introPt || []).length) {
      errors.push(`${tag}: intro (${(l.intro || []).length}) e introPt (${(l.introPt || []).length}) com tamanhos diferentes`);
    }

    if ((l.vocab || []).length < 5) errors.push(`${tag}: menos de 5 vocábulos`);
    for (const v of l.vocab || []) {
      if (!v.en || !v.pt || !v.example) errors.push(`${tag}: vocábulo incompleto → ${v.en || '?'}`);
    }

    if (!(l.insights?.cards || []).length) errors.push(`${tag}: insights sem cards`);
    for (const card of l.insights?.cards || []) {
      if (!card.en || !card.pt) errors.push(`${tag}: card de insight sem en/pt`);
    }

    if (!(l.exercises || []).length) errors.push(`${tag}: sem exercícios`);
    for (const [i, ex] of (l.exercises || []).entries()) {
      const et = `${tag} ex${i + 1}`;
      if (!ex.title) errors.push(`${et}: sem título`);
      if (!RENDERABLE.has(ex.type)) {
        errors.push(`${et}: tipo "${ex.type}" não é renderizável — o exercício sumiria da página`);
        continue;
      }

      if (ex.type === 'wordBank') {
        const bank = ex.bank || [];
        if (!bank.length) errors.push(`${et}: bank vazio`);
        for (const it of ex.items || []) {
          if (!bank.includes(it.answer)) errors.push(`${et}: resposta "${it.answer}" não está no bank`);
          if (!/___/.test(it.text || '')) errors.push(`${et}: item sem lacuna "___" → ${it.text}`);
        }
        const unused = bank.filter((b) => !(ex.items || []).some((it) => it.answer === b));
        if (unused.length) errors.push(`${et}: palavras do bank sem uso: ${unused.join(', ')}`);
      }

      if (ex.type === 'multipleChoice') {
        const options = ex.options || [];
        const correct = options.filter((o) => o.correct);
        if (correct.length !== 1) errors.push(`${et}: ${correct.length} alternativas corretas (esperado exatamente 1)`);
        const ids = options.map((o) => o.id);
        if (new Set(ids).size !== ids.length) errors.push(`${et}: ids de alternativa duplicados`);
        for (const o of options) {
          if (!o.text) errors.push(`${et}: alternativa "${o.id}" sem texto`);
          if (!o.correct && !o.whyWrong) errors.push(`${et}: alternativa errada "${o.id}" sem whyWrong`);
        }
        if (!ex.prompt) errors.push(`${et}: sem prompt`);
      }
    }
  }

  if (scope === 'incoming') {
    const existing = new Set((course.lessons || []).map((l) => l.num));
    for (const l of lessons) {
      if (existing.has(l.num)) errors.push(`L${l.num}: num já existe no curso`);
    }
  }

  return errors;
}

function report(course) {
  console.log(`  lições: ${course.lessons.length}`);
  for (const t of course.tracks) {
    const n = course.lessons.filter((l) => l.track === t.id).length;
    console.log(`  [${t.status === 'active' ? 'ativa' : 'soon '}] ${t.id.padEnd(14)} ${String(n).padStart(2)} lições`);
  }
}

function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('uso: node scripts/bakerhughes-add-lessons.cjs <arquivo.json | --check>');
    process.exit(2);
  }

  const course = JSON.parse(fs.readFileSync(COURSE_PATH, 'utf8'));
  const theme = JSON.parse(fs.readFileSync(THEME_PATH, 'utf8'));

  if (arg === '--check') {
    const errors = validateLessons(course.lessons || [], course, theme, { scope: 'all' });
    if (errors.length) {
      console.error(`FALHOU — ${errors.length} problema(s) no curso atual:`);
      console.error(errors.map((e) => '  · ' + e).join('\n'));
      process.exit(1);
    }
    console.log('OK — o curso atual passou em todas as checagens.');
    report(course);
    return;
  }

  const incoming = JSON.parse(fs.readFileSync(path.resolve(arg), 'utf8'));
  const errors = validateLessons(incoming, course, theme, { scope: 'incoming' });
  if (errors.length) {
    console.error(`FALHOU — nada foi gravado (${errors.length} problema(s)):`);
    console.error(errors.map((e) => '  · ' + e).join('\n'));
    process.exit(1);
  }

  course.lessons.push(...incoming);
  course.lessons.sort((a, b) => a.num - b.num);

  // Uma trilha só sai de "Coming soon" quando de fato tem lição.
  for (const t of course.tracks) {
    const has = course.lessons.some((l) => l.track === t.id);
    if (has && t.status !== 'active') t.status = 'active';
  }

  fs.writeFileSync(COURSE_PATH, JSON.stringify(course, null, 2) + '\n');
  console.log(`OK — ${incoming.length} lição(ões) adicionada(s).`);
  report(course);
}

main();
