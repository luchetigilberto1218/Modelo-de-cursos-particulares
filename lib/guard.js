import { redirect } from 'next/navigation';
import { getSession, canAccessClient } from './auth';

// Only these client routes require login. Everything else stays open,
// exactly like before. Add a client id here to protect it.
const PROTECTED_CLIENTS = ['aps', 'czarnikow-teste'];

// Blocks a protected client route unless the visitor is logged in and allowed.
// Additive/safe: unprotected clients are never touched; for a protected client
// with no valid session, send the visitor to /login.
export async function guardClient(client) {
  if (!PROTECTED_CLIENTS.includes(client)) {
    return null;
  }
  const session = await getSession();
  if (!canAccessClient(session, client)) {
    redirect('/login');
  }
  return session;
}
