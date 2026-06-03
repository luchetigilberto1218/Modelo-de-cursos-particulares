'use client';

import AudioPlayer from '../AudioPlayer';
import Icon from './RacionalIcon';

/**
 * GrammarDeepDive — bloco de gramática "deep dive" (aula TEORIA do Fábio, 1h30).
 *
 * Renderiza o objeto lesson.grammar: ponto, seções (forma/uso/stative), exemplos
 * com áudio, tabela de contraste lado a lado, signal words, erros típicos e fontes
 * (Oxford/Cambridge). Tudo aditivo — só aparece quando a aula tem `grammar`.
 */
export default function GrammarDeepDive({ grammar, voice = 'us-male', accent = '#102A71' }) {
  if (!grammar) return null;
  return (
    <div className="rc-gdd">
      <div className="rc-gdd-tag" style={{ color: accent }}>
        <Icon name="book" size={15} /> Gramática em profundidade · {grammar.point}
      </div>
      {grammar.lead && <p className="rc-gdd-lead" dangerouslySetInnerHTML={{ __html: grammar.lead }} />}

      {/* Seções (forma / uso / stative) */}
      {(grammar.sections || []).map((s, i) => (
        <div key={i} className="rc-gdd-section">
          <h3 className="rc-gdd-h">{s.heading}</h3>
          {s.body && <p className="rc-gdd-body" dangerouslySetInnerHTML={{ __html: s.body }} />}
          {(s.examples || []).map((ex, j) => (
            <div key={j} className="rc-gdd-ex">
              <div className="rc-gdd-ex-body">
                <span className="rc-gdd-ex-en">{ex.en}</span>
                {ex.gloss && <span className="rc-gdd-ex-gloss">{ex.gloss}</span>}
              </div>
              <AudioPlayer text={ex.en} voiceType={voice} rate={0.88} label="" small />
            </div>
          ))}
        </div>
      ))}

      {/* Contraste lado a lado */}
      {grammar.contrast?.length > 0 && (
        <div className="rc-gdd-section">
          <h3 className="rc-gdd-h">Contraste lado a lado</h3>
          <div className="rc-gdd-contrast">
            <div className="rc-gdd-ccol rc-gdd-csimple"><span className="rc-gdd-clabel">Present Simple</span></div>
            <div className="rc-gdd-ccol rc-gdd-ccont"><span className="rc-gdd-clabel">Present Continuous</span></div>
            {grammar.contrast.map((c, i) => (
              <RowContrast key={i} c={c} voice={voice} />
            ))}
          </div>
        </div>
      )}

      {/* Signal words */}
      {grammar.signalWords && (
        <div className="rc-gdd-section">
          <h3 className="rc-gdd-h">Signal words — pistas de qual tempo usar</h3>
          <div className="rc-gdd-signals">
            <div className="rc-gdd-sigcol">
              <div className="rc-gdd-sighdr">Present Simple</div>
              <div className="rc-gdd-chips">{(grammar.signalWords.simple || []).map((w, i) => <span key={i} className="rc-gdd-chip">{w}</span>)}</div>
            </div>
            <div className="rc-gdd-sigcol">
              <div className="rc-gdd-sighdr">Present Continuous</div>
              <div className="rc-gdd-chips">{(grammar.signalWords.continuous || []).map((w, i) => <span key={i} className="rc-gdd-chip">{w}</span>)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Erros típicos */}
      {grammar.mistakes?.length > 0 && (
        <div className="rc-gdd-section">
          <h3 className="rc-gdd-h">Erros típicos (e a forma certa)</h3>
          {grammar.mistakes.map((m, i) => (
            <div key={i} className="rc-gdd-mistake">
              <div className="rc-gdd-wrong"><span className="rc-gdd-x">✗</span> {m.wrong}</div>
              <div className="rc-gdd-right"><span className="rc-gdd-ok">✓</span> {m.right}
                <AudioPlayer text={m.right} voiceType={voice} rate={0.88} label="" small />
              </div>
              {m.why && <div className="rc-gdd-why">{m.why}</div>}
            </div>
          ))}
        </div>
      )}

      {grammar.sources?.length > 0 && (
        <p className="rc-gdd-sources">Fontes: {grammar.sources.join(' · ')}</p>
      )}
    </div>
  );
}

function RowContrast({ c, voice }) {
  return (
    <>
      <div className="rc-gdd-ccell rc-gdd-csimple">
        <span>{c.simple}</span>
        <AudioPlayer text={c.simple} voiceType={voice} rate={0.88} label="" small />
      </div>
      <div className="rc-gdd-ccell rc-gdd-ccont">
        <span>{c.continuous}</span>
        <AudioPlayer text={c.continuous} voiceType={voice} rate={0.88} label="" small />
      </div>
      {c.note && <div className="rc-gdd-cnote">{c.note}</div>}
    </>
  );
}
