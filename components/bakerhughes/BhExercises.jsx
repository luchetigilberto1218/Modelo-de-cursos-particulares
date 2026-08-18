'use client';

import { useEffect, useRef, useState } from 'react';
import AudioPlayer from '../AudioPlayer';
import { ExShell, Instruction, CheckRow, ResultLine, TranscriptToggle, maybeShuffle, norm, seededShuffle, hashString } from './BhKit';

/*
  Baker Hughes — banco de formatos de exercício das trilhas personalizadas.

  Regras que valem para todos:
  · auto-corrigíveis por seleção, ordenação, ligação ou clique;
  · nada de escrita livre — quando a aluna "escreve", é montando a frase na
    ordem certa a partir de blocos, porque correção de texto livre por máquina
    não ajuda ninguém;
  · cada bloco avisa `onChecked(acertos 0..1)` na primeira correção, que é o
    que fecha a lição lá no BakerHughesLesson.

  Aditivo: só entra em ação para os `type` listados em BH_EXTRA_TYPES. Qualquer
  lição antiga da Baker segue no caminho de sempre.
*/

export const BH_EXTRA_TYPES = [
  'multiSelect',
  'trueFalse',
  'categorize',
  'oddOneOut',
  'orderList',
  'errorSpot',
  'highlightPick',
  'dropdownGap',
  'serialChoice',
  'flowChoice',
  'listenChoose',
  'listenGap',
  'sentenceBuild',
  'readingTask',
  'emailTriage',
  'swipeChoice',
  'checkOff',
  'dialogue',
];

// Exercícios que não contam para fechar a lição. O `checkOff` saiu daqui em
// 07/2026: ele passou a contar, mas por CONFIRMAÇÃO explícita, não por marcar
// todos os itens — a instrução pede que o aluno assinale só o que já consegue
// fazer, e exigir tudo marcado viraria pressão para marcar por obrigação.
export const BH_UNGRADED_TYPES = [];

/* Embaralha as alternativas antes de renderizar.

   O conteúdo foi escrito com a resposta certa quase sempre em primeiro lugar
   (e, no A ou B, quase sempre na segunda). Quem percebe o padrão acerta tudo
   sem ler. Aqui a ordem é sorteada uma vez, a partir do próprio texto do item,
   e não muda mais: recarregar a página não faz a resposta trocar de lugar.

   O que NÃO se embaralha: `items` de orderList (é a resposta), de categorize,
   trueFalse, errorSpot e sentenceBuild — esses componentes já sorteiam o que
   precisa sorteia por dentro. */
function embaralhar(ex, ligado) {
  if (!ligado || !ex) return ex;
  const k = (extra) => `${ex.type}|${ex.title || ''}|${extra}`;
  const out = { ...ex };

  if (Array.isArray(out.options)) out.options = maybeShuffle(out.options, true, k('options'));

  if (Array.isArray(out.items) && ['serialChoice', 'listenChoose'].includes(ex.type)) {
    out.items = out.items.map((it, i) => (it && typeof it === 'object' && Array.isArray(it.options)
      ? { ...it, options: maybeShuffle(it.options, true, k(it.prompt || it.audio || i)) }
      : it));
  }
  if (Array.isArray(out.questions)) {
    out.questions = out.questions.map((q, i) => (Array.isArray(q.options)
      ? { ...q, options: maybeShuffle(q.options, true, k(q.q || q.prompt || i)) } : q));
  }
  if (Array.isArray(out.turns)) {
    out.turns = out.turns.map((t, i) => (Array.isArray(t.options)
      ? { ...t, options: maybeShuffle(t.options, true, k(t.them || i)) } : t));
  }
  if (Array.isArray(out.gaps)) {
    out.gaps = out.gaps.map((g, i) => (Array.isArray(g.options)
      ? { ...g, options: maybeShuffle(g.options, true, k(g.answer || i)) } : g));
  }
  if (Array.isArray(out.groups)) {
    out.groups = out.groups.map((g, i) => (Array.isArray(g.items)
      ? { ...g, items: maybeShuffle(g.items, true, k(g.odd || i)) } : g));
  }
  if (Array.isArray(out.bank)) out.bank = maybeShuffle(out.bank, true, k('bank'));

  // A ou B: trocar os lados e inverter qual é o certo.
  if (ex.type === 'swipeChoice' && Array.isArray(out.items)) {
    out.items = out.items.map((it, i) => {
      const inverter = maybeShuffle(['a', 'b'], true, k(it.prompt || i))[0] === 'b';
      if (!inverter) return it;
      return { ...it, a: it.b, b: it.a, correct: it.correct === 'a' ? 'b' : 'a' };
    });
  }
  return out;
}

export default function BhExercise({ ex: exOriginal, c, voiceType, onChecked, seed = 1, shuffle = false }) {
  const ex = embaralhar(exOriginal, shuffle);
  const props = { ex, c, voiceType, onChecked, seed };
  switch (ex.type) {
    case 'multiSelect': return <MultiSelect {...props} />;
    case 'trueFalse': return <TrueFalse {...props} />;
    case 'categorize': return <Categorize {...props} />;
    case 'oddOneOut': return <OddOneOut {...props} />;
    case 'orderList': return <OrderList {...props} />;
    case 'errorSpot': return <ErrorSpot {...props} />;
    case 'highlightPick': return <HighlightPick {...props} />;
    case 'dropdownGap': return <DropdownGap {...props} />;
    case 'serialChoice': return <SerialChoice {...props} />;
    case 'flowChoice': return <FlowChoice {...props} />;
    case 'listenChoose': return <ListenChoose {...props} />;
    case 'listenGap': return <ListenGap {...props} />;
    case 'sentenceBuild': return <SentenceBuild {...props} />;
    case 'readingTask': return <ReadingTask {...props} />;
    case 'emailTriage': return <EmailTriage {...props} />;
    case 'swipeChoice': return <SwipeChoice {...props} />;
    case 'checkOff': return <CheckOff {...props} />;
    case 'dialogue': return <Dialogue {...props} />;
    default: return null;
  }
}

/* ─────────────────────────── 1. Multi select ─────────────────────────── */
function MultiSelect({ ex, c, onChecked }) {
  const accent = c.accent || '#00B04F';
  const [picked, setPicked] = useState({});
  const [checked, setChecked] = useState(false);
  const options = ex.options || [];
  const toggle = (i) => !checked && setPicked((p) => ({ ...p, [i]: !p[i] }));
  const right = options.filter((o, i) => (o.correct ? picked[i] : !picked[i])).length;
  const acc = options.length ? right / options.length : 0;

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Marque todas'}>
      <Instruction c={c}>{ex.instruction || 'Marque todas as opções corretas — há mais de uma.'}</Instruction>
      {ex.prompt && <p style={{ fontSize: 15.5, fontWeight: 600, color: c.ink || c.navy || '#062E2B', margin: '0 0 12px', lineHeight: 1.6 }}>{ex.prompt}</p>}
      <div style={{ display: 'grid', gap: 8 }}>
        {options.map((o, i) => {
          const on = !!picked[i];
          const state = checked ? (o.correct === on ? 'ok' : 'bad') : null;
          return (
            <button key={i} onClick={() => toggle(i)} disabled={checked}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left', padding: '12px 14px', borderRadius: 10, cursor: checked ? 'default' : 'pointer', fontSize: 14.5, lineHeight: 1.5, fontFamily: 'inherit',
                background: state === 'ok' ? (c.okBg || '#F0FFF4') : state === 'bad' ? (c.badBg || '#FFF5F5') : on ? c.accentLight || '#E4F7EC' : '#fff',
                border: `2px solid ${state === 'ok' ? (c.okBorder || '#9AE6B4') : state === 'bad' ? (c.badBorder || '#FEB2B2') : on ? accent : c.grayLight || '#E2E9E7'}`,
                color: c.text || '#20302D' }}>
              <span style={{ flex: '0 0 20px', height: 20, borderRadius: 5, border: `2px solid ${on ? accent : '#C9D6D2'}`, background: on ? accent : '#fff', color: '#fff', fontSize: 13, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{on ? '✓' : ''}</span>
              <span style={{ flex: 1 }}>{o.text}{checked && o.correct && <strong style={{ color: (c.okText || '#2F855A') }}> · correta</strong>}</span>
            </button>
          );
        })}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setPicked({})} canCheck={Object.values(picked).some(Boolean)} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation}
        corrections={options.filter((o) => o.correct).map((o) => o.text)} />}
    </ExShell>
  );
}

/* ─────────────────────────── 2. True / False ─────────────────────────── */
function TrueFalse({ ex, c, onChecked }) {
  const accent = c.accent || '#00B04F';
  const [ans, setAns] = useState({});
  const [checked, setChecked] = useState(false);
  const items = ex.items || [];
  const isRight = (i) => ans[i] === items[i].answer;
  const acc = items.length ? items.filter((_, i) => isRight(i)).length / items.length : 0;
  const labels = ex.labels || ['True', 'False'];

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'True or false'}>
      <Instruction c={c}>{ex.instruction || 'Verdadeiro ou falso? Decida com base no que você viu na lição.'}</Instruction>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((it, i) => (
          <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: checked ? (isRight(i) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : c.offWhite || '#F5F8F7', border: `1px solid ${checked ? (isRight(i) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : c.grayLight || '#E2E9E7'}` }}>
            <div style={{ fontSize: 15, lineHeight: 1.55, marginBottom: 10 }}>{it.text}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[true, false].map((v, k) => (
                <button key={k} onClick={() => !checked && setAns((a) => ({ ...a, [i]: v }))} disabled={checked}
                  style={{ padding: '6px 16px', borderRadius: 999, fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer',
                    background: ans[i] === v ? accent : '#fff', color: ans[i] === v ? '#fff' : c.gray || '#5F7570',
                    border: `1px solid ${ans[i] === v ? accent : c.grayLight || '#E2E9E7'}` }}>{labels[k]}</button>
              ))}
            </div>
            {checked && !isRight(i) && it.why && <div style={{ marginTop: 9, fontSize: 13.5, color: (c.badText || '#742A2A') }}>{it.why}</div>}
          </div>
        ))}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setAns({})} canCheck={items.every((_, i) => ans[i] !== undefined)} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation}
        corrections={items.filter((_, i) => !isRight(i)).map((it) => `${it.text} → ${it.answer ? labels[0] : labels[1]}`)} />}
    </ExShell>
  );
}

/* ─────────────────────────── 3. Categorize ─────────────────────────── */
function Categorize({ ex, c, onChecked, seed }) {
  const accent = c.accent || '#00B04F';
  const cats = ex.categories || [];
  const items = ex.items || [];
  const order = seededShuffle(items.map((_, i) => i), hashString(ex.title || 'cat') + seed);
  const [put, setPut] = useState({});
  const [checked, setChecked] = useState(false);
  const isRight = (i) => put[i] === items[i].cat;
  const acc = items.length ? items.filter((_, i) => isRight(i)).length / items.length : 0;

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Classifique'}>
      <Instruction c={c}>{ex.instruction || 'Escolha a categoria certa para cada item.'}</Instruction>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {cats.map((cat) => (
          <span key={cat.id} style={{ padding: '5px 12px', borderRadius: 999, background: c.accentLight || '#E4F7EC', color: c.ink || c.navy || '#062E2B', fontSize: 13, fontWeight: 700 }}>{cat.name}</span>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 9 }}>
        {order.map((i) => {
          const it = items[i];
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '11px 14px', borderRadius: 10, background: checked ? (isRight(i) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : '#fff', border: `1px solid ${checked ? (isRight(i) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : c.grayLight || '#E2E9E7'}` }}>
              <span style={{ flex: '1 1 200px', fontSize: 14.5, lineHeight: 1.5 }}>{it.text}</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {cats.map((cat) => (
                  <button key={cat.id} onClick={() => !checked && setPut((p) => ({ ...p, [i]: cat.id }))} disabled={checked}
                    style={{ padding: '5px 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer',
                      background: put[i] === cat.id ? accent : '#fff', color: put[i] === cat.id ? '#fff' : c.gray || '#5F7570',
                      border: `1px solid ${put[i] === cat.id ? accent : c.grayLight || '#E2E9E7'}` }}>{cat.short || cat.name}</button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setPut({})} canCheck={items.every((_, i) => put[i])} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation}
        corrections={items.filter((_, i) => !isRight(i)).map((it) => `${it.text} → ${(cats.find((k) => k.id === it.cat) || {}).name}`)} />}
    </ExShell>
  );
}

/* ─────────────────────────── 4. Odd one out ─────────────────────────── */
function OddOneOut({ ex, c, onChecked }) {
  const accent = c.accent || '#00B04F';
  const groups = ex.groups || [];
  const [pick, setPick] = useState({});
  const [checked, setChecked] = useState(false);
  const isRight = (g) => norm(pick[g]) === norm(groups[g].odd);
  const acc = groups.length ? groups.filter((_, g) => isRight(g)).length / groups.length : 0;

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Odd one out'}>
      <Instruction c={c}>{ex.instruction || 'Em cada linha, clique na palavra que não pertence ao grupo.'}</Instruction>
      <div style={{ display: 'grid', gap: 12 }}>
        {groups.map((g, gi) => (
          <div key={gi}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(g.items || []).map((w, wi) => {
                const on = pick[gi] === w;
                const state = checked ? (norm(w) === norm(g.odd) ? 'ok' : on ? 'bad' : null) : null;
                return (
                  <button key={wi} onClick={() => !checked && setPick((p) => ({ ...p, [gi]: w }))} disabled={checked}
                    style={{ padding: '8px 14px', borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer',
                      background: state === 'ok' ? (c.okBg || '#F0FFF4') : state === 'bad' ? (c.badBg || '#FFF5F5') : on ? c.accentLight || '#E4F7EC' : '#fff',
                      border: `2px solid ${state === 'ok' ? (c.okBorder || '#9AE6B4') : state === 'bad' ? (c.badBorder || '#FEB2B2') : on ? accent : c.grayLight || '#E2E9E7'}`,
                      color: c.text || '#20302D' }}>{w}</button>
                );
              })}
            </div>
            {checked && g.why && <div style={{ marginTop: 7, fontSize: 13.5, color: c.gray || '#5F7570' }}>{g.why}</div>}
          </div>
        ))}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setPick({})} canCheck={groups.every((_, g) => pick[g])} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation}
        corrections={groups.filter((_, g) => !isRight(g)).map((g) => `${(g.items || []).join(' · ')} → ${g.odd}`)} />}
    </ExShell>
  );
}

/* ───────── 5. Order list — diálogo, etapas, blocos de e-mail, escala ───────── */
function OrderList({ ex, c, onChecked, seed, badge }) {
  const accent = c.accent || '#00B04F';
  const correct = ex.items || [];
  const pool = seededShuffle(correct.map((_, i) => i), hashString(ex.title || 'ord') + seed);
  const [seq, setSeq] = useState([]);
  const [checked, setChecked] = useState(false);
  // Ordenar frases numa língua que a pessoa mal lê é adivinhação, não exercício.
  // Com `itemsPt` no conteúdo, o bloco ganha um botão que mostra a tradução de
  // cada linha. Sem o campo, nada muda.
  const [showPt, setShowPt] = useState(false);
  const pt = (i) => (Array.isArray(ex.itemsPt) ? ex.itemsPt[i] : null);
  const temPt = Array.isArray(ex.itemsPt) && ex.itemsPt.length === (ex.items || []).length;
  const place = (i) => { if (!checked && !seq.includes(i)) setSeq((s) => [...s, i]); };
  const undo = () => !checked && setSeq((s) => s.slice(0, -1));
  const isRight = (pos) => seq[pos] === pos;
  const acc = correct.length ? correct.filter((_, pos) => isRight(pos)).length / correct.length : 0;
  const label = (x) => (typeof x === 'string' ? x : `${x.who ? `${x.who}: ` : ''}${x.text}`);

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={badge || ex.badge || 'Coloque em ordem'}>
      <Instruction c={c}>{ex.instruction || 'Clique nas linhas na ordem certa. Use "Voltar uma" se errar o clique.'}</Instruction>
      {temPt && (
        <button type="button" onClick={() => setShowPt((v) => !v)}
          style={{ marginBottom: 12, padding: '6px 13px', borderRadius: 999, border: `1px solid ${c.grayLight || '#E2E9E7'}`, background: c.card || '#fff', color: c.ink || c.navy || '#062E2B', fontWeight: 700, fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer' }}>
          {showPt ? 'Ocultar tradução' : '🇧🇷 Ver tradução'}
        </button>
      )}
      {ex.scale && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, color: c.gray || '#5F7570', marginBottom: 10 }}>
          <span>1 · {ex.scale[0]}</span><span>{correct.length} · {ex.scale[1]}</span>
        </div>
      )}
      {ex.context && <div style={{ padding: '12px 14px', background: c.offWhite || '#F5F8F7', border: `1px solid ${c.grayLight || '#E2E9E7'}`, borderRadius: 10, fontSize: 14, lineHeight: 1.6, marginBottom: 12, fontStyle: 'italic' }}>{ex.context}</div>}

      <div style={{ display: 'grid', gap: 7, marginBottom: 12 }}>
        {seq.map((idx, pos) => (
          <div key={pos} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 10,
            background: checked ? (isRight(pos) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : c.accentLight || '#E4F7EC',
            border: `1px solid ${checked ? (isRight(pos) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : accent}` }}>
            <span style={{ flex: '0 0 24px', height: 24, borderRadius: 7, background: accent, color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pos + 1}</span>
            <span style={{ flex: 1, fontSize: 14.5, lineHeight: 1.5 }}>
              {label(correct[idx])}
              {showPt && pt(idx) && (
                <span style={{ display: 'block', marginTop: 4, fontSize: 13, fontStyle: 'italic', color: c.gray || '#5F7570' }}>{pt(idx)}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {pool.filter((i) => !seq.includes(i)).map((i) => (
          <button key={i} onClick={() => place(i)} disabled={checked}
            style={{ padding: '9px 14px', borderRadius: 10, border: `1px solid ${c.grayLight || '#E2E9E7'}`, background: c.card || '#fff', color: c.text || '#20302D', fontSize: 14, fontFamily: 'inherit', textAlign: 'left', cursor: checked ? 'default' : 'pointer', maxWidth: '100%', lineHeight: 1.45 }}>
            {label(correct[i])}
            {showPt && pt(i) && (
              <span style={{ display: 'block', marginTop: 4, fontSize: 12.5, fontStyle: 'italic', color: c.gray || '#5F7570' }}>{pt(i)}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        {!checked ? (
          <>
            <button onClick={() => { setChecked(true); if (onChecked) onChecked(acc); }} disabled={seq.length !== correct.length}
              style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: seq.length === correct.length ? accent : (c.disabled || '#CBD5D2'), color: '#fff', fontWeight: 700, fontSize: 14, cursor: seq.length === correct.length ? 'pointer' : 'not-allowed' }}>Corrigir</button>
            {seq.length > 0 && <button onClick={undo} style={{ padding: '10px 18px', borderRadius: 8, border: `1px solid ${c.grayLight || '#E2E9E7'}`, background: c.card || '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>Voltar uma</button>}
          </>
        ) : (
          <button onClick={() => { setChecked(false); setSeq([]); }} style={{ padding: '10px 18px', borderRadius: 8, border: `1px solid ${c.grayLight || '#E2E9E7'}`, background: c.card || '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>Tentar de novo</button>
        )}
      </div>
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation} corrections={acc === 1 ? [] : correct.map((x, i) => `${i + 1}. ${label(x)}`)} />}
    </ExShell>
  );
}

/* ─────────────────────────── 6. Error spot ─────────────────────────── */
function ErrorSpot({ ex, c, onChecked }) {
  const accent = c.accent || '#00B04F';
  const items = ex.items || [];
  const [pick, setPick] = useState({});
  const [checked, setChecked] = useState(false);
  const isRight = (i) => norm(pick[i]) === norm(items[i].wrong);
  const acc = items.length ? items.filter((_, i) => isRight(i)).length / items.length : 0;

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Ache o erro'}>
      <Instruction c={c}>{ex.instruction || 'Cada frase tem uma palavra errada. Clique nela.'}</Instruction>
      <div style={{ display: 'grid', gap: 14 }}>
        {items.map((it, i) => {
          const tokens = String(it.sentence || '').split(' ');
          return (
            <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: checked ? (isRight(i) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : c.offWhite || '#F5F8F7', border: `1px solid ${checked ? (isRight(i) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : c.grayLight || '#E2E9E7'}` }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, fontSize: 15, lineHeight: 1.8 }}>
                {tokens.map((t, ti) => {
                  const clean = t.replace(/[.,!?;:]/g, '');
                  const on = pick[i] === clean;
                  const isWrong = norm(clean) === norm(it.wrong);
                  const state = checked ? (isWrong ? 'ok' : on ? 'bad' : null) : null;
                  return (
                    <button key={ti} onClick={() => !checked && setPick((p) => ({ ...p, [i]: clean }))} disabled={checked}
                      style={{ padding: '2px 6px', borderRadius: 6, fontSize: 15, fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer',
                        background: state === 'ok' ? (c.okBgStrong || '#C6F6D5') : state === 'bad' ? (c.badBgStrong || '#FED7D7') : on ? c.accentLight || '#E4F7EC' : 'transparent',
                        border: `1px solid ${on || state ? (state === 'bad' ? (c.badBorder || '#FEB2B2') : accent) : 'transparent'}`, color: c.text || '#20302D' }}>{t}</button>
                  );
                })}
              </div>
              {checked && <div style={{ marginTop: 8, fontSize: 13.5, color: isRight(i) ? (c.okText || '#22543D') : (c.badText || '#742A2A') }}><strong>{it.wrong} → {it.fix}</strong>{it.why ? ` · ${it.why}` : ''}</div>}
            </div>
          );
        })}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setPick({})} canCheck={items.every((_, i) => pick[i])} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation} />}
    </ExShell>
  );
}

/* ─────────────────────────── 7. Highlight pick ─────────────────────────── */
function HighlightPick({ ex, c, onChecked, voiceType }) {
  const accent = c.accent || '#00B04F';
  const targets = (ex.targets || []).map(norm);
  const tokens = String(ex.text || '').split(' ');
  const [on, setOn] = useState({});
  const [checked, setChecked] = useState(false);
  const cleanAt = (i) => tokens[i].replace(/[.,!?;:"]/g, '');
  const isTarget = (i) => targets.includes(norm(cleanAt(i)));
  const hits = tokens.filter((_, i) => isTarget(i) && on[i]).length;
  const wrong = tokens.filter((_, i) => !isTarget(i) && on[i]).length;
  const totalTargets = tokens.filter((_, i) => isTarget(i)).length || 1;
  const acc = Math.max(0, (hits - wrong) / totalTargets);

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Clique nas palavras'}>
      <Instruction c={c}>{ex.instruction || 'Clique em todas as expressões que servem para o objetivo indicado.'}</Instruction>
      {ex.goal && <p style={{ fontSize: 14.5, fontWeight: 700, color: c.ink || c.navy || '#062E2B', margin: '0 0 12px' }}>{ex.goal}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, fontSize: 15.5, lineHeight: 1.9, padding: '14px', background: c.offWhite || '#F5F8F7', borderRadius: 10, border: `1px solid ${c.grayLight || '#E2E9E7'}` }}>
        {tokens.map((t, i) => {
          const state = checked ? (isTarget(i) ? 'ok' : on[i] ? 'bad' : null) : null;
          return (
            <button key={i} onClick={() => !checked && setOn((o) => ({ ...o, [i]: !o[i] }))} disabled={checked}
              style={{ padding: '2px 6px', borderRadius: 6, fontSize: 15.5, fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer',
                background: state === 'ok' ? (c.okBgStrong || '#C6F6D5') : state === 'bad' ? (c.badBgStrong || '#FED7D7') : on[i] ? c.accentLight || '#E4F7EC' : 'transparent',
                border: `1px solid ${on[i] || state ? (state === 'bad' ? (c.badBorder || '#FEB2B2') : accent) : 'transparent'}`, color: c.text || '#20302D' }}>{t}</button>
          );
        })}
      </div>
      {ex.audio !== false && <div style={{ marginTop: 10 }}><AudioPlayer text={ex.text} rate={0.9} label="Listen" small voiceType={voiceType} /></div>}
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(Math.min(1, acc)); }} onReset={() => setOn({})} canCheck={Object.values(on).some(Boolean)} c={c} />
      {checked && <ResultLine ok={acc >= 1 && wrong === 0} c={c} explanation={ex.explanation} corrections={ex.targets || []} />}
    </ExShell>
  );
}

/* ─────────────────────────── 8. Dropdown gap ─────────────────────────── */
function DropdownGap({ ex, c, onChecked }) {
  const gaps = ex.gaps || [];
  const [ans, setAns] = useState({});
  const [checked, setChecked] = useState(false);
  const isRight = (i) => norm(ans[i]) === norm(gaps[i].answer);
  const acc = gaps.length ? gaps.filter((_, i) => isRight(i)).length / gaps.length : 0;
  const parts = String(ex.text || '').split('___');

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Complete o texto'}>
      <Instruction c={c}>{ex.instruction || 'Escolha a opção certa em cada lacuna.'}</Instruction>
      <div style={{ fontSize: 15.5, lineHeight: 2.1, padding: '14px 16px', background: c.offWhite || '#F5F8F7', borderRadius: 10, border: `1px solid ${c.grayLight || '#E2E9E7'}` }}>
        {parts.map((p, i) => (
          <span key={i}>
            {p}
            {i < gaps.length && (
              <select value={ans[i] || ''} onChange={(e) => setAns((a) => ({ ...a, [i]: e.target.value }))} disabled={checked}
                style={{ margin: '0 4px', padding: '4px 8px', borderRadius: 6, fontSize: 14.5, fontFamily: 'inherit',
                  border: `2px solid ${checked ? (isRight(i) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : c.grayLight || '#E2E9E7'}`,
                  color: c.text || 'inherit',
                  background: checked ? (isRight(i) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : (c.inputBg || '#fff') }}>
                <option value="">…</option>
                {(gaps[i].options || []).map((o, j) => <option key={j} value={o}>{o}</option>)}
              </select>
            )}
          </span>
        ))}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setAns({})} canCheck={gaps.every((_, i) => ans[i])} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation}
        corrections={gaps.filter((_, i) => !isRight(i)).map((g, k) => `${g.answer}${g.why ? ` — ${g.why}` : ''}`)} />}
    </ExShell>
  );
}

/* ───────── 9. Serial choice — série de mini-escolhas (collocation, preposição, tom) ───────── */
function SerialChoice({ ex, c, onChecked }) {
  const accent = c.accent || '#00B04F';
  const items = ex.items || [];
  const [pick, setPick] = useState({});
  const [checked, setChecked] = useState(false);
  const rightIdx = (i) => (items[i].options || []).findIndex((o) => o.correct);
  const isRight = (i) => pick[i] === rightIdx(i);
  const acc = items.length ? items.filter((_, i) => isRight(i)).length / items.length : 0;

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Escolha certa'}>
      <Instruction c={c}>{ex.instruction}</Instruction>
      <div style={{ display: 'grid', gap: 14 }}>
        {items.map((it, i) => (
          <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: checked ? (isRight(i) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : '#fff', border: `1px solid ${checked ? (isRight(i) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : c.grayLight || '#E2E9E7'}` }}>
            <div style={{ fontSize: 14.5, lineHeight: 1.6, marginBottom: 9, color: c.ink || c.navy || '#062E2B', fontWeight: 600 }}>{it.prompt}</div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {(it.options || []).map((o, oi) => {
                const on = pick[i] === oi;
                const state = checked ? (o.correct ? 'ok' : on ? 'bad' : null) : null;
                return (
                  <button key={oi} onClick={() => !checked && setPick((p) => ({ ...p, [i]: oi }))} disabled={checked}
                    style={{ padding: '8px 14px', borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer', textAlign: 'left',
                      background: state === 'ok' ? (c.okBgStrong || '#C6F6D5') : state === 'bad' ? (c.badBgStrong || '#FED7D7') : on ? c.accentLight || '#E4F7EC' : '#fff',
                      border: `1.5px solid ${state === 'ok' ? (c.okBorder || '#9AE6B4') : state === 'bad' ? (c.badBorder || '#FEB2B2') : on ? accent : c.grayLight || '#E2E9E7'}`,
                      color: c.text || '#20302D' }}>{o.text}</button>
                );
              })}
            </div>
            {checked && it.why && <div style={{ marginTop: 9, fontSize: 13.5, color: c.gray || '#5F7570', lineHeight: 1.5 }}>{it.why}</div>}
          </div>
        ))}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setPick({})} canCheck={items.every((_, i) => pick[i] !== undefined)} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation}
        corrections={items.filter((_, i) => !isRight(i)).map((it) => (it.options.find((o) => o.correct) || {}).text)} />}
    </ExShell>
  );
}

/* ───────── 10. Flow choice — conversa turno a turno ───────── */
function FlowChoice({ ex, c, onChecked, voiceType }) {
  const accent = c.accent || '#00B04F';
  const turns = ex.turns || [];
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState({});
  const done = step >= turns.length;
  const score = turns.filter((t, i) => picks[i] !== undefined && (t.options[picks[i]] || {}).correct).length;
  const acc = turns.length ? score / turns.length : 0;

  const choose = (i, oi) => {
    if (picks[i] !== undefined) return;
    const next = { ...picks, [i]: oi };
    setPicks(next);
    setTimeout(() => setStep(i + 1), 350);
    if (i === turns.length - 1 && onChecked) {
      const s = turns.filter((t, k) => next[k] !== undefined && (t.options[next[k]] || {}).correct).length;
      onChecked(turns.length ? s / turns.length : 0);
    }
  };

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Conversa'}>
      <Instruction c={c}>{ex.instruction || 'A conversa avança conforme você escolhe. Escolha a resposta mais natural em cada turno.'}</Instruction>
      {ex.situation && <div style={{ padding: '11px 14px', background: c.offWhite || '#F5F8F7', borderRadius: 10, border: `1px solid ${c.grayLight || '#E2E9E7'}`, fontSize: 14, fontStyle: 'italic', marginBottom: 14, lineHeight: 1.55 }}>{ex.situation}</div>}
      <div style={{ display: 'grid', gap: 12 }}>
        {turns.slice(0, Math.min(step + 1, turns.length)).map((t, i) => (
          <div key={i}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 9 }}>
              <span style={{ flex: '0 0 34px', height: 34, borderRadius: 999, background: c.navy || '#062E2B', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{(t.who || 'A').slice(0, 2).toUpperCase()}</span>
              <div style={{ background: c.offWhite || '#F5F8F7', border: `1px solid ${c.grayLight || '#E2E9E7'}`, borderRadius: 12, padding: '10px 14px', fontSize: 14.5, lineHeight: 1.55, flex: 1 }}>
                {t.them}
                <div style={{ marginTop: 7 }}><AudioPlayer text={t.them} rate={0.9} label="" small voiceType={voiceType} /></div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 7, paddingLeft: 44 }}>
              {(t.options || []).map((o, oi) => {
                const answered = picks[i] !== undefined;
                const on = picks[i] === oi;
                const state = answered ? (o.correct ? 'ok' : on ? 'bad' : null) : null;
                return (
                  <button key={oi} onClick={() => choose(i, oi)} disabled={answered}
                    style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 12, fontSize: 14.5, lineHeight: 1.5, fontFamily: 'inherit', cursor: answered ? 'default' : 'pointer',
                      background: state === 'ok' ? (c.okBg || '#F0FFF4') : state === 'bad' ? (c.badBg || '#FFF5F5') : '#fff',
                      border: `1.5px solid ${state === 'ok' ? (c.okBorder || '#9AE6B4') : state === 'bad' ? (c.badBorder || '#FEB2B2') : c.grayLight || '#E2E9E7'}`,
                      color: c.text || '#20302D' }}>
                    {o.text}
                    {answered && on && o.why && <div style={{ marginTop: 6, fontSize: 13, color: o.correct ? (c.okText || '#22543D') : (c.badText || '#742A2A') }}>{o.why}</div>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {done && (
        <div style={{ marginTop: 16, padding: '12px 15px', borderRadius: 10, background: acc === 1 ? (c.okBg || '#F0FFF4') : c.accentLight || '#E4F7EC', border: `1px solid ${acc === 1 ? (c.okBorder || '#9AE6B4') : accent}`, fontSize: 14.5 }}>
          <strong>{score}/{turns.length}</strong> — {ex.explanation || 'Conversa concluída.'}
          <button onClick={() => { setPicks({}); setStep(0); }} style={{ marginLeft: 12, padding: '6px 14px', borderRadius: 8, border: `1px solid ${c.grayLight || '#E2E9E7'}`, background: c.card || '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>Refazer</button>
        </div>
      )}
    </ExShell>
  );
}

/* ───────── 11. Listen & choose ───────── */
function ListenChoose({ ex, c, onChecked, voiceType }) {
  const accent = c.accent || '#00B04F';
  const items = ex.items || [];
  const [pick, setPick] = useState({});
  const [checked, setChecked] = useState(false);
  const isRight = (i) => pick[i] === (items[i].options || []).findIndex((o) => o.correct);
  const acc = items.length ? items.filter((_, i) => isRight(i)).length / items.length : 0;

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Ouça e escolha'}>
      <Instruction c={c}>{ex.instruction || 'Toque no áudio (quantas vezes quiser) e escolha o que você ouviu ou a melhor resposta.'}</Instruction>
      <div style={{ display: 'grid', gap: 14 }}>
        {items.map((it, i) => (
          <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: checked ? (isRight(i) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : c.offWhite || '#F5F8F7', border: `1px solid ${checked ? (isRight(i) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : c.grayLight || '#E2E9E7'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <AudioPlayer text={it.audio} rate={it.rate || 0.9} label={`Áudio ${i + 1}`} small voiceType={it.voice || voiceType} />
            </div>
            {/* Transcript só onde o conteúdo pede (`transcript: true` ou o texto).
                Sem o campo, o bloco fica exatamente como sempre foi. */}
            {it.transcript && (
              <TranscriptToggle text={typeof it.transcript === 'string' ? it.transcript : it.audio} pt={it.pt} c={c} hint="Tente ouvir duas vezes antes de ler." />
            )}
            <div style={{ display: 'grid', gap: 7 }}>
              {(it.options || []).map((o, oi) => {
                const on = pick[i] === oi;
                const state = checked ? (o.correct ? 'ok' : on ? 'bad' : null) : null;
                return (
                  <button key={oi} onClick={() => !checked && setPick((p) => ({ ...p, [i]: oi }))} disabled={checked}
                    style={{ textAlign: 'left', padding: '9px 13px', borderRadius: 10, fontSize: 14.5, lineHeight: 1.5, fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer',
                      background: state === 'ok' ? (c.okBgStrong || '#C6F6D5') : state === 'bad' ? (c.badBgStrong || '#FED7D7') : on ? c.accentLight || '#E4F7EC' : '#fff',
                      border: `1.5px solid ${state === 'ok' ? (c.okBorder || '#9AE6B4') : state === 'bad' ? (c.badBorder || '#FEB2B2') : on ? accent : c.grayLight || '#E2E9E7'}`,
                      color: c.text || '#20302D' }}>{o.text}</button>
                );
              })}
            </div>
            {checked && it.why && <div style={{ marginTop: 8, fontSize: 13.5, color: c.gray || '#5F7570' }}>{it.why}</div>}
          </div>
        ))}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setPick({})} canCheck={items.every((_, i) => pick[i] !== undefined)} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation} corrections={items.filter((_, i) => !isRight(i)).map((it) => it.audio)} />}
    </ExShell>
  );
}

/* ───────── 12. Listen & fill (banco de palavras) ───────── */
function ListenGap({ ex, c, onChecked, voiceType }) {
  const items = ex.items || [];
  const [ans, setAns] = useState({});
  const [checked, setChecked] = useState(false);
  const isRight = (i) => norm(ans[i]) === norm(items[i].answer);
  const acc = items.length ? items.filter((_, i) => isRight(i)).length / items.length : 0;

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Ouça e complete'}>
      <Instruction c={c}>{ex.instruction || 'Ouça o trecho e complete as lacunas com o banco de palavras.'}</Instruction>
      {ex.audioText && (
        <div style={{ padding: '12px 14px', background: c.accentLight || '#E4F7EC', borderRadius: 10, marginBottom: 14 }}>
          <AudioPlayer text={ex.audioText} rate={ex.rate || 0.88} label="Ouvir o trecho completo" small voiceType={voiceType} />
          {ex.transcript && (
            <TranscriptToggle text={typeof ex.transcript === 'string' ? ex.transcript : ex.audioText} pt={ex.audioTextPt} c={c} hint="Tente ouvir duas vezes antes de ler." />
          )}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {(ex.bank || []).map((w, i) => (
          <span key={i} style={{ padding: '5px 12px', background: c.card || '#fff', border: `1px solid ${c.accent || '#00B04F'}`, borderRadius: 999, fontSize: 13.5, fontWeight: 600, color: c.ink || c.navy || '#062E2B' }}>{w}</span>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((it, i) => {
          const parts = String(it.text || '').split('___');
          return (
            <div key={i} style={{ fontSize: 15, lineHeight: 1.8 }}>
              {parts[0]}
              <select value={ans[i] || ''} onChange={(e) => setAns((a) => ({ ...a, [i]: e.target.value }))} disabled={checked}
                style={{ margin: '0 4px', padding: '4px 8px', borderRadius: 6, fontSize: 14, fontFamily: 'inherit',
                  border: `2px solid ${checked ? (isRight(i) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : c.grayLight || '#E2E9E7'}`,
                  color: c.text || 'inherit',
                  background: checked ? (isRight(i) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : (c.inputBg || '#fff') }}>
                <option value="">…</option>
                {(ex.bank || []).map((w, j) => <option key={j} value={w}>{w}</option>)}
              </select>
              {parts.slice(1).join('___')}
            </div>
          );
        })}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setAns({})} canCheck={items.every((_, i) => ans[i])} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation}
        corrections={items.filter((_, i) => !isRight(i)).map((it) => it.text.replace('___', `[${it.answer}]`))} />}
    </ExShell>
  );
}

/* ───────── 13. Sentence build — montar a frase clicando nos blocos ───────── */
function SentenceBuild({ ex, c, onChecked, seed, voiceType }) {
  const accent = c.accent || '#00B04F';
  const items = ex.items || [];
  const [built, setBuilt] = useState({});
  const [checked, setChecked] = useState(false);
  const words = (i) => String(items[i].answer || '').split(' ');
  const chips = (i) => seededShuffle([...words(i), ...(items[i].extra || [])], hashString(items[i].answer) + seed);
  const current = (i) => built[i] || [];
  const isRight = (i) => norm(current(i).join(' ')) === norm(items[i].answer);
  const acc = items.length ? items.filter((_, i) => isRight(i)).length / items.length : 0;
  const add = (i, w, k) => !checked && setBuilt((b) => ({ ...b, [i]: [...(b[i] || []), w] }));
  const back = (i) => !checked && setBuilt((b) => ({ ...b, [i]: (b[i] || []).slice(0, -1) }));

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Monte a frase'}>
      <Instruction c={c}>{ex.instruction || 'Clique nos blocos na ordem certa. Alguns blocos sobram — são distratores.'}</Instruction>
      <div style={{ display: 'grid', gap: 18 }}>
        {items.map((it, i) => {
          const used = current(i);
          const remaining = (() => {
            const pool = [...chips(i)];
            used.forEach((w) => { const k = pool.indexOf(w); if (k >= 0) pool.splice(k, 1); });
            return pool;
          })();
          return (
            <div key={i} style={{ padding: '13px 14px', borderRadius: 10, background: checked ? (isRight(i) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : c.offWhite || '#F5F8F7', border: `1px solid ${checked ? (isRight(i) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : c.grayLight || '#E2E9E7'}` }}>
              {it.hint && <div style={{ fontSize: 13.5, color: c.gray || '#5F7570', marginBottom: 9, fontStyle: 'italic' }}>{it.hint}</div>}
              <div style={{ minHeight: 40, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', padding: '8px 10px', background: c.card || '#fff', border: `1px dashed ${c.grayLight || '#E2E9E7'}`, borderRadius: 8, marginBottom: 10 }}>
                {used.length === 0 && <span style={{ fontSize: 13.5, color: '#A9B8B4' }}>clique nos blocos abaixo…</span>}
                {used.map((w, k) => <span key={k} style={{ padding: '4px 10px', background: c.accentLight || '#E4F7EC', border: `1px solid ${accent}`, borderRadius: 8, fontSize: 14.5 }}>{w}</span>)}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {remaining.map((w, k) => (
                  <button key={k} onClick={() => add(i, w, k)} disabled={checked}
                    style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${c.grayLight || '#E2E9E7'}`, background: c.card || '#fff', fontSize: 14.5, fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer', color: c.text || '#20302D' }}>{w}</button>
                ))}
                {used.length > 0 && !checked && (
                  <button onClick={() => back(i)} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${c.grayLight || '#E2E9E7'}`, background: c.card || '#fff', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', color: c.gray || '#5F7570' }}>← apagar</button>
                )}
              </div>
              {checked && (
                <div style={{ marginTop: 10, fontSize: 14, color: isRight(i) ? (c.okText || '#22543D') : (c.badText || '#742A2A'), display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <strong>{it.answer}</strong>
                  <AudioPlayer text={it.answer} rate={0.9} label="" small voiceType={voiceType} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setBuilt({})} canCheck={items.every((_, i) => current(i).length > 0)} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation} />}
    </ExShell>
  );
}

/* ───────── 14. Reading task — texto de contexto + perguntas ───────── */
function ReadingTask({ ex, c, onChecked, voiceType }) {
  const accent = c.accent || '#00B04F';
  const qs = ex.questions || [];
  const [pick, setPick] = useState({});
  const [checked, setChecked] = useState(false);
  const isRight = (i) => pick[i] === (qs[i].options || []).findIndex((o) => o.correct);
  const acc = qs.length ? qs.filter((_, i) => isRight(i)).length / qs.length : 0;

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Leia e responda'}>
      <Instruction c={c}>{ex.instruction || 'Leia o texto e responda com base nele.'}</Instruction>
      <div style={{ padding: '16px 18px', background: c.offWhite || '#F5F8F7', border: `1px solid ${c.grayLight || '#E2E9E7'}`, borderRadius: 12, marginBottom: 16 }}>
        {ex.heading && <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: accent, marginBottom: 8 }}>{ex.heading}</div>}
        {(Array.isArray(ex.passage) ? ex.passage : [ex.passage]).map((p, i) => (
          <p key={i} style={{ margin: '0 0 10px', fontSize: 15, lineHeight: 1.7, color: c.text || '#20302D' }}>{p}</p>
        ))}
        <AudioPlayer text={(Array.isArray(ex.passage) ? ex.passage.join(' ') : ex.passage) || ''} rate={0.9} label="Listen" small voiceType={voiceType} />
      </div>
      <div style={{ display: 'grid', gap: 14 }}>
        {qs.map((q, i) => (
          <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: checked ? (isRight(i) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : '#fff', border: `1px solid ${checked ? (isRight(i) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : c.grayLight || '#E2E9E7'}` }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: c.ink || c.navy || '#062E2B', marginBottom: 9, lineHeight: 1.55 }}>{i + 1}. {q.prompt}</div>
            <div style={{ display: 'grid', gap: 7 }}>
              {(q.options || []).map((o, oi) => {
                const on = pick[i] === oi;
                const state = checked ? (o.correct ? 'ok' : on ? 'bad' : null) : null;
                return (
                  <button key={oi} onClick={() => !checked && setPick((p) => ({ ...p, [i]: oi }))} disabled={checked}
                    style={{ textAlign: 'left', padding: '9px 13px', borderRadius: 10, fontSize: 14.5, lineHeight: 1.5, fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer',
                      background: state === 'ok' ? (c.okBgStrong || '#C6F6D5') : state === 'bad' ? (c.badBgStrong || '#FED7D7') : on ? c.accentLight || '#E4F7EC' : '#fff',
                      border: `1.5px solid ${state === 'ok' ? (c.okBorder || '#9AE6B4') : state === 'bad' ? (c.badBorder || '#FEB2B2') : on ? accent : c.grayLight || '#E2E9E7'}`,
                      color: c.text || '#20302D' }}>{o.text}</button>
                );
              })}
            </div>
            {checked && q.why && <div style={{ marginTop: 8, fontSize: 13.5, color: c.gray || '#5F7570', lineHeight: 1.5 }}>{q.why}</div>}
          </div>
        ))}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setPick({})} canCheck={qs.every((_, i) => pick[i] !== undefined)} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation} />}
    </ExShell>
  );
}

/* ───────── 15. Email triage — e-mail real + decisões ───────── */
function EmailTriage({ ex, c, onChecked }) {
  const accent = c.accent || '#00B04F';
  const qs = ex.questions || [];
  const [pick, setPick] = useState({});
  const [checked, setChecked] = useState(false);
  const isRight = (i) => pick[i] === (qs[i].options || []).findIndex((o) => o.correct);
  const acc = qs.length ? qs.filter((_, i) => isRight(i)).length / qs.length : 0;
  const m = ex.email || {};

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Caixa de entrada'}>
      <Instruction c={c}>{ex.instruction || 'Leia a mensagem como se tivesse acabado de chegar e decida o que fazer.'}</Instruction>
      <div style={{ border: `1px solid ${c.grayLight || '#E2E9E7'}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ background: c.navy || '#062E2B', color: '#fff', padding: '11px 15px', fontSize: 13 }}>
          <div style={{ opacity: 0.75 }}>{m.channel || 'Outlook'} · {m.from}</div>
          <div style={{ fontWeight: 700, fontSize: 14.5, marginTop: 3 }}>{m.subject}</div>
        </div>
        <div style={{ padding: '15px 17px', background: c.card || '#fff', fontSize: 14.8, lineHeight: 1.75, whiteSpace: 'pre-line', color: c.text || '#20302D' }}>{m.body}</div>
      </div>
      <div style={{ display: 'grid', gap: 14 }}>
        {qs.map((q, i) => (
          <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: checked ? (isRight(i) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : c.offWhite || '#F5F8F7', border: `1px solid ${checked ? (isRight(i) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : c.grayLight || '#E2E9E7'}` }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: c.ink || c.navy || '#062E2B', marginBottom: 9, lineHeight: 1.55 }}>{q.prompt}</div>
            <div style={{ display: 'grid', gap: 7 }}>
              {(q.options || []).map((o, oi) => {
                const on = pick[i] === oi;
                const state = checked ? (o.correct ? 'ok' : on ? 'bad' : null) : null;
                return (
                  <button key={oi} onClick={() => !checked && setPick((p) => ({ ...p, [i]: oi }))} disabled={checked}
                    style={{ textAlign: 'left', padding: '9px 13px', borderRadius: 10, fontSize: 14.5, lineHeight: 1.5, fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer',
                      background: state === 'ok' ? (c.okBgStrong || '#C6F6D5') : state === 'bad' ? (c.badBgStrong || '#FED7D7') : on ? '#fff' : '#fff',
                      border: `1.5px solid ${state === 'ok' ? (c.okBorder || '#9AE6B4') : state === 'bad' ? (c.badBorder || '#FEB2B2') : on ? accent : c.grayLight || '#E2E9E7'}`,
                      color: c.text || '#20302D' }}>{o.text}</button>
                );
              })}
            </div>
            {checked && q.why && <div style={{ marginTop: 8, fontSize: 13.5, color: c.gray || '#5F7570', lineHeight: 1.5 }}>{q.why}</div>}
          </div>
        ))}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setPick({})} canCheck={qs.every((_, i) => pick[i] !== undefined)} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation} />}
    </ExShell>
  );
}

/* ───────── 16. Swipe choice — A ou B, rápido ───────── */
function SwipeChoice({ ex, c, onChecked }) {
  const accent = c.accent || '#00B04F';
  const items = ex.items || [];
  const [pick, setPick] = useState({});
  const [checked, setChecked] = useState(false);
  const isRight = (i) => pick[i] === items[i].correct;
  const acc = items.length ? items.filter((_, i) => isRight(i)).length / items.length : 0;

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'A ou B'}>
      <Instruction c={c}>{ex.instruction || 'Duas versões da mesma ideia. Qual funciona melhor no contexto?'}</Instruction>
      <div style={{ display: 'grid', gap: 14 }}>
        {items.map((it, i) => (
          <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: checked ? (isRight(i) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : '#fff', border: `1px solid ${checked ? (isRight(i) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : c.grayLight || '#E2E9E7'}` }}>
            {it.prompt && <div style={{ fontSize: 13.8, color: c.gray || '#5F7570', marginBottom: 10, lineHeight: 1.5 }}>{it.prompt}</div>}
            <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
              {['a', 'b'].map((k) => {
                const on = pick[i] === k;
                const state = checked ? (it.correct === k ? 'ok' : on ? 'bad' : null) : null;
                return (
                  <button key={k} onClick={() => !checked && setPick((p) => ({ ...p, [i]: k }))} disabled={checked}
                    style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 12, fontSize: 14.5, lineHeight: 1.55, fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer',
                      background: state === 'ok' ? (c.okBgStrong || '#C6F6D5') : state === 'bad' ? (c.badBgStrong || '#FED7D7') : on ? c.accentLight || '#E4F7EC' : c.offWhite || '#F5F8F7',
                      border: `1.5px solid ${state === 'ok' ? (c.okBorder || '#9AE6B4') : state === 'bad' ? (c.badBorder || '#FEB2B2') : on ? accent : c.grayLight || '#E2E9E7'}`,
                      color: c.text || '#20302D' }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: accent, display: 'block', marginBottom: 5 }}>{k.toUpperCase()}</span>
                    {it[k]}
                  </button>
                );
              })}
            </div>
            {checked && it.why && <div style={{ marginTop: 9, fontSize: 13.5, color: c.gray || '#5F7570', lineHeight: 1.5 }}>{it.why}</div>}
          </div>
        ))}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setPick({})} canCheck={items.every((_, i) => pick[i])} c={c} />
      {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation} />}
    </ExShell>
  );
}

/* ───────── 17. Check-off final — auto-avaliação assinalável ───────── */
function CheckOff({ ex, c, voiceType, onChecked }) {
  const accent = c.accent || '#00B04F';
  const navy = c.navy || '#062E2B';
  const items = ex.items || [];
  const [on, setOn] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const done = items.filter((_, i) => on[i]).length;
  const all = items.length > 0 && done === items.length;

  return (
    <div style={{ background: c.card || '#fff', border: `2px solid ${all ? accent : c.grayLight || '#E2E9E7'}`, borderRadius: 14, padding: '22px 24px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 999, background: accent, color: '#fff' }}>Check-off</span>
        <h4 style={{ margin: 0, fontSize: 16.5, color: c.ink || navy }}>{ex.title || 'Antes de fechar a lição'}</h4>
      </div>
      <p style={{ fontSize: 14, color: c.gray || '#5F7570', margin: '0 0 16px', lineHeight: 1.55 }}>
        {ex.instruction || 'Assinale só o que você realmente já consegue fazer. O que ficar em branco é o que vale revisar antes da próxima aula — leve para o professor.'}
      </p>
      <div style={{ display: 'grid', gap: 9 }}>
        {items.map((it, i) => {
          const text = typeof it === 'string' ? it : it.en;
          const pt = typeof it === 'string' ? null : it.pt;
          return (
            <button key={i} onClick={() => setOn((o) => ({ ...o, [i]: !o[i] }))}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12, textAlign: 'left', padding: '12px 14px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                background: on[i] ? c.accentLight || '#E4F7EC' : c.offWhite || '#F5F8F7',
                border: `1px solid ${on[i] ? accent : c.grayLight || '#E2E9E7'}` }}>
              <span style={{ flex: '0 0 22px', height: 22, borderRadius: 6, border: `2px solid ${on[i] ? accent : '#C9D6D2'}`, background: on[i] ? accent : '#fff', color: '#fff', fontSize: 13, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{on[i] ? '✓' : ''}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: 14.8, color: c.ink || navy, fontWeight: 600, lineHeight: 1.45 }}>{text}</span>
                {pt && <span style={{ display: 'block', fontSize: 13.3, color: c.gray || '#5F7570', marginTop: 3, lineHeight: 1.45 }}>{pt}</span>}
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 16, padding: '11px 15px', borderRadius: 10, background: all ? (c.okBg || '#F0FFF4') : c.offWhite || '#F5F8F7', border: `1px solid ${all ? (c.okBorder || '#9AE6B4') : c.grayLight || '#E2E9E7'}`, fontSize: 14, color: all ? (c.okText || '#22543D') : c.gray || '#5F7570' }}>
        <strong>{done}/{items.length}</strong> {all ? `— ${ex.doneMessage || 'lição fechada. Pode seguir para a próxima com tranquilidade.'}` : `— ${ex.openMessage || 'o que ficou em branco vira pauta da próxima aula.'}`}
      </div>

      {/* Confirmação: é ela que faz o check-off contar para fechar a lição.
          Vale com qualquer número de itens marcados — deixar em branco é uma
          resposta honesta, e é o que vira pauta da aula. */}
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {!confirmed ? (
          <button onClick={() => { setConfirmed(true); if (onChecked) onChecked(items.length ? done / items.length : 1); }}
            style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: accent, color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>
            Concluir auto-avaliação
          </button>
        ) : (
          <>
            <span style={{ fontSize: 14, fontWeight: 700, color: (c.okText || '#248A3D') }}>✓ Auto-avaliação registrada</span>
            <button onClick={() => setConfirmed(false)}
              style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${c.grayLight || '#E2E9E7'}`, background: c.card || '#fff', color: c.text || '#20302D', fontWeight: 700, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>
              Rever marcações
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ───────── 18. Diálogo com transcript e tradução ─────────
   Conversa curta em duas vozes: o aluno ouve, lê o transcript (sempre à mão,
   porque o público é básico), abre a tradução se precisar e só então responde
   às perguntas de compreensão — que são o que fecha o bloco. */
function Dialogue({ ex, c, onChecked, voiceType }) {
  const accent = c.accent || '#00B04F';
  const navy = c.navy || '#062E2B';
  const gray = c.gray || '#5F7570';
  const grayLight = c.grayLight || '#E2E9E7';
  const offWhite = c.offWhite || '#F5F8F7';
  const lines = ex.lines || [];
  const questions = ex.questions || [];
  const [showPt, setShowPt] = useState(false);
  const [pick, setPick] = useState({});
  const [checked, setChecked] = useState(false);
  const isRight = (i) => pick[i] === (questions[i].options || []).findIndex((o) => o.correct);
  const acc = questions.length ? questions.filter((_, i) => isRight(i)).length / questions.length : 1;

  /* Conversa inteira, linha a linha, cada fala na voz do seu personagem.
     Antes o botão lia o diálogo todo numa voz só, e as duas pessoas soavam
     como a mesma pessoa — que é justamente o que um diálogo não pode ser. */
  const [nowPlaying, setNowPlaying] = useState(null); // índice da fala no ar
  const audioRef = useRef(null);
  const playingRef = useRef(false);

  const stopConversation = () => {
    playingRef.current = false;
    setNowPlaying(null);
    const el = audioRef.current;
    if (el) { el.onended = null; try { el.pause(); } catch { /* ignore */ } }
  };

  const playFrom = (idx) => {
    if (idx >= lines.length) { stopConversation(); return; }
    const ln = lines[idx];
    const el = audioRef.current || new Audio();
    audioRef.current = el;
    setNowPlaying(idx);
    el.onended = () => { if (playingRef.current) playFrom(idx + 1); };
    el.onerror = () => { if (playingRef.current) playFrom(idx + 1); };
    el.playbackRate = ln.rate || ex.rate || 0.92;
    el.src = `/api/tts?voice=${encodeURIComponent(ln.voice || voiceType || 'us-female')}&text=${encodeURIComponent(String(ln.en).slice(0, 800))}`;
    el.play().catch(() => { if (playingRef.current) playFrom(idx + 1); });
  };

  const toggleConversation = () => {
    if (playingRef.current) { stopConversation(); return; }
    playingRef.current = true;
    playFrom(0);
  };

  useEffect(() => () => stopConversation(), []);

  return (
    <ExShell image={ex.image} imageCaption={ex.imageCaption} title={ex.title} c={c} badge={ex.badge || 'Diálogo'}>
      <Instruction c={c}>{ex.instruction || 'Ouça a conversa, leia junto e depois responda às perguntas.'}</Instruction>
      {ex.scene && (
        <p style={{ fontSize: 13.5, color: gray, margin: '0 0 12px', lineHeight: 1.55, fontStyle: 'italic' }}>{ex.scene}</p>
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <button type="button" onClick={toggleConversation}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 15px 7px 12px', borderRadius: 999, border: 'none', background: accent, color: '#fff', fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
          <span>{nowPlaying !== null ? '❚❚' : '▶'}</span>
          {nowPlaying !== null ? 'Parar' : 'Ouvir a conversa inteira'}
        </button>
        <button type="button" onClick={() => setShowPt((v) => !v)}
          style={{ padding: '6px 13px', borderRadius: 999, border: `1px solid ${grayLight}`, background: c.card || '#fff', color: c.ink || navy, fontWeight: 700, fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer' }}>
          {showPt ? 'Ocultar tradução' : '🇧🇷 Ver tradução'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: 8, marginBottom: 18 }}>
        {lines.map((ln, i) => {
          const mine = /^(you|voc[êe])/i.test(ln.who || '');
          return (
            <div key={i} style={{ padding: '11px 14px', borderRadius: 12, transition: 'box-shadow 0.2s, border-color 0.2s',
              background: mine ? c.accentLight || '#E4F7EC' : offWhite,
              border: `1px solid ${nowPlaying === i ? accent : mine ? accent : grayLight}`,
              boxShadow: nowPlaying === i ? `0 0 0 2px ${accent}44` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: mine ? (c.ink || navy) : gray }}>{ln.who}</span>
                <AudioPlayer text={ln.en} rate={ln.rate || 0.85} label="" small voiceType={ln.voice || voiceType} />
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: c.text || '#20302D' }}>{ln.en}</div>
              {showPt && ln.pt && (
                <div style={{ marginTop: 6, fontSize: 13.5, lineHeight: 1.55, color: gray, fontStyle: 'italic' }}>{ln.pt}</div>
              )}
            </div>
          );
        })}
      </div>

      {questions.length > 0 && (
        <>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: c.ink || navy, margin: '0 0 10px' }}>{ex.questionsLabel || 'Você entendeu?'}</p>
          <div style={{ display: 'grid', gap: 14 }}>
            {questions.map((q, i) => (
              <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: checked ? (isRight(i) ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5')) : '#fff', border: `1px solid ${checked ? (isRight(i) ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')) : grayLight}` }}>
                <p style={{ margin: '0 0 9px', fontSize: 14.5, fontWeight: 600, color: c.ink || navy, lineHeight: 1.5 }}>{q.q}</p>
                <div style={{ display: 'grid', gap: 7 }}>
                  {(q.options || []).map((o, oi) => {
                    const on = pick[i] === oi;
                    const state = checked ? (o.correct ? 'ok' : on ? 'bad' : null) : null;
                    return (
                      <button key={oi} type="button" onClick={() => !checked && setPick((p) => ({ ...p, [i]: oi }))} disabled={checked}
                        style={{ textAlign: 'left', padding: '9px 13px', borderRadius: 10, fontSize: 14.5, lineHeight: 1.5, fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer',
                          background: state === 'ok' ? (c.okBgStrong || '#C6F6D5') : state === 'bad' ? (c.badBgStrong || '#FED7D7') : on ? c.accentLight || '#E4F7EC' : '#fff',
                          border: `1.5px solid ${state === 'ok' ? (c.okBorder || '#9AE6B4') : state === 'bad' ? (c.badBorder || '#FEB2B2') : on ? accent : grayLight}`,
                          color: c.text || '#20302D' }}>{o.text}</button>
                    );
                  })}
                </div>
                {checked && q.why && <div style={{ marginTop: 8, fontSize: 13.5, color: gray, lineHeight: 1.55 }}>{q.why}</div>}
              </div>
            ))}
          </div>
          <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(acc); }} onReset={() => setPick({})} canCheck={questions.every((_, i) => pick[i] !== undefined)} c={c} />
          {checked && <ResultLine ok={acc === 1} c={c} explanation={ex.explanation} corrections={questions.filter((_, i) => !isRight(i)).map((q) => (q.options || []).find((o) => o.correct)?.text).filter(Boolean)} />}
        </>
      )}
    </ExShell>
  );
}
