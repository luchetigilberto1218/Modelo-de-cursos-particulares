#!/usr/bin/env node
/*
  Czarnikow (ambiente de teste) — substitui os exercícios que sobraram no formato
  antigo por exercícios interativos gerados a partir da própria lição.

  Depois de rodar o czt-converte-licoes.cjs, sobra em cada lição o que não
  encaixou em nenhuma forma conhecida ou o que o conversor RECUSOU por estar
  defeituoso (mesmo enunciado em todos os itens, frases de template
  agramaticais, definições com inglês quebrado). Deixá-los na tela como "faça no
  caderno" mantinha o defeito à vista e não somava para a conclusão da lição.

  Aqui eles são TROCADOS, não remendados. A troca só usa material que já estava
  escrito à mão dentro da lição e que foi conferido como limpo:

    · grammarDeepDive.quickPractice  → verbFill    (720/720 lições têm)
    · vocab en/pt                    → matching    (720/720 lições têm)
    · grammarDeepDive.commonMistakes → multipleChoice (720/720 lições têm)

  NÃO se usa `vocab[].example`: essas frases vêm do mesmo gerador que produziu os
  exercícios defeituosos ("The team discussed depot at the Czarnikow London
  desk", e no Apex a mesma frase repetida para palavras diferentes).

  Nada de inglês novo é inventado por este script: cada frase que vai para a tela
  já existia na lição, escrita por quem fez o curso.

  Uso:
    node scripts/czt-repoe-exercicios.cjs --report --level=essentials
    node scripts/czt-repoe-exercicios.cjs --apply  --level=essentials
*/

const fs = require('fs');
const path = require('path');

const COURSE = path.join(__dirname, '..', 'courses', 'czarnikow-teste', 'course.json');
const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const arg = (n) => (argv.find((a) => a.startsWith(`--${n}=`)) || '').split('=')[1] || null;
const ONLY_TRACK = arg('track');
const ONLY_LEVEL = arg('level');

const clean = (s) => (s || '').toString().replace(/\s+/g, ' ').trim();
/** normaliza a lacuna: o material usa de 3 a 8 sublinhados */
const gap = (s) => clean(s).replace(/_{2,}/g, '___');

/** contrações aceitas além da resposta oficial — evita reprovar quem escreve certo */
function variantes(resposta) {
  const r = clean(resposta);
  const out = new Set();
  const pares = [
    [/\bdo not\b/gi, "don't"], [/\bdoes not\b/gi, "doesn't"], [/\bdid not\b/gi, "didn't"],
    [/\bis not\b/gi, "isn't"], [/\bare not\b/gi, "aren't"], [/\bwas not\b/gi, "wasn't"],
    [/\bwere not\b/gi, "weren't"], [/\bhas not\b/gi, "hasn't"], [/\bhave not\b/gi, "haven't"],
    [/\bhad not\b/gi, "hadn't"], [/\bwill not\b/gi, "won't"], [/\bcannot\b/gi, "can't"],
    [/\bmust not\b/gi, "mustn't"], [/\bshould not\b/gi, "shouldn't"], [/\bwould not\b/gi, "wouldn't"],
  ];
  for (const [re, curta] of pares) if (re.test(r)) out.add(r.replace(re, curta));
  out.delete(r);
  return [...out];
}

/* ── geradores ─────────────────────────────────────────────────────────────── */

/** quickPractice → verbFill. A dica entre parênteses vem junto, como na fonte. */
function geraVerbFill(l, num) {
  const qp = (l.grammarDeepDive?.quickPractice || []).filter((x) => x?.q && x?.a);
  if (qp.length < 3) return null;
  return {
    type: 'verbFill',
    title: `${num}. Pratique: ${l.grammar}`,
    instruction: 'Complete cada lacuna e clique em “Corrigir”. A dica entre parênteses é a forma base.',
    items: qp.map((x) => ({
      prompt: gap(x.q),
      answer: clean(x.a),
      acceptable: variantes(x.a),
    })),
  };
}

/** vocab en/pt → matching. */
function geraMatching(l, num) {
  const v = (l.vocab || []).filter((x) => x && typeof x === 'object' && x.en && x.pt);
  if (v.length < 4) return null;
  const pairs = [];
  const vistos = new Set();
  for (const x of v) {
    const pt = clean(x.pt);
    if (vistos.has(pt.toLowerCase())) continue; // significado repetido deixaria o par ambíguo
    vistos.add(pt.toLowerCase());
    pairs.push({ left: clean(x.en), right: pt });
  }
  if (pairs.length < 4) return null;
  return {
    type: 'matching',
    title: `${num}. Relacione o termo ao significado`,
    skill: 'vocabulary',
    instruction: 'Associe cada termo em inglês ao seu significado em português.',
    pairs,
  };
}

/** commonMistakes → multipleChoice: qual frase está certa? */
function geraMultipleChoice(l, num) {
  const cm = (l.grammarDeepDive?.commonMistakes || []).filter((x) => x?.wrong && x?.right);
  if (cm.length < 2) return null;
  const certo = cm[0];
  const porque = clean(certo.why || certo.note || '');
  // cada distrator carrega a explicação do PRÓPRIO erro, não uma genérica
  const distratores = cm
    .map((x) => ({ text: clean(x.wrong), why: clean(x.why || x.note || '') }))
    .filter((d, i, arr) => d.text && d.text !== clean(certo.right)
      && arr.findIndex((o) => o.text === d.text) === i)
    .slice(0, 3);
  if (!distratores.length) return null;

  const options = [
    { text: clean(certo.right), correct: true },
    ...distratores.map((d) => ({
      text: d.text,
      correct: false,
      whyWrong: d.why || 'Confira a forma na seção de gramática desta lição.',
    })),
  ];
  // a resposta certa não pode cair sempre na primeira posição
  if (l.num % 2 === 0) options.reverse();
  // as letras só são atribuídas depois da ordenação, senão saem fora de ordem
  options.forEach((o, i) => { o.id = String.fromCharCode(97 + i); });

  return {
    type: 'multipleChoice',
    title: `${num}. Qual frase está correta?`,
    prompt: 'Só uma das frases está certa. Escolha a correta.',
    options,
    explanation: porque || 'É a forma correta para a gramática desta lição.',
  };
}

/* Ordem de preferência. Evita repetir um tipo que a lição já tem — o aluno faria
   dois exercícios iguais em sequência. */
const GERADORES = [
  ['verbFill', geraVerbFill, ['verbFill', 'wordBank', 'quickDrill']],
  ['matching', geraMatching, ['matching']],
  ['multipleChoice', geraMultipleChoice, ['multipleChoice']],
];

/* ── execução ──────────────────────────────────────────────────────────────── */
const course = JSON.parse(fs.readFileSync(COURSE, 'utf8'));
const alvo = course.lessons.filter((l) => (
  (!ONLY_LEVEL || l.level === ONLY_LEVEL)
  && (!ONLY_TRACK || l.track === ONLY_TRACK)
  && (l.exercises || []).some((e) => !e.type)
));

const stat = { licoes: alvo.length, trocados: 0, semFonte: 0 };
const porGerador = {};
const problemas = [];

for (const l of alvo) {
  const usados = new Set((l.exercises || []).filter((e) => e.type).map((e) => e.type));
  const novos = [];
  for (const [i, e] of (l.exercises || []).entries()) {
    if (e.type) { novos.push(e); continue; }

    const num = i + 1;
    let escolhido = null;
    // 1ª passada: gerador cujo tipo ainda não aparece na lição
    for (const [nome, fn, conflita] of GERADORES) {
      if (conflita.some((t) => usados.has(t))) continue;
      const g = fn(l, num);
      if (g) { escolhido = [nome, g]; break; }
    }
    // 2ª passada: aceita repetir o tipo, para não deixar exercício quebrado na tela
    if (!escolhido) {
      for (const [nome, fn] of GERADORES) {
        const g = fn(l, num);
        if (g) { escolhido = [nome, g]; break; }
      }
    }

    if (!escolhido) {
      stat.semFonte += 1;
      problemas.push(`${l.level}/${l.track} #${l.trackOrder} (num ${l.num}) — ${e.title}`);
      novos.push(e);
      continue;
    }
    const [nome, exercicio] = escolhido;
    porGerador[nome] = (porGerador[nome] || 0) + 1;
    usados.add(exercicio.type);
    stat.trocados += 1;
    novos.push(exercicio);
  }
  l.exercises = novos;
}

console.log(`\n${ONLY_LEVEL || 'curso inteiro'}${ONLY_TRACK ? '/' + ONLY_TRACK : ''}`);
console.log(`  lições com exercício no formato antigo: ${stat.licoes}`);
console.log(`  exercícios trocados: ${stat.trocados}`);
console.log(`  sem fonte limpa na lição (mantidos): ${stat.semFonte}`);
console.log('  por gerador:', porGerador);
if (problemas.length) {
  console.log('\n  sem fonte:');
  problemas.slice(0, 20).forEach((p) => console.log('   ', p));
}

if (APPLY) {
  fs.writeFileSync(COURSE, JSON.stringify(course));
  console.log('\nGRAVADO em course.json.');
} else {
  console.log('\n(modo relatório — nada foi gravado; use --apply)');
}
