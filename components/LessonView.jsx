'use client';

import Link from 'next/link';
import AudioPlayer from './AudioPlayer';
import VocabChip from './VocabChip';
import Exercise from './Exercise';
import SpeakingExercise from './SpeakingExercise';
import Icon from './Icon';
import { useIdentity, useLessonDone } from './czarnikow-teste/progress';

function stripHtml(html) {
  return html?.replace(/<br>/g, ' ').replace(/<[^>]+>/g, '').trim() || '';
}

// Convert "<h4>Watch Out!</h4>" + following block into a styled CUIDADO banner.
// Captures the heading and the next sibling block (paragraph or div) up to the next <h4>.
function styleWatchOut(html) {
  if (!html) return html;
  const re = /<h4[^>]*>\s*(?:Watch\s*Out!?|Cuidado!?|Atenção!?)[^<]*<\/h4>\s*([\s\S]*?)(?=<h4|$)/gi;
  return html.replace(re, (_match, body) => {
    return `
      <div class="watch-out-banner">
        <div class="wob-sign">!</div>
        <div class="wob-text">
          <span class="wob-label">Cuidado</span>
          <span class="wob-title">Erro comum em português → inglês</span>
        </div>
      </div>
      <div class="watch-out-content">${body}</div>
    `;
  });
}

function extractAudioText(content) {
  const emMatches = [...(content || '').matchAll(/<em>"?([^<]+)"?<\/em>/g)];
  if (emMatches.length > 0) {
    return emMatches.map(m => m[1].replace(/"/g, '').trim()).join('. ');
  }
  return '';
}

function isAudioExercise(title) {
  return /Listening|Pronunciation|drill|Read aloud/i.test(title || '');
}

// Voice rotation by module: US male, US female, GB male, GB female
const VOICE_CYCLE = ['us-male', 'us-female', 'gb-male', 'gb-female'];
const VOICE_LABELS = {
  'us-male': 'American male',
  'us-female': 'American female',
  'gb-male': 'British male',
  'gb-female': 'British female',
  'james': 'James · RP',
  'oliver': 'Oliver · London',
  'harry': 'Harry · British',
  'sophie': 'Sophie · RP',
  'emily': 'Emily · London',
  'charlotte': 'Charlotte · British',
};

function getModuleVoice(lessonNum) {
  const moduleIndex = Math.floor((lessonNum - 1) / 8);
  return VOICE_CYCLE[moduleIndex % VOICE_CYCLE.length];
}

const LEVEL_LABEL = {
  confidence: 'Confidence',
  essentials: 'Essentials',
  rise: 'Rise',
  apex: 'Apex'
};
const TRACK_LABEL = {
  'general-business': 'General Business',
  'hr': 'Human Resources',
  'trade-finance': 'Trade & Finance',
  'information-technology': 'Information Technology',
  'fiscal-taxes': 'Fiscal & Taxes',
  'accounting': 'Accounting',
  'supply-chain': 'Supply Chain',
  'logistics': 'Logistics',
  'uk-england': 'UK & England'
};

export default function LessonView({ lesson, lessonIndex, totalLessons, clientId, backHref, course, prevNum: prevNumProp, nextNum: nextNumProp }) {
  const l = lesson;
  const isOutdoor = l.type === 'outdoor';
  // Progresso "acende a lição" — SÓ no ambiente de teste do Czarnikow (aditivo).
  const cztProgress = clientId === 'czarnikow-teste';
  const cztIdentity = useIdentity(cztProgress);
  const cztLesson = useLessonDone(cztProgress ? cztIdentity?.student : null, l.num);
  // Navigation by real lesson `num`. The page passes prevNum/nextNum scoped to the
  // same level+track (correct for Czarnikow, where num !== index+1). Fall back to the
  // legacy index-based math only for older sequential courses that don't pass them.
  const prevNum = prevNumProp !== undefined
    ? prevNumProp
    : (lessonIndex > 0 ? lessonIndex : null);
  const nextNum = nextNumProp !== undefined
    ? nextNumProp
    : (lessonIndex < totalLessons - 1 ? lessonIndex + 2 : null);
  // Prefer lesson-assigned character (Czarnikow), fall back to module rotation (APS)
  const voiceType = l.character || getModuleVoice(l.num);
  const voiceLabel = l.characterName
    ? `${l.characterName} · ${l.characterAccent || 'British'}`
    : VOICE_LABELS[voiceType] || voiceType;
  const allLessonsHref = backHref || `/${clientId}`;

  // Vocab rendering
  const hasObjectVocab = l.vocab?.[0] && typeof l.vocab[0] === 'object';
  const isReviewVocab = !hasObjectVocab && l.vocab?.[0] && (
    l.vocab[0].startsWith('Review') || l.vocab[0].startsWith('No new') || l.vocab[0].startsWith('Nenhum')
  ) || (hasObjectVocab && l.vocab?.[0]?.en === 'Review');

  // Detect typed exercises (new APS / FAAP-style lessons)
  const isTypedLesson = l.exercises?.[0]?.type !== undefined;

  return (
    <>
      {/* Lesson hero */}
      <div className="lesson-hero">
        {l.heroImage && (
          <div className="lesson-hero-bg" style={{ backgroundImage: `url(${l.heroImage})` }} />
        )}
        <div className="lesson-hero-inner">
          <div className="lesson-label">{LEVEL_LABEL[l.level] || ''} · {TRACK_LABEL[l.track] || ''} · Lesson {l.trackOrder || l.num}</div>
          <h1>{l.title}</h1>
          <span className="lesson-focus" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
            {l.focus}
          </span>
          <span className="lesson-focus lesson-voice-badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.1)', marginLeft: 8, fontSize: 11 }}>
            🎙 {voiceLabel}
          </span>
        </div>
      </div>

      {/* Nav */}
      <div className="lesson-nav-row">
        {prevNum ? (
          <Link href={`/${clientId}/lesson/${prevNum}`} className="btn btn-outline">← Previous</Link>
        ) : <span />}
        {cztProgress && (
          <Link href={allLessonsHref} className="btn btn-outline" style={{ fontWeight: 600 }}>
            ☰ Voltar à trilha
          </Link>
        )}
        {nextNum ? (
          <Link href={`/${clientId}/lesson/${nextNum}`} className="btn btn-outline">Next →</Link>
        ) : <span />}
      </div>

      {/* Lesson body */}
      <div className="lesson-body">

        {/* Teacher Guide — collapsed by default, click to expand */}
        {l.teacherGuide && (
          <details
            className="lesson-section"
            style={{
              background: '#FFF8E1',
              border: '1px solid #F5D976',
              borderRadius: 12,
              padding: 0,
              marginBottom: 24,
              overflow: 'hidden',
            }}
          >
            <summary style={{
              cursor: 'pointer',
              fontWeight: 700,
              color: '#8C6A00',
              fontSize: 15,
              listStyle: 'none',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
            }}>
              <span>Teacher Guide · Plano da atividade de hoje</span>
              <span style={{ fontSize: 12, color: '#B8960A' }}>tap to expand</span>
            </summary>
            <div style={{ padding: '0 20px 20px' }}>
              {l.teacherGuide.overview && (
                <p style={{ fontSize: 14, lineHeight: 1.65, color: '#5A4A1F', marginTop: 0 }}>
                  {l.teacherGuide.overview}
                </p>
              )}

              {/* Outdoor lessons → field-activity menu */}
              {Array.isArray(l.teacherGuide.fieldActivities) ? (
                <>
                  {l.teacherGuide.openingRitual && (
                    <>
                      <h4 style={sectionH4Outdoor()}>
                        <Icon name="flag" size={14} color="#8C6A00" />
                        <span>Ritual de abertura — celular como apoio</span>
                      </h4>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: '#5A4A1F', margin: 0, padding: '12px 14px', background: '#FFFCF0', border: '1px dashed #E8C786', borderRadius: 8 }}>
                        {l.teacherGuide.openingRitual}
                      </p>
                    </>
                  )}

                  <h4 style={sectionH4Outdoor('20px 0 10px')}>
                    <Icon name="target" size={14} color="#8C6A00" />
                    <span>Sugestões de atividades em campo (escolha quais e em que ordem)</span>
                  </h4>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {l.teacherGuide.fieldActivities.map((a, i) => (
                      <div key={i} style={{ background: '#FFFFFF', border: '1px solid #F5D976', borderRadius: 10, padding: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#5A4A1F' }}>{i + 1}. {a.title}</span>
                          {a.format && (
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 980, background: '#FEEBC8', color: '#8C6A00' }}>{a.format}</span>
                          )}
                          {a.location && (
                            <span style={{ fontSize: 11, color: '#8C6A00', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <Icon name="pin" size={11} color="#8C6A00" />
                              {a.location}
                            </span>
                          )}
                        </div>
                        {a.instructions && (
                          <div style={{ fontSize: 13, color: '#5A4A1F', lineHeight: 1.55 }}>{a.instructions}</div>
                        )}
                        {a.evaluation && (
                          <div style={{ fontSize: 12, color: '#8C6A00', marginTop: 6, paddingTop: 6, borderTop: '1px dashed #F0D080', fontStyle: 'italic' }}>
                            <strong>Avaliar:</strong> {a.evaluation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {l.teacherGuide.vocabPeek && (
                    <>
                      <h4 style={sectionH4Outdoor('20px 0 8px')}>
                        <Icon name="eye" size={14} color="#8C6A00" />
                        <span>Espiadinha permitida no app</span>
                      </h4>
                      <p style={{ fontSize: 13, lineHeight: 1.55, color: '#5A4A1F', margin: 0 }}>{l.teacherGuide.vocabPeek}</p>
                    </>
                  )}

                  {Array.isArray(l.teacherGuide.evaluationFocus) && l.teacherGuide.evaluationFocus.length > 0 && (
                    <>
                      <h4 style={sectionH4Outdoor('20px 0 8px')}>
                        <Icon name="check" size={14} color="#8C6A00" />
                        <span>Foco de avaliação</span>
                      </h4>
                      <ul style={{ paddingLeft: 22, margin: 0 }}>
                        {l.teacherGuide.evaluationFocus.map((c, i) => (
                          <li key={i} style={{ marginBottom: 4, fontSize: 13, lineHeight: 1.55, color: '#5A4A1F' }}>{c}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {l.teacherGuide.wrapUpRitual && (
                    <>
                      <h4 style={sectionH4Outdoor('20px 0 8px')}>
                        <Icon name="film" size={14} color="#8C6A00" />
                        <span>Ritual de fechamento</span>
                      </h4>
                      <p style={{ fontSize: 13, lineHeight: 1.55, color: '#5A4A1F', margin: 0 }}>{l.teacherGuide.wrapUpRitual}</p>
                    </>
                  )}
                </>
              ) : Array.isArray(l.teacherGuide.lessonFlow) && l.teacherGuide.lessonFlow.length > 0 ? (
                /* Classic in-class flow → render the actual lessonFlow array */
                <>
                  <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#8C6A00', margin: '16px 0 10px' }}>
                    Lesson Flow
                  </h4>
                  <ol style={{ paddingLeft: 22, margin: 0 }}>
                    {l.teacherGuide.lessonFlow.map((s, i) => (
                      <li key={i} style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.55 }}>
                        <strong>{s.what || `Passo ${i + 1}`}</strong>
                        {s.duration && <span style={{ color: '#8C6A00', fontSize: 12, marginLeft: 8 }}>({s.duration})</span>}
                        {s.instructions && <div style={{ color: '#5A4A1F', marginTop: 2, whiteSpace: 'pre-wrap' }}>{s.instructions}</div>}
                      </li>
                    ))}
                  </ol>
                </>
              ) : null}

              {/* Banco de exercícios extras — feitos pelo professor, não estão no app.
                  Cada bloco tem o gabarito/resposta-modelo em verde ao lado. */}
              {Array.isArray(l.teacherGuide.extraPractice) && l.teacherGuide.extraPractice.length > 0 && (
                <>
                  <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#8C6A00', margin: '22px 0 10px' }}>
                    Exercícios extras · não estão no app — faça com o aluno
                  </h4>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {l.teacherGuide.extraPractice.map((b, bi) => (
                      <div key={bi} style={{ background: '#FFFFFF', border: '1px solid #F5D976', borderRadius: 10, padding: 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#5A4A1F', marginBottom: b.note ? 2 : 8 }}>{b.title}</div>
                        {b.note && <div style={{ fontSize: 12, color: '#8C6A00', fontStyle: 'italic', marginBottom: 8 }}>{b.note}</div>}
                        <ol style={{ paddingLeft: 20, margin: 0 }}>
                          {(b.items || []).map((it, ii) => (
                            <li key={ii} style={{ marginBottom: 6, fontSize: 13, lineHeight: 1.55, color: '#5A4A1F' }}>
                              <span>{it.q}</span>
                              {it.a && <span style={{ color: '#1B7A3D', fontWeight: 600 }}>{`   →   ${it.a}`}</span>}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {l.teacherGuide.commonChallenges?.length > 0 && (
                <>
                  <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#8C6A00', margin: '20px 0 10px' }}>
                    Common Challenges
                  </h4>
                  <ul style={{ paddingLeft: 22, margin: 0 }}>
                    {l.teacherGuide.commonChallenges.map((c, i) => (
                      <li key={i} style={{ marginBottom: 6, fontSize: 14, lineHeight: 1.55, color: '#5A4A1F' }}>{c}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </details>
        )}

        {l.level === 'confidence' && (
          <div style={{
            margin: '20px 0 24px',
            padding: '14px 20px',
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            border: '1px solid #F59E0B',
            borderRadius: 12,
            color: '#78350F',
            fontSize: 14,
            fontWeight: 500,
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            💛 English comes in <strong>CAN's</strong>, not in <strong>CAN'Ts</strong>. Vá no seu ritmo!
          </div>
        )}

        {/* === OUTDOOR LESSON STUDENT BRIEFING === */}
        {isOutdoor && (
          <OutdoorStudentBriefing lesson={l} clientId={clientId} />
        )}

        {/* === IN CLASS EXERCISES (only for in-class lessons) === */}
        {!isOutdoor && <h2 className="part-title">IN CLASS EXERCISES</h2>}

        {/* 1. Objective of the class */}
        {!isOutdoor && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">O</div> Objective of the class
            </div>
            <p>{l.objective}</p>
          </div>
        )}

        {!isOutdoor && (
        <>
        {/* 2. Introduction */}
        {l.intro && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">I</div> Introduction
            </div>
            <div className="intro-box">
              <p dangerouslySetInnerHTML={{ __html: l.intro }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <AudioPlayer key={`intro-${l.num}`} text={stripHtml(l.intro)} audioUrl={l.audio?.intro} rate={0.95} label="Listen to introduction" voiceType={voiceType} />
            </div>
          </div>
        )}

        {/* 3. Vocabulary */}
        <div className="lesson-section">
          <div className="section-title">
            <div className="section-icon">V</div> Vocabulary
          </div>
          {isReviewVocab ? (
            <p>{typeof l.vocab[0] === 'object' ? (l.vocab[0].pt || l.vocab[0].en) : l.vocab[0]}</p>
          ) : hasObjectVocab ? (
            <div className="vocab-list">
              {l.vocab.map((v, i) => (
                <div key={i} className="vocab-row">
                  <div className="vocab-body">
                    <div className="vocab-row-words">
                      <span className="vocab-en">{v.en}</span>
                      <span className="vocab-pt"> — {v.pt}</span>
                    </div>
                    {v.example && (
                      <div className="vocab-example">
                        <em>e.g.</em> {v.example}
                      </div>
                    )}
                  </div>
                  <div className="vocab-audio">
                    <AudioPlayer
                      key={`vocab-${l.num}-${i}`}
                      text={v.example ? `${v.en}. ${v.example}` : v.en}
                      rate={0.85}
                      label=""
                      small
                      voiceType={voiceType}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="vocab-grid">
              {l.vocab?.map((v, i) => (
                <span key={i} className="vocab-chip">{v}</span>
              ))}
            </div>
          )}

          {/* Vocabulary Practice — exercise[2] shown right after vocab (legacy Czarnikow) */}
          {!isTypedLesson && l.exercises?.[2] && (() => {
            const ex = l.exercises[2];
            const isReadAloud = /Read aloud|Listening|Pronunciation/i.test(ex.title || '');
            const parenMatches = !isReadAloud ? [...(ex.content || '').matchAll(/([a-j])\)[^(]*\(([^)]{1,40})\)/g)] : [];
            const hasRealAnswers = parenMatches.length > 0 && parenMatches.every(m => !m[2].includes('/'));
            const contentWithout = hasRealAnswers ? ex.content.replace(/\s*\(([^)/]{1,40})\)/g, '') : ex.content;
            const answers = hasRealAnswers ? parenMatches.map(m => m[1] + ') ' + m[2]) : [];
            return (
              <div className="exercise-item" style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span className="exercise-num">V</span>
                  <span className="exercise-title">Vocabulary Practice</span>
                </div>
                <div className="exercise-content" dangerouslySetInnerHTML={{ __html: contentWithout }} />
                {(answers.length > 0 || ex.answers?.length > 0) && (
                  <details style={{ marginTop: 12 }}>
                    <summary style={{ cursor: 'pointer', color: 'var(--accent, #2AAAE2)', fontSize: 13, fontWeight: 600 }}>Show answers</summary>
                    <div style={{ marginTop: 8, padding: 12, background: '#F0FFF4', borderRadius: 8, border: '1px solid #C6F6D5', fontSize: 14, color: '#2F855A', lineHeight: 1.8 }}>
                      {(ex.answers || answers).map((a, j) => <div key={j}>{a}</div>)}
                    </div>
                  </details>
                )}
              </div>
            );
          })()}
        </div>

        {/* 4. Context */}
        <div className="lesson-section">
          <div className="section-title">
            <div className="section-icon">C</div> Context
          </div>
          <div className="context-box">
            <p>{l.situation}</p>
          </div>
          {l.context && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: '#8892A4', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>
                Read aloud · Leia em voz alta
              </div>
              <div style={{
                padding: 14,
                background: '#FFFFFF',
                border: '1px solid #E4E9EF',
                borderRadius: 10,
                fontSize: 15,
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}>
                "{l.context}"
              </div>
              <div style={{ marginTop: 10 }}>
                <AudioPlayer key={`ctx-${l.num}`} text={l.context} audioUrl={l.audio?.context} rate={0.95} label="Listen to context" voiceType={voiceType} />
              </div>
              <SpeakingExercise mode="read" targetText={l.context} levelId={l.level || 'starter'} lang="en-US" />
            </div>
          )}
        </div>

        {/* 5. Role Plays (moved up) */}
        {l.extendedExercises?.rolePlays?.length > 0 && l.extendedExercises.rolePlays[0] && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">R</div> Role Play
            </div>
            {l.extendedExercises.rolePlays.filter(Boolean).map((rp, i) => (
              <div key={i} className="lesson-card-box" style={{ marginBottom: 24, padding: 16, background: '#F9FAFB', borderRadius: 10, border: '1px solid var(--gray-light, #E4E9EF)' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: 15 }}>{rp.title}</h4>
                <p style={{ fontSize: 14, color: 'var(--gray)', margin: '0 0 10px' }}><strong>Setup:</strong> {rp.setup}</p>
                {rp.studentA && <p style={{ fontSize: 14, margin: '0 0 6px' }}><strong>Student A:</strong> {rp.studentA}</p>}
                {rp.studentB && <p style={{ fontSize: 14, margin: '0 0 12px' }}><strong>Student B:</strong> {rp.studentB}</p>}
                {rp.sampleDialogue?.length > 0 && (
                  <>
                    <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--gray)', margin: '12px 0 6px' }}>Sample dialogue</p>
                    <div style={{ padding: 12, background: 'white', borderRadius: 6, fontSize: 13, lineHeight: 1.6 }}>
                      {rp.sampleDialogue.map((line, j) => <div key={j} style={{ marginBottom: 4 }}>{line}</div>)}
                    </div>
                  </>
                )}
                {rp.successCriteria && (
                  <p style={{ fontSize: 13, color: 'var(--gray)', margin: '12px 0 0' }}>
                    <strong>Success:</strong> {rp.successCriteria}
                  </p>
                )}
                {rp.teacherNotes && (
                  <p style={{ fontSize: 13, color: '#8C6A00', margin: '8px 0 0', padding: 10, background: '#FFF8E1', borderRadius: 6 }}>
                    <strong>Teacher note:</strong> {rp.teacherNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 6. Additional Audios (moved up) */}
        {l.extendedExercises?.additionalAudios?.length > 0 && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">A</div> Additional Audios
            </div>
            {l.extendedExercises.additionalAudios.map((audio, i) => (
              <div key={i} className="lesson-card-box" style={{ marginBottom: 24, padding: 16, background: '#F9FAFB', borderRadius: 10, border: '1px solid var(--gray-light, #E4E9EF)' }}>
                <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>{audio.title}</h4>
                <div style={{ padding: 12, background: 'white', borderRadius: 6, fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                  {audio.transcript}
                </div>
                <AudioPlayer text={audio.transcript} rate={0.85} label="Listen" voiceType={audio.speaker || voiceType} />
                {audio.tasks?.length > 0 && (
                  <ol style={{ paddingLeft: 22, marginTop: 12, marginBottom: 0 }}>
                    {audio.tasks.map((t, j) => (
                      <li key={j} style={{ marginBottom: 4, fontSize: 14, lineHeight: 1.5 }}>{t}</li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 7. Exercises */}
        <div className="lesson-section">
          <div className="section-title">
            <div className="section-icon">E</div> Exercises
          </div>
          {/* Typed exercises (new APS lessons) */}
          {isTypedLesson && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {l.exercises.map((ex, i) => (
                <Exercise key={i} exercise={ex} levelId={l.level || 'starter'} />
              ))}
            </div>
          )}
          {/* Legacy HTML exercises (Czarnikow) */}
          {!isTypedLesson && l.exercises?.filter((_, i) => i !== 2).map((ex, i) => {
            const audioText = isAudioExercise(ex.title) ? extractAudioText(ex.content) : '';
            const isReadAloud = /Read aloud|Listening|Pronunciation/i.test(ex.title || '');
            const parenMatches = !isReadAloud ? [...(ex.content || '').matchAll(/([a-j])\)[^(]*\(([^)]{1,40})\)/g)] : [];
            const hasRealAnswers = parenMatches.length > 0 && parenMatches.every(m => !m[2].includes('/'));
            const contentWithout = hasRealAnswers
              ? ex.content.replace(/\s*\(([^)/]{1,40})\)/g, '')
              : ex.content;
            const answers = hasRealAnswers
              ? parenMatches.map(m => m[1] + ') ' + m[2])
              : [];
            return (
              <div key={i} className="exercise-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span className="exercise-num">{i + 1}</span>
                  <span className="exercise-title">{ex.title}</span>
                </div>
                <div className="exercise-content" dangerouslySetInnerHTML={{ __html: contentWithout }} />
                {audioText && (
                  <div style={{ marginTop: 10 }}>
                    <AudioPlayer key={`ex-${l.num}-${i}`} text={audioText} rate={0.85} label="Listen" small voiceType={voiceType} />
                  </div>
                )}
                {(answers.length > 0 || ex.answers?.length > 0) && (
                  <details style={{ marginTop: 12 }}>
                    <summary style={{ cursor: 'pointer', color: 'var(--accent, #2AAAE2)', fontSize: 13, fontWeight: 600 }}>Show answers</summary>
                    <div style={{ marginTop: 8, padding: 12, background: '#F0FFF4', borderRadius: 8, border: '1px solid #C6F6D5', fontSize: 14, color: '#2F855A', lineHeight: 1.8 }}>
                      {(ex.answers || answers).map((a, j) => <div key={j}>{a}</div>)}
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>

        {/* 8. Q&A */}
        {l.extendedExercises?.qAndA?.length > 0 && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">Q</div> Questions &amp; Answers
            </div>
            {l.extendedExercises.qAndA.map((qa, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <p style={{ fontWeight: 600, margin: '0 0 4px' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: '#E6F5FC', color: '#1C8FBF', textTransform: 'uppercase', letterSpacing: 0.6, marginRight: 8, fontWeight: 700 }}>
                    {qa.type}
                  </span>
                  {qa.question || qa.q}
                </p>
                <details>
                  <summary style={{ cursor: 'pointer', color: 'var(--accent, #2AAAE2)', fontSize: 13 }}>Show answer</summary>
                  <p style={{ fontSize: 14, color: 'var(--gray)', margin: '6px 0 0' }}>{qa.sampleAnswer || qa.modelAnswer || qa.a}</p>
                </details>
              </div>
            ))}
          </div>
        )}

        {/* Production Tasks — present to teacher */}
        {l.extendedExercises?.productionTasks?.length > 0 && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">P</div> Production Task
            </div>
            {l.extendedExercises.productionTasks.map((pt, i) => (
              <div key={i} style={{ marginBottom: 16, padding: 16, background: '#F0FFF4', borderRadius: 10, border: '1px solid #C6F6D5' }}>
                {pt.type && (
                  <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 999, background: '#C6F6D5', color: '#2F855A', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10, display: 'inline-block', fontWeight: 700 }}>
                    {pt.type}
                  </span>
                )}
                <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.6, color: '#1A202C' }}>
                  {pt.task || pt.prompt}
                </p>
                {pt.successCriteria && (
                  <p style={{ fontSize: 13, color: 'var(--gray)', margin: '10px 0 0' }}>
                    <strong style={{ color: '#2F855A' }}>✓ Success:</strong> {pt.successCriteria}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contextualization — Make It Your Own */}
        {l.extendedExercises?.contextualization?.length > 0 && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">M</div> Make It Your Own
            </div>
            <ol style={{ paddingLeft: 22, margin: 0 }}>
              {l.extendedExercises.contextualization.map((c, i) => (
                <li key={i} style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.6 }}>{c}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Pair Work */}
        {l.extendedExercises?.pairWork?.length > 0 && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">2</div> Pair Work
            </div>
            {l.extendedExercises.pairWork.map((pw, i) => (
              <div key={i} style={{ marginBottom: 16, padding: 14, background: '#F9FAFB', borderRadius: 10, border: '1px solid var(--gray-light, #E4E9EF)' }}>
                {pw.title && <h4 style={{ margin: '0 0 6px', fontSize: 15 }}>{pw.title}</h4>}
                <p style={{ fontSize: 14, margin: '0 0 6px', lineHeight: 1.55 }}>{pw.description || pw.instructions}</p>
                {pw.duration && (
                  <p style={{ fontSize: 12, color: 'var(--gray)', margin: 0 }}>Duration: {pw.duration}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* === EXTRA MATERIAL 1 === */}
        {l.takeaways && l.takeaways.length > 0 && (
          <>
            <h2 className="part-title">{isTypedLesson ? 'O QUE APRENDI HOJE' : 'EXTRA MATERIAL 1'}</h2>
            <div className="lesson-section">
              <div className="section-title">
                <div className="section-icon">✓</div>
                {isTypedLesson ? 'I can / Eu consigo' : 'Sentences I Need to Own'}
              </div>
              <div className="takeaway-box">
                {isTypedLesson && (
                  <div className="takeaway-heading">
                    <span style={{ fontSize: 22 }}>🎯</span>
                    <div>
                      What I learned today
                      <span className="takeaway-heading-pt">O que eu consegui hoje</span>
                    </div>
                  </div>
                )}
                {l.takeaways.map((t, i) => (
                  <div key={i} className="takeaway-item">
                    <span style={{ flex: 1 }}>{t}</span>
                    <AudioPlayer text={t} rate={0.85} label="" small voiceType={voiceType} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* === GRAMMAR OF THE LESSON === */}
        <h2 className="part-title">GRAMMAR OF THE LESSON</h2>

        {/* Grammar Point */}
        <div className="lesson-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>
              <div className="section-icon">G</div> Grammar Point
            </div>
            {/* Áudio só na gramática em INGLÊS (níveis Rise/Apex). Na gramática em PT
                (Confidence) o texto mistura português com termos em inglês soltos
                ("am, is, are", "to be") e a voz confunde os dois — então sem áudio aqui. */}
            {(l.grammarDetail || l.audio?.grammar) && !/[áàâãéêíóôõúüç]/i.test(stripHtml(l.grammarDetail || '')) && (
              <AudioPlayer
                key={`gr-${l.num}`}
                text={`${l.grammar || ''}. ${stripHtml(l.grammarDetail)}`}
                audioUrl={l.audio?.grammar}
                rate={0.95}
                label="Listen"
                small
                voiceType={voiceType}
              />
            )}
          </div>
          <div className="grammar-box" dangerouslySetInnerHTML={{ __html: styleWatchOut(l.grammarDetail) }} />
        </div>

        {/* Think about it — open question with free-mode SpeakingExercise */}
        {l.grammarCriticalQuestion && (
          <div className="lesson-section">
            <div style={{
              padding: '20px 22px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #FFFBEB, #FFFFFF)',
              border: '1px dashed #D69E2E',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: -12,
                left: 18,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.25em',
                color: '#7B5300',
                textTransform: 'uppercase',
                background: '#FFFFFF',
                padding: '2px 10px',
                borderRadius: 999,
                border: '1px solid #D69E2E',
              }}>
                🤔 Think about it
              </div>
              <p style={{ fontSize: 12, color: '#8892A4', margin: '6px 0 10px' }}>
                Não há resposta certa — é pra você pensar em inglês. Toque no microfone e responda como vier, mesmo que seja uma frase curta.
              </p>
              <p style={{ margin: '6px 0 0', fontSize: 16, fontStyle: 'italic', color: '#2D3748', lineHeight: 1.55 }}>
                {l.grammarCriticalQuestion}
              </p>
              <div style={{ marginTop: 10 }}>
                <AudioPlayer key={`crit-${l.num}`} text={l.grammarCriticalQuestion} audioUrl={l.audio?.critical} rate={0.95} label="Listen" small voiceType={voiceType} />
              </div>
              <SpeakingExercise mode="free" levelId={l.level || 'starter'} lang="en-US" />
            </div>
          </div>
        )}

        {/* Grammar Deep Dive */}
        {l.grammarDeepDive && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">G+</div> Grammar Deep Dive
            </div>
            <div className="grammar-box">
              {l.grammarDeepDive.title && <h3 style={{ marginTop: 0 }}>{l.grammarDeepDive.title}</h3>}
              {l.grammarDeepDive.explanation && (
                <div dangerouslySetInnerHTML={{ __html: l.grammarDeepDive.explanation }} />
              )}
              {l.grammarDeepDive.references?.length > 0 && (
                <>
                  <h4 style={{ marginTop: 20, marginBottom: 8, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--gray)' }}>
                    References
                  </h4>
                  <ul style={{ paddingLeft: 20, fontSize: 13, color: 'var(--gray)', margin: 0 }}>
                    {l.grammarDeepDive.references.map((r, i) => <li key={i} style={{ marginBottom: 4 }}>{r}</li>)}
                  </ul>
                </>
              )}
              {l.grammarDeepDive.examples?.length > 0 && (
                <>
                  <h4 style={{ marginTop: 24, marginBottom: 10, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--gray)' }}>
                    Examples ({l.grammarDeepDive.examples.length})
                  </h4>
                  <ol style={{ paddingLeft: 22, margin: 0 }}>
                    {l.grammarDeepDive.examples.map((e, i) => (
                      <li key={i} style={{ marginBottom: 10 }}>
                        <div style={{ fontWeight: 600 }}>{e.en}</div>
                        <div style={{ color: 'var(--gray)', fontSize: 13 }}>{e.pt}</div>
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {l.grammarDeepDive.commonMistakes?.length > 0 && (
                <>
                  <h4 style={{ marginTop: 24, marginBottom: 10, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--gray)' }}>
                    Common Mistakes
                  </h4>
                  {l.grammarDeepDive.commonMistakes.map((m, i) => (
                    <div key={i} style={{ marginBottom: 12, padding: 12, background: '#FFF5F5', borderRadius: 8, borderLeft: '3px solid #E53E3E' }}>
                      <div style={{ color: '#C53030', marginBottom: 2 }}>&#10060; {m.wrong}</div>
                      <div style={{ color: '#2F855A', marginBottom: 4 }}>&#10003; {m.right}</div>
                      <div style={{ fontSize: 13, color: 'var(--gray)' }}>{m.note || m.why || m.tip}</div>
                    </div>
                  ))}
                </>
              )}
              {l.grammarDeepDive.quickPractice?.length > 0 && (
                <>
                  <h4 style={{ marginTop: 24, marginBottom: 10, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--gray)' }}>
                    Quick Practice
                  </h4>
                  <ol style={{ paddingLeft: 22, margin: 0 }}>
                    {l.grammarDeepDive.quickPractice.map((p, i) => (
                      <li key={i} style={{ marginBottom: 14 }}>
                        <div style={{ marginBottom: 4 }}>{p.q}</div>
                        <details>
                          <summary style={{ cursor: 'pointer', color: 'var(--accent, #2AAAE2)', fontSize: 13 }}>Show answer</summary>
                          <div style={{ fontWeight: 600, color: '#2F855A', marginTop: 4, fontSize: 14 }}>{p.a}</div>
                        </details>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </div>
        )}

        </>
        )}

        {/* Concluir lição (Czarnikow · teste) — marca a lição e acende o card na trilha */}
        {cztProgress && cztIdentity?.student && (
          <div style={{
            margin: '32px 0 8px',
            padding: '24px',
            borderRadius: 16,
            textAlign: 'center',
            background: cztLesson.done ? '#F0FBF4' : '#fff',
            border: `2px solid ${cztLesson.done ? '#34C759' : '#e4e9ef'}`,
          }}>
            {cztLesson.done ? (
              <>
                <p style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600, color: '#248A3D' }}>
                  ✓ Lição concluída
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {nextNum && (
                    <Link href={`/${clientId}/lesson/${nextNum}`} className="btn btn-primary">Próxima lição →</Link>
                  )}
                  <Link href={allLessonsHref} className="btn btn-outline">☰ Voltar à trilha</Link>
                  <button onClick={cztLesson.markUndone} className="btn btn-outline" style={{ cursor: 'pointer' }}>
                    Desfazer
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ margin: '0 0 14px', fontSize: 15, color: '#6B7A8F' }}>
                  Terminou esta lição? Marque como concluída para acender a sua trilha.
                </p>
                <button
                  onClick={cztLesson.markDone}
                  className="btn btn-primary"
                  style={{ cursor: 'pointer', fontSize: 16, padding: '12px 28px' }}
                >
                  ✓ Concluir lição
                </button>
              </>
            )}
          </div>
        )}

        {/* Bottom nav */}
        <div className="lesson-bottom-nav">
          {prevNum ? (
            <Link href={`/${clientId}/lesson/${prevNum}`} className="btn btn-outline">← Previous</Link>
          ) : <span />}
          <Link href={allLessonsHref} className="btn btn-outline">{cztProgress ? '☰ Voltar à trilha' : 'All Lessons'}</Link>
          {nextNum ? (
            <Link href={`/${clientId}/lesson/${nextNum}`} className="btn btn-primary">Next →</Link>
          ) : <span />}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OutdoorStudentBriefing — what the student sees on outdoor lessons.
   No exercises, no voice recording, no "Think about it".
   Shows: milestone + celebration (PT/EN), grammar recap, outdoor prep.
   Reads `lesson.studentBriefing` if present; otherwise falls back to the
   lesson's own focus + objective for graceful degradation.
   ───────────────────────────────────────────────────────────────── */
function sectionH4Outdoor(margin = '16px 0 8px') {
  return {
    fontSize: 12, textTransform: 'uppercase', letterSpacing: 1,
    color: '#8C6A00', margin, display: 'flex', alignItems: 'center', gap: 8,
  };
}

function OutdoorStudentBriefing({ lesson, clientId }) {
  const b = lesson.studentBriefing || {};
  const milestone = b.milestone || `Você chegou ao fim do conteúdo dessa parte do curso. Hora de aplicar tudo no porto.`;
  const celebration = b.celebration || `Você não está começando do zero hoje. Você já consegue se virar em inglês em situações reais. Today is the day to use what you know — fora da tela, dentro do museu.`;
  const structures = Array.isArray(b.structures) ? b.structures : [];
  const outdoorPrep = b.outdoorPrep || `Hoje a aula é fora da sala, no Complexo Cultural. Leve o celular carregado, mas a aula é viva. Você pode dar uma espiadinha rápida no app se travar — mas a regra é: olhos no porto, não na tela.`;

  return (
    <>
      <h2 className="part-title" style={{ color: '#B7791F', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name="flag" size={22} color="#B7791F" />
        <span>Aula outdoor — preparação</span>
      </h2>

      {/* Milestone banner */}
      <div style={{
        margin: '0 0 18px',
        padding: '22px 24px',
        borderRadius: 16,
        background: 'linear-gradient(135deg, #FFFCF5 0%, #FEEBC8 100%)',
        border: '1px solid #E8C786',
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: '#B7791F', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="target" size={13} color="#B7791F" />
          <span>Você chegou até aqui</span>
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#7B341E', lineHeight: 1.5, margin: 0 }}>
          {milestone}
        </p>
      </div>

      {/* Celebration / motivational */}
      <div className="lesson-section">
        <div className="section-title">
          <div className="section-icon" style={{ background: '#2F855A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bicep" size={18} color="#FFFFFF" strokeWidth={2} />
          </div>
          Olha de onde você veio
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text)' }}>{celebration}</p>
      </div>

      {/* Structures recap */}
      {structures.length > 0 && (
        <div className="lesson-section">
          <div className="section-title">
            <div className="section-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="list" size={18} color="#FFFFFF" strokeWidth={2} />
            </div>
            O que você já sabe (e vai usar hoje)
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {structures.map((s, i) => (
              <div key={i} style={{
                padding: '14px 16px',
                borderRadius: 10,
                background: '#FFFFFF',
                border: '1px solid var(--gray-light)',
                borderLeft: '4px solid #0071E3',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>{s.title}</div>
                {s.example && (
                  <div style={{ fontSize: 13, color: 'var(--text)', fontStyle: 'italic', marginBottom: 4 }}>
                    e.g. {s.example}
                  </div>
                )}
                {s.whenToUse && (
                  <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--text)' }}>Quando usar:</strong> {s.whenToUse}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outdoor prep */}
      <div className="lesson-section">
        <div className="section-title">
          <div className="section-icon" style={{ background: '#B7791F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="pin" size={18} color="#FFFFFF" strokeWidth={2} />
          </div>
          Como se preparar para hoje
        </div>
        <div style={{
          padding: '16px 18px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #EBF8FF 0%, #FFFFFF 100%)',
          border: '1px solid #BEE3F8',
        }}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text)', margin: 0 }}>{outdoorPrep}</p>
        </div>
      </div>
    </>
  );
}

