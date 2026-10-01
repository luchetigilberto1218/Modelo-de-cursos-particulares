import { cookies } from 'next/headers';
import { getUsers } from './auth';

/*
  Visão MASTER da Czarnikow (01/10/2026) — mesma ideia do material da Daniela
  (Sucafina) e da EuroChem: o coordenador (Gilberto) entra com o login dele e
  uma barra no rodapé troca:

    · Ver como aluno  / Ver como professor
    · Prova           / Dados reais
    · Reiniciar prova

  PROVA: tudo grava num aluno-sandbox (`czt-master-prova`) que não existe no
  users.json — não entra no ranking de ninguém, nem na fila do professor real,
  nem no /admin/alunos. No painel do professor em modo prova, ele é o ÚNICO
  aluno listado, então "aula dada" lá só mexe no sandbox.

  DADOS REAIS: lê o progresso de um colaborador escolhido (aluno) ou o painel
  real (professor) — e a gravação é BLOQUEADA no servidor (403) e no cliente.

  A escolha vive num cookie que só tem efeito para quem é `coordinator`: um
  aluno que forjasse o cookie continua sendo ele mesmo.
*/

export const PROVA_ID = 'czt-master-prova';
export const PROVA_NAME = 'Prova (visão master)';
// perfil do sandbox: o mesmo do login de demonstração
export const PROVA_PROFILE = { level: 'essentials', stage: 'Essentials 1', track: ['hr'] };
const COOKIE = 'czt_master';
const CLIENT = 'czarnikow-teste';

export function rosterCZ() {
  return getUsers()
    .filter((u) => u.role === 'student' && (u.clients || []).includes(CLIENT) && !u.disabled && u.id !== 'czt-teste')
    .map((u) => ({ id: u.id, name: u.name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

export function parseMaster(raw) {
  const [view, mode, student] = String(raw || '').split('.');
  return {
    view: view === 'teacher' ? 'teacher' : 'student',
    mode: mode === 'real' ? 'real' : 'prova',
    student: /^[a-z0-9-]{1,64}$/.test(student || '') ? student : null,
  };
}

export function serializeMaster(m) {
  return `${m.view}.${m.mode}.${m.student || ''}`;
}

// Identidade EFETIVA para as rotas da CZ. Para quem não é coordenador, é a
// própria sessão, sem nenhuma mudança.
//   { id, name, role, readOnly, master }
export async function effectiveIdentity(session) {
  if (!session?.id) return null;
  const users = getUsers();
  if (session.role !== 'coordinator') {
    const u = users.find((x) => x.id === session.id);
    return { id: session.id, name: u?.name || '', role: session.role || 'student', readOnly: false, master: null };
  }

  const store = await cookies();
  const m = parseMaster(store.get(COOKIE)?.value);
  const roster = rosterCZ();
  if (m.mode === 'real' && !roster.some((r) => r.id === m.student)) m.student = roster[0]?.id || null;

  if (m.mode === 'real') {
    const u = roster.find((r) => r.id === m.student);
    return { id: m.student, name: u?.name || '', role: m.view, readOnly: true, master: m };
  }
  return { id: PROVA_ID, name: PROVA_NAME, role: m.view, readOnly: false, master: m };
}

export const MASTER_COOKIE = COOKIE;
