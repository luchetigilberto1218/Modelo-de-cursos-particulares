#!/usr/bin/env node
/*
  Czarnikow — bateria de exercícios INTERATIVOS sobre o assunto da lição.

  O problema que isto resolve: as 720 lições têm exatamente 3 exercícios
  (pronúncia + gramática + glossário) e NENHUM sobre o conteúdo da aula. As
  perguntas de compreensão existiam em `extendedExercises.qAndA`, mas são
  abertas — o aluno responde com as próprias palavras e nada corrige.

  A regra do formato novo (decisão do usuário, 13/08/2026):
    · sempre interativo — ler/ouvir → escolher → corrigir na hora
    · 5 itens por bloco, 4 blocos: reading, listening, vocabulary, expressions
    · compreensão de LEITURA e de ÁUDIO, com perguntas de inferência
    · vocabulário em CONTEXTO (não definição solta)
    · expressões e phrasal verbs
    · gramática (o verb fill que já existia) fica por ÚLTIMO, encostada na
      seção "Grammar Point" que vem logo abaixo na página

  Cada lição vive num arquivo `data/czt-mcset/<num>.json`:
    { "num": 81, "blocks": [ {reading}, {listening}, {vocabulary}, {expressions} ] }
  Cada bloco é um `mcSet` com 5 itens { q, options[4], answer, why }. O reading
  traz `passage` (HTML); o listening traz `audio: { text, rate }`. O conteúdo é
  escrito a partir do TEXTO da própria lição — nunca por template, que reproduz
  os exercícios defeituosos (ver memória czarnikow-material-defeituoso).

  Tudo entra DEPOIS dos 3 exercícios que já existem: nada é removido nem
  reescrito. Quem já concluiu a lição continua concluído.

  Uso:
    node scripts/czt-exercicios-interativos.cjs --report        (não escreve)
    node scripts/czt-exercicios-interativos.cjs --apply
    node scripts/czt-exercicios-interativos.cjs --apply --only=81,82
*/

const fs = require('fs');
const path = require('path');

const COURSES = ['czarnikow', 'czarnikow-teste'].map(
  (c) => path.join(__dirname, '..', 'courses', c, 'course.json')
);
const DATA_DIR = path.join(__dirname, '..', 'data', 'czt-mcset');
const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const ONLY = (argv.find((a) => a.startsWith('--only=')) || '').split('=')[1];
const ONLY_SET = ONLY ? new Set(ONLY.split(',').map(Number)) : null;

/* Título por skill: o aluno lê "3. Listening comprehension", não o slug. */
const TITULO = {
  reading: 'Reading comprehension',
  listening: 'Listening comprehension',
  vocabulary: 'Vocabulary in context',
  expressions: 'Expressions & phrasal verbs',
};

/* `**termo**` no enunciado vira <strong> — o McSet renderiza `q` como HTML
   para destacar a palavra em foco no bloco de vocabulário. */
const negrito = (s) => (s || '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

/* Ordem dos exercícios na lição. Pronúncia → entender (ler) → entender (ouvir)
   → reconhecer vocabulário (glossário) → usar vocabulário → expressões →
   gramática por último, encostada na seção Grammar Point. */
const ORDEM = (ex) => {
  if (ex.type === 'readAloud') return 1;
  if (ex.type === 'mcSet' && ex.skill === 'reading') return 2;
  if (ex.type === 'mcSet' && ex.skill === 'listening') return 3;
  if (ex.type === 'matching') return 4;
  if (ex.type === 'mcSet' && ex.skill === 'vocabulary') return 5;
  if (ex.type === 'mcSet' && ex.skill === 'expressions') return 6;
  return 7;   // verbFill, wordBank, wordOrder, quickDrill — tudo que é gramática
};

/** Renumera o "1." / "2." do título para bater com a posição final. */
const renumera = (ex, i) => {
  ex.title = `${i + 1}. ${(ex.title || '').replace(/^\s*\d+\.\s*/, '')}`;
  return ex;
};

/** Prepara os blocos de um arquivo de dados: injeta type/title, aplica negrito. */
function prepara(blocks) {
  return blocks.map((b) => {
    const bloco = { type: 'mcSet', title: TITULO[b.skill] || 'Escolha a alternativa', ...b };
    bloco.items = (b.items || []).map((it) => ({ ...it, q: negrito(it.q) }));
    return bloco;
  });
}

/* ── carga dos arquivos de dados ───────────────────────────────────────────── */
const arquivos = fs.existsSync(DATA_DIR)
  ? fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'))
  : [];
const LICOES = arquivos
  .map((f) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8')))
  .filter((d) => !ONLY_SET || ONLY_SET.has(d.num))
  .sort((a, b) => a.num - b.num);

if (LICOES.length === 0) {
  console.log('  Nenhuma lição em data/czt-mcset/ (ou nenhuma casou com --only).');
  process.exit(0);
}

/* ── validação: um bloco malformado trava a lição inteira, não passa batido ─── */
const problemas = [];
for (const lic of LICOES) {
  for (const b of lic.blocks || []) {
    if (!TITULO[b.skill]) problemas.push(`L${lic.num}: skill desconhecida "${b.skill}"`);
    const items = b.items || [];
    if (items.length !== 5) problemas.push(`L${lic.num}/${b.skill}: ${items.length} itens (esperado 5)`);
    items.forEach((it, i) => {
      if (!Array.isArray(it.options) || it.options.length !== 4) problemas.push(`L${lic.num}/${b.skill}#${i + 1}: options != 4`);
      if (typeof it.answer !== 'number' || it.answer < 0 || it.answer > 3) problemas.push(`L${lic.num}/${b.skill}#${i + 1}: answer inválido`);
      if (!it.q || !it.why) problemas.push(`L${lic.num}/${b.skill}#${i + 1}: falta q ou why`);
    });
    if (b.skill === 'listening' && !b.audio?.text) problemas.push(`L${lic.num}/listening: falta audio.text`);
    if (b.skill === 'reading' && !b.passage) problemas.push(`L${lic.num}/reading: falta passage`);
  }
}
if (problemas.length) {
  console.log('  ✗ Problemas encontrados — nada foi gravado:');
  problemas.forEach((p) => console.log('    ' + p));
  process.exit(1);
}

/* ── aplicação ─────────────────────────────────────────────────────────────── */
let resumo = [];
for (const file of COURSES) {
  const course = JSON.parse(fs.readFileSync(file, 'utf8'));
  let tocadas = 0, blocos = 0, itens = 0;

  for (const lic of LICOES) {
    const lesson = course.lessons.find((l) => l.num === lic.num);
    if (!lesson) { console.log(`  ✗ lição ${lic.num} não existe em ${path.basename(path.dirname(file))}`); continue; }

    const novos = prepara(lic.blocks);
    // Idempotente: tira uma aplicação anterior antes de reinserir.
    lesson.exercises = (lesson.exercises || []).filter((e) => e.type !== 'mcSet');
    lesson.exercises.push(...JSON.parse(JSON.stringify(novos)));
    lesson.exercises.sort((a, b) => ORDEM(a) - ORDEM(b));
    lesson.exercises.forEach(renumera);

    tocadas += 1;
    blocos += novos.length;
    itens += novos.reduce((s, b) => s + b.items.length, 0);
  }

  resumo.push(`${path.basename(path.dirname(file))}: ${tocadas} lição(ões) · ${blocos} blocos · ${itens} itens`);
  if (APPLY) fs.writeFileSync(file, JSON.stringify(course));
}

console.log(resumo.map((r) => '  ' + r).join('\n'));
console.log(`  lições no pacote: ${LICOES.map((l) => l.num).join(', ')}`);
console.log(APPLY ? '\n  Gravado.' : '\n  Simulação — rode com --apply para gravar.');
