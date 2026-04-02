import { NextResponse } from 'next/server';
import { getUsers, verifyPassword, createToken } from '../../../lib/auth';

export async function POST(request) {
  const { email, password } = await request.json();

  const users = getUsers();
  const user = users.find(u => u.email === email);

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
