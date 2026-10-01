import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { effectiveIdentity, rosterCZ } from '../../../../lib/czarnikow-master';

// Identidade do usuário logado (Czarnikow · teste), para o cliente saber quem é
// e por qual chave guardar o progresso. Nunca vaza senha/hash.
// Coordenador recebe a identidade EFETIVA da visão master (ver lib/czarnikow-master.js)
// e, junto, o estado da barra e a lista de colaboradores para "Dados reais".
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session?.id) return NextResponse.json({ student: null }, { status: 401 });
  const me = await effectiveIdentity(session);
  const out = { student: me.id, name: me.name, role: me.role };
  if (me.master) {
    out.readOnly = me.readOnly;
    out.master = { ...me.master, student: me.readOnly ? me.id : me.master.student, roster: rosterCZ() };
  }
  return NextResponse.json(out);
}
