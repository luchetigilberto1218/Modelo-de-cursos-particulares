import { NextResponse } from 'next/server';
import { getSession, getUsers } from '../../../../lib/auth';
import { readLessons, mergeLessonsFor, isValidStudent } from '../../../../lib/czarnikow-teste-progress-store';
import { effectiveIdentity } from '../../../../lib/czarnikow-master';

// Sync de progresso por aluno (Czarnikow · teste). O aluno é SEMPRE derivado da
// sessão logada (não do body/query) — impede sincronizar no nome de outro.
// ADITIVO e tolerante a falha: se algo der errado, devolve {} sem erro e o cliente
// segue 100% no localStorage.

export const dynamic = 'force-dynamic';

// Coordenador: identidade da visão master (sandbox na prova, colaborador
// escolhido em "Dados reais" — este último só leitura).
async function studentFromSession() {
  const session = await getSession();
  if (!session?.id) return null;
  if (session.role === 'coordinator') {
    const me = await effectiveIdentity(session);
    if (!me?.id || !isValidStudent(me.id)) return null;
    return { id: me.id, name: me.name, readOnly: me.readOnly };
  }
  if (!isValidStudent(session.id)) return null;
  const user = getUsers().find((u) => u.id === session.id);
  return { id: session.id, name: user?.name || '' };
}

export async function GET() {
  const who = await studentFromSession();
  if (!who) return NextResponse.json({});
  try {
    return NextResponse.json(await readLessons(who.id));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(request) {
  const who = await studentFromSession();
  if (!who) return NextResponse.json({});
  if (who.readOnly) return NextResponse.json({ error: 'read_only' }, { status: 403 });
  let body = {};
  try { body = await request.json(); } catch { body = {}; }
  try {
    return NextResponse.json(await mergeLessonsFor(who.id, who.name, body));
  } catch {
    return NextResponse.json({});
  }
}
