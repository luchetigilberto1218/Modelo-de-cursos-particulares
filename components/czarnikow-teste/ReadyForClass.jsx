'use client';

import { useState } from 'react';
import { useLessonReady } from './progress';

/*
  "Estudei a unidade e estou pronto para a aula particular" (Czarnikow).

  DUAS COISAS SEPARADAS, de propósito:

  · o EXERCÍCIO é evidência — é ele que conclui a lição, acende a trilha e vale
    ponto na campanha. Nada aqui mexe nisso;
  · o BOTÃO é declaração — avisa o professor que o aluno quer marcar a aula
    daquela unidade, e leva junto o que ele praticou de verdade.

  Se o botão também concluísse a lição, ele viraria o caminho de menor esforço e
  ninguém mais faria exercício. Como ele só declara, quem clica sem praticar não
  ganha nada — só aparece no painel do professor exatamente como está, e o
  professor abre a aula sabendo que precisa retomar o conteúdo.

  O gate é SUAVE (READY_MIN): abaixo do limiar o botão continua funcionando, mas
  pede confirmação. Travar de vez seria pior — parte do material antigo tem
  exercício que não fecha, e o aluno ficaria preso sem conseguir marcar aula.
*/

// fração dos exercícios avaliáveis que se espera ter respondido para declarar
export const READY_MIN = 0.7;

const C = {
  navy: '#1B2736', navyLight: '#2B3B4F', accent: '#2AAAE2', accentLight: '#E6F5FC',
  text: '#2D3748', gray: '#6B7A8F', grayLight: '#E4E9EF', offWhite: '#F9FAFB',
  green: '#1E7A3C', greenDark: '#166430', greenBg: '#F0FBF4', greenLine: '#9AE6B4',
  gold: '#9A6B12', goldBg: '#FFF6DF', goldLine: '#E0B84C',
};

// Fundos cheios: o bloco precisa se destacar do branco da lição, senão vira mais
// uma caixa entre exercícios e ninguém marca nada.
const FUNDO = {
  navy: `linear-gradient(135deg, ${C.navy}, ${C.navyLight})`,
  green: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`,
};

function fmt(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  // sem "de ago." — o mês abreviado já vem com ponto e brigaria com o da frase
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

/* Junta o que o aluno fez NESTA sessão com o que já estava salvo: quem concluiu
   a lição num acesso anterior volta com doneCount 0, e sem isso apareceria como
   se nunca tivesse praticado. */
function evidenceOf(state, answered, total, sessionAcc) {
  const feitos = answered > 0 ? answered : (state.done ? total : 0);
  const acc = answered > 0
    ? (typeof sessionAcc === 'number' ? sessionAcc : null)
    : (typeof state.acc === 'number' ? state.acc : null);
  return { feitos, acc };
}

/* ── barra fina no topo da lição ──
   Informativa. Só oferece o botão para quem JÁ praticou (voltou numa sessão
   seguinte, ou acabou de fechar os exercícios) — no início da lição, por
   definição, não há nada a declarar. */
export function ReadyStrip({ studentId, num, answered = 0, total = 0, acc = null }) {
  const state = useLessonReady(studentId, num);
  if (!studentId) return null;

  const { feitos } = evidenceOf(state, answered, total, acc);
  const minimo = total > 0 ? Math.ceil(total * READY_MIN) : 0;
  const suficiente = total > 0 ? feitos >= minimo : !!state.done;
  const pct = total > 0 ? Math.min(100, Math.round((feitos / total) * 100)) : 0;

  if (state.ready) {
    return (
      <Strip bg={FUNDO.green}>
        <Selo bg="rgba(255,255,255,0.18)">✓ Pronto</Selo>
        <strong style={{ fontWeight: 700 }}>Você avisou o professor{fmt(state.readyAt) ? ` em ${fmt(state.readyAt)}` : ''}.</strong>
        <span style={{ color: 'rgba(255,255,255,0.75)' }}>Esta unidade está na lista dele como próxima aula.</span>
      </Strip>
    );
  }

  if (suficiente) {
    return (
      <Strip bg={FUNDO.navy}>
        <Selo bg={C.accent}>Aula particular</Selo>
        <strong style={{ fontWeight: 700 }}>Você já praticou esta unidade.</strong>
        <span style={{ color: 'rgba(255,255,255,0.75)' }}>Avise o professor no fim da lição que está pronto para a aula.</span>
      </Strip>
    );
  }

  return (
    <Strip bg={FUNDO.navy}>
      <Selo bg={C.accent}>Aula particular</Selo>
      <span style={{ color: 'rgba(255,255,255,0.82)', flex: 1, minWidth: 240 }}>
        Ao terminar, marque no fim da lição que está pronto —
        o professor abre a aula vendo o que você praticou aqui.
      </span>
      {total > 0 && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, whiteSpace: 'nowrap' }}>
          <Bar pct={pct} color={C.accent} width={80} sobreEscuro />
          <strong style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{feitos}/{total}</strong>
        </span>
      )}
    </Strip>
  );
}

function Strip({ bg, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      padding: '13px 18px', marginBottom: 20, borderRadius: 14,
      background: bg, color: '#fff', fontSize: 14, lineHeight: 1.5,
      boxShadow: '0 6px 18px rgba(27,39,54,0.18)',
    }}>
      {children}
    </div>
  );
}

function Selo({ bg, children }) {
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 800, letterSpacing: 1.1, textTransform: 'uppercase',
      padding: '4px 10px', borderRadius: 999, background: bg, color: '#fff', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

function Bar({ pct, color, width, sobreEscuro }) {
  return (
    <span style={{
      display: 'inline-block', width, height: 8, borderRadius: 999, overflow: 'hidden',
      background: sobreEscuro ? 'rgba(255,255,255,0.22)' : C.grayLight,
    }}>
      <span style={{ display: 'block', height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width .4s ease' }} />
    </span>
  );
}

/* ── bloco do fim da lição ── */
export default function ReadyForClass({ studentId, num, answered = 0, total = 0, acc = null }) {
  const state = useLessonReady(studentId, num);
  const [confirmando, setConfirmando] = useState(false);
  if (!studentId) return null;

  const ev = evidenceOf(state, answered, total, acc);
  const minimo = total > 0 ? Math.ceil(total * READY_MIN) : 0;
  const suficiente = total > 0 ? ev.feitos >= minimo : !!state.done;
  const pct = total > 0 ? Math.min(100, Math.round((ev.feitos / total) * 100)) : 0;

  const declarar = () => {
    state.markReady({ answered: ev.feitos, total, acc: typeof ev.acc === 'number' ? ev.acc : undefined });
    setConfirmando(false);
  };

  /* já declarou — mostra ao aluno exatamente o que o professor está vendo */
  if (state.ready) {
    const rd = typeof state.readyDone === 'number' ? state.readyDone : ev.feitos;
    const rt = typeof state.readyTotal === 'number' ? state.readyTotal : total;
    const ra = typeof state.readyAcc === 'number' ? state.readyAcc : ev.acc;
    return (
      <Card bg={FUNDO.green} escuro>
        <Label color="rgba(255,255,255,0.92)">Aula particular</Label>
        <p style={{ margin: '0 0 8px', fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 800, letterSpacing: -0.4, color: '#fff' }}>
          ✓ Professor avisado
        </p>
        <p style={{ margin: '0 0 16px', fontSize: 15, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>
          Você marcou esta unidade como estudada{fmt(state.readyAt) ? ` em ${fmt(state.readyAt)}` : ''}.
          Ela entra na lista do seu professor como próxima aula.
        </p>
        <div style={{ padding: '13px 16px', borderRadius: 12, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.22)', fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
          <strong style={{ color: '#fff', fontWeight: 800 }}>O que ele vê:</strong>{' '}
          {rt > 0
            ? <>{rd} de {rt} exercícios respondidos{typeof ra === 'number' ? ` · ${Math.round(ra * 100)}% de acerto na 1ª tentativa` : ''}.</>
            : <>esta unidade não tem exercícios de correção automática.</>}
        </div>
        <button onClick={state.markUnready} style={btnGhost}>Ainda não estou pronto</button>
      </Card>
    );
  }

  /* clicou sem ter praticado o suficiente — confirma, mas não impede */
  if (confirmando) {
    return (
      <Card bg={C.goldBg} border={C.goldLine} borda={2}>
        <Label color={C.gold}>Aula particular</Label>
        <p style={{ margin: '0 0 8px', fontSize: 'clamp(18px, 2.6vw, 21px)', fontWeight: 800, letterSpacing: -0.3, color: C.navy }}>
          Você respondeu {ev.feitos} de {total} exercícios.
        </p>
        <p style={{ margin: '0 0 18px', fontSize: 15, color: C.text, lineHeight: 1.6 }}>
          Posso avisar o professor assim mesmo? Ele vai ver que a prática ficou
          incompleta e usará parte da aula para retomar o conteúdo — o que sobra
          menos tempo para você falar.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={declarar} style={{ ...btnPrimary, background: C.gold, boxShadow: '0 6px 16px rgba(154,107,18,0.32)' }}>Avisar assim mesmo</button>
          <button onClick={() => setConfirmando(false)} style={btnOutline}>Voltar e praticar</button>
        </div>
      </Card>
    );
  }

  /* estado normal: barra + botão */
  return (
    <Card bg={FUNDO.navy} escuro>
      <Label color={C.accent}>Aula particular</Label>
      <p style={{ margin: '0 0 8px', fontSize: 'clamp(19px, 2.8vw, 23px)', fontWeight: 800, letterSpacing: -0.4, color: '#fff', lineHeight: 1.25 }}>
        {suficiente ? 'Pronto para a aula particular?' : 'Vai marcar a aula particular?'}
      </p>
      <p style={{ margin: '0 0 18px', fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
        {suficiente
          ? 'Você praticou esta unidade. Avise seu professor: ele abre a aula já sabendo o que você fez aqui e onde você errou.'
          : 'Quanto mais você praticar aqui, mais a aula rende — o professor vê exatamente o que você respondeu.'}
      </p>

      {total > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Bar pct={pct} color={suficiente ? C.accent : C.goldLine} width="100%" sobreEscuro />
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', margin: '9px 0 0' }}>
            <strong style={{ color: '#fff', fontWeight: 800 }}>{ev.feitos} de {total}</strong> exercícios respondidos
            {typeof ev.acc === 'number' && <> · {Math.round(ev.acc * 100)}% de acerto na 1ª tentativa</>}
            {!suficiente && <> · sugerido: pelo menos {minimo}</>}
          </p>
        </div>
      )}

      <button
        onClick={() => (suficiente ? declarar() : setConfirmando(true))}
        style={{ ...btnPrimary, background: C.accent, boxShadow: '0 8px 20px rgba(42,170,226,0.38)' }}
      >
        Estudei a unidade — estou pronto para a aula particular →
      </button>
    </Card>
  );
}

function Card({ bg, border, borda = 1, escuro, children }) {
  return (
    <div style={{
      margin: '30px 0 8px', padding: 'clamp(22px, 3.4vw, 30px)', borderRadius: 18, background: bg,
      border: escuro ? 'none' : `${borda}px solid ${border}`,
      boxShadow: escuro ? '0 10px 30px rgba(27,39,54,0.22)' : '0 6px 18px rgba(27,39,54,0.10)',
    }}>
      {children}
    </div>
  );
}

function Label({ color, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <span style={{ height: 2, width: 26, background: color }} />
      <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color }}>{children}</span>
    </div>
  );
}

const btnPrimary = {
  padding: '15px 26px', borderRadius: 999, border: 'none', background: C.accent, color: '#fff',
  fontWeight: 800, fontSize: 15.5, fontFamily: 'inherit', cursor: 'pointer', lineHeight: 1.3, textAlign: 'left',
};
const btnOutline = {
  padding: '12px 22px', borderRadius: 999, border: `1px solid ${C.grayLight}`, background: '#fff',
  color: C.text, fontWeight: 700, fontSize: 14.5, fontFamily: 'inherit', cursor: 'pointer',
};
// discreto de propósito: desmarcar não é o que se espera do aluno nesta tela
const btnGhost = {
  marginTop: 16, padding: '9px 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.35)',
  background: 'transparent', color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: 13,
  fontFamily: 'inherit', cursor: 'pointer',
};
