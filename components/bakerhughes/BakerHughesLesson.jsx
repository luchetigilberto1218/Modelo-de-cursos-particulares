'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Exercise from '../Exercise';
import AudioPlayer from '../AudioPlayer';
import SpeakingExercise from '../SpeakingExercise';
import BhExercise, { BH_EXTRA_TYPES, BH_UNGRADED_TYPES } from './BhExercises';
import { useIdentity, useLessonDone } from './progress';

/*
  Baker Hughes — self-study lesson renderer (async, no teacher).
  Merges the Racional interactive exercise types (via <Exercise>) with
  Delta Ducon self-study types (word bank, verb fill, read aloud,
  make it your own, Q&A reveal, celebration). Everything auto-corrects
  so the student can study alone.
*/

const RACIONAL_TYPES = ['matching', 'multipleChoice', 'fillGap', 'reorder', 'writing', 'speaking', 'dictation', 'info'];

function normalize(s) {
  return (s || '').toString().trim().toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ');
}

export default function BakerHughesLesson({ lesson, theme, clientId, prevNum, nextNum, backHref, student, position }) {
  const l = lesson;
  const c = theme?.colors || {};
  const navy = c.navy || '#062E2B';
  const navyLight = c.navyLight || '#0E4A44';
  const accent = c.accent || '#00B04F';
  const accentLight = c.accentLight || '#E4F7EC';
  const teal = c.teal || '#009CA6';
  const text = c.text || '#20302D';
  const gray = c.gray || '#5F7570';
  const grayLight = c.grayLight || '#E2E9E7';
  const offWhite = c.offWhite || '#F5F8F7';
  const school = theme?.logos?.school;
  const voiceType = l.character || 'us-female';

  const exercises = l.exercises || [];

  // Completion tracking — the "lesson complete" card only shows once the
  // gradeable exercises have actually been answered (right or wrong).
  const GRADEABLE = [
    'wordBank', 'verbFill', 'quickDrill',
    ...RACIONAL_TYPES.filter(t => t !== 'info'),
    // formatos novos das trilhas personalizadas (BhExercises); o check-off é
    // auto-avaliação e por isso não conta para fechar a lição.
    ...BH_EXTRA_TYPES.filter(t => !BH_UNGRADED_TYPES.includes(t)),
  ];
  const gradeableIdx = exercises.map((ex, i) => (GRADEABLE.includes(ex.type) ? i : null)).filter(i => i !== null);
  const [doneSet, setDoneSet] = useState({});
  const markDone = (i) => setDoneSet(prev => (prev[i] ? prev : { ...prev, [i]: true }));
  const doneCount = gradeableIdx.filter(i => doneSet[i]).length;
  const totalGradeable = gradeableIdx.length;
  const allDone = totalGradeable > 0 && doneCount >= totalGradeable;
  // Quais exercícios ainda faltam corrigir — o material é self-paced, então o
  // aluno precisa saber NOMINALMENTE o que ficou para trás, não só o número.
  const pending = gradeableIdx
    .filter(i => !doneSet[i])
    .map(i => ({ i, title: exercises[i].title || EX_LABEL[exercises[i].type] || 'Exercício' }));

  // Ponto de retomada: a home lê isto para dizer "continue de onde parou".
  // Só no navegador de quem estuda — nada sai daqui.
  useEffect(() => {
    if (!l.track) return;
    try {
      window.localStorage.setItem(`bh:last:${clientId}:${l.track}`, JSON.stringify({
        num: l.num, title: l.title, order: position?.index || l.trackOrder || l.num,
      }));
    } catch { /* navegador sem localStorage: só não lembra */ }
  }, [clientId, l.track, l.num, l.title, l.trackOrder, position?.index]);

  // Conclusão persistida (localStorage + Vercel Blob). Assim que os exercícios
  // corrigíveis são respondidos, a lição "acende" na trilha e continua acesa no
  // próximo acesso — inclusive de outro aparelho. Falha de rede não atrapalha:
  // o estudo segue igual, só não sincroniza.
  const identity = useIdentity();
  const { done: savedDone, markDone: persistDone } = useLessonDone(identity?.student, l.num);
  useEffect(() => {
    if (allDone) persistDone();
  }, [allDone, persistDone]);
  const lessonComplete = allDone || savedDone;

  // Um exercício, no formato certo para o seu `type`. Extraído do JSX só para
  // que cada bloco possa ser embrulhado numa div com id — nada mudou aqui.
  function renderExercise(ex, i) {
    if (RACIONAL_TYPES.includes(ex.type)) {
      return <Exercise exercise={ex} levelId="starter" onResult={() => markDone(i)} />;
    }
    if (ex.type === 'wordBank') return <WordBank ex={ex} c={c} onChecked={() => markDone(i)} />;
    if (ex.type === 'verbFill' || ex.type === 'quickDrill') return <VerbFill ex={ex} c={c} onChecked={() => markDone(i)} />;
    if (ex.type === 'readAloud') return <ReadAloud ex={ex} c={c} voiceType={voiceType} />;
    if (ex.type === 'makeItYourOwn') return <MakeItYourOwn ex={ex} c={c} voiceType={voiceType} />;
    if (BH_EXTRA_TYPES.includes(ex.type)) {
      return <BhExercise ex={ex} c={c} voiceType={voiceType} seed={(l.num || 1) * 31 + i} onChecked={() => markDone(i)} />;
    }
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: offWhite, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: text, WebkitFontSmoothing: 'antialiased' }}>
      {/* Chrome */}
      <div style={{ background: navy, color: '#fff' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Link href={`/${clientId}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            {school && <img src={school} alt="Alumni" style={{ height: 24 }} />}
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>Baker Hughes</span>
          </Link>
          <Link href={backHref || `/${clientId}`} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>← Trilha</Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${navy}, ${navyLight})`, color: '#fff', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${teal})` }} />
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '34px 24px 30px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: accent, marginBottom: 10 }}>
            {(l.levelLabel || 'Foundations')} · Lesson {l.trackOrder || l.num}
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.1, margin: '0 0 12px' }}>{l.title}</h1>
          <span style={{ display: 'inline-block', fontSize: 13, padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}>{l.focus}</span>
        </div>
      </div>

      {/* Onde você está — a lição do dia dentro da trilha, sempre visível */}
      {position?.total > 1 && (
        <YouAreHere position={position} student={student} l={l} c={c} clientId={clientId} />
      )}

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 24px 60px' }}>

        {/* Objective */}
        {l.objective && (
          <Section navy={navy} accent={accent} letter="O" title={l.objectiveLabel || 'Objetivo da lição'} bg={accentLight} border="#B7E4C8">
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65, color: '#20302D' }}>{l.objective}</p>
          </Section>
        )}

        {/* Introduction */}
        {l.intro && (
          <IntroBlock l={l} navy={navy} accent={accent} accentLight={accentLight} grayLight={grayLight} voiceType={voiceType} />
        )}

        {/* Vocabulary */}
        {l.vocab?.length > 0 && (
          <Section navy={navy} accent={accent} letter="V" title="Vocabulary">
            <div style={{ display: 'grid', gap: 10 }}>
              {l.vocab.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: offWhite, border: `1px solid ${grayLight}`, borderRadius: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div><strong style={{ color: navy }}>{v.en}</strong> <span style={{ color: gray }}>— {v.pt}</span></div>
                    {v.example && <div style={{ fontSize: 13.5, color: gray, marginTop: 3, fontStyle: 'italic' }}>e.g. {v.example}</div>}
                  </div>
                  <AudioPlayer text={v.example ? `${v.en}. ${v.example}` : v.en} rate={0.85} label="" small voiceType={voiceType} />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Context */}
        {l.situation && (
          <Section navy={navy} accent={accent} letter="C" title="Context">
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: '#33443F' }}>{l.situation}</p>
            {l.context && (
              <div style={{ marginTop: 14, padding: 14, background: offWhite, border: `1px solid ${grayLight}`, borderRadius: 10, fontStyle: 'italic', fontSize: 15, lineHeight: 1.6 }}>
                "{l.context}"
                <div style={{ marginTop: 10 }}>
                  <AudioPlayer text={l.context} rate={0.95} label="Listen" small voiceType={voiceType} />
                </div>
              </div>
            )}
          </Section>
        )}

        {/* Exercises — merged Racional + Delta types */}
        {exercises.length > 0 && (
          <>
            <PartTitle accent={accent} navy={navy}>{l.practiceLabel || 'Practice · pratique sozinho'}</PartTitle>
            {exercises.map((ex, i) => {
              // O bloco vai dentro de uma <div id="bh-ex-N"> só para o rastreador
              // abaixo conseguir levar o aluno até o exercício que faltou.
              const node = renderExercise(ex, i);
              if (!node) return null;
              return <div key={i} id={`bh-ex-${i}`} style={{ scrollMarginTop: 90 }}>{node}</div>;
            })}
            <PracticeTracker pending={pending} total={totalGradeable} done={doneCount} c={c} />
          </>
        )}

        {/* Insights / Sacadas — curiosidades no lugar da gramática */}
        {l.insights?.cards?.length > 0 && (
          <Insights data={l.insights} c={c} voiceType={voiceType} />
        )}

        {/* Grammar */}
        {l.grammarDetail && (
          <>
            <PartTitle accent={accent} navy={navy}>Grammar of the lesson</PartTitle>
            <Section navy={navy} accent={accent} letter="G" title="Grammar Point">
              <div className="bh-grammar" style={{ fontSize: 15, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: l.grammarDetail }} />
            </Section>
            {l.grammarDeepDive && <GrammarDeepDive dd={l.grammarDeepDive} c={c} />}
          </>
        )}

        {/* Takeaways */}
        {l.takeaways?.length > 0 && (
          <Section navy={navy} accent={accent} letter="✓" title="What I can do now · O que eu já consigo">
            <div style={{ display: 'grid', gap: 8 }}>
              {l.takeaways.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: accentLight, borderRadius: 10 }}>
                  <span style={{ color: accent, fontWeight: 800 }}>✓</span>
                  <span style={{ flex: 1, fontSize: 14.5 }}>{t}</span>
                  <AudioPlayer text={t} rate={0.85} label="" small voiceType={voiceType} />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Q&A self-check */}
        {l.qa?.length > 0 && (
          <Section navy={navy} accent={accent} letter="Q" title="Check yourself · perguntas e respostas">
            <p style={{ fontSize: 13.5, color: gray, margin: '0 0 12px' }}>Responda de cabeça, depois clique para revelar uma resposta-modelo.</p>
            {l.qa.map((qa, i) => (
              <details key={i} style={{ marginBottom: 10, padding: '12px 14px', background: offWhite, border: `1px solid ${grayLight}`, borderRadius: 10 }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, color: navy, fontSize: 14.5 }}>{qa.q || qa.question}</summary>
                <p style={{ margin: '10px 0 0', fontSize: 14, color: '#33443F', lineHeight: 1.6 }}>{qa.a || qa.sampleAnswer}</p>
              </details>
            ))}
          </Section>
        )}

        {/* Lesson complete — aparece quando os exercícios foram feitos, e volta a
            aparecer nos próximos acessos porque a conclusão fica gravada. */}
        {l.celebrate && lessonComplete && (
          <div style={{ margin: '30px 0 8px', padding: '30px 32px', borderRadius: 16, background: `linear-gradient(135deg, ${navy}, ${navyLight})`, color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{ height: 2, width: 28, background: accent }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: accent }}>Lesson complete</span>
              {savedDone && !allDone && (
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4, padding: '3px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.86)' }}>
                  ✓ você já concluiu esta lição
                </span>
              )}
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5, margin: '0 0 6px' }}>{l.celebrate.en}</p>
            <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.5, margin: 0 }}>{l.celebrate.pt}</p>
          </div>
        )}
        {/* Lembrete de uma linha para quem desceu até o fim da página sem
            perceber que ficou exercício por corrigir lá em cima. */}
        {!lessonComplete && totalGradeable > 0 && (
          <PracticeTracker pending={pending} total={totalGradeable} done={doneCount} c={c} compact />
        )}

        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
          {prevNum ? <BhBtn href={`/${clientId}/lesson/${prevNum}`} c={c} outline>← Anterior</BhBtn> : <span />}
          <Link href={backHref || `/${clientId}`} style={{ color: gray, textDecoration: 'none', fontSize: 14 }}>Todas as lições</Link>
          {nextNum ? <BhBtn href={`/${clientId}/lesson/${nextNum}`} c={c}>Próxima lição →</BhBtn> : <span />}
        </div>
      </div>
    </div>
  );
}

/* Nome amigável do exercício quando o JSON não traz `title`. */
const EX_LABEL = {
  wordBank: 'Banco de palavras',
  verbFill: 'Complete com o verbo',
  quickDrill: 'Quick drill',
  matching: 'Associação',
  multipleChoice: 'Múltipla escolha',
  fillGap: 'Complete a lacuna',
  reorder: 'Coloque em ordem',
  writing: 'Escrita',
  dictation: 'Ditado',
  multiSelect: 'Marque todas',
  trueFalse: 'Verdadeiro ou falso',
  categorize: 'Classifique',
  oddOneOut: 'Qual não pertence',
  orderList: 'Coloque em ordem',
  errorSpot: 'Ache o erro',
  highlightPick: 'Destaque',
  dropdownGap: 'Complete a lacuna',
  serialChoice: 'Escolha certa',
  flowChoice: 'Conversa',
  listenChoose: 'Ouça e escolha',
  listenGap: 'Ouça e complete',
  sentenceBuild: 'Monte a frase',
  readingTask: 'Leitura',
  emailTriage: 'Triagem de e-mail',
  swipeChoice: 'Decida rápido',
};

/* ── Rastreador da prática ──────────────────────────────────────────────────
   O material é self-paced: sem professor por perto, o aluno que corrige quase
   tudo vê a lição não fechar e não sabe o que ficou para trás. Este bloco diz
   quantos faltam, NOMEIA cada um e leva até ele num clique. Só conta o que tem
   botão de correção — check-off e read aloud continuam de fora. */
function PracticeTracker({ pending, total, done, c, compact = false }) {
  const navy = c.navy || '#062E2B';
  const accent = c.accent || '#00B04F';
  const gray = c.gray || '#5F7570';
  const grayLight = c.grayLight || '#E2E9E7';
  const offWhite = c.offWhite || '#F5F8F7';
  const falta = pending.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const irPara = (i) => {
    const el = document.getElementById(`bh-ex-${i}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Rodapé: uma linha só, que devolve o aluno ao primeiro exercício pendente.
  if (compact) {
    if (!falta) return null;
    return (
      <div style={{ margin: '30px 0 8px', padding: '16px 20px', borderRadius: 14, background: '#fff', border: `1px dashed ${grayLight}`, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 14.5, color: gray }}>
          <strong style={{ color: navy }}>{falta === 1 ? 'Falta 1 exercício' : `Faltam ${falta} exercícios`}</strong> para esta lição contar como concluída.
        </span>
        <button onClick={() => irPara(pending[0].i)} type="button"
          style={{ padding: '8px 14px', borderRadius: 999, border: `1px solid ${accent}`, background: '#fff', color: navy, fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
          Voltar à prática ↑
        </button>
      </div>
    );
  }

  if (!falta) {
    return (
      <div style={{ margin: '22px 0 6px', padding: '16px 20px', borderRadius: 14, background: '#F2FBF5', border: '1px solid #9AE6B4', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 20 }}>✓</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#248A3D' }}>
          Você corrigiu os {total} exercícios desta lição — ela já conta como concluída.
        </span>
      </div>
    );
  }

  return (
    <div style={{ margin: '22px 0 6px', padding: '20px 22px', borderRadius: 14, background: offWhite, border: `1px solid ${grayLight}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 15.5, fontWeight: 800, color: navy }}>
          {falta === 1 ? 'Falta 1 exercício' : `Faltam ${falta} exercícios`} para concluir esta lição
        </span>
        <span style={{ fontSize: 13, color: gray, fontWeight: 700 }}>{done} de {total} corrigidos</span>
      </div>

      <div style={{ height: 6, borderRadius: 999, background: grayLight, overflow: 'hidden', margin: '11px 0 14px' }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: accent, transition: 'width 0.4s' }} />
      </div>

      <p style={{ margin: '0 0 10px', fontSize: 13.5, color: gray, lineHeight: 1.55 }}>
        Basta clicar em <strong style={{ color: navy }}>Corrigir</strong> (ou <strong style={{ color: navy }}>Verificar respostas</strong>) em cada um — não precisa acertar tudo. Toque no nome para ir direto até ele:
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {pending.map((p) => (
          <button key={p.i} onClick={() => irPara(p.i)} type="button"
            style={{ padding: '8px 14px', borderRadius: 999, border: `1px solid ${accent}`, background: '#fff', color: navy, fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
            {p.title} ↑
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── "Onde você está" — faixa fina abaixo do hero com a lição do dia,
      o tópico atual e o quanto já foi andado na trilha. ── */
function YouAreHere({ position, student, l, c, clientId }) {
  const navy = c.navy || '#062E2B';
  const accent = c.accent || '#00B04F';
  const gray = c.gray || '#5F7570';
  const grayLight = c.grayLight || '#E2E9E7';
  const { index, total, topic, trackName } = position;
  const pct = Math.round((index / total) * 100);
  const firstName = (student || '').split(' ')[0];

  return (
    <div style={{ background: '#fff', borderBottom: `1px solid ${grayLight}` }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: accent, marginBottom: 4 }}>
            {firstName ? `A lição de hoje, ${firstName}` : 'A lição de hoje'}
          </div>
          <div style={{ fontSize: 13.5, color: gray, lineHeight: 1.45 }}>
            <strong style={{ color: navy }}>{index} de {total}</strong>
            {trackName ? ` · ${trackName}` : ''}
            {topic ? ` · tópico: ${topic}` : ''}
          </div>
        </div>
        <div style={{ flex: '1 1 200px', minWidth: 160 }}>
          <div style={{ height: 7, borderRadius: 999, background: grayLight, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: accent, borderRadius: 999, transition: 'width 0.4s' }} />
          </div>
          <div style={{ fontSize: 11.5, color: gray, marginTop: 5, textAlign: 'right' }}>{pct}% da trilha</div>
        </div>
      </div>
    </div>
  );
}

/* ── layout helpers ── */
function stripHtml(html) { return (html || '').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }

/* Introduction with an optional PT translation toggle (l.introPt) */
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
        <AudioPlayer text={stripHtml(Array.isArray(l.intro) ? l.intro.join(' ') : l.intro)} rate={0.95} label="Listen to introduction" voiceType={voiceType} />
        {ptHtml && (
          <button onClick={() => setShowPt(s => !s)} style={{ padding: '9px 16px', borderRadius: 999, border: `1px solid ${grayLight}`, background: '#fff', color: navy, fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}>
            {showPt ? 'Ocultar tradução' : '🇧🇷 Ver tradução'}
          </button>
        )}
      </div>
    </Section>
  );
}

/* Sacadas — bilingual "did you know" cards (replaces the grammar block) */
function Insights({ data, c, voiceType }) {
  const navy = c.navy || '#062E2B';
  const navyLight = c.navyLight || '#0E4A44';
  const accent = c.accent || '#00B04F';
  return (
    <>
      <PartTitle accent={accent} navy={navy}>{data.kicker || 'Sacadas · did you know?'}</PartTitle>
      <div style={{ background: `linear-gradient(135deg, ${navy}, ${navyLight})`, borderRadius: 16, padding: '24px 22px', marginBottom: 16, color: '#fff', boxShadow: '0 10px 34px rgba(6,46,43,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ height: 2, width: 24, background: accent }} />
          {data.title && <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>{data.title}</h3>}
        </div>
        {data.intro && <p style={{ margin: '0 0 18px', fontSize: 14.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 }}>{data.intro}</p>}
        <div style={{ display: 'grid', gap: 10 }}>
          {data.cards.map((card, i) => <InsightCard key={i} card={card} c={c} voiceType={voiceType} />)}
        </div>
      </div>
    </>
  );
}
function InsightCard({ card, c, voiceType }) {
  const accent = c.accent || '#00B04F';
  const [showPt, setShowPt] = useState(false);
  return (
    <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 12 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ color: accent, fontWeight: 800, fontSize: 15, lineHeight: 1.5 }}>◆</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15.5, lineHeight: 1.6, fontWeight: 500, color: '#fff' }}>{card.en}</div>
          {showPt && card.pt && (
            <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.72)', fontStyle: 'italic' }}>{card.pt}</div>
          )}
          <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <AudioPlayer text={card.en} rate={0.9} label="" small voiceType={voiceType} />
            {card.pt && (
              <button onClick={() => setShowPt(s => !s)} style={{ padding: '5px 12px', borderRadius: 999, border: 'none', background: 'transparent', color: accent, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', textDecoration: 'underline' }}>
                {showPt ? 'ocultar tradução' : 'tradução'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ navy, accent, letter, title, children, bg = '#fff', border = '#E2E9E7' }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: '20px 22px', marginBottom: 16, boxShadow: '0 1px 4px rgba(6,46,43,0.04)' }}>
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
      <span style={{ height: 1, flex: 1, background: '#E2E9E7' }} />
    </div>
  );
}
function BhBtn({ href, c, children, outline }) {
  const accent = c.accent || '#00B04F';
  const navy = c.navy || '#062E2B';
  return (
    <Link href={href} style={{
      padding: '11px 20px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 14,
      background: outline ? '#fff' : accent, color: outline ? navy : '#fff',
      border: outline ? '1px solid #E2E9E7' : 'none',
    }}>{children}</Link>
  );
}

/* ── Delta-style self-study exercises (auto-corrected) ── */

function WordBank({ ex, c, onChecked }) {
  const accent = c.accent || '#00B04F';
  const navy = c.navy || '#062E2B';
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const items = ex.items || [];
  const isRight = (i) => normalize(answers[i]) === normalize(items[i].answer);
  const allFilled = items.every((_, i) => answers[i]);

  return (
    <ExShell title={ex.title} c={c} badge="Word bank">
      {ex.instruction && <p style={{ fontSize: 14, color: c.gray, margin: '0 0 10px', lineHeight: 1.5 }}>{ex.instruction}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, padding: 12, background: c.accentLight || '#E4F7EC', borderRadius: 10 }}>
        {(ex.bank || []).map((w, i) => <span key={i} style={{ padding: '5px 12px', background: '#fff', border: `1px solid ${accent}`, borderRadius: 999, fontSize: 13.5, fontWeight: 600, color: navy }}>{w}</span>)}
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((it, i) => {
          const parts = (it.text || '').split('___');
          return (
            <div key={i} style={{ fontSize: 15, lineHeight: 1.7 }}>
              {parts[0]}
              <select value={answers[i] || ''} onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))} disabled={checked && isRight(i)}
                style={{ margin: '0 4px', padding: '4px 8px', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', border: `2px solid ${checked ? (isRight(i) ? '#9AE6B4' : '#FEB2B2') : '#E2E9E7'}`, background: checked ? (isRight(i) ? '#F0FFF4' : '#FFF5F5') : '#fff' }}>
                <option value="">…</option>
                {(ex.bank || []).map((w, j) => <option key={j} value={w}>{w}</option>)}
              </select>
              {parts.slice(1).join('___')}
            </div>
          );
        })}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(); }} onReset={() => setAnswers({})} canCheck={allFilled} c={c} />
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
                style={{ margin: '0 4px', padding: '4px 10px', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', width: 120, border: `2px solid ${checked ? (isRight(i) ? '#9AE6B4' : '#FEB2B2') : '#E2E9E7'}`, background: checked ? (isRight(i) ? '#F0FFF4' : '#FFF5F5') : '#fff' }} />
              {parts.slice(1).join('___')}
            </div>
          );
        })}
      </div>
      <CheckRow checked={checked} setChecked={(v) => { setChecked(v); if (v && onChecked) onChecked(); }} onReset={() => setAnswers({})} canCheck={allFilled} c={c} />
      {checked && <ResultLine ok={items.every((_, i) => isRight(i))} c={c} explanation={ex.explanation} corrections={items.map((it, i) => !isRight(i) ? `${it.prompt.replace('___', `[${it.answer}]`)}` : null).filter(Boolean)} />}
    </ExShell>
  );
}

function ReadAloud({ ex, c, voiceType }) {
  return (
    <ExShell title={ex.title} c={c} badge="Read aloud">
      <p style={{ fontSize: 13.5, color: c.gray, margin: '0 0 12px', lineHeight: 1.5 }}>{ex.instruction || 'Ouça e leia cada frase em voz alta. Grave para comparar sua pronúncia.'}</p>
      <div style={{ display: 'grid', gap: 14 }}>
        {(ex.sentences || []).map((s, i) => (
          <div key={i} style={{ padding: 14, background: c.offWhite || '#F5F8F7', border: `1px solid ${c.grayLight || '#E2E9E7'}`, borderRadius: 12 }}>
            <div style={{ fontSize: 15.5, fontWeight: 500, marginBottom: 10 }}>{s}</div>
            <AudioPlayer text={s} rate={0.85} label="Listen" small voiceType={ex.voice || voiceType} />
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
  const navy = c.navy || '#062E2B';
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
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `2px solid ${wc >= min ? '#9AE6B4' : c.grayLight || '#E2E9E7'}`, fontSize: 15, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5 }} />
              <div style={{ fontSize: 12, color: wc >= min ? '#2F855A' : c.gray, marginTop: 4 }}>{wc} palavra(s){wc < min ? ` · escreva pelo menos ${min}` : ' ✓'}</div>
            </div>
          );
        })}
      </div>
    </ExShell>
  );
}

/* shared exercise chrome for the self-study types */
function ExShell({ title, c, badge, children }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${c.grayLight || '#E2E9E7'}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        {badge && <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 999, background: c.accentLight || '#E4F7EC', color: c.navy || '#062E2B' }}>{badge}</span>}
        <h4 style={{ margin: 0, fontSize: 16 }}>{title}</h4>
      </div>
      {children}
    </div>
  );
}
function CheckRow({ checked, setChecked, onReset, canCheck, c }) {
  const accent = c.accent || '#00B04F';
  return (
    <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
      {!checked ? (
        <button onClick={() => setChecked(true)} disabled={!canCheck} style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: canCheck ? accent : '#CBD5D2', color: '#fff', fontWeight: 700, fontSize: 14, cursor: canCheck ? 'pointer' : 'not-allowed' }}>Corrigir</button>
      ) : (
        <button onClick={() => { setChecked(false); onReset(); }} style={{ padding: '10px 18px', borderRadius: 8, border: `1px solid ${c.grayLight || '#E2E9E7'}`, background: '#fff', color: c.text || '#20302D', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Tentar de novo</button>
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
  const navy = c.navy || '#062E2B';
  const gray = c.gray || '#5F7570';
  return (
    <div style={{ background: '#fff', border: `1px solid ${c.grayLight || '#E2E9E7'}`, borderRadius: 16, padding: '20px 22px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: c.teal || '#009CA6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>G+</span>
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
      {dd.quickPractice?.length > 0 && (
        <ol style={{ paddingLeft: 20, margin: '14px 0 0' }}>
          {dd.quickPractice.map((p, i) => (
            <li key={i} style={{ marginBottom: 10 }}>
              <div>{p.q}</div>
              <details><summary style={{ cursor: 'pointer', color: c.accent || '#00B04F', fontSize: 13 }}>Ver resposta</summary><div style={{ fontWeight: 700, color: '#2F855A', marginTop: 4 }}>{p.a}</div></details>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
