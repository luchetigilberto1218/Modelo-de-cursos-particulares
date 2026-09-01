'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { anuncioAtivo } from './campaign';

/*
  Aviso de "pontuação atualizada" — Czarnikow, campanha Ago–Dez 2026.

  POR QUE EXISTE: a presença em aula é lançada uma vez por mês (o relatório de
  assiduidade vira pontos de uma vez só). No dia do lançamento a pontuação de
  todo mundo salta e a classificação se reorganiza — mas ninguém fica sabendo,
  porque a plataforma é a mesma de ontem. Este banner é o único momento em que o
  produto puxa o colaborador de volta para a página da campanha.

  BANNER, NÃO MODAL. O aviso não pede decisão nenhuma e não é urgente: bloquear a
  tela para dizer "sua pontuação subiu" custa mais do que entrega, e no celular
  um modal cobre o conteúdo inteiro. Como banner ele nasce logo acima da faixa da
  campanha — o número de que o aviso fala fica visível na mesma dobra, o que é
  justamente a prova de que vale clicar.

  Regras (todas do lado do cliente, sem backend novo e sem escrever no Blob):
  - janela de 72h por lançamento, definida em ANUNCIOS (campaign.js);
  - dispensável, e a dispensa é POR JANELA (a chave inclui a data), então o
    aviso do mês seguinte volta a aparecer para quem fechou o deste mês;
  - localStorage em try/catch: navegador com site data bloqueado apenas mostra o
    aviso de novo, nunca quebra a tela.
*/

const C = {
  navy: '#1C2B4A',
  red: '#C8102E',
  redDark: '#A50D26',
  gray: '#5b6472',
};

const CHAVE = 'czt-aviso-pontuacao';

function foiDispensado(data) {
  try {
    return localStorage.getItem(`${CHAVE}:${data}`) === '1';
  } catch {
    return false; // site data bloqueado: mostra o aviso, que é o lado seguro
  }
}

function dispensar(data) {
  try {
    localStorage.setItem(`${CHAVE}:${data}`, '1');
  } catch {
    /* sem persistência: o aviso volta no próximo carregamento, e tudo bem */
  }
}

export default function ScoreUpdateBanner({ clientId }) {
  // Decidido só depois de montar: a janela depende do relógio de quem lê e a
  // dispensa vive no localStorage — nada disso existe no servidor, e renderizar
  // um palpite no HTML causaria divergência de hidratação.
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    const a = anuncioAtivo(new Date());
    if (a && !foiDispensado(a.data)) setAviso(a);
  }, []);

  if (!aviso) return null;

  function fechar(e) {
    e.preventDefault();
    e.stopPropagation();
    dispensar(aviso.data);
    setAviso(null);
  }

  return (
    <div
      role="status"
      data-czt-aviso
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #e4e9ef',
        borderLeft: `5px solid ${C.red}`,
        boxShadow: '0 6px 20px rgba(28,43,74,0.10)',
        padding: '16px 52px 16px 18px',
        marginBottom: 14,   // fica no componente: sem aviso, não sobra espaço
        animation: 'czt-aviso-entra .32s ease-out both',
      }}
    >
      <style>{`
        @keyframes czt-aviso-entra {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: none; }
        }
        /* Quem pediu menos movimento no sistema não recebe a entrada animada. */
        @media (prefers-reduced-motion: reduce) {
          [data-czt-aviso] { animation: none !important; }
        }
        @media (max-width: 560px) {
          [data-czt-aviso-cta] { width: 100%; text-align: center; }
        }
      `}</style>

      <div style={{ flex: '1 1 300px', minWidth: 0 }}>
        <p style={{
          margin: '0 0 5px',
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: C.red,
        }}>
          Campanha · Novo lançamento
        </p>
        <p style={{
          margin: 0,
          fontSize: 'clamp(15px, 2.4vw, 17px)',
          fontWeight: 700,
          lineHeight: 1.3,
          color: C.navy,
          letterSpacing: -0.2,
        }}>
          Pontuação atualizada com relatório das aulas — Confira sua posição!
        </p>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: C.gray, lineHeight: 1.45 }}>
          Já entraram as aulas de {aviso.ref} de 2026.
        </p>
      </div>

      <Link
        href={`/${clientId}/campanha`}
        data-czt-aviso-cta
        style={{
          flex: '0 0 auto',
          background: C.red,
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          padding: '11px 20px',
          borderRadius: 999,
          whiteSpace: 'nowrap',
          boxShadow: `0 2px 8px ${C.red}40`,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.redDark; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = C.red; }}
      >
        Ver minha posição →
      </Link>

      <button
        type="button"
        onClick={fechar}
        aria-label="Fechar aviso de pontuação atualizada"
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 30,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          borderRadius: 8,
          background: 'transparent',
          color: C.gray,
          fontSize: 18,
          lineHeight: 1,
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f2f5'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
