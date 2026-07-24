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
function mergeLessons(a, b) {
  const out = {};
  for (const num of new Set([...Object.keys(a || {}), ...Object.keys(b || {})])) {
    const x = (a && a[num]) || {};
    const y = (b && b[num]) || {};
    const len = Math.max(x.checks?.length || 0, y.checks?.length || 0);
    const checks = Array.from({ length: len }, (_, i) => !!x.checks?.[i] || !!y.checks?.[i]);
    out[num] = { checks, done: !!x.done || !!y.done };
  }
  return out;
}

// Mescla o mapa recebido do cliente com o salvo e grava. Carimba nome + data no servidor.
export async function mergeLessonsFor(student, name, incoming) {
  const cur = await readDoc(student);
  const merged = {
    name: name || cur?.name || '',
    at: new Date().toISOString(),
    lessons: mergeLessons(cur?.lessons, incoming || {}),
  };
  await put(path(student), JSON.stringify(merged), OPTS);
  return merged.lessons;
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
      if (doc) out.push({ student, name: doc.name || student, at: doc.at || null, lessons: doc.lessons || {} });
    }
    cursor = res.cursor;
  } while (cursor);
  return out;
}
