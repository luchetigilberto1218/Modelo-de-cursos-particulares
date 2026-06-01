'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RacionalTopBar, RacionalFooter } from './RacionalChrome';
import Exercise from '../Exercise';
import Icon from './RacionalIcon';

export default function RacionalQuiz({ meta, mod, modName, quiz }) {
  const exercises = quiz.exercises || [];
  const [results, setResults] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const level = meta.family === 'teoria-pratica' || meta.family === 'interpessoal' ? 'starter' : 'fluency';
  const T = (pt, en) => (level === 'starter' ? pt : en);

  const answeredCount = Object.values(results).filter((r) => r?.answered).length;
  const correctCount = Object.values(results).filter((r) => r?.correct).length;
  const total = exercises.length;
  const pct = total ? Math.round((correctCount / total) * 100) : 0;
  // Tom sempre positivo e que agrega — sem aprovação/reprovação.
  const msg = pct >= 85
    ? T('Mandou muito! Vocabulário consolidado.', 'Nailed it! Vocabulary consolidated.')
    : pct >= 60
      ? T('Muito bom! Você já domina a maior parte — e cada questão te agregou.', 'Great! You already own most of it — and every question added something.')
      : T('Boa! Você se testou e ganhou vocabulário novo. Siga em frente e volte quando quiser.', 'Nice! You tested yourself and picked up new vocabulary. Keep going and come back anytime.');

  return (
    <>
      <RacionalTopBar showHome />
      <section className="rc-dash-hero" style={{ background: `linear-gradient(135deg, ${meta.accent} 0%, #1C2230 120%)`, padding: '44px 0 38px' }}>
        <div className="rc-dash-hero-bg" style={{ backgroundImage: `url(${meta.hero})` }} />
        <div className="rc-dash-hero-inner rc-wrap-narrow">
          <Link href={`/racional/${meta.id}`} className="rc-back">← {meta.studentName}</Link>
          <div className="rc-dash-role">{mod} · Teste-se</div>
          <h1>{quiz.title}</h1>
        </div>
      </section>

      <div className="rc-wrap-narrow" style={{ padding: '30px 24px 10px' }}>
        <div className="rc-quiz-invite"><Icon name="spark" size={16} /> {T('Um convite para você se testar — rápido, sem nota e sem pegadinha. Cada questão é só pra agregar.', 'An invitation to test yourself — quick, no grades, no tricks. Every question is just to add value.')}</div>
        {quiz.intro && <div className="rc-box" style={{ borderLeftColor: meta.accent, marginBottom: 22 }}>{quiz.intro}</div>}

        {submitted && (
          <div className="rc-quiz-result" style={{ background: '#F0FBF4', borderColor: '#A7D7BC' }}>
            <div className="rc-quiz-score" style={{ color: '#1B5E36' }}>{pct}%</div>
            <div className="rc-quiz-msg">
              {msg}
              <div className="rc-mini-label" style={{ marginTop: 6 }}>{correctCount}/{total} {T('em cheio · o resto fica de revisão tranquila', 'spot on · the rest is easy review')}</div>
            </div>
            <button className="rc-btn rc-btn-outline" onClick={() => { setSubmitted(false); setResults({}); if (typeof window !== 'undefined') window.scrollTo({ top: 0 }); }}>{T('Testar de novo', 'Test again')}</button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {exercises.map((ex, i) => (
            <div key={i} style={submitted ? { outline: `2px solid ${results[i]?.correct ? '#1E7A46' : '#BFD3E6'}`, outlineOffset: -2, borderRadius: 12 } : null}>
              <Exercise exercise={ex} levelId={level} quizMode onResult={(r) => setResults((s) => ({ ...s, [i]: r }))} />
            </div>
          ))}
        </div>

        <div className="rc-stepnav" style={{ paddingTop: 8 }}>
          <Link className="rc-btn rc-btn-outline" href={`/racional/${meta.id}`}>{T('Voltar ao programa', 'Back to programme')}</Link>
          {!submitted ? (
            <button className="rc-btn rc-btn-primary" style={{ background: meta.accent }}
              onClick={() => { setSubmitted(true); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={answeredCount < total}>
              {answeredCount < total ? `${answeredCount}/${total} ${T('respondidas', 'answered')}` : T('Ver meu resultado', 'See my result')}
            </button>
          ) : (
            <span className="rc-quiz-final" style={{ color: '#1E7A46' }}>{pct}% · {correctCount}/{total}</span>
          )}
        </div>
      </div>
      <RacionalFooter />
    </>
  );
}
