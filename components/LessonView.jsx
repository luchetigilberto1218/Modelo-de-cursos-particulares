'use client';

import Link from 'next/link';
import AudioPlayer from './AudioPlayer';
import VocabChip from './VocabChip';

function stripHtml(html) {
  return html?.replace(/<br>/g, ' ').replace(/<[^>]+>/g, '').trim() || '';
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

export default function LessonView({ lesson, lessonIndex, totalLessons, clientId, backHref, course }) {
  const l = lesson;
  const prevNum = lessonIndex > 0 ? lessonIndex : null;
  const nextNum = lessonIndex < totalLessons - 1 ? lessonIndex + 2 : null;
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
  );

  return (
    <>
      {/* Lesson hero */}
      <div className="lesson-hero">
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
              <span>Teacher Guide · {l.teacherGuide.duration || l.teacherGuide.pacing || '90 minutes'}</span>
              <span style={{ fontSize: 12, color: '#B8960A' }}>tap to expand</span>
            </summary>
            <div style={{ padding: '0 20px 20px' }}>
              {l.teacherGuide.overview && (
                <p style={{ fontSize: 14, lineHeight: 1.65, color: '#5A4A1F', marginTop: 0 }}>
                  {l.teacherGuide.overview}
                </p>
              )}
              <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#8C6A00', margin: '16px 0 10px' }}>
                Lesson Flow (90 min) — follows the page order
              </h4>
              <ol style={{ paddingLeft: 22, margin: 0 }}>
                <li style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.55 }}>
                  <strong>Objective of the class</strong>
                  <span style={{ color: '#8C6A00', fontSize: 12, marginLeft: 8 }}>(3 min)</span>
                  <div style={{ color: '#5A4A1F', marginTop: 2 }}>Read the objective aloud. Ask the student what they already know about the topic.</div>
                </li>
                <li style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.55 }}>
                  <strong>Introduction</strong>
                  <span style={{ color: '#8C6A00', fontSize: 12, marginLeft: 8 }}>(10 min)</span>
                  <div style={{ color: '#5A4A1F', marginTop: 2 }}>Play the intro audio once, then read together. Check understanding with 2 quick questions.</div>
                </li>
                <li style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.55 }}>
                  <strong>Vocabulary + Vocabulary Practice</strong>
                  <span style={{ color: '#8C6A00', fontSize: 12, marginLeft: 8 }}>(15 min)</span>
                  <div style={{ color: '#5A4A1F', marginTop: 2 }}>Drill each word with its example. Then do the Vocabulary Practice exercise right after — it uses all 10 words and reinforces them in context. Check with Show answers.</div>
                </li>
                <li style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.55 }}>
                  <strong>Context</strong>
                  <span style={{ color: '#8C6A00', fontSize: 12, marginLeft: 8 }}>(5 min)</span>
                  <div style={{ color: '#5A4A1F', marginTop: 2 }}>Set the scene. Ask the student to imagine themselves in the situation before moving on.</div>
                </li>
                <li style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.55 }}>
                  <strong>Role Play</strong>
                  <span style={{ color: '#8C6A00', fontSize: 12, marginLeft: 8 }}>(15 min)</span>
                  <div style={{ color: '#5A4A1F', marginTop: 2 }}>Run the role play twice, swapping roles. Use the sample dialogue only if the student gets stuck.</div>
                </li>
                <li style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.55 }}>
                  <strong>Additional Audios</strong>
                  <span style={{ color: '#8C6A00', fontSize: 12, marginLeft: 8 }}>(10 min)</span>
                  <div style={{ color: '#5A4A1F', marginTop: 2 }}>Play each audio, then go through the tasks. Replay key sections if needed.</div>
                </li>
                <li style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.55 }}>
                  <strong>Exercises (Read aloud + Complete)</strong>
                  <span style={{ color: '#8C6A00', fontSize: 12, marginLeft: 8 }}>(15 min)</span>
                  <div style={{ color: '#5A4A1F', marginTop: 2 }}>Do the Read aloud for pronunciation, then the fill/complete exercise. Use Show answers for correction.</div>
                </li>
                <li style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.55 }}>
                  <strong>Questions &amp; Answers</strong>
                  <span style={{ color: '#8C6A00', fontSize: 12, marginLeft: 8 }}>(10 min)</span>
                  <div style={{ color: '#5A4A1F', marginTop: 2 }}>Ask 3–5 questions. Compare with the model answer only after the student speaks.</div>
                </li>
                <li style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.55 }}>
                  <strong>Extra Material 1 — Sentences I Need to Own</strong>
                  <span style={{ color: '#8C6A00', fontSize: 12, marginLeft: 8 }}>(5 min)</span>
                  <div style={{ color: '#5A4A1F', marginTop: 2 }}>Drill each sentence aloud. Student should leave the class able to say them naturally.</div>
                </li>
                <li style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.55 }}>
                  <strong>Grammar of the Lesson</strong>
                  <span style={{ color: '#8C6A00', fontSize: 12, marginLeft: 8 }}>(7 min)</span>
                  <div style={{ color: '#5A4A1F', marginTop: 2 }}>Start with the Grammar Point. Go to Deep Dive only if the student wants more detail or makes errors.</div>
                </li>
              </ol>
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

        {/* === IN CLASS EXERCISES === */}
        <h2 className="part-title">IN CLASS EXERCISES</h2>

        {/* 1. Objective of the class */}
        <div className="lesson-section">
          <div className="section-title">
            <div className="section-icon">O</div> Objective of the class
          </div>
          <p>{l.objective}</p>
        </div>

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
              <AudioPlayer key={`intro-${l.num}`} text={stripHtml(l.intro)} rate={0.8} label="Listen to introduction" voiceType={voiceType} />
            </div>
          </div>
        )}

        {/* 3. Vocabulary */}
        <div className="lesson-section">
          <div className="section-title">
            <div className="section-icon">V</div> Vocabulary
          </div>
          {isReviewVocab ? (
            <p>{l.vocab[0]}</p>
          ) : hasObjectVocab ? (
            <div className="vocab-list">
              {l.vocab.map((v, i) => (
                <div key={i} className="vocab-row">
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
              ))}
            </div>
          ) : (
            <div className="vocab-grid">
              {l.vocab?.map((v, i) => (
                <span key={i} className="vocab-chip">{v}</span>
              ))}
            </div>
          )}

          {/* Vocabulary Practice — exercise[2] shown right after vocab */}
          {l.exercises?.[2] && (() => {
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
          {l.exercises?.filter((_, i) => i !== 2).map((ex, i) => {
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
            <h2 className="part-title">EXTRA MATERIAL 1</h2>
            <div className="lesson-section">
              <div className="section-title">
                <div className="section-icon">S</div> Sentences I Need to Own
              </div>
              <div className="takeaway-box">
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
          <div className="section-title">
            <div className="section-icon">G</div> Grammar Point
          </div>
          <div className="grammar-box" dangerouslySetInnerHTML={{ __html: l.grammarDetail }} />
        </div>

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

        {/* Bottom nav */}
        <div className="lesson-bottom-nav">
          {prevNum ? (
            <Link href={`/${clientId}/lesson/${prevNum}`} className="btn btn-outline">← Previous</Link>
          ) : <span />}
          <Link href={allLessonsHref} className="btn btn-outline">All Lessons</Link>
          {nextNum ? (
            <Link href={`/${clientId}/lesson/${nextNum}`} className="btn btn-primary">Next →</Link>
          ) : <span />}
        </div>
      </div>
    </>
  );
}
