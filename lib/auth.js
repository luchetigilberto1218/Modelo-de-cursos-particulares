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

// Usuário desativado (`"disabled": true` no users.json): o cadastro, as trilhas
// e o material continuam intactos — só o acesso é fechado. Aditivo: quem não
// tem o campo segue entrando exatamente como antes. Para reativar, remover o
// campo (ou pôr false).
export function isDisabledUser(user) {
  return user?.disabled === true;
}

// Mesma checagem a partir da sessão do cookie. Um token emitido antes da
// desativação para de valer na hora, sem esperar os 7 dias de expiração.
export function isDisabledSession(session) {
  if (!session?.id) return false;
  try {
    return isDisabledUser(getUsers().find((u) => u.id === session.id));
  } catch {
    return false; // sem conseguir ler o arquivo, não tranca ninguém
  }
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
  if (hasFullView(session)) return true;
  return (session.tracks || []).includes(track.owner);
}

// Visão completa do material: coordenação, quem apresenta a aula e o RH do
// cliente. São os três papéis que enxergam as trilhas personalizadas de todo
// mundo. Aditivo: nada muda para aluno nem para visitante.
export function hasFullView(session) {
  return ['coordinator', 'teacher', 'hr'].includes(session?.role);
}

// RH do cliente (`role: "hr"`). Vê o material como o apresentador e, além
// disso, a página de acompanhamento da turma — quem já tem trilha
// personalizada e quem ainda está no aguardo do envio dos itens.
export function isHR(session) {
  return session?.role === 'hr';
}

// Filtra a lista de trilhas de um curso conforme a sessão.
export function visibleTracks(session, tracks) {
  return (tracks || []).filter((t) => canAccessTrack(session, t));
}

// Conta SEM senha no cadastro: é o acesso de visitante, que entra pelo link de
// convite (/convite/<cliente>) e nunca pela tela de login. A tela recusa a
// senha em vez de mandar `undefined` para o bcrypt — que estouraria em 500.
// Aditivo: todo cadastro com senha continua entrando como antes.
export function hasPassword(user) {
  return typeof user?.password === 'string' && user.password.length > 0;
}

// Visitante (`role: "guest"`): vê o material compartilhado do cliente, e só.
// Não é aluno — então fica fora da contagem de acessos do /admin e de qualquer
// lista de turma, que filtram por `role === 'student'`.
export function isGuest(session) {
  return session?.role === 'guest';
}

// Trilhas pessoais que o visitante NÃO abre, para a home poder mostrá-las
// travadas — ele enxerga que existe conteúdo desenhado por pessoa sem entrar
// em nenhum. Só vale para visitante: para aluno e professor devolve lista
// vazia, então ninguém passa a ver a trilha de um colega.
export function lockedTracks(session, tracks) {
  if (!isGuest(session)) return [];
  return (tracks || [])
    .filter((t) => t.owner && !canAccessTrack(session, t) && t.status !== 'inactive')
    // Só o id e o tema da trilha atravessam. O nome do cadastro é
    // "Fernanda · Business & Leadership English"; para o visitante fica só o
    // tema. A limpeza é AQUI, no servidor, e não na tela: assim o nome de quem
    // estuda não vai nem no código-fonte da página.
    // Nem o id da trilha atravessa: ele é o primeiro nome do aluno.
    .map((t, i) => ({ key: `pessoal-${i + 1}`, label: (t.name || '').split('\u00b7').pop().trim() }));
}
