#!/usr/bin/env node
/*
  Czarnikow (ambiente de teste) — conversor dos exercícios estáticos para o
  formato interativo que o CztLesson renderiza.

  O material do Czarnikow nasceu como HTML solto ({title, content}) com, no
  máximo, um array `answers` ao lado: o aluno lia, respondia no caderno e o
  professor conferia. A trilha essentials/hr foi convertida à mão para o formato
  tipado (readAloud / wordBank / verbFill / matching), que corrige sozinho,
  acende a lição na trilha e alimenta a campanha. Faltam as outras 35 trilhas.

  Este script faz a parte mecânica dessa conversão: reconhece as FORMAS que se
  repetem no material e as traduz para o schema tipado. O que não encaixa numa
  forma conhecida — ou o que encaixa mas está defeituoso — ele NÃO converte:
  reporta, para virar trabalho de conteúdo. Converter um exercício quebrado é
  pior que deixá-lo estático, porque a correção automática passa a reprovar quem
  acertou.

  Uso:
    node scripts/czt-converte-licoes.cjs --report              (não escreve nada)
    node scripts/czt-converte-licoes.cjs --report --track=logistics
    node scripts/czt-converte-licoes.cjs --apply --track=general-business
    node scripts/czt-converte-licoes.cjs --apply --level=essentials
*/

const fs = require('fs');
const path = require('path');

const COURSE = path.join(__dirname, '..', 'courses', 'czarnikow-teste', 'course.json');
const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const arg = (n) => (argv.find((a) => a.startsWith(`--${n}=`)) || '').split('=')[1] || null;
const ONLY_TRACK = arg('track');
const ONLY_LEVEL = arg('level') || 'essentials';
const VERBOSE = argv.includes('--verbose');

/* ── utilidades de HTML ────────────────────────────────────────────────────── */
const decode = (s) => (s || '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const stripTags = (s) => decode((s || '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
/** quebra o conteúdo em linhas lógicas (<br> e fim de <p>) */
const toLines = (html) => decode(html || '')
  .replace(/<\/p>\s*<p>/gi, '\n')
  .replace(/<\/li>/gi, '\n')
  .replace(/<li[^>]*>/gi, '\n')
  .replace(/<\/?(?:ol|ul|div)[^>]*>/gi, '\n')
  .replace(/<br\s*\/?>/gi, '\n')
  .split('\n')
  .map((s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
  .filter(Boolean);

const GAP = /_{2,}/;
const LETTER_LINE = /^([a-j])\)\s*(.+)$/i;
const ITEM_LINE = /^([a-j]|\d{1,2})[.)]\s*(.+)$/i;
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const norm = (s) => clean(s).toLowerCase().replace(/[.,!?;:]/g, '');

/** Gabarito por letra: ["a) email", …] → {a:'email', …}. Também aceita array puro. */
function answersByLetter(answers) {
  const map = {};
  const flat = [];
  for (const raw of answers || []) {
    const m = String(raw).match(/^\s*([a-j]|\d{1,2})[.)]\s*(.+)$/i);
    if (m) map[m[1].toLowerCase()] = clean(m[2]);
    else flat.push(clean(String(raw)));
  }
  return { map, flat, lettered: Object.keys(map).length > 0 };
}

/** Word bank declarado no enunciado ("Word bank: a, b, c."). */
function readBank(html) {
  const txt = stripTags(html);
  const m = txt.match(/word bank:?\s*([^.]*[^.\s])\.?/i);
  if (!m) return null;
  const itens = m[1].split(/,\s*/).map(clean).filter(Boolean);
  return itens.length >= 3 ? itens : null;
}

/* ── detector de defeito: o mesmo enunciado repetido ───────────────────────────
   Existe um lote de exercícios gerados por template em que TODOS os itens têm a
   mesma frase e respostas diferentes — impossíveis de acertar quando a correção
   é automática. Já apareceram e foram consertados à mão em essentials/hr. */
function stemsRepetidos(itens) {
  if (itens.length < 4) return false;
  const stems = itens.map((i) => norm(String(i.text || i.prompt || '').replace(/\(.*?\)/g, '').replace(/_+/g, '_')));
  return new Set(stems).size <= Math.ceil(stems.length / 2);
}

/* ── parsers ───────────────────────────────────────────────────────────────── */

/** 1. Read aloud — frases em <em> dentro do conteúdo. */
function parseReadAloud(e) {
  if (!/read aloud|leia em voz/i.test(e.title || '')) return null;
  const frases = [...(e.content || '').matchAll(/<em>([\s\S]*?)<\/em>/gi)]
    .map((m) => stripTags(m[1]).replace(/^["“”']+|["“”']+$/g, ''))
    .filter((s) => s.length > 3);
  if (frases.length < 2) return null;
  const antes = stripTags((e.content || '').split(/<em>/i)[0]);
  return {
    type: 'readAloud',
    title: e.title,
    instruction: antes || 'Ouça e leia cada frase em voz alta. Grave para comparar sua pronúncia.',
    sentences: frases,
  };
}

/** 2. Lacunas em itens rotulados — a)…j) ou 1)…10) — vira wordBank (com banco)
    ou verbFill (digitando). O gabarito pode vir rotulado ("a) email") ou como
    lista posicional na mesma ordem dos itens. */
function parseLetteredGaps(e) {
  const linhas = toLines(e.content).filter((l) => ITEM_LINE.test(l) && GAP.test(l));
  if (linhas.length < 4) return null;

  const { map, flat, lettered } = answersByLetter(e.answers);
  const posicional = !lettered && flat.length === linhas.length ? flat : null;
  const itens = [];
  for (const [i, linha] of linhas.entries()) {
    const [, rotulo, resto] = linha.match(ITEM_LINE);
    if (!GAP.test(resto)) return null; // sem lacuna → não é este formato

    let texto = resto;
    let resposta = lettered ? map[rotulo.toLowerCase()] : (posicional ? posicional[i] : null);

    // resposta escrita no fim da linha entre parênteses: "… the backbone. (is)"
    const fim = texto.match(/\s*\(([^()]{1,40})\)\s*$/);
    if (!resposta && fim) { resposta = clean(fim[1]); texto = texto.replace(/\s*\([^()]{1,40}\)\s*$/, ''); }
    else if (resposta && fim && norm(fim[1]) === norm(resposta)) texto = texto.replace(/\s*\([^()]{1,40}\)\s*$/, '');

    if (!resposta) return null;                    // sem gabarito recuperável
    if (/^\(.*\)$/.test(resposta)) return null;
    // "a) My manager's decision is final." — gabarito é a frase inteira reescrita,
    // não cabe numa lacuna; esse formato é de reescrita, não de preenchimento.
    if (resposta.split(' ').length > 6) return null;

    itens.push({ rotulo, text: clean(texto).replace(GAP, '___'), answer: resposta });
  }
  if (itens.length < 4) return null;
  if (itens.some((i) => !i.text.includes('___'))) return null;
  if (stemsRepetidos(itens)) return { defeito: 'enunciado repetido em todos os itens' };

  const bank = readBank(e.content);
  const instrucaoBase = stripTags((e.content || '').split(/<br/i)[0]).replace(/:$/, '');

  if (bank) {
    // todas as respostas precisam existir no banco, senão o select não as oferece
    const faltando = itens.filter((i) => !bank.some((b) => norm(b) === norm(i.answer)));
    if (faltando.length === 0) {
      return {
        type: 'wordBank',
        title: e.title,
        instruction: `${instrucaoBase}. Escolha a opção certa em cada lacuna e clique em “Corrigir”.`,
        bank,
        items: itens.map((i) => ({ text: i.text, answer: i.answer })),
      };
    }
  }

  // banco implícito: poucas respostas distintas (must/have to, is/are, can/cannot…)
  const distintas = [...new Set(itens.map((i) => i.answer))];
  if (distintas.length <= 4 && distintas.every((d) => d.split(' ').length <= 3)) {
    return {
      type: 'wordBank',
      title: e.title,
      instruction: `${instrucaoBase}. Escolha a opção certa em cada lacuna e clique em “Corrigir”.`,
      bank: distintas.sort(),
      items: itens.map((i) => ({ text: i.text, answer: i.answer })),
    };
  }

  return {
    type: 'verbFill',
    title: e.title,
    instruction: `${instrucaoBase}. Digite a resposta em cada lacuna e clique em “Corrigir”.`,
    items: itens.map((i) => ({ prompt: i.text, answer: i.answer, acceptable: [] })),
  };
}

/** 3. Parágrafo com lacunas numeradas (1)…(10) + word bank. */
function parseParagraphGaps(e) {
  const bank = readBank(e.content);
  const { flat, lettered } = answersByLetter(e.answers);
  if (!bank || lettered || flat.length < 4) return null;

  // o parágrafo é o último <p> — o que tem as lacunas numeradas
  const paras = decode(e.content || '').split(/<\/p>/i).map((p) => stripTags(p)).filter(Boolean);
  const corpo = paras.find((p) => (p.match(/\(\d+\)\s*_+/g) || []).length >= 4);
  if (!corpo) return null;

  const gaps = (corpo.match(/\(\d+\)\s*_+/g) || []).length;
  if (gaps !== flat.length) return null;

  // quebra em frases; cada item precisa ficar com exatamente uma lacuna
  const frases = corpo.match(/[^.!?]+[.!?]+/g) || [];
  const itens = [];
  let idx = 0;
  for (const f of frases) {
    const n = (f.match(/\(\d+\)\s*_+/g) || []).length;
    if (n === 0) continue;
    if (n > 1) return null; // duas lacunas na mesma frase: o select só cobre uma
    itens.push({ text: clean(f).replace(/\(\d+\)\s*_+/, '___'), answer: flat[idx] });
    idx += 1;
  }
  if (itens.length !== flat.length) return null;
  if (stemsRepetidos(itens)) return { defeito: 'enunciado repetido em todos os itens' };

  // o banco precisa conter todas as respostas (o gabarito às vezes flexiona: start → starts)
  const faltando = itens.filter((i) => !bank.some((b) => norm(b) === norm(i.answer)));
  const bancoFinal = faltando.length
    ? [...new Set([...bank, ...faltando.map((i) => i.answer)])]
    : bank;

  return {
    type: 'wordBank',
    title: e.title,
    instruction: 'Complete o texto escolhendo a palavra certa em cada lacuna. Cada palavra é usada uma vez.',
    bank: bancoFinal,
    items: itens,
  };
}

/** 4. Duas listas rotuladas (a–j) × (1–10) e um gabarito ligando uma à outra.
    Cobre os dois sentidos que o material usa: "a) 7 — to negotiate" (letra→número)
    e "1-f" (número→letra). As listas aparecem como "a)" e "1)" ou "1.". */
function parseMatchWordDef(e) {
  if (!Array.isArray(e.answers) || e.answers.length < 4) return null;
  const linhas = toLines(e.content);

  const porLetra = {};
  const porNumero = {};
  for (const l of linhas) {
    const p = l.match(/^([a-j])[.)]\s*(.+)$/i);
    if (p && !GAP.test(p[2])) porLetra[p[1].toLowerCase()] = clean(p[2]);
    const d = l.match(/^(\d{1,2})[.)]\s*(.+)$/);
    if (d && !GAP.test(d[2])) porNumero[d[1]] = clean(d[2]);
  }
  if (Object.keys(porLetra).length < 4 || Object.keys(porNumero).length < 4) return null;

  const pairs = [];
  for (const raw of e.answers) {
    const s = clean(String(raw));
    // "a) 7 — to negotiate"  →  letra a ligada ao número 7
    let m = s.match(/^([a-j])\s*[.)=-]\s*(\d{1,2})\b/i);
    if (m) {
      const esq = porLetra[m[1].toLowerCase()];
      const dir = porNumero[m[2]];
      if (!esq || !dir) return null;
      pairs.push({ left: esq, right: dir });
      continue;
    }
    // "1-f" / "1 - f" / "1) f"  →  número 1 ligado à letra f
    m = s.match(/^(\d{1,2})\s*[-–—).=]\s*([a-j])\b/i);
    if (m) {
      const esq = porNumero[m[1]];
      const dir = porLetra[m[2].toLowerCase()];
      if (!esq || !dir) return null;
      pairs.push({ left: esq, right: dir });
      continue;
    }
    return null;
  }
  if (pairs.length < 4) return null;
  // definições geradas por template ("the action of ask foring something") não vão pro ar
  if (pairs.some((p) => /\b\w+ing\w*ing\b|\b(to )?\w+ foring\b/i.test(p.right))) {
    return { defeito: 'definições com inglês quebrado (geradas por template)' };
  }
  if (new Set(pairs.map((p) => norm(p.right))).size !== pairs.length) {
    return { defeito: 'definições repetidas — o par fica ambíguo' };
  }

  return {
    type: 'matching',
    title: e.title,
    skill: 'vocabulary',
    instruction: 'Relacione cada termo à sua definição.',
    pairs,
  };
}

/** 5. "a) Supplier — ______ (provides raw materials)" — par na própria linha. */
function parseMatchInline(e) {
  const linhas = toLines(e.content).filter((l) => LETTER_LINE.test(l));
  if (linhas.length < 4) return null;
  const pairs = [];
  for (const l of linhas) {
    const m = l.match(/^[a-j]\)\s*(.+?)\s*[—–-]\s*_+\s*\(([^()]+)\)\s*$/i);
    if (!m) return null;
    pairs.push({ left: clean(m[1]), right: clean(m[2]) });
  }
  if (new Set(pairs.map((p) => norm(p.right))).size !== pairs.length) {
    return { defeito: 'definições repetidas — o par fica ambíguo' };
  }
  return {
    type: 'matching',
    title: e.title,
    skill: 'vocabulary',
    instruction: 'Relacione cada elemento ao que ele faz.',
    pairs,
  };
}

/** 6. Reordenar palavras: "a) the / team / We / call / every / Brazil / week."
    com o gabarito trazendo a frase montada. Vira o tipo wordOrder do CztLesson. */
function parseWordOrder(e) {
  const { map, flat, lettered } = answersByLetter(e.answers);
  // separador é " / " com espaços: siglas do material ("D/P", "D/A") não podem
  // ser quebradas ao meio.
  const SEP = /\s+\/\s+/;
  const linhas = toLines(e.content).filter((l) => l.split(SEP).length >= 4);
  if (linhas.length < 3) return null;

  const items = [];
  for (const [i, linha] of linhas.entries()) {
    // duas embalagens no material: "a) x / y / z" e "[ x / y / z ] (dica)"
    const rotulado = linha.match(ITEM_LINE);
    const rotulo = rotulado ? rotulado[1] : null;
    const corpo = (rotulado ? rotulado[2] : linha)
      .replace(/^\[\s*/, '').replace(/\s*\]\s*(\(.*\))?\s*$/, '');
    const palavras = corpo.split(SEP).map(clean).filter(Boolean);
    if (palavras.length < 4) return null;
    const frase = (lettered && rotulo) ? map[rotulo.toLowerCase()] : flat[i];
    if (!frase) return null;
    // o gabarito tem que ser exatamente as mesmas palavras, só que na ordem certa
    const a = [...palavras].map(norm).sort().join(' ');
    const b = frase.split(/\s+/).map(norm).filter(Boolean).sort().join(' ');
    if (a !== b) return null;
    items.push({ words: palavras, answer: clean(frase) });
  }
  if (items.length < 3) return null;

  // frases montadas por template cego ("The late is important for Czarnikow.")
  const modelo = items.filter((i) => /^The \w+ is important for Czarnikow\.?$/i.test(i.answer)).length;
  if (modelo >= Math.ceil(items.length / 2)) {
    return { defeito: 'frases montadas por template, várias agramaticais' };
  }

  return {
    type: 'wordOrder',
    title: e.title,
    instruction: 'Toque nas palavras na ordem certa para formar a frase. Toque de novo para tirar.',
    items,
  };
}

const PARSERS = [
  ['readAloud', parseReadAloud],
  ['wordOrder', parseWordOrder],
  ['matchInline', parseMatchInline],
  ['matchWordDef', parseMatchWordDef],
  ['paragraphGaps', parseParagraphGaps],
  ['letteredGaps', parseLetteredGaps],
];

function converte(e) {
  for (const [nome, fn] of PARSERS) {
    let r = null;
    try { r = fn(e); } catch (err) { return { falha: `erro no parser ${nome}: ${err.message}` }; }
    if (r && r.defeito) return { falha: r.defeito, parser: nome };
    if (r) return { ex: r, parser: nome };
  }
  return { falha: 'nenhuma forma reconhecida' };
}

/* ── execução ──────────────────────────────────────────────────────────────── */
const course = JSON.parse(fs.readFileSync(COURSE, 'utf8'));
const alvo = course.lessons.filter((l) => (
  l.level === ONLY_LEVEL
  && (!ONLY_TRACK || l.track === ONLY_TRACK)
  && !(l.exercises || []).some((e) => e.type) // pula o que já é interativo
));

const stat = { licoes: alvo.length, ex: 0, ok: 0, falha: 0 };
const porParser = {};
const falhas = [];
const convertidas = [];

for (const l of alvo) {
  const novos = [];
  let algumOk = false;
  let todosOk = true;
  for (const e of l.exercises || []) {
    stat.ex += 1;
    const r = converte(e);
    if (r.ex) {
      stat.ok += 1;
      algumOk = true;
      porParser[r.parser] = (porParser[r.parser] || 0) + 1;
      novos.push(r.ex);
    } else {
      stat.falha += 1;
      todosOk = false;
      novos.push(e);       // fica como está — o CztLesson renderiza o formato antigo
      falhas.push({ track: l.track, ordem: l.trackOrder, num: l.num, titulo: e.title, motivo: r.falha });
    }
  }
  // O primeiro exercício é o que decide o renderizador (LessonView olha
  // exercises[0].type). Sem ele convertido, a lição não migra.
  if (algumOk && novos[0]?.type) convertidas.push({ l, novos, todosOk });
}

console.log(`\n${ONLY_LEVEL}${ONLY_TRACK ? '/' + ONLY_TRACK : ''} — ${stat.licoes} lições ainda estáticas, ${stat.ex} exercícios`);
console.log(`  convertidos automaticamente: ${stat.ok}  (${Math.round((stat.ok / stat.ex) * 100)}%)`);
console.log(`  precisam de trabalho de conteúdo: ${stat.falha}`);
console.log(`  lições que migram para o formato novo: ${convertidas.length} de ${stat.licoes}`);
console.log(`    · com os 3 exercícios interativos: ${convertidas.filter((c) => c.todosOk).length}`);
console.log(`    · com 1 exercício ainda no formato antigo: ${convertidas.filter((c) => !c.todosOk).length}`);
console.log('\n  por parser:', porParser);

const motivos = {};
for (const f of falhas) motivos[f.motivo] = (motivos[f.motivo] || 0) + 1;
console.log('\n  motivos das falhas:');
Object.entries(motivos).sort((a, b) => b[1] - a[1]).forEach(([m, n]) => console.log(`    ${String(n).padStart(4)}  ${m}`));

if (VERBOSE) {
  console.log('\n  exercícios não convertidos:');
  for (const f of falhas) console.log(`    ${f.track} #${f.ordem} (num ${f.num}) — ${f.titulo} → ${f.motivo}`);
}

if (APPLY) {
  for (const { l, novos } of convertidas) l.exercises = novos;
  fs.writeFileSync(COURSE, JSON.stringify(course));
  console.log(`\nGRAVADO: ${convertidas.length} lições convertidas em course.json.`);
} else {
  console.log('\n(modo relatório — nada foi gravado; use --apply)');
}
