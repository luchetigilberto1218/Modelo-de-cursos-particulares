/* ============================================================
   PÓS-AULA · banco de formatos de exercício (auto-gerados)
   Puro (sem React): roda no build do servidor e devolve BLOCOS
   serializáveis. Cada bloco corrige-se sozinho e exige o mínimo de
   escrita (seleção, ordenação, ligação, toque). Sorteio determinístico
   por número da aula -> lições diferentes recebem misturas diferentes.
   ============================================================ */

/* ---------- utilidades determinísticas ---------- */
export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function sample(arr, n, rng) { return shuffle(arr, rng).slice(0, Math.max(0, n)); }
function words(s) { return String(s || '').trim().replace(/\s+/g, ' ').split(' ').filter(Boolean); }
const norm = (s) => String(s || '').trim().toLowerCase().replace(/[.,!?;:"“”]+$/, '');
const STOP = new Set('a an the to of in on at and or my your i can is are be with for it this that you we am do does not no as by from will would about into over under after before our their his her they he she them us me have has had at your'.split(' '));

function distractors(correct, poolVals, n, rng) {
  const seen = new Set([norm(correct)]);
  const out = [];
  for (const v of shuffle(poolVals, rng)) {
    const k = norm(v);
    if (!v || !k || seen.has(k)) continue;
    seen.add(k); out.push(v);
    if (out.length >= n) break;
  }
  return out;
}
function mcExercise({ title, prompt, correct, distractors: ds, explanation, rng }) {
  const opts = shuffle([{ text: correct, correct: true }, ...ds.map((d) => ({ text: d, correct: false }))], rng)
    .map((o, i) => ({ id: 'abcdef'[i], text: o.text, correct: o.correct }));
  return { type: 'multipleChoice', title, prompt, options: opts, explanation };
}
function scramble(tokens, rng) {
  if (tokens.length < 2) return tokens;
  let out = shuffle(tokens, rng);
  if (out.join(' ') === tokens.join(' ')) out = [...tokens.slice(1), tokens[0]];
  return out;
}

/* ---------- banco distrator (amostra de OUTRAS lições) ---------- */
export function buildDistractorPool(course, currentNum, cap = 60) {
  const words = [];
  const takeaways = [];
  const lessons = course?.lessons || [];
  for (const l of lessons) {
    if (l.num === currentNum) continue;
    if (Array.isArray(l.vocab)) for (const v of l.vocab) if (v && v.en && v.pt) words.push({ en: v.en, pt: v.pt });
    if (Array.isArray(l.takeaways)) for (const t of l.takeaways) if (t) takeaways.push(t);
  }
  // amostragem determinística e enxuta (espaçada) para não inflar o payload
  const spread = (arr, k) => {
    if (arr.length <= k) return arr;
    const step = arr.length / k, out = [];
    for (let i = 0; i < k; i++) out.push(arr[Math.floor(i * step)]);
    return out;
  };
  return { words: spread(words, cap), takeaways: spread(takeaways, Math.floor(cap * 0.7)) };
}

/* ============================================================
   GERADORES (cada um devolve um bloco ou null)
   ctx = { vocab, takeaways, meta, pool, rng }
   ============================================================ */

/* ---- MEMORIZAÇÃO (palavras-chave) ---- */

function vocMeaning(ctx) {
  const { vocab, pool, rng } = ctx;
  if (vocab.length < 2) return null;
  const picks = sample(vocab, Math.min(4, vocab.length), rng);
  const exercises = picks.map((v) => {
    const ds = distractors(v.pt, [...vocab.map((x) => x.pt), ...pool.words.map((x) => x.pt)], 3, rng);
    if (ds.length < 2) return null;
    return mcExercise({ title: `O que significa “${v.en}”?`, prompt: '', correct: v.pt, distractors: ds, explanation: `${v.en} — ${v.pt}`, rng });
  }).filter(Boolean);
  if (!exercises.length) return null;
  return { id: 'vocMeaning', cat: 'memo', format: 'Significado', render: 'engine', title: 'Escolha o significado', instruction: 'Marque a tradução correta de cada palavra.', exercises };
}

function vocReverse(ctx) {
  const { vocab, pool, rng } = ctx;
  if (vocab.length < 2) return null;
  const picks = sample(vocab, Math.min(4, vocab.length), rng);
  const exercises = picks.map((v) => {
    const ds = distractors(v.en, [...vocab.map((x) => x.en), ...pool.words.map((x) => x.en)], 3, rng);
    if (ds.length < 2) return null;
    return mcExercise({ title: `Qual palavra em inglês significa “${v.pt}”?`, prompt: '', correct: v.en, distractors: ds, explanation: `${v.pt} — ${v.en}`, rng });
  }).filter(Boolean);
  if (!exercises.length) return null;
  return { id: 'vocReverse', cat: 'memo', format: 'Palavra certa', render: 'engine', title: 'Qual é a palavra em inglês?', instruction: 'Marque a palavra em inglês para cada tradução.', exercises };
}

function vocClozeMC(ctx) {
  const { vocab, pool, rng } = ctx;
  const withEx = vocab.filter((v) => v.example && new RegExp(esc(v.en), 'i').test(v.example));
  if (withEx.length < 1) return null;
  const picks = sample(withEx, Math.min(4, withEx.length), rng);
  const exercises = picks.map((v) => {
    const prompt = v.example.replace(new RegExp(esc(v.en), 'i'), '_____');
    const ds = distractors(v.en, [...vocab.map((x) => x.en), ...pool.words.map((x) => x.en)], 3, rng);
    if (ds.length < 2) return null;
    return mcExercise({ title: 'Complete a frase', prompt, correct: v.en, distractors: ds, explanation: `${v.en} — ${v.pt}`, rng });
  }).filter(Boolean);
  if (!exercises.length) return null;
  return { id: 'vocClozeMC', cat: 'memo', format: 'Completar (escolha)', render: 'engine', title: 'Complete a frase escolhendo a palavra', instruction: 'Marque a palavra que completa cada frase — sem digitar.', exercises };
}

function vocMatch(ctx) {
  const { vocab, rng } = ctx;
  if (vocab.length < 3) return null;
  const picks = sample(vocab, Math.min(6, vocab.length), rng);
  return {
    id: 'vocMatch', cat: 'memo', format: 'Ligar', render: 'engine', title: 'Ligue palavra e tradução',
    exercises: [{ type: 'matching', skill: 'vocabulary', title: 'Associe cada palavra à sua tradução', pairs: picks.map((v) => ({ left: v.en, right: v.pt })), explanation: 'Boa! Você associou as palavras-chave.' }],
  };
}

function vocMatchExample(ctx) {
  const { vocab, rng } = ctx;
  const withEx = vocab.filter((v) => v.example);
  if (withEx.length < 3) return null;
  const picks = sample(withEx, Math.min(5, withEx.length), rng);
  return {
    id: 'vocMatchExample', cat: 'memo', format: 'Palavra × frase', render: 'engine', title: 'Ligue a palavra à frase de exemplo',
    exercises: [{ type: 'matching', title: 'Associe cada palavra ao exemplo em que ela aparece', instruction: 'Clique na caixa à direita e escolha a frase de exemplo certa para cada palavra.', pairs: picks.map((v) => ({ left: v.en, right: v.example })), explanation: 'Boa! Você reconheceu a palavra no contexto.' }],
  };
}

function vocReorderExample(ctx) {
  const { vocab, rng } = ctx;
  const cands = vocab.filter((v) => v.example && words(v.example).length >= 3 && words(v.example).length <= 9);
  if (!cands.length) return null;
  const v = cands[Math.floor(rng() * cands.length)];
  const toks = words(v.example.replace(/[.]$/, ''));
  return {
    id: 'vocReorderExample', cat: 'memo', format: 'Ordenar', render: 'engine', title: 'Coloque a frase na ordem certa',
    exercises: [{ type: 'reorder', title: `Ordene: (dica — usa “${v.en}”)`, prompt: scramble(toks, rng), correctOrder: toks, explanation: `${v.example} — ${v.en} (${v.pt})` }],
  };
}

function vocTrueFalse(ctx) {
  const { vocab, rng } = ctx;
  if (vocab.length < 3) return null;
  const picks = sample(vocab, Math.min(6, vocab.length), rng);
  const items = picks.map((v) => {
    const asTrue = rng() < 0.5;
    let shownPt = v.pt;
    if (!asTrue) {
      const other = vocab.find((x) => norm(x.pt) !== norm(v.pt));
      shownPt = other ? other.pt : v.pt;
    }
    const answer = norm(shownPt) === norm(v.pt);
    return { text: `“${v.en}” quer dizer “${shownPt}”.`, answer, explain: answer ? 'Certo!' : `Na verdade “${v.en}” = “${v.pt}”.` };
  });
  return { id: 'vocTrueFalse', cat: 'memo', format: 'Verdadeiro ou falso', render: 'truefalse', title: 'Verdadeiro ou falso?', instruction: 'A tradução de cada palavra está certa? Toque em V ou F.', items };
}

function vocMemory(ctx) {
  const { vocab, rng } = ctx;
  if (vocab.length < 3) return null;
  const picks = sample(vocab, Math.min(5, vocab.length), rng);
  const pairs = picks.map((v, i) => ({ key: i, en: v.en, pt: v.pt }));
  const deck = shuffle(pairs.flatMap((p) => [{ key: p.key, face: p.en, side: 'en' }, { key: p.key, face: p.pt, side: 'pt' }]), rng)
    .map((c, i) => ({ ...c, id: i }));
  return { id: 'vocMemory', cat: 'memo', format: 'Jogo da memória', render: 'memory', title: 'Jogo da memória', instruction: 'Vire duas cartas e ache o par palavra ↔ tradução.', deck };
}

function vocWordbank(ctx) {
  const { vocab, rng } = ctx;
  const withEx = vocab.filter((v) => v.example && new RegExp(esc(v.en), 'i').test(v.example));
  if (withEx.length < 3) return null;
  const picks = sample(withEx, Math.min(5, withEx.length), rng);
  const items = picks.map((v) => {
    const parts = v.example.split(new RegExp(esc(v.en), 'i'));
    return { before: parts[0], after: parts.slice(1).join(v.en), answer: v.en };
  });
  const bank = shuffle(picks.map((v) => v.en), rng);
  return { id: 'vocWordbank', cat: 'memo', format: 'Banco de palavras', render: 'wordbank', title: 'Complete com o banco de palavras', instruction: 'Toque na palavra do banco e depois no espaço em branco certo — sem digitar.', items, bank };
}

function vocTilesSpell(ctx) {
  const { vocab, rng } = ctx;
  const cands = vocab.filter((v) => v.en.length >= 3 && v.en.length <= 14);
  if (!cands.length) return null;
  const picks = sample(cands, Math.min(3, cands.length), rng);
  const items = picks.map((v) => {
    const isPhrase = /\s/.test(v.en);
    const units = isPhrase ? words(v.en) : v.en.split('');
    return { mode: isPhrase ? 'words' : 'letters', target: units, tiles: scramble(units, rng), hint: v.pt };
  });
  return { id: 'vocTilesSpell', cat: 'memo', format: 'Montar a palavra', render: 'tiles', title: 'Monte a palavra', instruction: 'Toque nas peças na ordem certa para formar a palavra em inglês.', items };
}

function vocOddOneOut(ctx) {
  const { vocab, pool, rng } = ctx;
  if (vocab.length < 3 || pool.words.length < 1) return null;
  const intruso = distractors('', [...pool.words.map((x) => x.en)], 1, rng)[0];
  if (!intruso || vocab.some((v) => norm(v.en) === norm(intruso))) return null;
  const daAula = sample(vocab.map((v) => v.en), 3, rng);
  const exercise = mcExercise({ title: 'Qual palavra NÃO é desta aula?', prompt: 'Três palavras são desta aula. Marque a intrusa.', correct: intruso, distractors: daAula, explanation: `“${intruso}” não faz parte do vocabulário desta aula.`, rng });
  return { id: 'vocOddOneOut', cat: 'memo', format: 'Ache a intrusa', render: 'engine', title: 'Ache a palavra intrusa', exercises: [exercise] };
}

function vocPicture(ctx) {
  const { vocab, pool, meta, rng } = ctx;
  if (!meta.hero || vocab.length < 2) return null;
  const v = vocab[Math.floor(rng() * vocab.length)];
  const ds = distractors(v.en, [...vocab.map((x) => x.en), ...pool.words.map((x) => x.en)], 3, rng);
  if (ds.length < 2) return null;
  const options = shuffle([{ text: v.en, correct: true }, ...ds.map((d) => ({ text: d, correct: false }))], rng)
    .map((o, i) => ({ id: 'abcd'[i], text: o.text, correct: o.correct }));
  return { id: 'vocPicture', cat: 'memo', format: 'Cena da aula', render: 'picture', title: 'A palavra da cena', image: meta.hero, caption: 'Cena do universo da sua aula.', prompt: `Qual destas é a palavra-chave “${v.pt}”?`, options, explanation: `${v.en} — ${v.pt}` };
}

function vocFlash(ctx) {
  const { vocab, meta, title } = ctx;
  if (vocab.length < 3) return null;
  return { id: 'vocFlash', cat: 'memo', format: 'Flashcards', render: 'flashdeck', title: 'Revise com flashcards', vocab, deckTitle: title, image: meta.hero };
}

/* ---- CONTEXTUALIZAÇÃO (takeaways) · pouca escrita ---- */

function ctxReorderTakeaway(ctx) {
  const { takeaways, rng } = ctx;
  const cands = takeaways.filter((t) => words(t).length >= 4 && words(t).length <= 10);
  if (!cands.length) return null;
  const t = cands[Math.floor(rng() * cands.length)];
  const toks = words(t.replace(/[.]$/, ''));
  return { id: 'ctxReorderTakeaway', cat: 'ctx', format: 'Ordenar a frase', render: 'engine', title: 'Monte a frase na ordem certa', exercises: [{ type: 'reorder', title: 'Coloque as palavras na ordem correta', prompt: scramble(toks, rng), correctOrder: toks, explanation: t }] };
}

function ctxClozeTakeaway(ctx) {
  const { takeaways, vocab, pool, rng } = ctx;
  const cands = takeaways.filter((t) => words(t).length >= 4);
  if (!cands.length) return null;
  const picks = sample(cands, Math.min(3, cands.length), rng);
  const exercises = picks.map((t) => {
    const toks = words(t.replace(/[.]$/, ''));
    const contentIdx = toks.map((w, i) => ({ w, i })).filter((x) => !STOP.has(norm(x.w)) && norm(x.w).length > 2);
    if (!contentIdx.length) return null;
    const chosen = contentIdx[Math.floor(rng() * contentIdx.length)];
    const correct = chosen.w.replace(/[.]$/, '');
    const prompt = toks.map((w, i) => (i === chosen.i ? '_____' : w)).join(' ');
    const poolWords = [...vocab.map((v) => v.en), ...pool.takeaways.flatMap((x) => words(x)).filter((w) => !STOP.has(norm(w)) && w.length > 2)];
    const ds = distractors(correct, poolWords, 3, rng);
    if (ds.length < 2) return null;
    return mcExercise({ title: 'Complete o que você aprendeu a dizer', prompt, correct, distractors: ds, explanation: t, rng });
  }).filter(Boolean);
  if (!exercises.length) return null;
  return { id: 'ctxClozeTakeaway', cat: 'ctx', format: 'Completar a fala', render: 'engine', title: 'Complete a frase que você já sabe dizer', instruction: 'Marque a palavra que falta — sem escrever.', exercises };
}

function ctxMatchHalves(ctx) {
  const { takeaways, rng } = ctx;
  const cands = takeaways.filter((t) => words(t).length >= 4);
  if (cands.length < 2) return null;
  const picks = sample(cands, Math.min(5, cands.length), rng);
  const pairs = picks.map((t) => {
    const toks = words(t.replace(/[.]$/, ''));
    const mid = Math.ceil(toks.length / 2);
    return { left: toks.slice(0, mid).join(' ') + ' …', right: '… ' + toks.slice(mid).join(' ') };
  });
  return { id: 'ctxMatchHalves', cat: 'ctx', format: 'Juntar as metades', render: 'engine', title: 'Junte as metades da frase', exercises: [{ type: 'matching', title: 'Ligue o começo ao fim de cada frase', instruction: 'Clique na caixa à direita e escolha o final certo para cada começo de frase.', pairs, explanation: 'Boa! Você reconstruiu as frases-chave da aula.' }] };
}

function ctxSpeak(ctx) {
  const { takeaways, rng } = ctx;
  if (!takeaways.length) return null;
  const t = takeaways[Math.floor(rng() * takeaways.length)];
  return { id: 'ctxSpeak', cat: 'ctx', format: 'Falar em voz alta', render: 'engine', title: 'Diga em voz alta', instruction: 'Sem escrever: leia a frase em voz alta e compare a sua gravação.', exercises: [{ type: 'speaking', targetText: t.replace(/^I can /i, 'I can '), explanation: 'Ótimo treino de fala — repita até sair natural.' }] };
}

function ctxPicture(ctx) {
  const { takeaways, pool, meta, rng } = ctx;
  if (!meta.hero || takeaways.length < 1) return null;
  const t = takeaways[Math.floor(rng() * takeaways.length)];
  const ds = distractors(t, pool.takeaways, 3, rng);
  if (ds.length < 2) return null;
  const options = shuffle([{ text: t, correct: true }, ...ds.map((d) => ({ text: d, correct: false }))], rng)
    .map((o, i) => ({ id: 'abcd'[i], text: o.text, correct: o.correct }));
  return { id: 'ctxPicture', cat: 'ctx', format: 'Cena × objetivo', render: 'picture', title: 'O que esta aula te faz dizer', image: meta.hero, caption: 'Pense na cena desta aula.', prompt: 'Qual frase você aprendeu a dizer NESTA aula?', options, explanation: 'Essa é uma das metas desta aula.' };
}

function ctxTilesWords(ctx) {
  const { takeaways, rng } = ctx;
  const cands = takeaways.filter((t) => words(t).length >= 4 && words(t).length <= 9);
  if (!cands.length) return null;
  const picks = sample(cands, Math.min(2, cands.length), rng);
  const items = picks.map((t) => {
    const units = words(t.replace(/[.]$/, ''));
    return { mode: 'words', target: units, tiles: scramble(units, rng), hint: '' };
  });
  return { id: 'ctxTilesWords', cat: 'ctx', format: 'Montar a fala', render: 'tiles', title: 'Monte a frase com as peças', instruction: 'Toque nas palavras na ordem certa para formar a frase.', items };
}

function ctxTrueFalseUsage(ctx) {
  const { takeaways, pool, rng } = ctx;
  if (takeaways.length < 1 || pool.takeaways.length < 2) return null;
  const reais = sample(takeaways, Math.min(3, takeaways.length), rng).map((t) => ({ text: `“${t}”`, answer: true, explain: 'Sim — isso é objetivo desta aula.' }));
  const falsas = sample(pool.takeaways.filter((p) => !takeaways.some((t) => norm(t) === norm(p))), Math.min(3, reais.length), rng)
    .map((t) => ({ text: `“${t}”`, answer: false, explain: 'Isso é de outra aula.' }));
  const items = shuffle([...reais, ...falsas], rng).slice(0, 5);
  if (items.length < 3) return null;
  return { id: 'ctxTrueFalseUsage', cat: 'ctx', format: 'É desta aula?', render: 'truefalse', title: 'Isso você aprendeu NESTA aula?', instruction: 'Marque V se a frase é uma meta desta aula; F se não é.', items };
}

/* ---------- helpers ---------- */
function esc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/* ============================================================
   SELEÇÃO por aula (rotação determinística)
   ============================================================ */
const MEMO_GENS = [vocMeaning, vocReverse, vocClozeMC, vocMatch, vocMatchExample, vocReorderExample, vocTrueFalse, vocMemory, vocWordbank, vocTilesSpell, vocOddOneOut, vocPicture, vocFlash];
const CTX_GENS = [ctxReorderTakeaway, ctxClozeTakeaway, ctxMatchHalves, ctxSpeak, ctxPicture, ctxTilesWords, ctxTrueFalseUsage];

/** Nº total de formatos disponíveis no banco (para exibir/telemetria). */
export const TOTAL_FORMATS = MEMO_GENS.length + CTX_GENS.length; // 20

function pickRotating(gens, count, offset, ctx) {
  const out = [];
  const seenIds = new Set();
  for (let k = 0; k < gens.length && out.length < count; k++) {
    const gen = gens[(offset + k) % gens.length];
    const block = gen(ctx);
    if (block && !seenIds.has(block.id)) { seenIds.add(block.id); out.push(block); }
  }
  return out;
}

/**
 * Monta os blocos de pós-aula da lição. Determinístico por lesson.num.
 * @returns {{ blocks: Array, totalFormats: number }}
 */
export function buildPostClass(lesson, pool) {
  const vocab = (lesson.vocab || []).filter((v) => v && v.en && v.pt);
  const takeaways = (lesson.takeaways || []).filter(Boolean);
  const meta = lesson.__meta || {};
  const seed = ((lesson.num || 1) * 2654435761) >>> 0;
  const rng = mulberry32(seed);
  const ctx = { vocab, takeaways, meta, title: lesson.title, pool: pool || { words: [], takeaways: [] }, rng };
  const offset = (lesson.num || 1);

  const memo = pickRotating(MEMO_GENS, 3, offset, ctx);
  const ctxBlocks = pickRotating(CTX_GENS, 2, offset, ctx);
  // 1 bloco “rico” extra (jogo/imagem) girando por aula, sem repetir
  const richPool = [vocMemory, vocPicture, ctxPicture, vocFlash, vocTilesSpell];
  const already = new Set([...memo, ...ctxBlocks].map((b) => b.id));
  let extra = null;
  for (let k = 0; k < richPool.length; k++) {
    const b = richPool[(offset + k) % richPool.length](ctx);
    if (b && !already.has(b.id)) { extra = b; break; }
  }

  const blocks = [...memo, ...ctxBlocks];
  if (extra) blocks.splice(Math.min(2, blocks.length), 0, extra);
  return { blocks, totalFormats: TOTAL_FORMATS };
}
