'use client';

import { useState } from 'react';
import { useLessonTaught } from './progress';

/*
  "A aula particular desta unidade já aconteceu" (Czarnikow).

  POR QUE EXISTE. Antes disto, o ponteiro da trilha andava só com o material
  estudado (`done`). Isso furava a regra do negócio em dois dos três cenários
  reais de uma aula particular:

    1. o aluno estudou tudo e clicou pronto  → exercícios fechavam, ponteiro
       andava. Funcionava.
    2. o aluno NÃO estudou (ou estudou pela metade) mas clicou pronto → a aula
       acontecia, mas a unidade continuava aberta. Na semana seguinte o painel
       do professor oferecia a MESMA unidade. Aula repetida.
    3. o aluno nem abriu o material e o professor fez os exercícios junto na
       aula → só fechava se desse tempo de responder TODOS. Acabou a aula no
       meio, unidade continuava aberta. Aula repetida.

  Aula particular não se repete. Então quem encerra a unidade é a AULA, não o
  material — e é isso que este bloco marca.

  DUAS DIMENSÕES SEPARADAS, de propósito:

  · `done`   = o aluno praticou o material. É o único que vale ponto de material
               na campanha (ver computeScore). Nada aqui mexe nisso;
  · `taught` = a aula daquela unidade aconteceu. Tira a unidade da fila do
               professor e faz o "Continue aqui →" do aluno andar.

  Por isso quem não estudou e teve a aula avança sem ganhar ponto de material —
  o negócio anda e o ranking continua honesto. A aula em si já é pontuada à
  parte, pelo lançamento de presença da Alumni (10 pts a particular).

  Dá para desfazer: marcar a unidade errada acontece, e o merge (cliente e
  servidor) usa a marcação mais RECENTE justamente para o desfazer sobreviver
  ao sync.
*/

const C = {
  navy: '#1B2736', text: '#2D3748', gray: '#6B7A8F', grayLight: '#E4E9EF',
  gold: '#8C6A00', goldBg: '#FFFBF2', goldLine: '#E0B84C', goldSolid: '#B98A16',
};

function fmt(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function ClassGiven({ studentId, num, role }) {
  const state = useLessonTaught(studentId, num);
  const [confirmando, setConfirmando] = useState(false);
  if (!studentId) return null;

  const by = role === 'teacher' || role === 'coordinator' ? 'teacher' : 'student';

  /* já encerrada — mostra quem encerrou e deixa desfazer */
  if (state.taught) {
    return (
      <div style={{
        marginTop: 22, padding: '16px 20px', borderRadius: 14,
        background: C.goldBg, border: `1px solid ${C.goldLine}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10.5, fontWeight: 800, letterSpacing: 1.1, textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: 999, background: C.goldSolid, color: '#fff',
          }}>Aula dada</span>
          <strong style={{ fontSize: 14.5, color: C.gold, fontWeight: 700 }}>
            Esta unidade já foi trabalhada em aula{fmt(state.taughtAt) ? ` em ${fmt(state.taughtAt)}` : ''}.
          </strong>
        </div>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: C.gray, lineHeight: 1.55 }}>
          Ela saiu da fila do professor e a trilha já aponta para a próxima. Você pode voltar
          aqui quando quiser para revisar — e, se fizer os exercícios, ainda ganha os pontos
          de material.
        </p>
        <button
          onClick={state.markUntaught}
          style={{
            marginTop: 12, padding: '8px 16px', borderRadius: 999,
            border: `1px solid ${C.grayLight}`, background: '#fff', color: C.gray,
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}
        >
          Marquei sem querer — desfazer
        </button>
      </div>
    );
  }

  /* confirmação: um passo, para não encerrar unidade por clique perdido */
  if (confirmando) {
    return (
      <div style={{
        marginTop: 22, padding: '18px 20px', borderRadius: 14,
        background: '#fff', border: `1px solid ${C.goldLine}`,
      }}>
        <strong style={{ fontSize: 15, color: C.text, fontWeight: 700 }}>
          Encerrar esta unidade?
        </strong>
        <p style={{ margin: '8px 0 0', fontSize: 13.5, color: C.gray, lineHeight: 1.6 }}>
          Ela sai da lista de próximas aulas e a trilha passa para a unidade seguinte.
          Use quando a aula particular desta unidade já tiver acontecido — mesmo que os
          exercícios não tenham sido feitos.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <button
            onClick={() => { state.markTaught(by); setConfirmando(false); }}
            style={{
              padding: '10px 20px', borderRadius: 999, border: 'none',
              background: C.goldSolid, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            Sim, a aula aconteceu
          </button>
          <button
            onClick={() => setConfirmando(false)}
            style={{
              padding: '10px 18px', borderRadius: 999, border: `1px solid ${C.grayLight}`,
              background: '#fff', color: C.gray, fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  /* estado normal */
  return (
    <div style={{
      marginTop: 22, padding: '16px 20px', borderRadius: 14,
      background: '#fff', border: `1px dashed ${C.grayLight}`,
      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: 240 }}>
        <strong style={{ fontSize: 14.5, color: C.text, fontWeight: 700 }}>
          A aula desta unidade já aconteceu?
        </strong>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: C.gray, lineHeight: 1.55 }}>
          {by === 'teacher'
            ? 'Marque ao fim da aula para encerrar a unidade e seguir para a próxima na semana que vem.'
            : 'Marque depois da sua aula particular — assim ela não volta a ser oferecida.'}
        </p>
      </div>
      <button
        onClick={() => setConfirmando(true)}
        style={{
          padding: '10px 20px', borderRadius: 999, border: `1px solid ${C.goldLine}`,
          background: C.goldBg, color: C.gold, fontWeight: 700, fontSize: 14, cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Marcar aula dada
      </button>
    </div>
  );
}
