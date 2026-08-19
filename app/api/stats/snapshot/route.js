import { NextResponse } from 'next/server';
import { gravarSnapshot } from '../../../../lib/historico';

/*
  Retrato diário da utilização dos materiais.

  Chamado pela manutenção das 6h (app/api/stats/compactar) e exposto aqui à parte
  para poder ser disparado à mão quando se quiser fechar um dia na hora — por
  exemplo antes de gerar o relatório mensal.

  Só grava: nada aqui apaga ou altera progresso de aluno.
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
  try {
    return NextResponse.json({ ok: true, ...(await gravarSnapshot()) });
  } catch (e) {
    return NextResponse.json({ ok: false, erro: String(e?.message || e).slice(0, 200) });
  }
}
