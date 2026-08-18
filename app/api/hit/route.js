import { NextResponse } from 'next/server';
import { recordHit } from '../../../lib/stats';
import { getSession } from '../../../lib/auth';
import { PROTECTED_CLIENTS } from '../../../lib/primary-client';

/*
  Beacon de contagem própria. O EmpresaTracker chama isso a cada navegação.
  Conta acesso por empresa (1º segmento da URL), independente de plano da Vercel.

  QUEM ENTRA NA CONTA
  -------------------
  Num curso com login (Czarnikow, Baker Hughes, FAAP · Atendimento, APS), só
  conta o acesso de quem entrou como ALUNO. Fica de fora:

    - visitante sem sessão — ninguém do cliente, e não dá para dizer quem é;
    - coordenação e professores — somos nós. Cada passada da Alumni pelo
      material para conferir, corrigir ou gravar áudio virava "acesso da
      empresa", e o número deixava de significar engajamento da turma.

  Curso sem login (MAD, Delta Ducon, as páginas abertas da FAAP) continua
  contando todo mundo, como antes: ali não existe sessão para consultar, e o
  material é aberto de propósito.

  A Racional tem senha por aluno, mas a checagem dela é no navegador — o filtro
  do modo professor está no EmpresaTracker, não aqui.

  Efeito colateral bem-vindo: menos gravação no Blob. Foi excesso de evento de
  acesso que encheu o store anterior até ele ser suspenso.
*/

const NOT_EMPRESA = new Set(['login', 'api', 'admin', '_next']);
const VALID = /^[a-z0-9-]{1,64}$/i;

export async function POST(request) {
  const empresa = new URL(request.url).searchParams.get('empresa');
  if (!empresa || NOT_EMPRESA.has(empresa) || !VALID.test(empresa)) {
    // 204 não pode ter corpo: com JSON junto, o Next devolve 500 e o beacon
    // vira erro no console de quem está estudando.
    return new NextResponse(null, { status: 204 });
  }

  if (PROTECTED_CLIENTS.includes(empresa)) {
    let session = null;
    try {
      session = await getSession();
    } catch {
      session = null;   // sem conseguir ler a sessão, não inventa um acesso
    }
    if (session?.role !== 'student') {
      return new NextResponse(null, { status: 204 });
    }
  }

  try {
    await recordHit(empresa);
  } catch {
    // nunca derruba a navegação do usuário por causa da métrica
  }
  return NextResponse.json({ ok: true });
}
