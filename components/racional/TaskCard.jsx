'use client';

import { useState } from 'react';
import AudioPlayer from '../AudioPlayer';
import { useTeacher } from './access';

/* ---------- Tarefa guiada (lesson.taskCard) ----------
   Feita para ir na tela durante a aula ao vivo: o aluno vê cenário, perguntas,
   frases de início e critério de sucesso; as falas do outro lado aparecem uma
   por vez (o professor só lê, não interpreta personagem). A faixa "Para o
   professor" só aparece no modo professor. */
export default function TaskCard({ card, studentName, voice, accent }) {
  const teacher = useTeacher();
  const first = (studentName || 'o aluno').split(' ')[0];
  const lines = card.replies?.lines || [];
  const [shown, setShown] = useState(0);
  const [ticks, setTicks] = useState({});
  const [model, setModel] = useState(null);
  const sc = card.scenario || {};

  return (
    <div className="rc-tc">
      {teacher && card.teacher && <TeacherStrip t={card.teacher} first={first} minutes={card.minutes} />}

      <section className="rc-tc-sec">
        <div className="rc-tc-h"><span>1</span> Read the scenario <em>· Leia o cenário</em></div>
        {sc.text && <p className="rc-tc-text">{sc.text}</p>}
        {sc.people?.length > 0 && (
          <div className="rc-tc-people">
            {sc.people.map((p, i) => (
              <div key={i} className="rc-tc-person" style={{ borderTopColor: accent }}>
                <div className="rc-tc-who"><b>{p.name}</b> · {p.role}</div>
                <div className="rc-tc-says">“{p.says}”</div>
              </div>
            ))}
          </div>
        )}
        {sc.table && (
          <div className="rc-tc-tablewrap">
            {sc.table.caption && <div className="rc-tc-caption">{sc.table.caption}</div>}
            <table className="rc-tc-table">
              <thead><tr>{sc.table.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
              <tbody>{sc.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        )}
        <p className="rc-tc-fict">Fictional names and numbers, for practice.</p>
      </section>

      {card.task && (
        <section className="rc-tc-sec">
          <div className="rc-tc-h"><span>2</span> Your task <em>· Sua tarefa</em></div>
          <div className="rc-tc-task" style={{ borderLeftColor: accent }}>{card.task}</div>
        </section>
      )}

      {card.questions?.length > 0 && (
        <section className="rc-tc-sec">
          <div className="rc-tc-h"><span>3</span> Questions to answer <em>· Responda</em></div>
          <ol className="rc-tc-q">{card.questions.map((q, i) => <li key={i}>{q}</li>)}</ol>
        </section>
      )}

      {card.starters?.length > 0 && (
        <section className="rc-tc-sec">
          <div className="rc-tc-h"><span>4</span> You can start with… <em>· Frases para começar</em></div>
          <div className="rc-tc-starters">{card.starters.map((s, i) => <span key={i}>{s}</span>)}</div>
        </section>
      )}

      {lines.length > 0 && (
        <section className="rc-tc-sec">
          <div className="rc-tc-h"><span>5</span> {card.replies.from || 'They answer you'} <em>· Responda a cada fala</em></div>
          <div className="rc-tc-replies">
            {lines.slice(0, shown).map((l, i) => (
              <div key={i} className="rc-tc-reply">
                <div className="rc-tc-reply-who">{l.who}</div>
                <div className="rc-tc-reply-row">
                  <span>“{l.text}”</span>
                  <AudioPlayer text={l.text} voiceType={voice} rate={0.9} label="" small />
                </div>
              </div>
            ))}
          </div>
          <div className="rc-tc-actions">
            {shown < lines.length ? (
              <button type="button" className="rc-btn rc-btn-primary" style={{ background: accent }} onClick={() => setShown(shown + 1)}>
                {shown === 0 ? 'Show the first line' : 'Next line'} → <small>({shown}/{lines.length})</small>
              </button>
            ) : (
              <span className="rc-tc-done">All {lines.length} lines done.</span>
            )}
            {shown > 0 && <button type="button" className="rc-tc-link" onClick={() => setShown(0)}>Start again</button>}
          </div>
        </section>
      )}

      {card.success?.length > 0 && (
        <section className="rc-tc-sec">
          <div className="rc-tc-h"><span>6</span> Success check <em>· Deu certo se…</em></div>
          <div className="rc-tc-success">
            {card.success.map((s, i) => (
              <label key={i} className={ticks[i] ? 'on' : ''}>
                <input type="checkbox" checked={!!ticks[i]} onChange={() => setTicks({ ...ticks, [i]: !ticks[i] })} />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      {card.model && (
        <section className="rc-tc-sec">
          <div className="rc-tc-h"><span>7</span> Model answer <em>· Resposta-modelo (abra no fim)</em></div>
          <div className="rc-tc-actions">
            <button type="button" className={`rc-tc-tab ${model === 'basic' ? 'on' : ''}`} onClick={() => setModel(model === 'basic' ? null : 'basic')}>Good</button>
            <button type="button" className={`rc-tc-tab ${model === 'better' ? 'on' : ''}`} onClick={() => setModel(model === 'better' ? null : 'better')}>Better</button>
          </div>
          {model && (
            <div className="rc-tc-model">
              <p>{card.model[model]}</p>
              <AudioPlayer text={card.model[model]} voiceType={voice} rate={0.9} label="Listen" small />
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function TeacherStrip({ t, first, minutes }) {
  const steps = [
    `Mostre esta tela e peça que ${first} leia o cenário e a tabela em silêncio (2 min). Tire as dúvidas de vocabulário.`,
    `Faça as perguntas do item 3, uma por vez. ${first} responde apoiado nas frases do item 4. Não corrija durante a fala: anote.`,
    `No item 5, clique em “Next line” e leia a fala em voz alta, do jeito que está escrita. Você não precisa interpretar personagem: só leia. ${first} responde a cada fala.`,
    `Feche com o item 6 (marquem juntos o que foi cumprido). Mostre 2 ou 3 frases de ${first} já corrigidas, abra a resposta-modelo e peça que diga a versão “Better” em voz alta.`,
  ];
  return (
    <details className="rc-tc-teacher" open>
      <summary><span className="rc-teacher-tag">PROFESSOR</span> Como conduzir esta tarefa{minutes ? ` · ${minutes} min` : ''}</summary>
      <div className="rc-tc-teacher-body">
        {t.background && (<><div className="rc-tc-th">Contexto técnico (para você)</div><p>{t.background}</p></>)}
        <div className="rc-tc-th">Passo a passo</div>
        <ol>{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        {t.watch?.length > 0 && (<><div className="rc-tc-th">Erros comuns: preste atenção</div><ul>{t.watch.map((w, i) => <li key={i}>{w}</li>)}</ul></>)}
      </div>
    </details>
  );
}
