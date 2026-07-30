import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getSession, canAccessClient } from './auth';

// Only these client routes require login. Everything else stays open,
// exactly like before. Add a client id here to protect it.
const PROTECTED_CLIENTS = ['aps', 'czarnikow-teste', 'bakerhughes'];

// Blocks a protected client route unless the visitor is logged in and allowed.
// Additive/safe: unprotected clients are never touched; for a protected client
// with no valid session, send the visitor to /login.
export async function guardClient(client) {
  if (!PROTECTED_CLIENTS.includes(client)) {
    return null;
  }
  const session = await getSession();
  if (!canAccessClient(session, client)) {
    redirect(`/login${await nextParam()}`);
  }
  return session;
}

// Monta o `?next=` do login a partir do caminho que o visitante tentou abrir
// (o middleware o publica em `x-pathname`). Sem o header, ou com um valor que
// não seja caminho interno, devolve string vazia — e o login se comporta
// exatamente como antes.
async function nextParam() {
  try {
    const path = (await headers()).get('x-pathname');
    if (!path || !path.startsWith('/') || path.startsWith('//')) return '';
    return `?next=${encodeURIComponent(path)}`;
  } catch {
    return '';
  }
}
