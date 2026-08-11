import { NextResponse } from 'next/server';
import { getUsers, verifyPassword, createToken, isDisabledUser } from '../../../lib/auth';

export async function POST(request) {
  const { username, email, password } = await request.json();

  // Accept login by username (name) — case/space-insensitive — or by email (legacy).
  // Acento também é ignorado: com login por NOME COMPLETO (Czarnikow), exigir
  // "Antônio Sérgio" com os acentos certos no celular é pedir chamado de suporte.
  // A normalização é aplicada dos DOIS lados, então ela só faz mais login passar,
  // nunca menos — nenhum usuário existente deixa de entrar.
  const norm = (s) => (s ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')  // tira acento
    .replace(/\s+/g, ' ').trim().toLowerCase();        // colapsa espaços
  const id = norm(username ?? email);
  const users = getUsers();
  const user = users.find(
    u => norm(u.username) === id || norm(u.email) === id
  );

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Conta desativada: a senha até confere, mas o acesso está fechado. O
  // cadastro e o material continuam intactos — é só remover o `disabled`
  // do users.json para liberar de novo.
  if (isDisabledUser(user)) {
    return NextResponse.json(
      { error: 'Este acesso está desativado. Fale com a Alumni para reativá-lo.' },
      { status: 403 }
    );
  }

  const token = createToken(user);

  const response = NextResponse.json({
    success: true,
    user: { name: user.name, role: user.role, clients: user.clients }
  });

  response.cookies.set('alumni_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('alumni_token', '', { maxAge: 0, path: '/' });
  return response;
}
