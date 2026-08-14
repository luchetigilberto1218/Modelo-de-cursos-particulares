'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Exercise from '../Exercise';
import AudioPlayer from '../AudioPlayer';
import SpeakingExercise from '../SpeakingExercise';
import { useIdentity, useLessonDone, useDoneMap } from './progress';
import ReadyForClass, { ReadyStrip } from './ReadyForClass';

/*
  Czarnikow (ambiente de teste) — renderizador de lição no estilo Baker Hughes.
  Réplica fiel de components/bakerhughes/BakerHughesLesson.jsx (que está em pasta
  não-commitada da outra aba), com as cores do Czarnikow e a conclusão ligada ao
  progresso por Vercel Blob (marca a lição e acende a trilha). Sem barra de topo
  própria — a NavBar da página já cobre logo + "Sair".
*/

const RACIONAL_TYPES = ['matching', 'multipleChoice', 'fillGap', 'reorder', 'writing', 'speaking', 'dictation', 'info'];

const LEVEL_LABEL = { confidence: 'Confidence', essentials: 'Essentials', rise: 'Rise', apex: 'Apex' };

// Paleta Czarnikow (theme.json)
const C = {
  navy: '#1B2736', navyLight: '#2B3B4F', accent: '#2AAAE2', accentHover: '#1C96CC',
  accentLight: '#E6F5FC', teal: '#1C96CC', text: '#2D3748', gray: '#6B7A8F',
  grayLight: '#E4E9EF', offWhite: '#F9FAFB',
};

/** Fração de acertos (0..1) de um exercício — alimenta os pontos da campanha. */
function accuracyOf(items, isRight) {
  if (!items?.length) return 0;
  return items.filter((_, i) => isRight(i)).length / items.length;
}

function normalize(s) {
  return (s || '').toString().trim().toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ');
}
function stripHtml(html) { return (html || '').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }

export default function CztLesson({ lesson, clientId, prevNum, nextNum, backHref }) {
  const l = lesson;
  const c = C;
  const { navy, navyLight, accent, accentLight, teal, text, gray, grayLight, offWhite } = C;
  const voiceType = l.character || 'us-female';
  const exercises = l.exercises || [];

  // Identidade + progresso (marca a lição e acende a trilha)
  const identity = useIdentity(true);
  const { done: persistedDone, markDone, markUndone } = useLessonDone(identity?.student, l.num);

  // Conclusão: o card "lição completa" só aparece quando os exercícios avaliáveis
  // foram respondidos (certo ou errado). Espelha o doneSet da Baker Hughes.
  // Cada exercício guarda também o acerto da PRIMEIRA tentativa (0..1), que vira
  // pontos na campanha Ago–Dez.
  const GRADEABLE = ['wordBank', 'verbFill', 'quickDrill', 'wordOrder', 'mcSet', ...RACIONAL_TYPES.filter(t => t !== 'info')];
  const gradeableIdx = exercises.map((ex, i) => (GRADEABLE.includes(ex.type) ? i : null)).filter(i => i !== null);
  const [doneSet, setDoneSet] = useState({});
  const mark = (i, accuracy) => setDoneSet(prev => (
    prev[i] ? prev : { ...prev, [i]: { acc: typeof accuracy === 'number' ? Math.min(1, Math.max(0, accuracy)) : 0 } }
  ));
  const answered = gradeableIdx.filter(i => doneSet[i]);
  const doneCount = answered.length;
  const totalGradeable = gradeableIdx.length;
  const allDone = totalGradeable > 0 && doneCount >= totalGradeable;
  const firstTryAccuracy = doneCount > 0
    ? answered.reduce((sum, i) => sum + (doneSet[i].acc || 0), 0) / doneCount
    : 0;

  useEffect(() => {
    if (allDone && identity?.student && !persistedDone) markDone(firstTryAccuracy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone, identity?.student, persistedDone]);

  // Marco: a cada 3 lições concluídas, um card sóbrio de recapitulação.
  const doneMap = useDoneMap(identity?.student);
  const totalLessonsDone = Object.keys(doneMap).length;
  const isMilestone = (allDone || persistedDone) && totalLessonsDone > 0 && totalLessonsDone % 3 === 0;

  const showCelebrate = allDone || persistedDone;
  const levelLabel = LEVEL_LABEL[l.level] || l.levelLabel || 'Essentials';

  return (
    <div style={{ minHeight: '100vh', background: offWhite, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: text, WebkitFontSmoothing: 'antialiased' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${navy}, ${navyLight})`, color: '#fff', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${teal})` }} />
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '20px 24px 30px' }}>
          <Link href={backHref || `/${clientId}`} style={{ display: 'inline-block', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 13, fontWeight: 600, marginBottom: 18 }}>← Voltar à trilha</Link>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: accent, marginBottom: 10 }}>
            {levelLabel} · Lesson {l.trackOrder || l.num}
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.1, margin: '0 0 12px' }}>{l.title}</h1>
          {l.focus && <span style={{ display: 'inline-block', fontSize: 13, padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}>{l.focus}</span>}
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 24px 60px' }}>

        <ReadyStrip
          studentId={identity?.student}
          num={l.num}
          answered={doneCount}
          total={totalGradeable}
          acc={firstTryAccuracy}
        />

        {l.teacherGuide && <TeacherGuide g={l.teacherGuide} />}

        {l.objective && (
          <Section navy={navy} accent={accent} letter="O" title={l.objectiveLabel || 'Objetivo da lição'} bg={accentLight} border="#BBD6F2">
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65, color: text }}>{l.objective}</p>
          </Section>
        )}

        {l.intro && (
          <IntroBlock l={l} navy={navy} accent={accent} accentLight={accentLight} grayLight={grayLight} voiceType={voiceType} />
        )}

        {l.vocab?.length > 0 && l.vocab[0] && typeof l.vocab[0] === 'object' && (
          <Section navy={navy} accent={accent} letter="V" title="Vocabulary">
            <div style={{ display: 'grid', gap: 10 }}>
              {l.vocab.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: offWhite, border: `1px solid ${grayLight}`, borderRadius: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div><strong style={{ color: navy }}>{v.en}</strong> <span style={{ color: gray }}>— {v.pt}</span></div>
                    {v.example && <div style={{ fontSize: 13.5, color: gray, marginTop: 3, fontStyle: 'italic' }}>e.g. {v.example}</div>}
                  </div>
                  <AudioPlayer text={v.example ? `${v.en}. ${v.example}` : v.en} rate={0.85} label="" small voiceType={voiceType}  preferServer />
                </div>
              ))}
            </div>
          </Section>
        )}

        {l.situation && (
          <Section navy={navy} accent={accent} letter="C" title="Context">
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: '#33443F' }}>{l.situation}</p>
          </Section>
        )}

        {/* Exercises — Racional + Delta types (idêntico à Baker Hughes) */}
        {exercises.length > 0 && (
          <>
            <PartTitle accent={accent} navy={navy}>{l.practiceLabel || 'Practice · pratique sozinho'}</PartTitle>
            {exercises.map((ex, i) => {
              if (RACIONAL_TYPES.includes(ex.type)) {
                return <Exercise key={i} exercise={ex} levelId="starter" onResult={(r) => mark(i, r?.accuracy)} />;
              }
              if (ex.type === 'wordBank') return <WordBank key={i} ex={ex} c={c} onChecked={(acc) => mark(i, acc)} />;
              if (ex.type === 'verbFill' || ex.type === 'quickDrill') return <VerbFill key={i} ex={ex} c={c} onChecked={(acc) => mark(i, acc)} />;
              if (ex.type === 'wordOrder') return <WordOrder key={i} ex={ex} c={c} onChecked={(acc) => mark(i, acc)} />;
              if (ex.type === 'mcSet') return <McSet key={i} ex={ex} c={c} voiceType={voiceType} onChecked={(acc) => mark(i, acc)} />;
              if (ex.type === 'readAloud') return <ReadAloud key={i} ex={ex} c={c} voiceType={voiceType} />;
              if (ex.type === 'makeItYourOwn') return <MakeItYourOwn key={i} ex={ex} c={c} voiceType={voiceType} />;
              if (!ex.type && ex.content) return <ExercicioEstatico key={i} ex={ex} c={c} />;
              return null;
            })}
          </>
        )}

        {l.grammarDetail && (
          <>
            <PartTitle accent={accent} navy={navy}>Grammar of the lesson</PartTitle>
            <Section navy={navy} accent={accent} letter="G" title="Grammar Point">
              <div style={{ fontSize: 15, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: l.grammarDetail }} />
            </Section>
            {l.grammarDeepDive && <GrammarDeepDive dd={l.grammarDeepDive} c={c} />}
          </>
        )}

        {l.takeaways?.length > 0 && (
          <Section navy={navy} accent={accent} letter="✓" title="What I can do now · O que eu já consigo">
            <div style={{ display: 'grid', gap: 8 }}>
              {l.takeaways.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: accentLight, borderRadius: 10 }}>
                  <span style={{ color: accent, fontWeight: 800 }}>✓</span>
                  <span style={{ flex: 1, fontSize: 14.5 }}>{t}</span>
                  <AudioPlayer text={t} rate={0.85} label="" small voiceType={voiceType}  preferServer />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Lesson complete — só quando os exercícios foram feitos */}
        {showCelebrate && (
          <div style={{ margin: '30px 0 8px', padding: '30px 32px', borderRadius: 16, background: `linear-gradient(135deg, ${navy}, ${navyLight})`, color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ height: 2, width: 28, background: accent }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: accent }}>Lesson complete</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5, margin: '0 0 6px' }}>{l.celebrate?.en || 'Great work — lesson complete!'}</p>
            <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.5, margin: 0 }}>{l.celebrate?.pt || 'Lição concluída — sua trilha acendeu.'}</p>
          </div>
        )}
        {isMilestone && <Milestone count={totalLessonsDone} c={c} clientId={clientId} />}

        {!showCelebrate && totalGradeable > 0 && (
          <div style={{ margin: '30px 0 8px', padding: '18px 22px', borderRadius: 14, background: '#fff', border: `1px dashed ${grayLight}`, color: gray, fontSize: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, color: navy }}>{doneCount}/{totalGradeable}</span>
            <span>Responda os exercícios acima (basta corrigir cada um) — a lição se conclui sozinha e acende a sua trilha.</span>
          </div>
        )}

        {/* Lição sem nenhum exercício auto-corrigido (os dela ainda estão no
            formato antigo): a conclusão volta a ser manual, como era antes da
            conversão — senão a trilha nunca acenderia. */}
        {!showCelebrate && totalGradeable === 0 && (
          <div style={{ margin: '30px 0 8px', padding: '20px 22px', borderRadius: 14, background: '#fff', border: `1px dashed ${grayLight}`, textAlign: 'center' }}>
            <p style={{ margin: '0 0 14px', fontSize: 14.5, color: gray, lineHeight: 1.55 }}>
              Terminou esta lição? Marque como concluída para acender a sua trilha.
            </p>
            <button
              onClick={() => identity?.student && markDone()}
              style={{ padding: '11px 22px', borderRadius: 999, border: 'none', background: accent, color: '#fff', fontWeight: 700, fontSize: 14.5, cursor: 'pointer' }}
            >
              Marcar como concluída
            </button>
          </div>
        )}
        {showCelebrate && totalGradeable === 0 && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button
              onClick={markUndone}
              style={{ padding: '9px 18px', borderRadius: 999, border: `1px solid ${grayLight}`, background: '#fff', color: gray, fontWeight: 600, fontSize: 13.5, cursor: 'pointer' }}
            >
              Desfazer
            </button>
          </div>
        )}

        {/* Handoff para a aula particular: declaração do aluno + evidência do que
            praticou. Não conclui a lição — quem conclui é o exercício. */}
        <ReadyForClass
          studentId={identity?.student}
          num={l.num}
          answered={doneCount}
          total={totalGradeable}
          acc={firstTryAccuracy}
        />

        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
          {prevNum ? <CztBtn href={`/${clientId}/lesson/${prevNum}`} c={c} outline>← Anterior</CztBtn> : <span />}
          <Link href={backHref || `/${clientId}`} style={{ color: gray, textDecoration: 'none', fontSize: 14 }}>☰ Voltar à trilha</Link>
          {nextNum ? <CztBtn href={`/${clientId}/lesson/${nextNum}`} c={c}>Próxima lição →</CztBtn> : <span />}
        </div>
      </div>
    </div>
  );
}

/* ── marco a cada 3 lições ──
   Tom profissional, nada cartunesco: recapitula o progresso, dá uma micro-dica
   de uso do inglês no trabalho e leva à campanha. */
const MICRO_TIPS = [
  { en: 'Say the sentence out loud before you write it — your emails start sounding natural.',
    pt: 'Fale a frase em voz alta antes de escrever: seus e-mails passam a soar naturais.' },
  { en: 'In meetings, prepare one sentence in advance. One is enough to break the silence.',
    pt: 'Em reuniões, prepare uma frase antes. Uma já basta para quebrar o silêncio.' },
  { en: 'Reuse the vocabulary of the lesson in a real message this week.',
    pt: 'Use o vocabulário da lição numa mensagem real ainda esta semana.' },
  { en: 'When you do not know a word, describe it. Fluency is not vocabulary size.',
    pt: 'Quando faltar a palavra, descreva. Fluência não é tamanho de vocabulário.' },
  { en: 'Short, regular study beats long sessions once in a while.',
    pt: 'Estudo curto e regular vence sessões longas de vez em quando.' },
];

function Milestone({ count, c, clientId }) {
  const tip = MICRO_TIPS[(Math.floor(count / 3) - 1) % MICRO_TIPS.length];
  return (
    <div style={{
      margin: '18px 0 8px', padding: '24px 26px', borderRadius: 16,
      background: '#fff', border: `1px solid ${c.grayLight}`, borderLeft: `4px solid ${c.navy}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 10.5, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: 999, background: c.navy, color: '#fff',
        }}>
          Marco
        </span>
        <strong style={{ fontSize: 17, color: c.navy }}>{count} lições concluídas</strong>
      </div>
      <p style={{ fontSize: 14.5, lineHeight: 1.6, color: c.text, margin: '0 0 4px' }}>{tip.en}</p>
      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: c.gray, margin: '0 0 16px' }}>{tip.pt}</p>
      <Link href={`/${clientId}/campanha`} style={{
        display: 'inline-block', fontSize: 13.5, fontWeight: 700, color: c.navy,
        textDecoration: 'none', border: `1px solid ${c.grayLight}`, borderRadius: 999, padding: '9px 18px',
      }}>
        Ver sua pontuação na campanha →
      </Link>
    </div>
  );
}

/* ── Teacher Guide ──
   Portado do components/LessonView.jsx (o renderizador do /czarnikow real), que
   as lições convertidas tinham perdido — o DADO nunca saiu do course.json, só
   faltava quem desenhasse. Recolhido por padrão e visível para todos, como no
   curso original. Paleta dourada: separa na hora o que é plano de aula do que é
   material do aluno. */
const TG = { bg: '#FFFBF2', border: '#E8D9B5', ink: '#5A4A1F', label: '#8C6A00', gold: '#B08D57', green: '#1B7A3D' };

function TeacherGuide({ g }) {
  return (
    <details style={{ background: TG.bg, border: `1px solid ${TG.border}`, borderRadius: 14, padding: 0, marginBottom: 20, overflow: 'hidden' }}>
      <summary style={{
        cursor: 'pointer', fontWeight: 700, color: TG.label, fontSize: 15, listStyle: 'none',
        padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, userSelect: 'none', flexWrap: 'wrap',
      }}>
        <span>Teacher Guide · plano da aula</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: TG.gold }}>
          {g.pacing ? `${g.pacing} · ` : ''}toque para abrir
        </span>
      </summary>

      <div style={{ padding: '0 20px 20px' }}>
        {g.overview && (
          <p style={{ fontSize: 14, lineHeight: 1.65, color: TG.ink, marginTop: 0 }}>{g.overview}</p>
        )}

        {Array.isArray(g.lessonFlow) && g.lessonFlow.length > 0 && (
          <>
            <TgLabel>Roteiro da aula</TgLabel>
            <ol style={{ paddingLeft: 22, margin: 0 }}>
              {g.lessonFlow.map((s, i) => (
                <li key={i} style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.55, color: TG.ink }}>
                  <strong>{s.what || `Passo ${i + 1}`}</strong>
                  {s.duration && <span style={{ color: TG.label, fontSize: 12, marginLeft: 8 }}>({s.duration})</span>}
                  {s.instructions && <div style={{ marginTop: 2, whiteSpace: 'pre-wrap' }}>{s.instructions}</div>}
                </li>
              ))}
            </ol>
          </>
        )}

        {Array.isArray(g.extraPractice) && g.extraPractice.length > 0 && (
          <>
            <TgLabel>Exercícios extras · não estão no app — faça com o aluno</TgLabel>
            <div style={{ display: 'grid', gap: 12 }}>
              {g.extraPractice.map((b, bi) => (
                <div key={bi} style={{ background: '#fff', border: `1px solid ${TG.border}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TG.ink, marginBottom: b.note ? 2 : 8 }}>{b.title}</div>
                  {b.note && <div style={{ fontSize: 12, color: TG.label, fontStyle: 'italic', marginBottom: 8 }}>{b.note}</div>}
                  <ol style={{ paddingLeft: 20, margin: 0 }}>
                    {(b.items || []).map((it, ii) => (
                      <li key={ii} style={{ marginBottom: 6, fontSize: 13, lineHeight: 1.55, color: TG.ink }}>
                        <span>{it.q}</span>
                        {it.a && <span style={{ color: TG.green, fontWeight: 600 }}>{`   →   ${it.a}`}</span>}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </>
        )}

        {g.commonChallenges?.length > 0 && (
          <>
            <TgLabel>Onde o aluno costuma tropeçar</TgLabel>
            <ul style={{ paddingLeft: 22, margin: 0 }}>
              {g.commonChallenges.map((c, i) => (
                <li key={i} style={{ marginBottom: 6, fontSize: 14, lineHeight: 1.55, color: TG.ink }}>{c}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </details>
  );
}

function TgLabel({ children }) {
  return (
    <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: TG.label, margin: '20px 0 10px' }}>
      {children}
    </h4>
  );
}

/* ── layout helpers (réplica da Baker Hughes) ── */
function IntroBlock({ l, navy, accent, accentLight, grayLight, voiceType }) {
  const [showPt, setShowPt] = useState(false);
  const toHtml = (v) => Array.isArray(v) ? v.map(p => `<p style="margin:0 0 12px">${p}</p>`).join('') : v;
  const enHtml = toHtml(l.intro);
  const ptHtml = l.introPt ? toHtml(l.introPt) : null;
  return (
    <Section navy={navy} accent={accent} letter="I" title={l.introLabel || 'Introduction'}>
      <div style={{ fontSize: 15.5, lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: enHtml }} />
      {ptHtml && showPt && (
        <div style={{ marginTop: 14, padding: '14px 16px', background: accentLight, borderLeft: `3px solid ${accent}`, borderRadius: 10, fontSize: 15, lineHeight: 1.7, color: '#33443F' }} dangerouslySetInnerHTML={{ __html: ptHtml }} />
      )}
      <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <AudioPlayer text={stripHtml(Array.isArray(l.intro) ? l.intro.join(' ') : l.intro)} rate={0.95} label="Listen to introduction" voiceType={voiceType}  preferServer />
        {ptHtml && (
          <button onClick={() => setShowPt(s => !s)} style={{ padding: '9px 16px', borderRadius: 999, border: `1px solid ${grayLight}`, background: '#fff', color: navy, fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}>
            {showPt ? 'Ocultar tradução' : '🇧🇷 Ver tradução'}
          </button>
        )}
      </div>
    </Section>
  );
}

function Section({ navy, accent, letter, title, children, bg = '#fff', border = '#E4E9EF' }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: '20px 22px', marginBottom: 16, boxShadow: '0 1px 4px rgba(27,39,54,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>{letter}</span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: navy }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}
function PartTitle({ accent, navy, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '30px 0 16px' }}>
      <span style={{ height: 2, flex: '0 0 24px', background: accent }} />
      <h2 style={{ margin: 0, fontSize: 13, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: navy }}>{children}</h2>
      <span style={{ height: 1, flex: 1, background: '#E4E9EF' }} />
    </div>
  );
}
function CztBtn({ href, c, children, outline }) {
  return (
    <Link href={href} style={{
      padding: '11px 20px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 14,
      background: outline ? '#fff' : c.accent, color: outline ? c.navy : '#fff',
      border: outline ? '1px solid #E4E9EF' : 'none',
    }}>{children}</Link>
  );
}

/* ── exercícios self-study auto-corrigidos (réplica da Baker Hughes) ── */
function WordBank({ ex, c, onChecked }) {
  const { accent, navy } = c;
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const items = ex.items || [];
  const isRight = (i) => normalize(answers[i]) === normalize(items[i].answer);
  const allFilled = items.every((_, i) => answers[i]);
  return (
    <ExShell title={ex.title} c={c} badge="Word bank">
      {ex.instruction && <p style={{ fontSize: 14, color: c.gray, margin: '0 0 10px', lineHeight: 1.5 }}>{ex.instruction}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, padding: 12, background: c.accentLight, borderRadius: 10 }}>
        {(ex.bank || []).map((w, i) => <span key={i} style={{ padding: '5px 12px', background: '#fff', border: `1px solid ${accent}`, borderRadius: 999, fontSize: 13.5, fontWeight: 600, color: navy }}>{w}</span>)}
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((it, i) => {
          const parts = (it.text || '').split('___');
          return (
            <div key={i} style={{ fontSize: 15, lineHeight: 1.7 }}>
              {parts[0]}
              <select value={answers[i] || ''} onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))} disabled={checked && isRight(i)}
                style={{ margin: '0 4px', padding: '4px 8px', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', border: `2px solid ${checked ? (isRight(i) ? '#9AE6B4' : '#FEB2B2') : '#E4E9EF'}`, background: checked ? (isRight(i) ? '#F0FFF4' : '#FFF5F5') : '#fff' }}>
                <option value="">…</option>
                {(ex.bank || []).map((w, j) => <option key={j} value={w}>{w}</option>)}
              </select>
              {parts.slice(1).join('___')}
            </div>
          );
        })}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(accuracyOf(items, isRight)); }} onReset={() => setAnswers({})} canCheck={allFilled} c={c} />
      {checked && <ResultLine ok={items.every((_, i) => isRight(i))} c={c} explanation={ex.explanation} corrections={items.map((it, i) => !isRight(i) ? `${it.text.replace('___', `[${it.answer}]`)}` : null).filter(Boolean)} />}
    </ExShell>
  );
}

function VerbFill({ ex, c, onChecked }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const items = ex.items || [];
  const isRight = (i) => {
    const acc = [items[i].answer, ...(items[i].acceptable || [])].map(normalize);
    return acc.includes(normalize(answers[i]));
  };
  const allFilled = items.every((_, i) => (answers[i] || '').trim());
  return (
    <ExShell title={ex.title} c={c} badge={ex.type === 'quickDrill' ? 'Quick drill' : 'Verb fill'}>
      {ex.instruction && <p style={{ fontSize: 14, color: c.gray, margin: '0 0 10px', lineHeight: 1.5 }}>{ex.instruction}</p>}
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((it, i) => {
          const parts = (it.prompt || '').split('___');
          return (
            <div key={i} style={{ fontSize: 15, lineHeight: 1.7 }}>
              {parts[0]}
              <input value={answers[i] || ''} onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))} disabled={checked && isRight(i)} placeholder="…"
                style={{ margin: '0 4px', padding: '4px 10px', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', width: 120, border: `2px solid ${checked ? (isRight(i) ? '#9AE6B4' : '#FEB2B2') : '#E4E9EF'}`, background: checked ? (isRight(i) ? '#F0FFF4' : '#FFF5F5') : '#fff' }} />
              {parts.slice(1).join('___')}
            </div>
          );
        })}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(accuracyOf(items, isRight)); }} onReset={() => setAnswers({})} canCheck={allFilled} c={c} />
      {checked && <ResultLine ok={items.every((_, i) => isRight(i))} c={c} explanation={ex.explanation} corrections={items.map((it, i) => !isRight(i) ? `${it.prompt.replace('___', `[${it.answer}]`)}` : null).filter(Boolean)} />}
    </ExShell>
  );
}

/* Exercício ainda no formato antigo (HTML + gabarito).
   A conversão para o formato interativo é feita exercício a exercício: quando um
   deles não encaixa em nenhuma forma conhecida — ou está defeituoso —, ele
   continua como estava, em vez de sumir da tela. Fica visualmente igual aos
   outros, com o gabarito atrás de um "ver respostas", como no /czarnikow real.
   Não conta para a conclusão da lição: não há como corrigir automaticamente. */
function ExercicioEstatico({ ex, c }) {
  return (
    <ExShell title={ex.title} c={c} badge="Faça no caderno">
      <div style={{ fontSize: 15, lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: ex.content }} />
      {ex.answers?.length > 0 && (
        <details style={{ marginTop: 14 }}>
          <summary style={{ cursor: 'pointer', color: c.accent, fontSize: 13, fontWeight: 700 }}>Ver respostas</summary>
          <div style={{ marginTop: 8, padding: 12, background: '#F0FFF4', border: '1px solid #C6F6D5', borderRadius: 8, fontSize: 14, color: '#2F855A', lineHeight: 1.8 }}>
            {ex.answers.map((a, j) => <div key={j}>{a}</div>)}
          </div>
        </details>
      )}
    </ExShell>
  );
}

/* Ordenar palavras para formar a frase.
   O material do Czarnikow tem centenas de exercícios de "reorder" — várias
   frases embaralhadas por exercício —, formato que o Exercise.jsx compartilhado
   não cobre (o reorder de lá é de UMA sequência só). Aqui cada frase é uma
   linha: toca na palavra para colocar, toca na palavra colocada para tirar. */
function WordOrder({ ex, c, onChecked }) {
  const items = ex.items || [];
  const [built, setBuilt] = useState({});   // { itemIdx: [índices das palavras, na ordem] }
  const [checked, setChecked] = useState(false);

  const frase = (i) => (built[i] || []).map((w) => items[i].words[w]).join(' ');
  const isRight = (i) => normalize(frase(i)) === normalize(items[i].answer);
  const allBuilt = items.every((it, i) => (built[i] || []).length === it.words.length);

  const toque = (i, w) => {
    if (checked) return;
    setBuilt((prev) => {
      const atual = prev[i] || [];
      return { ...prev, [i]: atual.includes(w) ? atual.filter((x) => x !== w) : [...atual, w] };
    });
  };

  return (
    <ExShell title={ex.title} c={c} badge="Monte a frase">
      <p style={{ fontSize: 14, color: c.gray, margin: '0 0 12px', lineHeight: 1.5 }}>
        {ex.instruction || 'Toque nas palavras na ordem certa para formar a frase. Toque de novo para tirar.'}
      </p>
      <div style={{ display: 'grid', gap: 18 }}>
        {items.map((it, i) => {
          const usados = built[i] || [];
          const ok = checked && isRight(i);
          const errou = checked && !ok;
          return (
            <div key={i}>
              {/* linha montada */}
              <div style={{
                minHeight: 44, padding: '10px 12px', borderRadius: 10, marginBottom: 8,
                border: `2px solid ${checked ? (ok ? '#9AE6B4' : '#FEB2B2') : c.grayLight}`,
                background: checked ? (ok ? '#F0FFF4' : '#FFF5F5') : c.offWhite,
                display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
              }}>
                {usados.length === 0 && <span style={{ color: c.gray, fontSize: 14 }}>…</span>}
                {usados.map((w) => (
                  <button key={w} onClick={() => toque(i, w)} disabled={checked}
                    style={{
                      padding: '5px 11px', borderRadius: 8, border: `1px solid ${c.accent}`,
                      background: '#fff', color: c.navy, fontWeight: 600, fontSize: 14,
                      fontFamily: 'inherit', cursor: checked ? 'default' : 'pointer',
                    }}>
                    {it.words[w]}
                  </button>
                ))}
              </div>
              {/* palavras disponíveis */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {it.words.map((p, w) => usados.includes(w) ? null : (
                  <button key={w} onClick={() => toque(i, w)} disabled={checked}
                    style={{
                      padding: '5px 11px', borderRadius: 8, border: `1px solid ${c.grayLight}`,
                      background: '#fff', color: c.text, fontSize: 14, fontFamily: 'inherit',
                      cursor: checked ? 'default' : 'pointer',
                    }}>
                    {p}
                  </button>
                ))}
              </div>
              {errou && (
                <div style={{ fontSize: 13.5, color: '#2F855A', marginTop: 6 }}>✓ {it.answer}</div>
              )}
            </div>
          );
        })}
      </div>
      <CheckRow
        checked={checked}
        setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(accuracyOf(items, isRight)); }}
        onReset={() => setBuilt({})}
        canCheck={allBuilt}
        c={c}
      />
      {checked && (
        <ResultLine ok={items.every((_, i) => isRight(i))} c={c} explanation={ex.explanation} corrections={[]} />
      )}
    </ExShell>
  );
}

function ReadAloud({ ex, c, voiceType }) {
  return (
    <ExShell title={ex.title} c={c} badge="Read aloud">
      <p style={{ fontSize: 13.5, color: c.gray, margin: '0 0 12px', lineHeight: 1.5 }}>{ex.instruction || 'Ouça e leia cada frase em voz alta. Grave para comparar sua pronúncia.'}</p>
      <div style={{ display: 'grid', gap: 14 }}>
        {(ex.sentences || []).map((s, i) => (
          <div key={i} style={{ padding: 14, background: c.offWhite, border: `1px solid ${c.grayLight}`, borderRadius: 12 }}>
            <div style={{ fontSize: 15.5, fontWeight: 500, marginBottom: 10 }}>{s}</div>
            <AudioPlayer text={s} rate={0.85} label="Listen" small voiceType={ex.voice || voiceType}  preferServer />
            <div style={{ marginTop: 8 }}>
              <SpeakingExercise mode="read" targetText={s} levelId="starter" lang="en-US" />
            </div>
          </div>
        ))}
      </div>
    </ExShell>
  );
}

function MakeItYourOwn({ ex, c, voiceType }) {
  const navy = c.navy;
  const [vals, setVals] = useState({});
  return (
    <ExShell title={ex.title} c={c} badge="Make it your own">
      <p style={{ fontSize: 13.5, color: c.gray, margin: '0 0 12px', lineHeight: 1.5 }}>{ex.instruction || 'Escreva suas próprias frases em inglês. Não há correção automática — é seu espaço para produzir.'}</p>
      <div style={{ display: 'grid', gap: 14 }}>
        {(ex.tasks || []).map((t, i) => {
          const wc = (vals[i]?.trim().match(/\S+/g) || []).length;
          const min = t.minWords || 4;
          return (
            <div key={i}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: navy, marginBottom: 4 }}>{t.label}</div>
              {t.hint && <div style={{ fontSize: 13, color: c.gray, marginBottom: 6, fontStyle: 'italic' }}>{t.hint}</div>}
              <textarea value={vals[i] || ''} onChange={e => setVals(v => ({ ...v, [i]: e.target.value }))} rows={2} placeholder="Escreva em inglês…"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `2px solid ${wc >= min ? '#9AE6B4' : c.grayLight}`, fontSize: 15, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5 }} />
              <div style={{ fontSize: 12, color: wc >= min ? '#2F855A' : c.gray, marginTop: 4 }}>{wc} palavra(s){wc < min ? ` · escreva pelo menos ${min}` : ' ✓'}</div>
            </div>
          );
        })}
      </div>
    </ExShell>
  );
}

/* Bloco de múltipla escolha com VÁRIAS perguntas (10, no padrão novo).
   O `multipleChoice` do Exercise.jsx compartilhado cobre UMA pergunta por
   exercício — não serve para compreensão de texto, onde o aluno lê/ouve uma vez
   e responde uma bateria. Aqui cada item tem seu enunciado, alternativas e
   explicação; a correção é de uma vez só, como nos outros exercícios, e a
   fração de acertos vira ponto na campanha.

   Variações, todas pelo mesmo componente:
   · `passage`  → texto para ler antes de responder (compreensão de leitura)
   · `audio`    → áudio para ouvir antes (compreensão oral); a transcrição só
                  aparece depois de corrigir, senão o exercício vira leitura
   · sem os dois → vocabulário em contexto, expressões, phrasal verbs */
function McSet({ ex, c, voiceType, onChecked }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const items = ex.items || [];
  const isRight = (i) => answers[i] === items[i].answer;
  const allAnswered = items.every((_, i) => answers[i] !== undefined);
  const BADGE = { reading: 'Compreensão de leitura', listening: 'Compreensão oral', vocabulary: 'Vocabulário em contexto', expressions: 'Expressões e phrasal verbs' };

  return (
    <ExShell title={ex.title} c={c} badge={BADGE[ex.skill] || 'Escolha a alternativa'}>
      {ex.instruction && <p style={{ fontSize: 14, color: c.gray, margin: '0 0 12px', lineHeight: 1.5 }}>{ex.instruction}</p>}

      {ex.passage && (
        <div style={{ padding: 16, background: c.offWhite, border: `1px solid ${c.grayLight}`, borderRadius: 12, marginBottom: 16, fontSize: 15, lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: ex.passage }} />
      )}

      {ex.audio && (
        <div style={{ padding: 14, background: c.accentLight, border: `1px solid ${c.grayLight}`, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 13.5, color: c.navy, fontWeight: 600, marginBottom: 8 }}>{ex.audio.label || 'Ouça quantas vezes precisar. A transcrição aparece depois de corrigir.'}</div>
          <AudioPlayer text={stripHtml(ex.audio.text)} rate={ex.audio.rate || 0.92} label="Listen" voiceType={ex.audio.voice || voiceType} preferServer />
        </div>
      )}

      <div style={{ display: 'grid', gap: 18 }}>
        {items.map((it, i) => (
          <div key={i}>
            {/* O enunciado aceita <strong> para destacar o termo em foco. */}
            <div style={{ fontSize: 15, fontWeight: 600, color: c.navy, lineHeight: 1.55, marginBottom: 8 }}
              dangerouslySetInnerHTML={{ __html: `${i + 1}. ${it.q}` }} />
            <div style={{ display: 'grid', gap: 6 }}>
              {(it.options || []).map((opt, j) => {
                const sel = answers[i] === j;
                const reveal = checked && (sel || j === it.answer);
                const ok = j === it.answer;
                return (
                  <button key={j} onClick={() => { if (!checked) setAnswers(a => ({ ...a, [i]: j })); }} disabled={checked}
                    style={{
                      textAlign: 'left', padding: '9px 12px', borderRadius: 9, fontSize: 14.5, lineHeight: 1.5, fontFamily: 'inherit',
                      cursor: checked ? 'default' : 'pointer',
                      border: `2px solid ${reveal ? (ok ? '#9AE6B4' : '#FEB2B2') : sel ? c.accent : c.grayLight}`,
                      background: reveal ? (ok ? '#F0FFF4' : '#FFF5F5') : sel ? c.accentLight : '#fff',
                      color: c.text,
                    }}>
                    <span style={{ fontWeight: 700, color: c.gray, marginRight: 8 }}>{'abcd'[j]}</span>{opt}
                  </button>
                );
              })}
            </div>
            {checked && it.why && (
              <div style={{ marginTop: 6, fontSize: 13.5, lineHeight: 1.55, color: isRight(i) ? '#2F855A' : '#9B2C2C' }}>
                {isRight(i) ? '✓ ' : '✗ '}{it.why}
              </div>
            )}
          </div>
        ))}
      </div>

      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(accuracyOf(items, isRight)); }} onReset={() => setAnswers({})} canCheck={allAnswered} c={c} />

      {checked && (
        <div style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: c.navy }}>
          {items.filter((_, i) => isRight(i)).length} de {items.length} corretas
        </div>
      )}
      {checked && ex.audio?.text && (
        <details style={{ marginTop: 10 }}>
          <summary style={{ cursor: 'pointer', color: c.accent, fontSize: 13, fontWeight: 700 }}>Ver transcrição</summary>
          <div style={{ marginTop: 8, padding: 12, background: c.offWhite, border: `1px solid ${c.grayLight}`, borderRadius: 8, fontSize: 14, lineHeight: 1.75 }}
            dangerouslySetInnerHTML={{ __html: ex.audio.text }} />
        </details>
      )}
    </ExShell>
  );
}

function ExShell({ title, c, badge, children }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${c.grayLight}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        {badge && <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 999, background: c.accentLight, color: c.navy }}>{badge}</span>}
        <h4 style={{ margin: 0, fontSize: 16 }}>{title}</h4>
      </div>
      {children}
    </div>
  );
}
function CheckRow({ checked, setChecked, onReset, canCheck, c }) {
  return (
    <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
      {!checked ? (
        <button onClick={() => setChecked(true)} disabled={!canCheck} style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: canCheck ? c.accent : '#CBD5D2', color: '#fff', fontWeight: 700, fontSize: 14, cursor: canCheck ? 'pointer' : 'not-allowed' }}>Corrigir</button>
      ) : (
        <button onClick={() => { setChecked(false); onReset(); }} style={{ padding: '10px 18px', borderRadius: 8, border: `1px solid ${c.grayLight}`, background: '#fff', color: c.text, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Tentar de novo</button>
      )}
    </div>
  );
}
function ResultLine({ ok, c, explanation, corrections }) {
  return (
    <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: ok ? '#F0FFF4' : '#FFF5F5', border: `1px solid ${ok ? '#9AE6B4' : '#FEB2B2'}`, color: ok ? '#22543D' : '#742A2A', fontSize: 14 }}>
      {ok ? `✓ ${explanation || 'Tudo certo!'}` : '✗ Quase — confira as respostas certas:'}
      {!ok && corrections?.length > 0 && (
        <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
          {corrections.map((c2, i) => <li key={i} style={{ marginBottom: 3 }}>{c2}</li>)}
        </ul>
      )}
    </div>
  );
}

function GrammarDeepDive({ dd, c }) {
  const { navy, gray } = c;
  return (
    <div style={{ background: '#fff', border: `1px solid ${c.grayLight}`, borderRadius: 16, padding: '20px 22px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: c.teal, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>G+</span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: navy }}>{dd.title || 'Grammar Deep Dive'}</h3>
      </div>
      {dd.explanation && <div style={{ fontSize: 14.5, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: dd.explanation }} />}
      {dd.examples?.length > 0 && (
        <ol style={{ paddingLeft: 20, margin: '14px 0 0' }}>
          {dd.examples.map((e, i) => <li key={i} style={{ marginBottom: 8 }}><strong>{e.en}</strong><br /><span style={{ color: gray, fontSize: 13.5 }}>{e.pt}</span></li>)}
        </ol>
      )}
      {dd.commonMistakes?.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {dd.commonMistakes.map((m, i) => (
            <div key={i} style={{ marginBottom: 10, padding: 12, background: '#FFF5F5', borderRadius: 8, borderLeft: '3px solid #E53E3E' }}>
              <div style={{ color: '#C53030' }}>✗ {m.wrong}</div>
              <div style={{ color: '#2F855A' }}>✓ {m.right}</div>
              {m.note && <div style={{ fontSize: 13, color: gray, marginTop: 3 }}>{m.note}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
