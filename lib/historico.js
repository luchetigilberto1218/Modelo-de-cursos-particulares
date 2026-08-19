import { get, put } from '@vercel/blob';

import { getPainelCoordenacao } from './coordenacao';

/*
  Histórico de utilização dos materiais.

  O painel de coordenação sempre soube o ACUMULADO ("Fulano fez 14 lições"), mas
  não sabia o MOVIMENTO ("andou 3 esta semana" / "está parada há um mês"). Sem
  isso não dá para dizer se o uso subiu ou caiu — nem aqui, nem no relatório
  mensal. Este módulo é a memória que faltava.

  Todo dia, o cron grava o retrato do dia: quantas lições cada aluno tinha
  concluído naquele momento. A diferença entre dois retratos é o quanto se andou
  no período. É de propósito que se guarde o acumulado, e não o delta: retrato é
  idempotente (rodar duas vezes no mesmo dia não duplica nada), delta não é.

  UM ARQUIVO SÓ. O store anterior foi suspenso por excesso de arquivos — 2.280
  eventos de acesso. Aqui o histórico inteiro vive em `hist/progresso.json`, que
  é reescrito por cima a cada dia e podado em JANELA dias. O store não cresce.

  Só o cron escreve. Quem lê (o painel) nunca grava.
*/

const ARQUIVO = 'hist/progresso.json';
const JANELA = 200;          // dias mantidos; ~130 KB no pior caso
const OPTS = {
  access: 'private',
  addRandomSuffix: false,
  allowOverwrite: true,
  contentType: 'application/json',
};

/** Dia no fuso de São Paulo (en-CA -> YYYY-MM-DD), igual ao resto do contador. */
function diaSP(date) {
  return date.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

/*
  O cron roda de madrugada (6h UTC = 3h de Brasília). O que ele encontra é o
  fechamento do dia ANTERIOR — ninguém estuda entre meia-noite e três. Por isso
  o retrato é carimbado com ontem: assim `dias['2026-08-18']` significa mesmo
  "como a turma terminou o dia 18", e a subtração entre dias fecha com o
  calendário.
*/
export function diaDoRetrato(agora = new Date()) {
  const sp = new Date(agora.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  return sp.getHours() < 6 ? diaSP(new Date(agora.getTime() - 24 * 60 * 60 * 1000)) : diaSP(agora);
}

/** Lê o histórico inteiro. Qualquer falha => vazio: o painel nunca cai por isso. */
export async function lerHistorico() {
  try {
    const res = await get(ARQUIVO, { access: 'private', useCache: false });
    if (!res || res.statusCode !== 200) return { dias: {} };
    const data = await new Response(res.stream).json();
    return data && typeof data.dias === 'object' ? data : { dias: {} };
  } catch {
    return { dias: {} };
  }
}

/*
  Grava o retrato de hoje e devolve o que foi gravado.

  Reescreve a entrada do dia em vez de somar: o valor é acumulado, então a
  última leitura do dia é a certa. Rodar o cron duas vezes é inofensivo.
*/
export async function gravarSnapshot(agora = new Date()) {
  const clientes = await getPainelCoordenacao();
  const dia = diaDoRetrato(agora);

  const retrato = {};
  for (const c of clientes) {
    // Turma cujo store falhou não entra: gravar zero viraria "a turma parou"
    // no cálculo de amanhã, e seria mentira.
    if (c.erro) continue;
    const ativos = c.alunos.filter((a) => !a.inativo);
    retrato[c.id] = {
      t: ativos.length,
      e: ativos.filter((a) => a.feitas > 0).length,
      l: ativos.reduce((s, a) => s + a.feitas, 0),
      a: Object.fromEntries(c.alunos.map((a) => [a.nome, a.feitas])),
    };
  }

  const hist = await lerHistorico();
  hist.v = 1;
  hist.dias[dia] = retrato;

  // Poda: só os JANELA dias mais recentes sobrevivem.
  const dias = Object.keys(hist.dias).sort();
  for (const d of dias.slice(0, Math.max(0, dias.length - JANELA))) delete hist.dias[d];

  await put(ARQUIVO, JSON.stringify(hist), OPTS);

  const pulados = clientes.filter((c) => c.erro).map((c) => c.id);
  return { dia, turmas: Object.keys(retrato).length, dias: Object.keys(hist.dias).length, pulados };
}

// ---------------------------------------------------------------- comparação

/*
  Acha o retrato mais recente que seja de ANTES do corte. Não exige o dia exato:
  se o cron falhou numa terça, a segunda serve — a janela real é reportada junto
  (`dia`), para a tela poder dizer "desde 12/08" em vez de fingir 7 dias certos.
*/
export function retratoAntesDe(hist, corte) {
  const dias = Object.keys(hist?.dias || {}).filter((d) => d <= corte).sort();
  const dia = dias[dias.length - 1];
  return dia ? { dia, dados: hist.dias[dia] } : null;
}

/*
  Quanto cada turma e cada aluno andou desde o retrato de `dias` atrás.

  Devolve um Map por cliente: { desde, licoes, porAluno: Map<nome, {delta, novo}> }.
  Sem histórico suficiente devolve Map vazio — e a tela simplesmente não mostra
  a coluna, em vez de mostrar zero (que leria como "ninguém fez nada").
*/
export function evolucao(clientes, hist, dias = 7, agora = new Date()) {
  const corte = diaSP(new Date(agora.getTime() - dias * 24 * 60 * 60 * 1000));
  const base = retratoAntesDe(hist, corte);
  const out = new Map();
  if (!base) return out;

  for (const c of clientes) {
    const antes = base.dados[c.id];
    if (!antes) continue;   // turma que ainda não existia no retrato
    const porAluno = new Map();
    let licoes = 0;
    for (const a of c.alunos) {
      const anterior = antes.a?.[a.nome];
      if (anterior === undefined) {
        porAluno.set(a.nome, { delta: 0, novo: true });
        continue;
      }
      const delta = Math.max(0, a.feitas - anterior);
      porAluno.set(a.nome, { delta, novo: false });
      if (!a.inativo) licoes += delta;
    }
    out.set(c.id, { desde: base.dia, licoes, porAluno });
  }
  return out;
}
