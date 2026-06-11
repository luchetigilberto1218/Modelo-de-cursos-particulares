import { get, put } from '@vercel/blob';

// Sincronização de progresso do aluno (Racional), em cima do Vercel Blob (store privado).
// Um doc por aluno: progress/<aluno>.json  ->  { [num]: { checks: bool[], done: bool } }.
//
// Camada ADITIVA: no cliente, o localStorage continua sendo a fonte da verdade.
// A gravação faz MERGE por UNIÃO (concluído continua concluído; marcações só somam),
// então estudar em mais de um aparelho nunca apaga uma conclusão.

const OPTS = {
  access: 'private',
  addRandomSuffix: false,
  allowOverwrite: true,
  contentType: 'application/json',
};

function path(student) {
  return `progress/${student}.json`;
}

// Lê o doc do aluno. Aluno que nunca sincronizou (ou qualquer falha) => mapa vazio.
export async function readProgress(student) {
  try {
    // useCache:false => sempre lê do origin, nunca uma versão velha do CDN
    // (essencial p/ sync: logo após marcar, outro aparelho tem que ver o estado novo).
    const res = await get(path(student), { access: 'private', useCache: false });
    if (!res || res.statusCode !== 200) return {};
    const data = await new Response(res.stream).json();
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

// Une dois mapas: done nunca volta para false; checks são OR posição a posição.
function mergeMaps(a, b) {
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

// Mescla o mapa recebido do cliente com o que já está salvo e devolve o resultado.
export async function mergeProgress(student, incoming) {
  const current = await readProgress(student);
  const merged = mergeMaps(current, incoming || {});
  await put(path(student), JSON.stringify(merged), OPTS);
  return merged;
}
