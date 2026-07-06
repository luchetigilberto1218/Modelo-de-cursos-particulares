import { get, put, list } from '@vercel/blob';

// Sincronização de progresso do aluno (Delta Ducon), sobre o Vercel Blob (store privado).
// Um doc por aluno: deltaducon/progress/<slug>.json
//   -> { name, t, done: { "<trilha>_<aula>": 1, ... }, at: <iso> }
//
// Camada ADITIVA: no cliente, o localStorage continua sendo a fonte da verdade.
// A gravação faz MERGE por UNIÃO (concluído nunca volta a false; só soma),
// então estudar em mais de um aparelho nunca apaga uma conclusão.
// Espelha o padrão de lib/racional-progress-store.js.

const NS = 'deltaducon/progress/';
const OPTS = {
  access: 'private',
  addRandomSuffix: false,
  allowOverwrite: true,
  contentType: 'application/json',
};

function path(slug) {
  return `${NS}${slug}.json`;
}

// Lê o doc do aluno. Aluno que nunca sincronizou (ou qualquer falha) => null.
export async function readOne(slug) {
  try {
    const res = await get(path(slug), { access: 'private', useCache: false });
    if (!res || res.statusCode !== 200) return null;
    const data = await new Response(res.stream).json();
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

function mergeDone(a, b) {
  const out = {};
  for (const k of new Set([...Object.keys(a || {}), ...Object.keys(b || {})])) out[k] = 1;
  return out;
}

// Mescla o recebido do cliente com o salvo e grava. Carimba a data no servidor.
export async function mergeOne(slug, incoming) {
  const cur = (await readOne(slug)) || {};
  const merged = {
    name: (incoming && incoming.name) || cur.name || '',
    t: incoming && Number.isInteger(incoming.t) ? incoming.t : (cur.t ?? null),
    done: mergeDone(cur.done, incoming && incoming.done),
    at: new Date().toISOString(),
  };
  await put(path(slug), JSON.stringify(merged), OPTS);
  return merged;
}

// Lista todos os alunos que já sincronizaram (para o painel do gestor).
export async function listAll() {
  const out = [];
  let cursor;
  do {
    const res = await list({ prefix: NS, cursor, limit: 1000 });
    for (const b of res.blobs) {
      const slug = b.pathname.slice(NS.length).replace(/\.json$/, '');
      const data = await readOne(slug);
      if (data) out.push({ slug, ...data });
    }
    cursor = res.cursor;
  } while (cursor);
  return out;
}
