#!/usr/bin/env node
/*
  Monta courses/faapatendimento/course.json a partir dos arquivos de conteúdo
  em data/faap/. Cada trilha vive num arquivo próprio; aqui só se juntam as
  peças, numeram-se as lições e se validam os campos que a tela usa.

    node scripts/build-faap-course.cjs
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'faap');
const OUT = path.join(ROOT, 'courses', 'faapatendimento', 'course.json');

const tracks = require(path.join(DATA, 'tracks.cjs'));

const lessons = [];
let num = 100;
for (const t of tracks) {
  const file = path.join(DATA, `${t.id}.cjs`);
  if (!fs.existsSync(file)) {
    console.warn(`  ! trilha "${t.id}" ainda sem arquivo de lições — pulando`);
    continue;
  }
  const list = require(file);
  list.forEach((l, i) => {
    num += 1;
    lessons.push({
      num,
      level: t.level || 'essentials',
      track: t.id,
      trackOrder: i + 1,
      levelLabel: t.levelLabel || t.name,
      trackLabel: t.name,
      character: l.character || 'us-female',
      objectiveLabel: 'Objetivo desta lição',
      practiceLabel: 'Practice · pratique sozinho',
      ...l,
    });
  });
}

/* O material da FAAP é para nível básico: todo áudio de exercício ganha botão
   de transcript por padrão. Quem quiser um bloco sem ele escreve
   `transcript: false` na lição. Isso não toca em nenhum outro curso. */
for (const l of lessons) {
  for (const ex of l.exercises || []) {
    if (ex.type === 'listenChoose') {
      for (const it of ex.items || []) if (it.transcript === undefined) it.transcript = true;
    }
    if (ex.type === 'listenGap' && ex.transcript === undefined) ex.transcript = true;
  }
}

/* Exemplos com número — valor, taxa, sala, horário, prazo — são inventados
   para treinar a frase, não para informar. Sem um aviso explícito, um aluno
   repete "R$ 250" ou "room 214" para um cliente como se fosse oficial. */
const DADOS_OPERACIONAIS = /R\$|two hundred and fifty|room 214|nine to (five|four)|the fifth of each month|two working days|gate closes at|registration fee|instalments/i;
const AVISO = 'os valores, prazos, salas e horários dos exemplos são fictícios — servem para você treinar a frase em inglês. Os números reais da FAAP são sempre os que a sua área informar.';
let comAviso = 0;
for (const l of lessons) {
  if (l.disclaimer) continue;
  if (DADOS_OPERACIONAIS.test(JSON.stringify(l))) { l.disclaimer = AVISO; comAviso += 1; }
}

/* Homógrafos: palavras cuja pronúncia muda com a classe gramatical. O TTS
   escolhe pela sintaxe e às vezes erra — "lives" (verbo) sai como plural de
   "life", "read" no passado sai como presente, "lead" comercial sai como o
   metal. Isto não bloqueia o build: só lista o que merece um ouvido, para o
   texto ser reescrito em vez de a máquina adivinhar. */
const HOMOGRAFOS = ['lives', 'read', 'lead', 'record', 'records', 'refuse', 'present', 'presents', 'object', 'contract', 'produce', 'progress', 'permit', 'invalid', 'wound', 'desert', 'minute'];
const homRe = new RegExp('\\b(' + HOMOGRAFOS.join('|') + ')\\b', 'gi');
const suspeitos = [];
for (const l of lessons) {
  const falado = [
    ...(l.intro || []), ...(l.takeaways || []),
    ...(l.vocab || []).map((v) => v.example),
    ...(l.insights?.cards || []).map((k) => k.en),
  ];
  for (const ex of l.exercises || []) {
    falado.push(...(ex.lines || []).map((x) => x.en), ...(ex.sentences || []), ...(ex.passage || []));
    falado.push(...(ex.items || []).map((it) => it && it.audio).filter(Boolean));
    if (ex.audioText) falado.push(ex.audioText);
  }
  for (const t of falado.filter(Boolean)) {
    const limpo = String(t).replace(/<[^>]+>/g, '');
    const m = limpo.match(homRe);
    if (m) suspeitos.push(`${l.num} · ${[...new Set(m.map((x) => x.toLowerCase()))].join(',')} · ${limpo.slice(0, 90)}`);
  }
}

/* ── validação: erro de conteúdo aqui é exercício impossível lá ── */
const problems = [];
const seenNums = new Set();
for (const l of lessons) {
  const where = `${l.track} #${l.trackOrder} "${l.title}"`;
  if (seenNums.has(l.num)) problems.push(`${where}: num duplicado ${l.num}`);
  seenNums.add(l.num);
  if (!l.title) problems.push(`${where}: sem title`);
  if (!l.objective) problems.push(`${where}: sem objective`);
  if (l.intro && !l.introPt) problems.push(`${where}: intro sem tradução (introPt)`);
  if (l.image && !fs.existsSync(path.join(ROOT, 'public', l.image.replace(/^\//, '')))) {
    problems.push(`${where}: imagem não existe — ${l.image}`);
  }
  for (const [i, ex] of (l.exercises || []).entries()) {
    const w = `${where} · ex${i + 1} (${ex.type})`;
    switch (ex.type) {
      case 'wordBank':
        for (const it of ex.items || []) {
          if (!(ex.bank || []).includes(it.answer)) problems.push(`${w}: resposta "${it.answer}" fora do banco`);
          if (!String(it.text).includes('___')) problems.push(`${w}: item sem lacuna ___`);
        }
        break;
      case 'dropdownGap': {
        const gaps = (ex.text.match(/___/g) || []).length;
        if (gaps !== (ex.gaps || []).length) problems.push(`${w}: ${gaps} lacunas no texto x ${(ex.gaps || []).length} gaps`);
        for (const g of ex.gaps || []) {
          if (!(g.options || []).includes(g.answer)) problems.push(`${w}: resposta "${g.answer}" fora das opções`);
        }
        break;
      }
      case 'listenGap':
        for (const it of ex.items || []) {
          if (!(ex.bank || []).includes(it.answer)) problems.push(`${w}: resposta "${it.answer}" fora do banco`);
        }
        break;
      case 'multipleChoice':
      case 'swipeChoice':
        if (ex.type === 'multipleChoice' && !(ex.options || []).some((o) => o.correct)) problems.push(`${w}: sem alternativa correta`);
        if (ex.type === 'swipeChoice') for (const it of ex.items || []) if (!['a', 'b'].includes(it.correct)) problems.push(`${w}: correct precisa ser "a" ou "b"`);
        break;
      case 'serialChoice':
      case 'listenChoose':
        for (const it of ex.items || []) if (!(it.options || []).some((o) => o.correct)) problems.push(`${w}: item sem alternativa correta`);
        break;
      case 'dialogue':
        for (const q of ex.questions || []) if (!(q.options || []).some((o) => o.correct)) problems.push(`${w}: pergunta sem alternativa correta`);
        break;
      case 'readingTask':
      case 'emailTriage':
        for (const q of ex.questions || []) if (!(q.options || []).some((o) => o.correct)) problems.push(`${w}: pergunta sem alternativa correta`);
        break;
      case 'categorize': {
        const ids = new Set((ex.categories || []).map((k) => k.id));
        for (const it of ex.items || []) if (!ids.has(it.cat)) problems.push(`${w}: item "${it.text}" com categoria inválida "${it.cat}"`);
        break;
      }
      case 'oddOneOut':
        for (const g of ex.groups || []) if (!(g.items || []).includes(g.odd)) problems.push(`${w}: odd "${g.odd}" fora do grupo`);
        break;
      case 'errorSpot':
        for (const it of ex.items || []) if (!String(it.sentence).split(/\s+/).map((s) => s.replace(/[.,!?;:]/g, '')).includes(it.wrong)) problems.push(`${w}: palavra errada "${it.wrong}" não está na frase`);
        break;
      case 'highlightPick':
        for (const t of ex.targets || []) if (!String(ex.text).split(/\s+/).includes(t)) problems.push(`${w}: alvo "${t}" não é uma palavra isolada do texto`);
        break;
      case 'sentenceBuild':
        for (const it of ex.items || []) if (!it.answer) problems.push(`${w}: item sem answer`);
        break;
      default:
        break;
    }
  }
}

if (problems.length) {
  console.error('\n✗ Problemas de conteúdo:\n' + problems.map((p) => '  · ' + p).join('\n') + '\n');
  process.exit(1);
}

const course = {
  meta: {
    title: 'FAAP · Inglês para o time',
    client: 'faapatendimento',
    clientName: 'FAAP',
    platform: 'levels',
    mode: 'self-study',
    totalLevels: 1,
    totalTracks: tracks.length,
    version: '1.0',
    totalLessons: lessons.length,
  },
  levels: [{ id: 'essentials', name: 'Programa FAAP', tag: 'A2 – B1', order: 1 }],
  tracks,
  lessons,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(course, null, 1));
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`   ${comAviso} lições receberam o aviso de dados fictícios`);
if (suspeitos.length) {
  console.log(`   ⚠ ${suspeitos.length} trechos falados com homógrafo (confira a pronúncia):`);
  for (const t of suspeitos) console.log('     · ' + t);
}
console.log(`✓ ${lessons.length} lições em ${tracks.length} trilhas → courses/faapatendimento/course.json (${kb} KB)`);
for (const t of tracks) {
  console.log(`   ${String(lessons.filter((l) => l.track === t.id).length).padStart(3)}  ${t.id} · ${t.name}`);
}
