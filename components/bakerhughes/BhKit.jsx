'use client';

import { createContext, useContext, useState } from 'react';
import AudioPlayer from '../AudioPlayer';

/*
  Baker Hughes — peças de UI compartilhadas pelos formatos de exercício novos.
  Vive só dentro de components/bakerhughes: o BakerHughesLesson original segue
  com as suas próprias cópias, então nada do que já está no ar muda.
*/

/* Ligado por curso, não por exercício.

   O `BhExercise` publica aqui o exercício da vez e se o curso pede áudio em
   tudo; o `ExShell` lê e decide se mostra o botão. Assim os dezessete pontos
   que montam um bloco continuam com a mesma chamada de sempre — nenhum
   material existente muda de comportamento. */
export const BlockAudio = createContext(null);

export function ExShell({ title, c, badge, children, image, imageCaption, audioText, voiceType }) {
  const bloco = useContext(BlockAudio);
  // A prop explícita manda; sem ela, o contexto decide. Curso sem a chave
  // `audio.everywhere` no tema não recebe contexto e o botão nunca aparece.
  const fala = audioText || (bloco?.on ? englishOf(bloco.ex) : '');
  const voz = voiceType || bloco?.voiceType;
  return (
    <div style={{ background: c.card || '#fff', border: `1px solid ${c.grayLight || '#E2E9E7'}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
      {/* Imagem opcional do exercício (`ex.image`). Aditivo: exercício sem o
          campo continua exatamente como antes. */}
      {image && (
        <figure style={{ margin: '-20px -20px 16px', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
          <img src={image} alt={imageCaption || ''} style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 260, objectFit: 'cover' }} />
          {imageCaption && (
            <figcaption style={{ padding: '8px 20px 0', fontSize: 12.5, color: c.gray || '#5F7570', lineHeight: 1.5 }}>{imageCaption}</figcaption>
          )}
        </figure>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        {badge && (
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 999, background: c.accentLight || '#E4F7EC', color: c.ink || c.navy || '#062E2B' }}>{badge}</span>
        )}
        <h4 style={{ margin: 0, fontSize: 16, color: c.ink || c.navy || '#062E2B' }}>{title}</h4>
        {/* Botão de bloco: lê o inglês do exercício inteiro. Só aparece nos
            cursos que pedem áudio em tudo (`audio.everywhere` no tema) — sem a
            prop, o bloco fica exatamente como sempre foi. */}
        {fala && (
          <span style={{ marginLeft: 'auto' }}>
            <AudioPlayer text={fala} rate={0.92} label="Ouvir" small voiceType={voz} />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* Transcript de um áudio, sob demanda. Existe porque parte do público estuda
   sozinho e em nível básico: sem o texto, um áudio que não se entende vira
   parede. Aditivo — só aparece onde o JSON traz o texto. */
export function TranscriptToggle({ text, pt, c, hint }) {
  const [open, setOpen] = useState(false);
  const [showPt, setShowPt] = useState(false);
  if (!text) return null;
  const navy = c.navy || '#062E2B';
  const accent = c.accent || '#00B04F';
  const gray = c.gray || '#5F7570';
  const grayLight = c.grayLight || '#E2E9E7';
  return (
    <div style={{ marginTop: 8 }}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        style={{ padding: '5px 12px', borderRadius: 999, border: `1px solid ${grayLight}`, background: c.card || '#fff', color: c.ink || navy, fontWeight: 700, fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer' }}>
        {open ? 'ocultar transcript' : '📄 ver transcript'}
      </button>
      {open && (
        <div style={{ marginTop: 8, padding: '10px 13px', background: c.offWhite || '#F5F8F7', border: `1px solid ${grayLight}`, borderRadius: 10 }}>
          {hint && <div style={{ fontSize: 12, color: gray, marginBottom: 6 }}>{hint}</div>}
          <div style={{ fontSize: 14.5, lineHeight: 1.6, color: c.text || '#20302D' }}>{text}</div>
          {pt && (
            <>
              {showPt && <div style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.55, color: gray, fontStyle: 'italic' }}>{pt}</div>}
              <button type="button" onClick={() => setShowPt((v) => !v)}
                style={{ marginTop: 8, padding: 0, border: 'none', background: 'transparent', color: accent, fontWeight: 700, fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>
                {showPt ? 'ocultar tradução' : 'tradução'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* Todo o inglês de um exercício, em ordem de leitura.

   Serve ao botão "ouvir o bloco": o aluno escuta o enunciado e os itens sem
   precisar de um botão por linha, que deixaria uma lista de sete itens com
   sete botões. Cada tipo tem os seus campos, então a extração é explícita —
   um tipo que não esteja aqui simplesmente não ganha o botão, em vez de ler
   um objeto pela metade.

   Só o inglês entra. `why`, `explanation` e `instruction` são a explicação em
   português e ficam de fora: o que se pratica de ouvido é a língua-alvo. */
export function englishOf(ex) {
  if (!ex) return '';
  const juntar = (...partes) => partes.flat(Infinity).filter(Boolean).map((t) => stripTags(String(t)).trim()).filter(Boolean).join('. ');
  switch (ex.type) {
    case 'multiSelect':
      return juntar(ex.prompt, (ex.options || []).map((o) => o.text));
    case 'trueFalse':
      return juntar((ex.items || []).map((i) => i.text));
    case 'categorize':
      return juntar((ex.items || []).map((i) => i.text));
    case 'oddOneOut':
      return juntar((ex.groups || []).map((g) => (g.items || []).join(', ')));
    case 'orderList':
      return juntar(ex.items);
    case 'errorSpot':
      return juntar((ex.items || []).map((i) => i.sentence));
    case 'highlightPick':
      return juntar(ex.goal, ex.text);
    case 'dropdownGap':
      return juntar(ex.text);
    case 'serialChoice':
      return juntar((ex.items || []).map((i) => [i.prompt, (i.options || []).map((o) => o.text)]));
    case 'sentenceBuild':
      return juntar((ex.items || []).map((i) => i.answer));
    case 'readingTask':
      return juntar(ex.heading, ex.passage, (ex.questions || []).map((q) => q.prompt));
    case 'emailTriage':
      return juntar(ex.email?.subject, ex.email?.body, (ex.questions || []).map((q) => q.prompt));
    case 'swipeChoice':
      return juntar((ex.items || []).map((i) => [i.a, i.b]));
    case 'matching':
      return juntar((ex.pairs || []).map((p) => p.left));
    case 'wordBank':
      // A lacuna vira uma pausa curta em vez de "underline underline".
      return juntar((ex.items || []).map((i) => String(i.text || '').replace(/_{2,}/g, '…')));
    case 'checkOff':
      return juntar((ex.items || []).map((i) => i.en));
    case 'multipleChoice':
      return juntar(ex.prompt, (ex.options || []).map((o) => o.text));
    default:
      // dialogue, listenChoose, listenGap, flowChoice e readAloud já têm áudio
      // próprio, linha a linha — um botão de bloco só atrapalharia.
      return '';
  }
}

/* Tira marcação do texto antes de mandar para a síntese de voz: sem isto o
   leitor pronuncia "strong" no meio da frase. */
function stripTags(t) {
  return String(t).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
}

export function Instruction({ children, c }) {
  if (!children) return null;
  return <p style={{ fontSize: 14, color: c.gray || '#5F7570', margin: '0 0 12px', lineHeight: 1.55 }}>{children}</p>;
}

export function CheckRow({ checked, setChecked, onReset, canCheck, c, checkLabel }) {
  const accent = c.accent || '#00B04F';
  return (
    <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
      {!checked ? (
        <button onClick={() => setChecked(true)} disabled={!canCheck}
          style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: canCheck ? accent : (c.disabled || '#CBD5D2'), color: canCheck ? (c.onAccent || '#fff') : (c.disabledText || '#2D3748'), fontWeight: 700, fontSize: 14, cursor: canCheck ? 'pointer' : 'not-allowed' }}>
          {checkLabel || 'Corrigir'}
        </button>
      ) : (
        <button onClick={() => { setChecked(false); onReset && onReset(); }}
          style={{ padding: '10px 18px', borderRadius: 8, border: `1px solid ${c.grayLight || '#E2E9E7'}`, background: c.card || '#fff', color: c.text || '#20302D', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Tentar de novo
        </button>
      )}
    </div>
  );
}

export function ResultLine({ ok, c, explanation, corrections }) {
  return (
    <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: ok ? (c.okBg || '#F0FFF4') : (c.badBg || '#FFF5F5'), border: `1px solid ${ok ? (c.okBorder || '#9AE6B4') : (c.badBorder || '#FEB2B2')}`, color: ok ? (c.okText || '#22543D') : (c.badText || '#742A2A'), fontSize: 14, lineHeight: 1.55 }}>
      {ok ? `✓ ${explanation || 'Tudo certo!'}` : '✗ Quase — confira as respostas certas:'}
      {!ok && corrections?.length > 0 && (
        <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
          {corrections.map((t, i) => <li key={i} style={{ marginBottom: 3 }}>{t}</li>)}
        </ul>
      )}
      {!ok && explanation && <div style={{ marginTop: 8, opacity: 0.85 }}>{explanation}</div>}
    </div>
  );
}

export const norm = (s) => String(s ?? '').trim().toLowerCase().replace(/[.,!?;:"'“”]+/g, '').replace(/\s+/g, ' ');

/* Embaralho determinístico: mesma lição embaralha igual em todo carregamento,
   então a aluna não vê a resposta "pular de lugar" ao voltar na página. */
export function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = (seed || 1) >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Ordem embaralhada quando o curso pede.

   Motivo: o material foi escrito com a alternativa certa quase sempre em
   primeiro lugar, e o exercício vira clique automático — o aluno acerta sem
   ler. `seededShuffle` já resolvia isso em categorize, orderList e
   sentenceBuild; aqui a mesma ideia passa a valer para as escolhas.

   A semente vem do texto do próprio item, então a ordem é estável: recarregar
   a página não faz a resposta pular de lugar. Sem `on`, devolve o array
   original — nenhum curso que não pediu muda. */
export function maybeShuffle(arr, on, chave) {
  if (!on || !Array.isArray(arr) || arr.length < 2) return arr;
  return seededShuffle(arr, hashString(String(chave || '')) || 1);
}

export function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < String(s).length; i++) { h ^= String(s).charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
