import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'alumni-cursos-secret-2026';
const COOKIE_NAME = 'alumni_token';

// Users database (JSON file based — no external DB needed)
import fs from 'fs';
import path from 'path';

function loadUsers() {
  const usersPath = path.join(process.cwd(), 'data', 'users.json');
  return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
}

export function getUsers() {
  return loadUsers().users || [];
}

export async function verifyPassword(plain, hashed) {
  return bcrypt.compareSync(plain, hashed);
}

export function hashPassword(plain) {
  return bcrypt.hashSync(plain, 10);
}

export function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clients: user.clients,
      // Trilhas pessoais liberadas para este usuário (Baker Hughes). Ausente =
      // só as trilhas compartilhadas. Coordenador vê todas, como sempre.
      tracks: user.tracks || [],
    },
    SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function isCoordinator(session) {
  return session?.role === 'coordinator';
}

export function canAccessClient(session, clientId) {
  if (!session) return false;
  if (session.role === 'coordinator') return true;
  return session.clients?.includes(clientId);
}

// Trilha sem `owner` é compartilhada — todo mundo do cliente vê.
// Trilha com `owner` é pessoal: só o dono e quem tem visão completa
// (coordinator/teacher). Aditivo: cursos sem `owner` seguem iguais.
export function canAccessTrack(session, track) {
  if (!track?.owner) return true;
  if (!session) return false;
  if (session.role === 'coordinator' || session.role === 'teacher') return true;
  return (session.tracks || []).includes(track.owner);
}

// Filtra a lista de trilhas de um curso conforme a sessão.
export function visibleTracks(session, tracks) {
  return (tracks || []).filter((t) => canAccessTrack(session, t));
}
