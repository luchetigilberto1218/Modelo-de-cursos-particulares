import { NextResponse } from 'next/server';
import { getUsers, verifyPassword, createToken } from '../../../lib/auth';

export async function POST(request) {
  const { username, email, password } = await request.json();

  // Accept login by username (name) — case/space-insensitive — or by email (legacy).
  const id = (username ?? email ?? '').trim().toLowerCase();
  const users = getUsers();
  const user = users.find(
    u =>
      u.username?.trim().toLowerCase() === id ||
      u.email?.trim().toLowerCase() === id
  );

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
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
