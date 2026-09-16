#!/usr/bin/env node
/*
  Czarnikow — revisão dos exercícios de lacuna (verbFill).

  Queixa do professor (16/09/2026, Apex/RH): "a palavra entre parênteses já está
  certa, o aluno só reescreve no box". O levantamento no curso inteiro achou:
    · ~470 itens em que a dica É a resposta (copiar, sem desafio)
    · 51 respostas que exigem digitar "…", itens de 2–3 lacunas com UMA caixa,
      ~150 que esperam a FRASE INTEIRA numa caixa — impossíveis de acertar
    · respostas repetidas no fim do enunciado, definição inteira para digitar,
      frases de template agramaticais

  Decisão do usuário: corrigir o que não dá para acertar e trocar a dica que
  entrega a resposta por um MIX de palavra em português (`hintPt`) e
  alternativas (`options`), com dica extra depois do erro (`hintAfterError`)
  onde fizer falta. O renderizador é o VerbFill de components/czarnikow-teste/CztLesson.jsx.

  Cada lição revisada vive em `data/czt-lacunas/<num>.json`:
    { "num": 41, "exercises": [ { "index": 6, "title": "...", "items": [ ... ] } ] }
  `index` é a posição do exercício em `lessons[].exercises` (não muda — o
  progresso do aluno é por posição). Cada item:
    { prompt, blanks: [[aceitas…], …], hint?, hintPt?, options?, hintAfterError? }

  O script VALIDA (recusa item que entrega a resposta, lacuna sem caixa etc.) e
  aplica nas DUAS portas. Idempotente: sempre reaplica a partir do arquivo. Os
  itens originais ficam no histórico do git (commit anterior a 16/09/2026).

  Uso:
    node scripts/czt-lacunas.cjs --report          (valida, não escreve)
    node scripts/czt-lacunas.cjs --apply [--only=41,42]
*/

const fs = require('fs');
const path = require('path');

const COURSES = ['czarnikow', 'czarnikow-teste'].map(
  (c) => path.join(__dirname, '..', 'courses', c, 'course.json')
);
const DATA_DIR = path.join(__dirname, '..', 'data', 'czt-lacunas');
const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const ONLY = (argv.find((a) => a.startsWith('--only=')) || '').split('=')[1];
const ONLY_SET = ONLY ? new Set(ONLY.split(',').map(Number)) : null;

const INSTRUCTION =
  'Complete as lacunas e clique em “Corrigir”. A dica pode ser a forma base em inglês (para transformar), a palavra em português (PT) ou alternativas para escolher. Errou? Alguns itens mostram uma dica antes da resposta.';

const tok = (s) => (s || '').toLowerCase().replace(/[’‘]/g, "'").replace(/[….,;:!?"“”()—–-]/g, ' ').split(/\s+/).filter(Boolean);
const norm = (s) => tok(s).join(' ');

function validaItem(it, where) {
  const erros = [];
  const e = (m) => erros.push(`${where}: ${m}`);
  if (typeof it.prompt !== 'string' || !it.prompt.trim()) { e('sem prompt'); return erros; }
  const n = (it.prompt.match(/_{3,}/g) || []).length;
  if (!n) e('prompt sem ___');
  if (!Array.isArray(it.blanks) || it.blanks.length !== n) e(`blanks (${it.blanks?.length}) ≠ lacunas (${n})`);
  const canon = [];
  for (const [b, acc] of (it.blanks || []).entries()) {
    if (!Array.isArray(acc) || !acc.length || acc.some((a) => typeof a !== 'string' || !a.trim())) { e(`lacuna ${b + 1} sem resposta`); continue; }
    if (acc.some((a) => /…|\.\.\.|\//.test(a))) e(`lacuna ${b + 1} com … ou / na resposta`);
    if (acc.some((a) => tok(a).length > 4)) e(`lacuna ${b + 1} com resposta longa demais (>4 palavras)`);
    canon.push(acc[0]);
  }
  const dicas = ['hint', 'hintPt', 'options'].filter((k) => it[k] != null);
  if (dicas.length > 1) e(`mais de uma dica (${dicas.join(', ')})`);
  if (/\(/.test(it.prompt) && dicas.length) e('prompt ainda tem parênteses além da dica');
  // parênteses no prompt que contêm a resposta = dica antiga copiável
  for (const m of it.prompt.matchAll(/\(([^)]*)\)/g)) {
    const h = new Set(tok(m[1]));
    if (canon.length && canon.every((a) => tok(a).every((w) => h.has(w)))) e(`parênteses no prompt entregam a resposta: (${m[1]})`);
  }
  const sentenca = new Set(tok(it.prompt.replace(/\([^)]*\)/g, ' ').replace(/_{3,}/g, ' ')));
  if (it.hint != null) {
    const h = new Set(tok(it.hint));
    const tudoIgual = canon.every((a) => tok(a).filter((w) => !sentenca.has(w)).every((w) => h.has(w)));
    if (!String(it.hint).trim()) e('hint vazio');
    else if (tudoIgual) e(`hint "${it.hint}" é a própria resposta — use hintPt ou options`);
  }
  if (it.hintPt != null) {
    if (!String(it.hintPt).trim()) e('hintPt vazio');
    if (canon.some((a) => norm(a) === norm(it.hintPt))) e('hintPt igual à resposta');
  }
  if (it.options != null) {
    const o = it.options;
    if (n !== 1) e('options só em item de UMA lacuna');
    if (!Array.isArray(o) || o.length < 3 || o.length > 4) e('options precisa de 3 ou 4 alternativas');
    else {
      if (new Set(o.map(norm)).size !== o.length) e('options repetidas');
      const aceitas = new Set((it.blanks?.[0] || []).map(norm));
      const certas = o.filter((x) => aceitas.has(norm(x)));
      if (certas.length !== 1) e(`options devem ter exatamente 1 certa (tem ${certas.length})`);
      if (!o.includes(it.blanks?.[0]?.[0])) e('blanks[0][0] precisa estar literalmente em options');
    }
  }
  if (it.hintAfterError != null) {
    const d = String(it.hintAfterError);
    if (!d.trim()) e('hintAfterError vazio');
    if (canon.some((a) => a.length > 3 && new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(d))) e('hintAfterError entrega a resposta');
  }
  // resposta colada no enunciado (defeito de template)
  const cauda = norm(it.prompt.split(/_{3,}/).pop());
  if (canon.some((a) => tok(a).length >= 2 && ` ${cauda} `.includes(` ${norm(a)} `))) e('resposta repetida no fim do enunciado');
  const extra = Object.keys(it).filter((k) => !['prompt', 'blanks', 'hint', 'hintPt', 'options', 'hintAfterError'].includes(k));
  if (extra.length) e(`campos desconhecidos: ${extra.join(', ')}`);
  return erros;
}

function carrega() {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs.readdirSync(DATA_DIR)
    .filter((f) => /^\d+\.json$/.test(f))
    .map((f) => {
      try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8')); }
      catch (err) { return { num: Number(f.split('.')[0]), _erro: `JSON inválido: ${err.message}` }; }
    })
    .filter((d) => !ONLY_SET || ONLY_SET.has(d.num))
    .sort((a, b) => a.num - b.num);
}

function main() {
  const docs = carrega();
  const base = JSON.parse(fs.readFileSync(COURSES[0], 'utf8'));
  const porNum = new Map(base.lessons.map((l) => [l.num, l]));
  const ok = [];
  let recusadas = 0;
  let itens = 0;
  const mix = { hint: 0, hintPt: 0, options: 0, nenhuma: 0, hintAfterError: 0 };
  for (const d of docs) {
    const erros = [];
    if (d._erro) erros.push(d._erro);
    const l = porNum.get(d.num);
    if (!l) erros.push('lição não existe');
    for (const ex of d.exercises || []) {
      const alvo = l?.exercises?.[ex.index];
      if (!alvo || alvo.type !== 'verbFill') { erros.push(`exercício ${ex.index} não é verbFill`); continue; }
      if (!Array.isArray(ex.items) || ex.items.length < 4 || ex.items.length > 10) erros.push(`exercício ${ex.index}: ${ex.items?.length} itens (4–10)`);
      (ex.items || []).forEach((it, k) => erros.push(...validaItem(it, `L${d.num} ex${ex.index} item${k + 1}`)));
    }
    if (!d.exercises?.length) erros.push('sem exercises');
    if (erros.length) {
      recusadas++;
      console.log(`✗ L${d.num}\n  ${erros.join('\n  ')}`);
      continue;
    }
    for (const ex of d.exercises) for (const it of ex.items) {
      itens++;
      if (it.hint != null) mix.hint++; else if (it.hintPt != null) mix.hintPt++; else if (it.options) mix.options++; else mix.nenhuma++;
      if (it.hintAfterError) mix.hintAfterError++;
    }
    ok.push(d);
  }
  console.log(`\n${ok.length} lições válidas, ${recusadas} recusadas, ${itens} itens`, mix);
  if (!APPLY) return;
  if (recusadas && !argv.includes('--parcial')) {
    console.log('Há recusas — corrija, ou rode com --parcial para aplicar só as válidas.');
    return;
  }

  for (const file of COURSES) {
    const course = JSON.parse(fs.readFileSync(file, 'utf8'));
    const map = new Map(course.lessons.map((l) => [l.num, l]));
    for (const d of ok) {
      const l = map.get(d.num);
      for (const ex of d.exercises) {
        const alvo = l.exercises[ex.index];
        alvo.instruction = INSTRUCTION;
        alvo.items = ex.items.map((it) => ({
          ...it,
          // `answer` segue existindo para quem lê o gabarito (guia do professor)
          answer: it.blanks.map((a) => a[0]).join(' … '),
        }));
      }
    }
    fs.writeFileSync(file, JSON.stringify(course));   // o course.json é minificado
    console.log(`gravado ${path.relative(process.cwd(), file)}`);
  }
}

main();
