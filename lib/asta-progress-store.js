import { get, put, list } from '@vercel/blob';

// Progresso do aluno (ASTA), sobre o Vercel Blob (store privado).
// Um doc por aluno: asta/progress/<student>.json
//   -> { name, at, lessons: { "<num>": { done: bool, doneAt: iso }, ... } }
//
// Espelha lib/bakerhughes-progress-store.js — mesmo contrato, outro prefixo.
// A tela da ASTA perguntava "quem sou eu" à API da Baker Hughes, que recusa
// quem não é da Baker: o aluno ficava sem identidade e a conclusão das lições
// não era gravada em lugar nenhum. Com store e rotas próprios, o material
// continua funcionando igual (o localStorage segue sendo a fonte da verdade) e
// o servidor passa a guardar uma cópia, que é o que a coordenação lê.
//
// MERGE por UNIÃO — concluído nunca volta a false, e vale sempre a data mais
// antiga, de forma que refazer uma lição não reescreve quando ela foi feita pela
// primeira vez. Sem Blob, sem rede ou com erro, o material funciona como antes.

const NS = 'asta/progress/';
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

// Une dois mapas de lições: done nunca volta para false; vale a doneAt mais antiga.
function mergeLessons(a, b) {
  const out = {};
  for (const num of new Set([...Object.keys(a || {}), ...Object.keys(b || {})])) {
    const x = (a && a[num]) || {};
    const y = (b && b[num]) || {};
    const entry = { done: !!x.done || !!y.done };
    const dates = [x.doneAt, y.doneAt].filter(Boolean).sort();
    if (dates.length) entry.doneAt = dates[0];
    out[num] = entry;
  }
  return out;
}

// Mescla o mapa recebido do cliente com o salvo e grava. Carimba nome + data no servidor.
export async function mergeLessonsFor(student, name, incoming) {
  const cur = await readDoc(student);
  const merged = {
    ...cur,
    name: name || cur?.name || '',
    at: new Date().toISOString(),
    lessons: mergeLessons(cur?.lessons, incoming || {}),
  };
  await put(path(student), JSON.stringify(merged), OPTS);
  return merged.lessons;
}

// Lista todos os alunos que já sincronizaram (para o acompanhamento da Alumni).
export async function listAll() {
  const out = [];
  let cursor;
  do {
    const res = await list({ prefix: NS, cursor, limit: 1000 });
    for (const b of res.blobs) {
      const student = b.pathname.slice(NS.length).replace(/\.json$/, '');
      const doc = await readDoc(student);
      if (doc) out.push({ student, name: doc.name || student, at: doc.at || null, lessons: doc.lessons || {} });
    }
    cursor = res.cursor;
  } while (cursor);
  return out;
}
