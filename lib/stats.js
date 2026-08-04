import { put, list, get, del } from '@vercel/blob';

/*
  Contador próprio de acessos por empresa, em cima do Vercel Blob (store privado).

  ESCRITA — append-only: cada acesso grava 1 blob minúsculo em
  `ev/<dia>/<empresa>/<id>`. É de propósito: o total é a CONTAGEM de blobs, então
  nada de ler-somar-regravar e acessos simultâneos (turma inteira entrando junto)
  nunca se sobrescrevem.

  COMPACTAÇÃO — o custo do append-only é o número de arquivos: o store anterior
  chegou a 2.294 arquivos, dos quais 2.280 eram estes eventos, e foi suspenso.
  Por isso os dias JÁ FECHADOS são colapsados em um único `agg/<dia>.json`
  ({ empresa: total }) e os eventos crus daquele dia são apagados. O dia corrente
  nunca é compactado — ele ainda está recebendo escrita, e compactar no meio
  perderia os acessos que chegassem durante a operação.

  Resultado: no regime, o store guarda os eventos de hoje + 1 arquivo por dia
  passado, em vez de um arquivo por acesso para sempre.

  A leitura soma as duas fontes, então o painel não sabe (nem precisa saber) se um
  dia já foi compactado.
*/

const PUT_OPTS = { access: 'private', addRandomSuffix: false, contentType: 'text/plain' };
const JSON_OPTS = { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json' };

// Dia no fuso de São Paulo (en-CA -> formato YYYY-MM-DD), pra o filtro bater com o calendário local.
function today() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

export async function recordHit(empresa) {
  const day = today(); // YYYY-MM-DD (horário de Brasília)
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  await put(`ev/${day}/${empresa}/${id}`, '1', PUT_OPTS);
}

/** Percorre os eventos crus (dias ainda não compactados). */
async function scanEventos(handler) {
  let cursor;
  do {
    const res = await list({ prefix: 'ev/', cursor, limit: 1000 });
    for (const b of res.blobs) {
      // pathname: ev/<dia>/<empresa>/<id>
      const [, day, empresa] = b.pathname.split('/');
      if (day && empresa) handler(day, empresa, 1);
    }
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
}

/** Percorre os dias já compactados (agg/<dia>.json). */
async function scanAgregados(handler) {
  let cursor;
  do {
    const res = await list({ prefix: 'agg/', cursor, limit: 1000 });
    for (const b of res.blobs) {
      const day = b.pathname.replace(/^agg\//, '').replace(/\.json$/, '');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
      try {
        const r = await get(b.pathname, { access: 'private', useCache: false });
        if (!r || r.statusCode !== 200) continue;
        const totais = await new Response(r.stream).json();
        for (const [empresa, n] of Object.entries(totais || {})) {
          if (Number(n) > 0) handler(day, empresa, Number(n));
        }
      } catch {
        // um agregado ilegível não pode derrubar o painel inteiro
      }
    }
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
}

/** As duas fontes juntas — é o que o painel enxerga. */
async function scan(handler) {
  await scanAgregados(handler);
  await scanEventos(handler);
}

/*
  Colapsa os dias fechados. Só mexe em dia ANTERIOR ao de hoje. Se o agregado do
  dia já existir, soma em cima antes de regravar — assim rodar duas vezes não
  perde nem duplica contagem.
*/
export async function compactarDiasFechados() {
  const hoje = today();
  const porDia = new Map();   // dia -> { empresa -> n }
  const aApagar = new Map();  // dia -> [urls]

  let cursor;
  do {
    const res = await list({ prefix: 'ev/', cursor, limit: 1000 });
    for (const b of res.blobs) {
      const [, day, empresa] = b.pathname.split('/');
      if (!day || !empresa || day >= hoje) continue;   // o dia corrente fica de fora
      if (!porDia.has(day)) { porDia.set(day, {}); aApagar.set(day, []); }
      const m = porDia.get(day);
      m[empresa] = (m[empresa] || 0) + 1;
      aApagar.get(day).push(b.url);
    }
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);

  let apagados = 0;
  for (const [day, totais] of porDia) {
    // se já houver agregado para o dia, soma em cima
    try {
      const r = await get(`agg/${day}.json`, { access: 'private', useCache: false });
      if (r && r.statusCode === 200) {
        const anterior = await new Response(r.stream).json();
        for (const [empresa, n] of Object.entries(anterior || {})) {
          totais[empresa] = (totais[empresa] || 0) + Number(n || 0);
        }
      }
    } catch { /* ainda não havia agregado para este dia */ }

    await put(`agg/${day}.json`, JSON.stringify(totais), JSON_OPTS);

    // os eventos crus só são apagados DEPOIS que o agregado do dia está gravado
    const urls = aApagar.get(day);
    for (let i = 0; i < urls.length; i += 100) {
      await del(urls.slice(i, i + 100));
      apagados += Math.min(100, urls.length - i);
    }
  }

  return { dias: porDia.size, apagados };
}

// Total por empresa no período [from, to] (datas YYYY-MM-DD, inclusivas).
export async function getStatsByEmpresa(from, to) {
  const counts = {};
  await scan((day, empresa, n) => {
    if (day >= from && day <= to) counts[empresa] = (counts[empresa] || 0) + n;
  });
  return Object.entries(counts)
    .map(([empresa, total]) => ({ empresa, total }))
    .sort((a, b) => b.total - a.total);
}

// Detalhe diário de UMA empresa no período (pra cavar dentro dela).
export async function getDailyForEmpresa(empresa, from, to) {
  const counts = {};
  await scan((day, emp, n) => {
    if (emp === empresa && day >= from && day <= to) counts[day] = (counts[day] || 0) + n;
  });
  return Object.entries(counts)
    .map(([day, hits]) => ({ day, hits }))
    .sort((a, b) => (a.day < b.day ? 1 : -1));
}
