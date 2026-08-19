import { NextResponse } from 'next/server';
import { compactarDiasFechados } from '../../../../lib/stats';
import { gravarSnapshot } from '../../../../lib/historico';

/*
  Manutenção diária (cron às 6h UTC — 3h de Brasília,
  quando ninguém está estudando, então o dia de ontem já fechou de verdade).

  O contador grava 1 arquivo por acesso, de propósito, para não perder contagem
  quando a turma entra junta. Isso encheu o store anterior — 2.280 dos 2.294
  arquivos eram eventos — até ele ser suspenso. Aqui os dias já fechados viram um
  arquivo só por dia e os eventos crus são apagados.

  Faz duas coisas, nesta ordem:

    1. COMPACTA o contador de acessos (era a única tarefa até aqui);
    2. GRAVA O RETRATO do progresso de cada turma — a memória que permite dizer
       "andou X esta semana" em vez de só o acumulado.

  As duas são independentes: cada uma tem seu try/catch e o resultado das duas
  volta no JSON. Se o retrato falhar, a compactação continua valendo, e vice-versa.

  Por que as duas moram no mesmo cron: a Vercel limita o número de crons por
  projeto, e as duas querem exatamente o mesmo horário — a madrugada, quando o
  dia anterior já fechou de verdade. Um cron só, duas tarefas, zero risco de
  esbarrar no limite do plano.

  Proteção: a Vercel manda `Authorization: Bearer <CRON_SECRET>` quando a variável
  existe. Se ela não estiver configurada, a rota aceita a chamada (senão o cron
  quebraria silenciosamente numa instalação sem o segredo) mas nunca faz nada
  destrutivo além de colapsar o próprio contador.
*/

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function autorizado(request) {
  const segredo = process.env.CRON_SECRET;
  if (!segredo) return true;
  return request.headers.get('authorization') === `Bearer ${segredo}`;
}

export async function GET(request) {
  if (!autorizado(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const out = {};

  try {
    out.acessos = await compactarDiasFechados();
  } catch (e) {
    // nunca deixa o cron derrubar nada: reporta e segue para a próxima tarefa
    out.acessos = { erro: String(e?.message || e).slice(0, 200) };
  }

  try {
    out.retrato = await gravarSnapshot();
  } catch (e) {
    out.retrato = { erro: String(e?.message || e).slice(0, 200) };
  }

  return NextResponse.json({ ok: !out.acessos?.erro && !out.retrato?.erro, ...out });
}
