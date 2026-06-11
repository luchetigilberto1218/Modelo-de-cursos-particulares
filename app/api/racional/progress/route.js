import { NextResponse } from 'next/server';
import { readProgress, mergeProgress } from '../../../../lib/racional-progress-store';

// Sync de progresso por aluno. ADITIVO e tolerante a falha: se qualquer coisa der errado,
// devolve {} sem erro — o cliente continua 100% no localStorage (comportamento atual).

export const dynamic = 'force-dynamic';

const VALID = /^[a-z0-9-]{1,64}$/i;

function studentOf(request) {
  const s = new URL(request.url).searchParams.get('student');
  return s && VALID.test(s) ? s : null;
}

export async function GET(request) {
  const student = studentOf(request);
  if (!student) return NextResponse.json({});
  try {
    return NextResponse.json(await readProgress(student));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(request) {
  const student = studentOf(request);
  if (!student) return NextResponse.json({});
  let body = {};
  try { body = await request.json(); } catch { body = {}; }
  try {
    return NextResponse.json(await mergeProgress(student, body));
  } catch {
    return NextResponse.json({});
  }
}
