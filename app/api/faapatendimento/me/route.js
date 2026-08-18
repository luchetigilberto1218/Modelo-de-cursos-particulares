import { NextResponse } from 'next/server';
import { getSession, getUsers, canAccessClient } from '../../../../lib/auth';

// Identidade de quem está logado no material da FAAP, para o navegador saber
// por qual chave guardar o progresso. Nunca devolve senha/hash.
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session?.id || !canAccessClient(session, 'faapatendimento')) {
    return NextResponse.json({ student: null }, { status: 401 });
  }
  const user = getUsers().find((u) => u.id === session.id);
  return NextResponse.json({
    student: session.id,
    name: user?.name || session.name || '',
    role: session.role || 'student',
  });
}
