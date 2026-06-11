import { NextResponse } from 'next/server';
import { recordHit } from '../../../lib/stats';

// Beacon de contagem própria. O EmpresaTracker chama isso a cada navegação.
// Conta acesso por empresa (1º segmento da URL), independente de plano da Vercel.

const NOT_EMPRESA = new Set(['login', 'api', 'admin', '_next']);
const VALID = /^[a-z0-9-]{1,64}$/i;

export async function POST(request) {
  const empresa = new URL(request.url).searchParams.get('empresa');
  if (!empresa || NOT_EMPRESA.has(empresa) || !VALID.test(empresa)) {
    return NextResponse.json({ ok: false }, { status: 204 });
  }
  try {
    await recordHit(empresa);
  } catch {
    // nunca derruba a navegação do usuário por causa da métrica
  }
  return NextResponse.json({ ok: true });
}
