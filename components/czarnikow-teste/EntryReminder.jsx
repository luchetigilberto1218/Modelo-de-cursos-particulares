'use client';

import { useEffect, useState } from 'react';
import { useIdentity } from './progress';

/*
  Lembrete de entrada (Czarnikow, 01/10/2026).

  POR QUE EXISTE: em setembro os professores davam a aula e não marcavam
  "aula dada" (a unidade ficava aberta e a fila do painel não andava), e os
  colaboradores não se preparavam no material nem avisavam que estavam prontos.
  O usuário pediu um aviso grande, impossível de não ver, toda vez que a pessoa
  entra no material:

  · professor → o maior: marcar AULA DADA no fim da lição;
  · colaborador → um pouco menor: preparar-se e clicar em "Estudei a unidade —
    estou pronto para a aula particular".

  "Toda vez que entra" = uma vez por SESSÃO do navegador (sessionStorage), não a
  cada clique entre páginas: num modal a cada navegação ninguém mais lê. Fechou a
  aba e voltou outro dia, aparece de novo. O coordenador vê o da visão master escolhida.
*/

const C = {
  navy: '#1C2B4A', red: '#C8102E', gold: '#B98A16', text: '#2D3748', gray: '#5b6472',
};

const CHAVE = 'czt-lembrete-entrada';

function jaViu(role) {
  try { return sessionStorage.getItem(`${CHAVE}:${role}`) === '1'; } catch { return false; }
}
function marcarVisto(role) {
  try { sessionStorage.setItem(`${CHAVE}:${role}`, '1'); } catch { /* volta a aparecer, tudo bem */ }
}

const TEXTO = {
  teacher: {
    selo: 'Professor',
    titulo: 'Professor, não esqueça de marcar AULA DADA ao final da lição',
    sub: 'E incentive seu aluno a agendar aulas particulares e a se preparar no material personalizado da Czarnikow.',
    botao: 'Entendi — vou marcar aula dada',
    cor: C.red,
    tam: 'clamp(26px, 5.2vw, 46px)',
    largura: 760,
  },
  student: {
    selo: 'Colaborador Czarnikow',
    titulo: 'Colaborador Czarnikow, prepare-se com seu material e não se esqueça de clicar em “Estudei a unidade — estou pronto para a aula particular”',
    sub: 'Assim seu professor sabe que você está preparado — e também pode se preparar melhor para a sua aula.',
    botao: 'Entendi — vou me preparar',
    cor: C.navy,
    tam: 'clamp(21px, 4vw, 34px)',
    largura: 680,
  },
};

export default function EntryReminder() {
  const me = useIdentity(true);
  const [aberto, setAberto] = useState(false);
  const role = me?.role === 'teacher' ? 'teacher' : me?.role === 'student' ? 'student' : null;

  useEffect(() => {
    if (role && !jaViu(role)) setAberto(true);
  }, [role]);

  useEffect(() => {
    if (!aberto) return undefined;
    const esc = (e) => { if (e.key === 'Escape') fechar(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  });

  if (!aberto || !role) return null;
  const t = TEXTO[role];

  function fechar() {
    marcarVisto(role);
    setAberto(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="czt-lembrete-titulo"
      onClick={fechar}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(12,20,36,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: t.largura, maxHeight: '92vh', overflowY: 'auto',
          background: '#fff', borderRadius: 20, borderTop: `10px solid ${t.cor}`,
          padding: 'clamp(24px, 5vw, 48px)', boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          textAlign: 'center', fontFamily: 'inherit',
        }}
      >
        <span style={{
          display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: 1.4,
          textTransform: 'uppercase', padding: '5px 14px', borderRadius: 999,
          background: t.cor, color: '#fff',
        }}>{t.selo}</span>
        <h2 id="czt-lembrete-titulo" style={{
          margin: '18px 0 0', fontSize: t.tam, lineHeight: 1.15, fontWeight: 900,
          color: t.cor, textTransform: 'uppercase', letterSpacing: 0.2,
        }}>
          {t.titulo}
        </h2>
        <p style={{
          margin: '18px auto 0', maxWidth: 560, fontSize: 'clamp(15px, 2.2vw, 18px)',
          lineHeight: 1.55, color: C.gray,
        }}>
          {t.sub}
        </p>
        <button
          onClick={fechar}
          autoFocus
          style={{
            marginTop: 28, padding: '14px 28px', borderRadius: 999, border: 'none',
            background: t.cor, color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer',
            minHeight: 48,
          }}
        >
          {t.botao}
        </button>
      </div>
    </div>
  );
}
