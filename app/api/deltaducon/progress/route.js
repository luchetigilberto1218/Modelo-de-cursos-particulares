import { NextResponse } from 'next/server';
import { readOne, mergeOne } from '../../../../lib/deltaducon-progress-store';

// Sync de progresso por aluno (Delta Ducon). ADITIVO e tolerante a falha:
// se algo der errado, devolve {} sem erro — o cliente segue 100% no localStorage.

export const dynamic = 'force-dynamic';

const VALID = /^[a-z0-9-]{1,64}$/;

function studentOf(request) {
  const s = new URL(request.url).searchParams.get('student');
  return s && VALID.test(s) ? s : null;
}

export async function GET(request) {
  const student = studentOf(request);
  if (!student) return NextResponse.json({});
  try {
    return NextResponse.json((await readOne(student)) || {});
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
    return NextResponse.json(await mergeOne(student, body));
  } catch {
    return NextResponse.json({});
  }
}
