import { NextResponse } from 'next/server';
import { getUsers, createToken, isDisabledUser } from '../../../lib/auth';

/*
  Link de convite — entrada de visitante, sem senha.

  Para mostrar o material a alguém que ainda não é aluno (um interessado da
  própria empresa, por exemplo), basta mandar UM link:

      https://<dominio>/convite/bakerhughes

  Quem abre recebe o cookie de uma conta `role: "guest"` cadastrada no
  users.json e cai direto na home do curso. Não digita nada.

  O que o visitante vê: só o material COMPARTILHADO do cliente. As trilhas
  pessoais têm `owner` e o `canAccessTrack` já as fecha — nem a página da
  trilha, nem a lição, nem a busca abrem para ele. Na home elas aparecem
  travadas, para ele saber que existe conteúdo desenhado por pessoa.

  Três travas de propósito:
    - só cliente listado em GUESTS tem convite;
    - a conta apontada precisa ser `role: "guest"` — assim esta rota nunca
      consegue emitir token de aluno, professor ou coordenação, mesmo que o
      mapa abaixo seja editado errado;
    - `"disabled": true` no cadastro derruba o link — e também os cookies já
      entregues, porque o `guardClient` reconfere o cadastro a cada página. É o
      botão de desligar: uma linha no users.json, sem tocar em código.

  Aditivo: nenhuma rota existente muda de comportamento.
*/

const GUESTS = {
  bakerhughes: 'bh-visitante',
};

export async function GET(request, { params }) {
  const { client } = await params;
  const origin = new URL(request.url).origin;

  const userId = GUESTS[client];
  if (!userId) {
    return NextResponse.redirect(`${origin}/login`);
  }

  let user = null;
  try {
    user = getUsers().find((u) => u.id === userId);
  } catch {
    user = null;
  }
  if (!user || user.role !== 'guest' || isDisabledUser(user)) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const response = NextResponse.redirect(`${origin}/${client}`);
  response.cookies.set('alumni_token', createToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return response;
}
