'use client';

import { useState } from 'react';
import AudioPlayer from '../AudioPlayer';
import SpeakingExercise from '../SpeakingExercise';
import Icon from './RacionalIcon';

/**
 * ClassroomActivities — atividades extras para o Fabrício (A1).
 *
 * Renderiza UMA atividade de lesson.activities. Quatro tipos:
 *   - picture  : Picture Discussion (Business) — foto corporativa real + perguntas (card guiado)
 *   - bingo    : Corporate Bingo / "Find someone who…" (card guiado, formas de pergunta)
 *   - email    : Email Detective — e-mail simples + perguntas checáveis (interativo)
 *   - problem  : Company Problem Solving — cenário + "We should…" checável (interativo)
 *
 * Aditivo: só aparece quando a aula tem `activities`. Não toca em Exercise.jsx
 * nem em nenhum outro curso.
 */
export default function ClassroomActivity({ activity, voice = 'us-female', level = 'starter', accent = '#102A71' }) {
  if (!activity) return null;
  let body = null;
  switch (activity.kind) {
    case 'picture': body = <Picture a={activity} accent={accent} />; break;
    case 'bingo': body = <Bingo a={activity} voice={voice} accent={accent} />; break;
    case 'email': body = <EmailDetective a={activity} accent={accent} />; break;
    case 'problem': body = <CompanyProblem a={activity} accent={accent} />; break;
    case 'pitch': body = <ElevatorPitch a={activity} voice={voice} accent={accent} />; break;
    case 'meeting': body = <SurvivalMeetings a={activity} voice={voice} accent={accent} />; break;
    default: return null;
  }
  return (
    <>
      {body}
      {activity.wrapUp && <WrapUp w={activity.wrapUp} voice={voice} level={level} accent={accent} />}
    </>
  );
}

/* ---------- Fechamento: explicar/resumir ao professor (produção oral) ---------- */
function WrapUp({ w, voice, level, accent }) {
  return (
    <div className="rc-act-wrap">
      <div className="rc-act-tag" style={{ color: accent }}><Icon name="mic" size={15} /> Explique ao professor</div>
      <p className="rc-act-instr">{w.prompt}</p>
      {w.model && (
        <>
          <div className="rc-readaloud">"{w.model}"</div>
          <div style={{ marginTop: 8 }}>
            <AudioPlayer text={w.model} voiceType={voice} rate={0.9} label="Ouvir modelo" small />
          </div>
        </>
      )}
      <SpeakingExercise mode="free" levelId={level} lang="en-US" />
      {w.teacherNote && <p className="rc-act-tnote">{w.teacherNote}</p>}
    </div>
  );
}

function Tag({ accent, icon, children }) {
  return (
    <div className="rc-act-tag" style={{ color: accent }}>
      <Icon name={icon} size={15} /> {children}
    </div>
  );
}

/* ---------- Picture Discussion (Business) — card guiado ---------- */
function Picture({ a, accent }) {
  return (
    <div className="rc-act">
      <Tag accent={accent} icon="spark">Picture Discussion</Tag>
      <div className="rc-act-photo">
        {/* foto corporativa real (Unsplash) */}
        <img src={a.image.url} alt={a.image.alt || 'corporate scene'} loading="lazy" />
      </div>
      <p className="rc-act-instr">{a.instruction || 'Olhe a imagem e responda em inglês, em voz alta, com o professor.'}</p>
      <ul className="rc-act-qs">
        {a.questions.map((q, i) => <li key={i}>{q}</li>)}
      </ul>
    </div>
  );
}

/* ---------- Corporate Bingo / Find someone who — card guiado ---------- */
function Bingo({ a, accent }) {
  return (
    <div className="rc-act">
      <Tag accent={accent} icon="check">Corporate Bingo · Find someone who…</Tag>
      <p className="rc-act-instr">{a.instruction || 'Circule e pergunte ao professor/colega. Faça a pergunta em inglês para cada linha.'}</p>
      <div className="rc-bingo">
        {a.items.map((it, i) => (
          <div key={i} className="rc-bingo-cell">
            <span className="rc-bingo-find">Find someone who…</span>
            <span className="rc-bingo-it">{it.find}</span>
            <span className="rc-bingo-ask">“{it.ask}”</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Email Detective — interativo ---------- */
function EmailDetective({ a, accent }) {
  return (
    <div className="rc-act">
      <Tag accent={accent} icon="book">Email Detective</Tag>
      <div className="rc-email">
        <div className="rc-email-meta">From: {a.email.from} &nbsp;·&nbsp; To: {a.email.to}</div>
        <pre className="rc-email-body">{a.email.body}</pre>
      </div>
      <p className="rc-act-instr">Leia o e-mail e responda:</p>
      <QuizList questions={a.questions} accent={accent} />
    </div>
  );
}

/* ---------- Company Problem Solving — interativo ---------- */
function CompanyProblem({ a, accent }) {
  return (
    <div className="rc-act">
      <Tag accent={accent} icon="target">Company Problem Solving</Tag>
      <div className="rc-box" style={{ borderLeftColor: accent, fontWeight: 600 }}>{a.scenario}</div>
      <p className="rc-act-instr" style={{ marginTop: 14 }}>Responda:</p>
      <QuizList questions={a.questions} accent={accent} />
      {a.suggestions?.length > 0 && (
        <div className="rc-act-help">
          <span className="rc-mini-label">Você pode usar:</span>
          <div className="rc-act-chips">{a.suggestions.map((s, i) => <span key={i} className="rc-act-chip">{s}</span>)}</div>
        </div>
      )}
    </div>
  );
}

/* ---------- Elevator Pitch Lite — construção guiada (Fernando) ---------- */
function ElevatorPitch({ a, voice, accent }) {
  return (
    <div className="rc-act">
      <Tag accent={accent} icon="spark">Elevator Pitch Lite</Tag>
      {a.intro && <p className="rc-act-instr">{a.intro}</p>}
      <div className="rc-pitch">
        {a.frame.map((f, i) => (
          <div key={i} className="rc-pitch-step">
            <span className="rc-pitch-n" style={{ background: accent }}>{i + 1}</span>
            <div className="rc-pitch-body">
              <span className="rc-pitch-label">{f.label}</span>
              {f.hint && <span className="rc-pitch-hint">{f.hint}</span>}
            </div>
          </div>
        ))}
      </div>
      {a.model && (
        <div className="rc-pitch-model">
          <span className="rc-mini-label" style={{ marginBottom: 4 }}>Modelo de pitch</span>
          <div className="rc-readaloud">"{a.model}"</div>
          <div style={{ marginTop: 8 }}><AudioPlayer text={a.model} voiceType={voice} rate={0.9} label="Ouvir modelo" small /></div>
        </div>
      )}
    </div>
  );
}

/* ---------- Survival Meetings — banco de expressões + prática (Fernando) ---------- */
function SurvivalMeetings({ a, voice, accent }) {
  return (
    <div className="rc-act">
      <Tag accent={accent} icon="check">Survival Meetings</Tag>
      {a.intro && <p className="rc-act-instr">{a.intro}</p>}
      <div className="rc-sm">
        {a.functions.map((fn, i) => (
          <div key={i} className="rc-sm-fn">
            <div className="rc-sm-fnlabel">{fn.label}</div>
            {fn.phrases.map((ph, j) => (
              <div key={j} className="rc-sm-phrase">
                <span>“{ph}”</span>
                <AudioPlayer text={ph} voiceType={voice} rate={0.9} label="" small />
              </div>
            ))}
          </div>
        ))}
      </div>
      {a.task && <div className="rc-box" style={{ borderLeftColor: accent, marginTop: 12 }}>{a.task}</div>}
    </div>
  );
}

/* ---------- Mini-quiz checável (Email / Problem) ---------- */
function QuizList({ questions, accent }) {
  return (
    <div className="rc-quiz">
      {questions.map((q, i) => <QuizQ key={i} q={q} accent={accent} />)}
    </div>
  );
}

function QuizQ({ q, accent }) {
  const [picked, setPicked] = useState(null);
  return (
    <div className="rc-quiz-q">
      <div className="rc-quiz-prompt">{q.q}</div>
      <div className="rc-quiz-opts">
        {q.options.map((o, i) => {
          const isPicked = picked === i;
          const show = picked !== null;
          const cls = show && o.correct ? 'correct' : isPicked && !o.correct ? 'wrong' : '';
          return (
            <button
              key={i}
              className={`rc-quiz-opt ${cls}`}
              style={show && o.correct ? { borderColor: '#1E7A46' } : null}
              onClick={() => setPicked(i)}
              disabled={show}
            >
              {o.text}
              {show && o.correct && <span className="rc-quiz-mark">✓</span>}
              {isPicked && !o.correct && <span className="rc-quiz-mark">✗</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
