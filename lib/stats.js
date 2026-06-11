import { put, list } from '@vercel/blob';

// Contador próprio de acessos por empresa, em cima do Vercel Blob (store privado).
// Modelo append-only: cada acesso grava 1 blob minúsculo em ev/<dia>/<empresa>/<id>.
// O total é a CONTAGEM de blobs — nada de ler-somar-regravar, então acessos
// simultâneos (turma inteira entrando junto) nunca se sobrescrevem.

const PUT_OPTS = { access: 'private', addRandomSuffix: false, contentType: 'text/plain' };

// Dia no fuso de São Paulo (en-CA -> formato YYYY-MM-DD), pra o filtro bater com o calendário local.
function today() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

export async function recordHit(empresa) {
  const day = today(); // YYYY-MM-DD (horário de Brasília)
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  await put(`ev/${day}/${empresa}/${id}`, '1', PUT_OPTS);
}

async function scan(handler) {
  let cursor;
  do {
    const res = await list({ prefix: 'ev/', cursor, limit: 1000 });
    for (const b of res.blobs) {
      // pathname: ev/<dia>/<empresa>/<id>
      const [, day, empresa] = b.pathname.split('/');
      if (day && empresa) handler(day, empresa);
    }
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
}

// Total por empresa no período [from, to] (datas YYYY-MM-DD, inclusivas).
export async function getStatsByEmpresa(from, to) {
  const counts = {};
  await scan((day, empresa) => {
    if (day >= from && day <= to) counts[empresa] = (counts[empresa] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([empresa, total]) => ({ empresa, total }))
    .sort((a, b) => b.total - a.total);
}

// Detalhe diário de UMA empresa no período (pra cavar dentro dela).
export async function getDailyForEmpresa(empresa, from, to) {
  const counts = {};
  await scan((day, emp) => {
    if (emp === empresa && day >= from && day <= to) counts[day] = (counts[day] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([day, hits]) => ({ day, hits }))
    .sort((a, b) => (a.day < b.day ? 1 : -1));
}
