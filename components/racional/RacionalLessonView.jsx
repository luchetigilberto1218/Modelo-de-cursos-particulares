'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RacionalTopBar, RacionalFooter } from './RacionalChrome';
import AudioPlayer from '../AudioPlayer';
import Exercise from '../Exercise';
import SpeakingExercise from '../SpeakingExercise';
import { useLessonProgress } from './progress';
import { useTeacher } from './access';
import Icon from './RacionalIcon';
import OverviewLookup from './OverviewLookup';
import PersonalizedDraft from './PersonalizedDraft';
import GrammarDeepDive from './GrammarDeepDive';
import PracticeStudio from './PracticeStudio';
import ClassroomActivity from './ClassroomActivities';

function pad(n) { return String(n).padStart(3, '0'); }

// Voz por aluno/universo (rotação leve só para variar timbre).
const VOICE_BY_STUDENT = {
  cassio: 'us-male', fabio: 'us-male', fabricio: 'us-female',
  fernando: 'gb-male', josemario: 'us-female', julio: 'gb-female',
};

export default function RacionalLessonView({ course, lesson, prevNum = null, nextNum = null }) {
  const { meta, typeMeta } = course;
  const accent = meta.accent;
  const voice = VOICE_BY_STUDENT[course.id] || 'us-male';
  // Todos os alunos recebem PT nas instruções/orientações (níveis Essential 1–4).
  const level = lesson.level || 'starter';
  const T = (pt, en) => (level === 'starter' ? pt : en);
  const tColor = typeMeta[lesson.type]?.color || accent;
  const teacher = useTeacher();

  const mod = course.modules.find((m) => m.code === lesson.mod);
  const { done: lessonDone } = useLessonProgress(course.id, lesson.num, lesson.takeaways?.length || 0);

  // ---------- monta as TELAS dinamicamente ----------
  const screens = [];

  if (lesson.rich) {
    // Tela: Overview do tópico (panorama de abertura, sem áudio)
    if (lesson.overview) {
      screens.push({
        kicker: T('Sobre o tema', 'About the topic'),
        title: lesson.title,
        render: () => (
          <>
            <div className="rc-prose" dangerouslySetInnerHTML={{ __html: lesson.overview }} />
            {/* Campo educativo de dúvida de vocabulário — em todos os overviews */}
            <OverviewLookup accent={accent} />
          </>
        ),
      });
    }

    // Tela: Exercício personalizado "[tema] na Racional" (quando a aula tem `personalized`)
    if (lesson.personalized) {
      screens.push({
        kicker: T('Exercício personalizado', 'Personalized exercise'),
        title: lesson.personalized.title || `${lesson.personalized.topic || lesson.title} na Racional`,
        render: () => (
          <PersonalizedDraft
            data={lesson.personalized}
            studentName={meta.studentName}
            voice={voice}
            accent={accent}
          />
        ),
      });
    }

    // Aula de PRÁTICA (formato exclusivo): só produção, sem telas de ensino.
    const isPractice = lesson.format === 'practice';

    // Tela: Gramática em profundidade (aula TEORIA com deep dive)
    if (lesson.grammar) {
      screens.push({
        kicker: T('Gramática', 'Grammar'),
        title: lesson.grammar.point || T('Gramática em profundidade', 'Grammar deep dive'),
        render: () => <GrammarDeepDive grammar={lesson.grammar} voice={voice} accent={accent} />,
      });
    }

    // Tela: Estúdio de prática (aula PRÁTICA) — substitui as telas de ensino
    if (lesson.practice) {
      screens.push({
        kicker: T('Prática', 'Practice'),
        title: T('Estúdio de prática', 'Practice studio'),
        render: () => <PracticeStudio practice={lesson.practice} voice={voice} level={level} accent={accent} />,
      });
    }

    // Tela: Objetivo + Introdução
    if (!isPractice) screens.push({
      kicker: T('Objetivo da aula', 'Lesson objective'),
      title: T('O que você vai dominar', 'What you will master'),
      render: () => (
        <>
          {lesson.objective && (
            <div className="rc-box" style={{ borderLeftColor: accent }}>{lesson.objective}</div>
          )}
          {lesson.intro && (
            <>
              <div style={{ marginTop: 18 }} dangerouslySetInnerHTML={{ __html: lesson.intro }} className="rc-prose" />
              <div style={{ marginTop: 12 }}>
                <AudioPlayer text={stripTags(lesson.intro)} voiceType={voice} rate={0.95} label={T('Ouvir introdução', 'Listen to intro')} />
              </div>
            </>
          )}
        </>
      ),
    });

    // Tela: Vocabulário
    if (!isPractice && lesson.vocab?.length) {
      screens.push({
        kicker: T(`Vocabulário · ${lesson.vocab.length} palavras`, `Vocabulary · ${lesson.vocab.length} words`),
        title: T('Palavras-chave da aula', 'Key words for this lesson'),
        render: () => (
          <>
            <p className="rc-mini-label">{T('Veja a palavra, a tradução e o exemplo. Toque para ouvir.', 'See the word, the translation and the example. Tap to listen.')}</p>
            <div className="rc-vocab-grid">
              {lesson.vocab.map((v, i) => (
                <div key={i} className="rc-vocab">
                  <div className="rc-vocab-body">
                    <div><span className="rc-vocab-en">{v.en}</span> <span className="rc-vocab-pt">— {v.pt}</span></div>
                    {v.example && <div className="rc-vocab-ex"><em>ex.</em>{v.example}</div>}
                  </div>
                  <AudioPlayer text={v.example ? `${v.en}. ${v.example}` : v.en} voiceType={voice} rate={0.85} label="" small />
                </div>
              ))}
            </div>
          </>
        ),
      });
    }

    // Tela: Contexto
    if (!isPractice && (lesson.situation || lesson.context)) {
      screens.push({
        kicker: T('Contexto', 'Context'),
        title: T('A cena real', 'The real scene'),
        render: () => (
          <>
            {lesson.situation && <div className="rc-box italic" style={{ borderLeftColor: accent }}>{lesson.situation}</div>}
            {lesson.context && (
              <>
                <p className="rc-mini-label" style={{ marginTop: 16 }}>{T('Leia em voz alta', 'Read aloud')}</p>
                <div className="rc-readaloud">"{lesson.context}"</div>
                <div style={{ marginTop: 10 }}>
                  <AudioPlayer text={lesson.context} voiceType={voice} rate={0.9} label={T('Ouvir', 'Listen')} small />
                </div>
                <SpeakingExercise mode="read" targetText={lesson.context} levelId={level} lang="en-US" />
              </>
            )}
          </>
        ),
      });
    }

    // Telas: um exercício por tela
    if (!isPractice) (lesson.exercises || []).forEach((ex, i) => {
      screens.push({
        kicker: T(`Exercício ${i + 1} de ${lesson.exercises.length}`, `Exercise ${i + 1} of ${lesson.exercises.length}`),
        title: T('Pratique', 'Practice'),
        render: () => <Exercise exercise={ex} levelId={level} />,
      });
    });

    // Telas: atividades extras (Fabrício) — uma por tela
    if (lesson.activities?.length) {
      const ACT_LABEL = {
        picture: T('Picture Discussion', 'Picture Discussion'),
        bingo: T('Corporate Bingo', 'Corporate Bingo'),
        email: T('Email Detective', 'Email Detective'),
        problem: T('Resolução de problema', 'Problem solving'),
      };
      lesson.activities.forEach((act, i) => {
        screens.push({
          kicker: T(`Atividade ${i + 1} de ${lesson.activities.length}`, `Activity ${i + 1} of ${lesson.activities.length}`),
          title: ACT_LABEL[act.kind] || T('Atividade', 'Activity'),
          render: () => <ClassroomActivity activity={act} voice={voice} level={level} accent={accent} />,
        });
      });
    }

    // Tela: Think about it (pergunta crítica, fala livre)
    if (!isPractice && lesson.critical) {
      screens.push({
        kicker: T('Pense nisso', 'Think about it'),
        title: T('Responda em inglês', 'Answer in English'),
        render: () => (
          <>
            <div className="rc-box" style={{ borderLeftColor: accent, fontStyle: 'italic' }}>{lesson.critical}</div>
            <div style={{
              marginTop: 12, fontSize: 13.5, color: '#1B4D7A', background: '#EAF2FB',
              border: '1px solid #BBD6F2', borderRadius: 8, padding: '10px 12px', lineHeight: 1.55,
            }}>
              🎙️ <strong>{T('Exercício de fala livre.', 'Free speaking exercise.')}</strong> {T(
                'A ideia é praticar falar em inglês como se estivesse numa reunião real — não há resposta certa. Toque no microfone e responda como vier (pode apoiar no português no que travar). Ao terminar, ouça a sua gravação: ouvir-se aumenta a consciência da sua produção oral e a fluência.',
                'The point is to practise speaking English as if in a real meeting — there is no right answer. Tap the mic and answer however it comes (lean on Portuguese where you get stuck). When you finish, listen to your recording: hearing yourself builds awareness of your spoken English and fluency.'
              )}
            </div>
            <div style={{ marginTop: 8 }}>
              <AudioPlayer text={lesson.critical} voiceType={voice} rate={0.95} label={T('Ouvir', 'Listen')} small />
            </div>
            <SpeakingExercise mode="free" levelId={level} lang="en-US" />
          </>
        ),
      });
    }

    // Tela extra: pílula de sotaque (EXTRA leve)
    if (lesson.pill) {
      screens.push({
        kicker: T('Extra · Sotaques', 'Extra · Accents'),
        title: T('Pílula de sotaque', 'Accent pill'),
        render: () => <AccentPill pill={lesson.pill} voice={voice} T={T} />,
      });
    }

    // Tela final: Recap
    if (lesson.takeaways?.length) {
      screens.push({
        kicker: T('Recapitulando', 'Recap'),
        title: T('O que eu aprendi nessa lição', 'What I learned in this lesson'),
        isRecap: true,
        render: () => (
          <RecapChecklist studentId={course.id} num={lesson.num} takeaways={lesson.takeaways} voice={voice} T={T} accent={accent} />
        ),
      });
    }
  }

  return (
    <>
      <RacionalTopBar showHome />

      {/* HERO da aula */}
      <section className="rc-lesson-hero" style={{ background: `linear-gradient(135deg, ${accent} 0%, #1C2230 120%)` }}>
        <div className="rc-lesson-hero-bg" style={{ backgroundImage: `url(${meta.hero})` }} />
        <div className="rc-lesson-hero-inner rc-wrap-narrow">
          <Link href={`/racional/${course.id}`} className="rc-back">← {meta.studentName}</Link>
          <div className="rc-lesson-label">{mod?.code} · {mod?.name} · {T('Aula', 'Lesson')} {pad(lesson.num)}</div>
          <h1>{lesson.title}</h1>
          <span className="rc-chip" style={{ background: 'rgba(255,255,255,0.14)' }}>
            <i style={{ width: 9, height: 9, borderRadius: '50%', background: tColor, display: 'inline-block' }} />
            {typeMeta[lesson.type]?.label || lesson.type}
          </span>
          {lessonDone && (
            <span className="rc-chip" style={{ background: '#1E7A46', marginLeft: 8 }}>✓ {T('Concluída', 'Completed')}</span>
          )}
        </div>
      </section>

      {teacher && lesson.teacher && (
        <div className="rc-wrap-narrow" style={{ paddingTop: 20 }}>
          <TeacherGuide guide={lesson.teacher} lesson={lesson} />
        </div>
      )}

      {lesson.rich && screens.length > 0 ? (
        <StepFlow screens={screens} courseId={course.id} prevNum={prevNum} nextNum={nextNum} T={T} accent={accent} />
      ) : (
        <NotYet course={course} lesson={lesson} mod={mod} prevNum={prevNum} nextNum={nextNum} T={T} voice={voice} />
      )}

      <RacionalFooter />
    </>
  );
}

/* ---------- Fluxo por telas (estilo FAAP) ---------- */
function StepFlow({ screens, courseId, prevNum, nextNum, T, accent }) {
  const [step, setStep] = useState(0);
  const last = screens.length - 1;
  const s = screens[step];
  const pct = Math.round(((step + 1) / screens.length) * 100);

  function go(n) {
    setStep(n);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <div className="rc-progress"><div className="rc-progress-fill" style={{ width: `${pct}%`, background: accent }} /></div>

      <div className="rc-step">
        <div className="rc-step-kicker" style={{ color: accent }}>{s.kicker}</div>
        <h2>{s.title}</h2>
        {s.render()}
      </div>

      <div className="rc-stepnav">
        <button className="rc-btn rc-btn-outline" onClick={() => go(step - 1)} disabled={step === 0}>← {T('Voltar', 'Back')}</button>
        <div className="rc-stepdots">
          {screens.map((_, i) => (
            <button key={i} className={`rc-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} onClick={() => go(i)} aria-label={`Tela ${i + 1}`} />
          ))}
        </div>
        {step < last ? (
          <button className="rc-btn rc-btn-primary" style={{ background: accent }} onClick={() => go(step + 1)}>{T('Continuar', 'Continue')} →</button>
        ) : nextNum ? (
          <Link className="rc-btn rc-btn-primary" style={{ background: accent }} href={`/racional/${courseId}/lesson/${nextNum}`}>{T('Próxima aula', 'Next lesson')} →</Link>
        ) : (
          <Link className="rc-btn rc-btn-primary" style={{ background: accent }} href={`/racional/${courseId}`}>{T('Concluir', 'Finish')} ✓</Link>
        )}
      </div>
    </>
  );
}

/* ---------- Aula ainda sem conteúdo rico ---------- */
function NotYet({ course, lesson, mod, prevNum, nextNum, T, voice }) {
  return (
    <>
      <div className="rc-step">
        <div className="rc-step-kicker">{mod?.code} · {mod?.name}</div>
        <h2>{lesson.title}</h2>
        {mod?.objective && (
          <>
            <p className="rc-mini-label">{T('Objetivo do módulo', 'Module objective')}</p>
            <div className="rc-box" style={{ marginBottom: 18 }}>{mod.objective}</div>
          </>
        )}
        <div className="rc-soon">
          <b>{T('Conteúdo interativo desta aula em produção.', 'Interactive content for this lesson in production.')}</b><br />
          {T('Esta aula faz parte do desenho curricular completo e fiel ao plano de estudos. O material interativo (vocabulário, exercícios e recap) está sendo produzido — as aulas-piloto já estão disponíveis no programa.',
             'This lesson is part of the full curriculum, faithful to the study plan. The interactive material is being produced — pilot lessons are already available in the programme.')}
        </div>
        {lesson.pill && <div style={{ marginTop: 22 }}><AccentPill pill={lesson.pill} voice={voice} T={T} /></div>}
      </div>
      <div className="rc-stepnav">
        {prevNum ? <Link className="rc-btn rc-btn-outline" href={`/racional/${course.id}/lesson/${prevNum}`}>← {T('Anterior', 'Previous')}</Link> : <span />}
        <Link className="rc-btn rc-btn-outline" href={`/racional/${course.id}`}>{T('Programa', 'Programme')}</Link>
        {nextNum ? <Link className="rc-btn rc-btn-primary" style={{ background: course.meta.accent }} href={`/racional/${course.id}/lesson/${nextNum}`}>{T('Próxima', 'Next')} →</Link> : <span />}
      </div>
    </>
  );
}

/* ---------- Recap interativo: marca cada item; ao completar, conclui a aula ---------- */
function RecapChecklist({ studentId, num, takeaways, voice, T, accent }) {
  const { checks, done, toggle } = useLessonProgress(studentId, num, takeaways.length);
  const checkedCount = takeaways.filter((_, i) => checks[i]).length;

  return (
    <div className="rc-recap" style={done ? { borderColor: '#1E7A46', boxShadow: '0 0 0 3px rgba(30,122,70,0.12)' } : null}>
      <div className="rc-recap-head"><Icon name="target" size={20} /> {T('O que eu aprendi nessa lição', 'What I learned in this lesson')}</div>
      <div className="rc-recap-sub">
        {T('Marque cada frase que você já consegue dizer com confiança. Ao marcar todas, a aula fica registrada como concluída.',
           'Tick each line you can already say with confidence. Tick them all and the lesson is saved as completed.')}
        {' '}<b>{checkedCount}/{takeaways.length}</b>
      </div>
      {takeaways.map((t, i) => {
        const on = !!checks[i];
        return (
          <div key={i} className="rc-check-item" onClick={() => toggle(i)} role="checkbox" aria-checked={on} tabIndex={0}
               onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(i); } }}>
            <span className={`rc-check-box ${on ? 'on' : ''}`} style={on ? { background: '#1E7A46', borderColor: '#1E7A46' } : null}>{on ? '✓' : ''}</span>
            <span className="rc-check-text" style={on ? { color: '#1B5E36', fontWeight: 600 } : null}>{t}</span>
            <span onClick={(e) => e.stopPropagation()}><AudioPlayer text={t} voiceType={voice} rate={0.85} label="" small /></span>
          </div>
        );
      })}
      {done && (
        <div className="rc-done-banner">✓ {T('Aula concluída! Ela vai aparecer mais clara no seu programa.', 'Lesson completed! It will appear highlighted in your programme.')}</div>
      )}
    </div>
  );
}

/* ---------- Teacher's Guide (visível só no modo professor) ---------- */
function TeacherGuide({ guide }) {
  return (
    <details className="rc-teacher-card" open>
      <summary>
        <span className="rc-teacher-tag">PROFESSOR</span>
        <span>Teacher's Guide · plano da aula</span>
        <span className="rc-module-chev">›</span>
      </summary>
      <div className="rc-teacher-body">
        {guide.overview && <p className="rc-teacher-over">{guide.overview}</p>}
        {guide.focus && <p className="rc-teacher-focus"><b>Foco:</b> {guide.focus}</p>}
        {guide.note && <div className="rc-teacher-note">{guide.note}</div>}
        {guide.flow?.length > 0 && (
          <>
            <div className="rc-teacher-h">Roteiro sugerido</div>
            <ol className="rc-teacher-flow">
              {guide.flow.map((s, i) => (
                <li key={i}><span className="rc-teacher-min">{s.min}'</span> <b>{s.what}</b> — {s.how}</li>
              ))}
            </ol>
          </>
        )}
        {guide.watch?.length > 0 && (
          <>
            <div className="rc-teacher-h">Atenção</div>
            <ul className="rc-teacher-watch">{guide.watch.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </>
        )}
        {guide.richNote && <p className="rc-teacher-rich">{guide.richNote}</p>}
      </div>
    </details>
  );
}

/* ---------- Pílula de sotaque (EXTRA leve em toda unidade) ---------- */
function AccentPill({ pill, voice, T }) {
  return (
    <div className="rc-pill">
      <div className="rc-pill-top">
        <span className="rc-pill-code">{pill.code || 'US'}</span>
        <div>
          <div className="rc-pill-tag"><Icon name="pin" size={12} /> {T('Pílula de sotaque · extra', 'Accent pill · extra')}</div>
          <div className="rc-pill-region">{pill.region}</div>
        </div>
      </div>
      <p className="rc-pill-tip">{pill.tip}</p>
      <div className="rc-pill-sample">
        <span className="rc-mini-label" style={{ marginBottom: 6 }}>{T('Ouça e treine o ouvido', 'Listen and tune your ear')}</span>
        <div className="rc-pill-phrase">"{pill.sample}"</div>
        <div style={{ marginTop: 8 }}>
          <AudioPlayer text={pill.sample} voiceType={pill.voice || voice} rate={0.9} label={T('Ouvir', 'Listen')} small />
        </div>
      </div>
    </div>
  );
}

function stripTags(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
