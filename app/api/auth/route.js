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
  // Apelidos de login (`aliases` no cadastro): grafias alternativas do mesmo
  // nome. O corretor do celular "conserta" Weslley -> Wesley e derrubava o
  // login. Aditivo: quem não tem `aliases` entra exatamente como antes.
  // O nome/e-mail de verdade vence SEMPRE — só quando ninguém casa por ele é
  // que os apelidos são consultados, então um apelido nunca leva ao cadastro
  // de outra pessoa.
  const user =
    users.find(u => norm(u.username) === id || norm(u.email) === id) ||
    users.find(u => (u.aliases || []).some(a => norm(a) === id));

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Espaço colado no fim/começo da senha (copiar-colar, teclado do celular)
  // derrubava o login. Tentamos primeiro a senha EXATA — quem tem espaço de
  // propósito não muda de comportamento — e só depois a versão aparada. Isso
  // só faz mais gente entrar, nunca menos.
  let valid = await verifyPassword(password, user.password);
  if (!valid && typeof password === 'string' && password.trim() !== password) {
    valid = await verifyPassword(password.trim(), user.password);
  }
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
