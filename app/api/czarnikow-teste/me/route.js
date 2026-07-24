import { NextResponse } from 'next/server';
import { getSession, getUsers } from '../../../../lib/auth';

// Identidade do usuário logado (Czarnikow · teste), para o cliente saber quem é
// e por qual chave guardar o progresso. Nunca vaza senha/hash.
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session?.id) return NextResponse.json({ student: null }, { status: 401 });
  const user = getUsers().find((u) => u.id === session.id);
  return NextResponse.json({
    student: session.id,
    name: user?.name || '',
    role: session.role || 'student',
  });
}
