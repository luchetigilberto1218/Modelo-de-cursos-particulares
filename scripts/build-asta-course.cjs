#!/usr/bin/env node
/*
  Monta courses/asta/course.json a partir dos arquivos de conteúdo em data/asta/.
  Mesma ideia do build da FAAP: cada trilha vive num arquivo próprio, aqui só se
  juntam as peças, numeram-se as lições e se validam os campos que a tela usa.

    node scripts/build-asta-course.cjs
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'asta');
const OUT = path.join(ROOT, 'courses', 'asta', 'course.json');

const tracks = require(path.join(DATA, 'tracks.cjs'));
const story = require(path.join(DATA, 'story.cjs'));
const areas = require(path.join(DATA, 'areas.cjs'));
const roster = require(path.join(DATA, 'roster.cjs'));

/* Números aposentados: lições que saíram do material depois de publicadas.
   O contador pula esses slots de propósito — o progresso do aluno vive no
   navegador indexado pelo número da lição. */
const APOSENTADOS = new Set([]);

const lessons = [];
let num = 300;
for (const t of tracks) {
  const file = path.join(DATA, `${t.id}.cjs`);
  if (!fs.existsSync(file)) {
    console.warn(`  ! trilha "${t.id}" ainda sem arquivo de lições — pulando`);
    continue;
  }
  const list = require(file);
  list.forEach((l, i) => {
    num += 1;
    while (APOSENTADOS.has(num)) num += 1;
    lessons.push({
      num,
      level: t.level || 'essentials',
      track: t.id,
      trackOrder: i + 1,
      levelLabel: t.levelLabel || t.name,
      trackLabel: t.name,
      character: l.character || 'us-female',
      objectiveLabel: 'O que você leva daqui',
      practiceLabel: 'Practice · pratique sozinho',
      ...l,
    });
  });
}

/* Transcript por padrão em todo áudio de exercício. Parte da turma estuda
   sozinha e em nível básico: sem o texto, um áudio que não se entende vira
   parede. Para tirar num bloco específico, escrever `transcript: false`. */
for (const l of lessons) {
  for (const ex of l.exercises || []) {
    if (ex.type === 'listenChoose') {
      for (const it of ex.items || []) if (it.transcript === undefined) it.transcript = true;
    }
    if (ex.type === 'listenGap' && ex.transcript === undefined) ex.transcript = true;
  }
}

/* Validação: os campos que a tela lê sem checar. Um material sem `objective`
   ou sem `vocab` renderiza uma seção vazia — melhor falhar aqui. */
const erros = [];
for (const l of lessons) {
  const onde = `lição ${l.num} (${l.track} #${l.trackOrder}) "${l.title || '???'}"`;
  if (!l.title) erros.push(`${onde}: sem title`);
  if (!l.objective) erros.push(`${onde}: sem objective`);
  if (!Array.isArray(l.intro) || !l.intro.length) erros.push(`${onde}: sem intro`);
  if (!Array.isArray(l.introPt) || l.introPt.length !== (l.intro || []).length) {
    erros.push(`${onde}: introPt não bate com intro (o botão de tradução fica capenga)`);
  }
  if (!Array.isArray(l.vocab) || !l.vocab.length) erros.push(`${onde}: sem vocab`);
  for (const v of l.vocab || []) if (!v.pt) erros.push(`${onde}: vocab "${v.en}" sem tradução`);
  if (!Array.isArray(l.exercises) || !l.exercises.length) erros.push(`${onde}: sem exercises`);
  if (!l.celebrate?.pt) erros.push(`${onde}: sem celebrate.pt`);
}
if (erros.length) {
  console.error('\n✗ Material com problema:\n' + erros.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

const course = {
  meta: {
    title: 'ASTA English Programme',
    client: 'asta',
    clientName: 'ASTA',
    platform: 'levels',
    mode: 'self-study',
    totalLevels: 1,
    totalTracks: tracks.length,
    version: '1.0',
    totalLessons: lessons.length,
  },
  levels: [{ id: 'essentials', name: 'Programme', tag: 'A1 – C1', order: 1 }],
  story,
  areas,
  roster,
  tracks,
  lessons,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(course, null, 1));

const porTrilha = {};
for (const l of lessons) porTrilha[l.track] = (porTrilha[l.track] || 0) + 1;
const tipos = {};
for (const l of lessons) for (const e of l.exercises || []) tipos[e.type] = (tipos[e.type] || 0) + 1;

console.log(`✓ ${OUT}`);
console.log(`  ${lessons.length} lições · ${tracks.length} trilhas`);
for (const t of tracks) console.log(`    ${String(porTrilha[t.id] || 0).padStart(3)}  ${t.id}${t.owner ? '  (pessoal)' : ''}`);
console.log(`  exercícios: ${Object.entries(tipos).map(([k, v]) => `${k} ${v}`).join(', ')}`);
