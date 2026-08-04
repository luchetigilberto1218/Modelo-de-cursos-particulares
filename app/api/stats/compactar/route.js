import { NextResponse } from 'next/server';
import { compactarDiasFechados } from '../../../../lib/stats';

/*
  Compactação diária do contador de acessos (cron às 6h UTC — 3h de Brasília,
  quando ninguém está estudando, então o dia de ontem já fechou de verdade).

  O contador grava 1 arquivo por acesso, de propósito, para não perder contagem
  quando a turma entra junta. Isso encheu o store anterior — 2.280 dos 2.294
  arquivos eram eventos — até ele ser suspenso. Aqui os dias já fechados viram um
  arquivo só por dia e os eventos crus são apagados.

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
  try {
    const r = await compactarDiasFechados();
    return NextResponse.json({ ok: true, ...r });
  } catch (e) {
    // nunca deixa o cron derrubar nada: reporta e sai
    return NextResponse.json({ ok: false, erro: String(e?.message || e).slice(0, 200) });
  }
}
