import { get, put, list } from '@vercel/blob';

// Progresso do aluno (Czarnikow · ambiente de teste), sobre o Vercel Blob (store privado).
// Um doc por aluno: czarnikow-teste/progress/<student>.json
//   -> { name, at, lessons: { "<num>": { checks: bool[], done: bool }, ... } }
//
// Espelha lib/racional-progress-store.js: MERGE por UNIÃO (concluído nunca volta a
// false; checks são OR posição a posição). O cliente segue com localStorage como
// fonte da verdade; o sync é aditivo e tolerante a falha.

const NS = 'czarnikow-teste/progress/';
const OPTS = {
  access: 'private',
  addRandomSuffix: false,
  allowOverwrite: true,
  contentType: 'application/json',
};

const VALID = /^[a-z0-9-]{1,64}$/;
export function isValidStudent(s) {
  return typeof s === 'string' && VALID.test(s);
}

function path(student) {
  return `${NS}${student}.json`;
}

// Lê o doc do aluno. Aluno que nunca sincronizou (ou qualquer falha) => null.
export async function readDoc(student) {
  try {
    const res = await get(path(student), { access: 'private', useCache: false });
    if (!res || res.statusCode !== 200) return null;
    const data = await new Response(res.stream).json();
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

// Só o mapa de lições (é o contrato que o cliente espera no GET).
export async function readLessons(student) {
  const doc = await readDoc(student);
  return (doc && doc.lessons) || {};
}

// Une dois mapas de lições: done nunca volta para false; checks são OR posição a posição.
// `doneAt` (quando a lição foi concluída) e `acc` (acerto na 1ª tentativa) alimentam a
// campanha — são preservados no merge: vale sempre o registro MAIS ANTIGO, para que
// refazer a lição não reescreva a data nem "melhore" o acerto da primeira tentativa.
// Das duas versões de uma lição, qual traz a declaração "pronto para a aula"
// mais recente. null quando nenhuma delas tem declaração.
function newerReady(x, y) {
  const rx = typeof x?.readyAt === 'string' ? x.readyAt : null;
  const ry = typeof y?.readyAt === 'string' ? y.readyAt : null;
  if (!rx && !ry) return null;
  if (!rx) return y;
  if (!ry) return x;
  return rx >= ry ? x : y;
}

// Das duas versões de uma lição, qual traz o registro de AULA DADA mais recente.
// Mesma regra do `ready` e pelo mesmo motivo: não é união. Marcar aula dada por
// engano na unidade errada acontece, e quem marcou precisa conseguir desfazer —
// se fosse união, o desfazer voltaria atrás no primeiro sync.
function newerTaught(x, y) {
  const tx = typeof x?.taughtAt === 'string' ? x.taughtAt : null;
  const ty = typeof y?.taughtAt === 'string' ? y.taughtAt : null;
  if (!tx && !ty) return null;
  if (!tx) return y;
  if (!ty) return x;
  return tx >= ty ? x : y;
}

function mergeLessons(a, b) {
  const out = {};
  for (const num of new Set([...Object.keys(a || {}), ...Object.keys(b || {})])) {
    const x = (a && a[num]) || {};
    const y = (b && b[num]) || {};
    const len = Math.max(x.checks?.length || 0, y.checks?.length || 0);
    const checks = Array.from({ length: len }, (_, i) => !!x.checks?.[i] || !!y.checks?.[i]);
    const entry = { checks, done: !!x.done || !!y.done };
    const dates = [x.doneAt, y.doneAt].filter(Boolean).sort();
    if (dates.length) entry.doneAt = dates[0];
    // o acerto que conta é o da 1ª tentativa: fica o que veio junto com a data mais antiga
    const accFrom = dates.length && y.doneAt === dates[0] && typeof y.acc === 'number' ? y : x;
    const acc = typeof accFrom.acc === 'number' ? accFrom.acc
      : (typeof x.acc === 'number' ? x.acc : (typeof y.acc === 'number' ? y.acc : null));
    if (typeof acc === 'number') entry.acc = acc;
    // "pronto para a aula particular" (ready/readyAt/readyDone/readyTotal/readyAcc):
    // aqui NÃO é união — vale a declaração mais RECENTE, porque o aluno pode
    // desmarcar. É um sinal para o professor, não progresso: não mexe em `done`.
    const winner = newerReady(x, y);
    if (winner) {
      entry.ready = !!winner.ready;
      entry.readyAt = winner.readyAt;
      if (typeof winner.readyDone === 'number') entry.readyDone = winner.readyDone;
      if (typeof winner.readyTotal === 'number') entry.readyTotal = winner.readyTotal;
      if (typeof winner.readyAcc === 'number') entry.readyAcc = winner.readyAcc;
    }
    // "aula particular desta unidade já aconteceu" (taught/taughtAt/taughtBy).
    // Encerra a unidade para aluno e professor mesmo quando o material não foi
    // estudado — é o que impede a aula de se repetir. NÃO toca em `done`: ponto
    // de material continua sendo só de quem praticou (ver computeScore).
    const tw = newerTaught(x, y);
    if (tw) {
      entry.taught = !!tw.taught;
      entry.taughtAt = tw.taughtAt;
      if (typeof tw.taughtBy === 'string') entry.taughtBy = tw.taughtBy;
    }
    out[num] = entry;
  }
  return out;
}

// Mescla o mapa recebido do cliente com o salvo e grava. Carimba nome + data no servidor.
export async function mergeLessonsFor(student, name, incoming) {
  const cur = await readDoc(student);
  const merged = {
    ...cur,                       // preserva campos alheios ao sync (ex.: `classes` da campanha)
    name: name || cur?.name || '',
    at: new Date().toISOString(),
    lessons: mergeLessons(cur?.lessons, incoming || {}),
  };
  await put(path(student), JSON.stringify(merged), OPTS);
  return merged.lessons;
}

// Aulas do aluno na campanha (presença lançada pela Alumni, não pelo aluno).
// { general, private }. Escrita separada do sync de progresso, de propósito.
export async function setClasses(student, classes) {
  const cur = await readDoc(student);
  const doc = {
    ...cur,
    name: cur?.name || '',
    at: new Date().toISOString(),
    lessons: cur?.lessons || {},
    classes: {
      general: Math.max(0, Number(classes?.general) || 0),
      private: Math.max(0, Number(classes?.private) || 0),
    },
  };
  await put(path(student), JSON.stringify(doc), OPTS);
  return doc.classes;
}

// Lista todos os alunos que já sincronizaram (para o painel do professor).
export async function listAll() {
  const out = [];
  let cursor;
  do {
    const res = await list({ prefix: NS, cursor, limit: 1000 });
    for (const b of res.blobs) {
      const student = b.pathname.slice(NS.length).replace(/\.json$/, '');
      const doc = await readDoc(student);
      // `classes` vem junto: é metade da pontuação da campanha (7 pts a aula em
      // turma, 10 a particular) e quem lê esta lista — o ranking da coordenação e
      // a posição na tela do colaborador — calcula em cima do que vem daqui. Sem
      // este campo, todo mundo aparecia com 0 ponto de aula por mais aula que
      // tivesse feito.
      if (doc) out.push({
        student,
        name: doc.name || student,
        at: doc.at || null,
        lessons: doc.lessons || {},
        classes: doc.classes || null,
      });
    }
    cursor = res.cursor;
  } while (cursor);
  return out;
}

// Marca (ou desmarca) "a aula particular desta unidade já aconteceu" para um
// aluno. Escrita feita PELO PROFESSOR, a partir do painel — o aluno tem o botão
// dentro da própria lição e passa pelo sync normal de progresso.
//
// Só toca em taught/taughtAt/taughtBy: `done`, `checks`, `doneAt` e `acc` ficam
// intactos, porque encerrar a aula não é o mesmo que ter estudado o material e
// não pode virar ponto de campanha (ver computeScore).
export async function setTaught(student, num, taught, by = 'teacher') {
  const cur = await readDoc(student);
  const lessons = { ...(cur?.lessons || {}) };
  const key = String(num);
  lessons[key] = {
    ...(lessons[key] || { checks: [], done: false }),
    taught: !!taught,
    taughtAt: new Date().toISOString(),
    taughtBy: by,
  };
  const doc = { ...cur, at: new Date().toISOString(), lessons };
  await put(path(student), JSON.stringify(doc), OPTS);
  return lessons[key];
}
