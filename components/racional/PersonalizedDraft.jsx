'use client';

import { useState } from 'react';
import AudioPlayer from '../AudioPlayer';
import Icon from './RacionalIcon';

/**
 * PersonalizedDraft — exercício "[tema] na Racional".
 *
 * O aluno recebe um texto-modelo, em inglês simples, já com o nome dele, sobre
 * o ponto do overview. Ele preenche ~5 lacunas com palavras e números do dia
 * a dia real (clientes, metas, indicadores). O resultado fica parecido com a
 * rotina dele — como se tivesse escrito.
 *
 * Dois tipos de lacuna (data-driven, vindo do JSON da aula):
 *   - { type:'free', placeholder }        → dado pessoal (número/cliente real), aceita qualquer coisa.
 *   - { type:'word', answer, placeholder } → palavra esperada; se errar, dica = 1ª letra + nº de letras.
 *
 * Ao completar, libera o Play: o texto final montado é lido por TTS (Web Speech).
 * Totalmente aditivo: só renderiza quando a aula tem `personalized` no JSON.
 *
 * data = {
 *   title?: string,          // se ausente, monta "<topic> na Racional"
 *   topic?: string,
 *   intro?: string,          // orientação em PT
 *   segments: Array<string | { type:'free'|'word', answer?, placeholder? }>
 * }
 */
function norm(s) {
  return (s || '').toString().trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export default function PersonalizedDraft({ data, studentName = '', voice = 'us-male', accent = '#102a71' }) {
  const blanks = data.segments
    .map((s, i) => (typeof s === 'object' ? { ...s, i } : null))
    .filter(Boolean);

  const [vals, setVals] = useState(() => Object.fromEntries(blanks.map((b) => [b.i, ''])));
  const [checked, setChecked] = useState(false);

  function setVal(i, v) {
    setVals((p) => ({ ...p, [i]: v }));
    setChecked(false);
  }

  // Estado de cada lacuna após "checar".
  function stateOf(b) {
    const v = vals[b.i] || '';
    if (!v.trim()) return 'empty';
    if (b.type === 'free') return 'ok';
    return norm(v) === norm(b.answer) ? 'ok' : 'wrong';
  }

  const states = blanks.map(stateOf);
  const allFilled = states.every((s) => s !== 'empty');
  const allOk = states.every((s) => s === 'ok');
  const complete = checked && allOk;

  function check() { setChecked(true); }

  // Texto final montado (para o TTS e para o "preview").
  const finalText = data.segments
    .map((s, idx) => (typeof s === 'string' ? s : (vals[idx] || '____')))
    .join('');

  const title = data.title || `${data.topic || 'Este tema'} na Racional`;

  return (
    <div className="rc-pdraft">
      <div className="rc-pdraft-head" style={{ borderLeftColor: accent }}>
        <div className="rc-pdraft-tag" style={{ color: accent }}>
          <Icon name="spark" size={14} /> Exercício personalizado
        </div>
        <div className="rc-pdraft-title">{title}</div>
        {data.intro && <p className="rc-pdraft-intro">{data.intro}</p>}
      </div>

      {/* Texto-modelo com lacunas inline */}
      <div className="rc-pdraft-text">
        {data.segments.map((seg, idx) => {
          if (typeof seg === 'string') return <span key={idx}>{seg}</span>;
          const st = checked ? stateOf({ ...seg, i: idx }) : (vals[idx]?.trim() ? 'filled' : 'empty');
          const cls =
            st === 'ok' ? 'rc-pblank ok' :
            st === 'wrong' ? 'rc-pblank wrong' :
            'rc-pblank';
          return (
            <span key={idx} className="rc-pblank-wrap">
              <input
                className={cls}
                value={vals[idx] || ''}
                placeholder={seg.placeholder || (seg.type === 'free' ? 'seu dado…' : '…')}
                style={st === 'ok' ? { borderColor: '#1E7A46' } : null}
                onChange={(e) => setVal(idx, e.target.value)}
                size={Math.max((seg.placeholder || '').length, 8)}
                aria-label="lacuna"
              />
              {checked && st === 'wrong' && seg.type === 'word' && (
                <span className="rc-pblank-hint">
                  dica: {seg.answer[0].toUpperCase()} · {seg.answer.length} letras
                </span>
              )}
            </span>
          );
        })}
      </div>

      <div className="rc-pdraft-actions">
        <button
          className="rc-btn rc-btn-primary"
          style={{ background: accent }}
          onClick={check}
          disabled={!allFilled}
        >
          {allFilled ? 'Checar' : 'Preencha as lacunas'}
        </button>
        {complete && (
          <span className="rc-pdraft-ok"><Icon name="check" size={14} /> Pronto! Esse é o seu texto.</span>
        )}
      </div>

      {/* Play liberado só quando tudo certo */}
      {complete && (
        <div className="rc-pdraft-play">
          <p className="rc-mini-label" style={{ marginBottom: 6 }}>Ouça o seu próprio texto em inglês:</p>
          <div className="rc-readaloud">"{finalText}"</div>
          <div style={{ marginTop: 10 }}>
            <AudioPlayer text={finalText} voiceType={voice} rate={0.92} label="Ouvir meu texto" />
          </div>
        </div>
      )}
    </div>
  );
}
