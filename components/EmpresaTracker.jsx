'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@vercel/analytics';

// Segmentos que NÃO são empresa (não devem virar linha nas métricas)
const NOT_EMPRESA = new Set(['login', 'api', 'admin', '_next']);

/*
  Janela de deduplicação. O contador grava 1 arquivo no Blob por acesso; disparar
  a cada navegação fazia um aluno percorrendo 10 lições virar 10 arquivos. Foi o
  que encheu o store anterior (2.280 de 2.294 arquivos eram eventos de acesso) até
  ele ser suspenso.

  Com a janela, o que se conta é VISITA e não pageview — que é o que o painel por
  empresa quer dizer de qualquer forma. Não há perda de histórico comparável: os
  dados antigos ficaram no store suspenso e a contagem recomeçou do zero.
*/
const JANELA_MS = 30 * 60 * 1000;

/*
  Acesso da própria Alumni não é acesso da turma.

  Nos cursos com login quem filtra é o servidor (app/api/hit/route.js só conta
  sessão de aluno). A Racional não dá para filtrar lá: a senha dela é por aluno
  e a checagem vive no navegador. O sinal que existe aqui é o modo professor —
  quem está com ele ligado é professor ou é a coordenação abrindo o material
  para conferir, e era isso que inflava o número da Racional.

  A chave é a mesma que components/racional/access.js grava. Se ela mudar lá,
  muda aqui: é o preço de o contador ser global e a porta da Racional ser local.
*/
function ehEquipeNaRacional() {
  try {
    return localStorage.getItem('rc-teacher-v1') === '1';
  } catch {
    return false;   // sem localStorage: conta, como antes
  }
}

function jaContou(empresa) {
  try {
    const chave = `hit:${empresa}`;
    const ultimo = Number(sessionStorage.getItem(chave) || 0);
    if (Date.now() - ultimo < JANELA_MS) return true;
    sessionStorage.setItem(chave, String(Date.now()));
    return false;
  } catch {
    return false;   // sem sessionStorage (aba anônima antiga, etc): conta como antes
  }
}

// A cada navegação, identifica a empresa (1º segmento da URL) e conta o acesso:
//  1) no nosso contador próprio (/api/hit -> Vercel Blob) — é o que alimenta o /admin, grátis;
//  2) também dispara um custom event da Vercel (só aparece se o time for Pro; no Hobby é ignorado).
export default function EmpresaTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const empresa = pathname.split('/').filter(Boolean)[0];
    if (!empresa || NOT_EMPRESA.has(empresa)) return;

    if (empresa === 'racional' && ehEquipeNaRacional()) return;

    // contador próprio (grátis) — no máximo 1 por empresa a cada 30 min
    if (!jaContou(empresa)) {
      fetch(`/api/hit?empresa=${encodeURIComponent(empresa)}`, {
        method: 'POST',
        keepalive: true,
      }).catch(() => {});
    }

    // bônus: custom event da Vercel (funciona se virar Pro)
    track('empresa_view', { empresa });
  }, [pathname]);

  return null;
}
