import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { parseMaster, serializeMaster, MASTER_COOKIE, PROVA_ID } from '../../../../lib/czarnikow-master';
import { deleteDoc } from '../../../../lib/czarnikow-teste-progress-store';

// Barra da visão master (só coordenador): troca visão/modo/colaborador, ou
// reinicia a prova (apaga o doc do aluno-sandbox — nunca o de um colaborador).
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const session = await getSession();
  if (session?.role !== 'coordinator') return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  let body = {};
  try { body = await request.json(); } catch { body = {}; }

  if (body.reset === true) {
    try { await deleteDoc(PROVA_ID); } catch { return NextResponse.json({ error: 'store_unavailable' }, { status: 503 }); }
    return NextResponse.json({ ok: true, reset: true });
  }

  const m = parseMaster(serializeMaster({ view: body.view, mode: body.mode, student: body.student }));
  const res = NextResponse.json({ ok: true, master: m });
  res.cookies.set(MASTER_COOKIE, serializeMaster(m), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
