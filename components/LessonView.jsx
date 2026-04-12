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

export default function LessonView({ lesson, lessonIndex, totalLessons, clientId, backHref }) {
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
          <div className="lesson-label">Lesson {String(l.num).padStart(2, '0')} of {totalLessons}</div>
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
              {l.teacherGuide.lessonFlow?.length > 0 && (
                <>
                  <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#8C6A00', margin: '16px 0 10px' }}>
                    Lesson Flow
                  </h4>
                  <ol style={{ paddingLeft: 22, margin: 0 }}>
                    {l.teacherGuide.lessonFlow.map((step, i) => (
                      <li key={i} style={{ marginBottom: 12, fontSize: 14, lineHeight: 1.55 }}>
                        <strong>{step.title || step.what}</strong>
                        <span style={{ color: '#8C6A00', fontSize: 12, marginLeft: 8 }}>({step.time || step.duration})</span>
                        <div style={{ color: '#5A4A1F', marginTop: 2 }}>{step.description || step.instructions}</div>
                      </li>
                    ))}
                  </ol>
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

        {/* Introduction */}
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

        {/* Objective */}
        <div className="lesson-section">
          <div className="section-title">
            <div className="section-icon">O</div> Objective
          </div>
          <p>{l.objective}</p>
        </div>

        {/* Vocabulary */}
        <div className="lesson-section">
          <div className="section-title">
            <div className="section-icon">V</div> Vocabulary
          </div>
          {isReviewVocab ? (
            <p>{l.vocab[0]}</p>
          ) : hasObjectVocab ? (
            <div className="vocab-grid">
              {l.vocab.map((v, i) => (
                <VocabChip key={i} en={v.en} pt={v.pt} />
              ))}
            </div>
          ) : (
            <div className="vocab-grid">
              {l.vocab?.map((v, i) => (
                <span key={i} className="vocab-chip">{v}</span>
              ))}
            </div>
          )}
        </div>

        {/* Context */}
        <div className="lesson-section">
          <div className="section-title">
            <div className="section-icon">C</div> Context
          </div>
          <div className="context-box">
            <p>{l.situation}</p>
          </div>
        </div>

        {/* Exercises */}
        <div className="lesson-section">
          <div className="section-title">
            <div className="section-icon">E</div> Exercises
          </div>
          {l.exercises?.map((ex, i) => {
            const audioText = isAudioExercise(ex.title) ? extractAudioText(ex.content) : '';
            return (
              <div key={i} className="exercise-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span className="exercise-num">{i + 1}</span>
                  <span className="exercise-title">{ex.title}</span>
                </div>
                <div className="exercise-content" dangerouslySetInnerHTML={{ __html: ex.content }} />
                {audioText && (
                  <div style={{ marginTop: 10 }}>
                    <AudioPlayer key={`ex-${l.num}-${i}`} text={audioText} rate={0.85} label="Listen" small voiceType={voiceType} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Role Plays */}
        {l.extendedExercises?.rolePlays?.length > 0 && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">R</div> Role Plays
            </div>
            {l.extendedExercises.rolePlays.map((rp, i) => (
              <div key={i} className="lesson-card-box" style={{ marginBottom: 24, padding: 16, background: '#F9FAFB', borderRadius: 10, border: '1px solid var(--gray-light, #E4E9EF)' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: 15 }}>{rp.title}</h4>
                <p style={{ fontSize: 14, color: 'var(--gray)', margin: '0 0 10px' }}><strong>Setup:</strong> {rp.setup}</p>
                <p style={{ fontSize: 14, margin: '0 0 6px' }}><strong>Student A:</strong> {rp.studentA}</p>
                <p style={{ fontSize: 14, margin: '0 0 12px' }}><strong>Student B:</strong> {rp.studentB}</p>
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
                    👩‍🏫 <strong>Teacher note:</strong> {rp.teacherNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Additional Audios */}
        {l.extendedExercises?.additionalAudios?.length > 0 && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">A</div> Additional Audios
            </div>
            {l.extendedExercises.additionalAudios.map((audio, i) => (
              <div key={i} className="lesson-card-box" style={{ marginBottom: 24, padding: 16, background: '#F9FAFB', borderRadius: 10, border: '1px solid var(--gray-light, #E4E9EF)' }}>
                <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>{audio.title}</h4>
                {audio.durationSeconds && (
                  <p style={{ fontSize: 12, color: 'var(--gray)', margin: '0 0 12px' }}>~{audio.durationSeconds}s</p>
                )}
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

        {/* Q&A */}
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

        {/* Contextualization */}
        {l.extendedExercises?.contextualization?.length > 0 && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">M</div> Make It Your Own
            </div>
            <p style={{ fontSize: 14, color: 'var(--gray)', marginBottom: 12 }}>
              Answer each prompt about your real Czarnikow day-to-day.
            </p>
            <ol style={{ paddingLeft: 22, margin: 0 }}>
              {l.extendedExercises.contextualization.map((c, i) => (
                <li key={i} style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.6 }}>{c}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Production Tasks */}
        {l.extendedExercises?.productionTasks?.length > 0 && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">P</div> Production Tasks
            </div>
            {l.extendedExercises.productionTasks.map((pt, i) => (
              <div key={i} style={{ marginBottom: 16, padding: 14, background: '#F9FAFB', borderRadius: 10, border: '1px solid var(--gray-light, #E4E9EF)' }}>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: '#E6F5FC', color: '#1C8FBF', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8, display: 'inline-block', fontWeight: 700 }}>
                  {pt.type}
                </span>
                <p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.55 }}>{pt.task}</p>
                {pt.successCriteria && (
                  <p style={{ fontSize: 13, color: 'var(--gray)', margin: '8px 0 0' }}>
                    <strong>✓ Success:</strong> {pt.successCriteria}
                  </p>
                )}
              </div>
            ))}
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
                <h4 style={{ margin: '0 0 6px', fontSize: 15 }}>{pw.title}</h4>
                <p style={{ fontSize: 14, margin: '0 0 6px', lineHeight: 1.55 }}>{pw.description}</p>
                {pw.duration && (
                  <p style={{ fontSize: 12, color: 'var(--gray)', margin: 0 }}>Duration: {pw.duration}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Homework */}
        {l.extendedExercises?.homework && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">H</div> Homework
            </div>
            {l.extendedExercises.homework.tasks?.length > 0 && (
              <ol style={{ paddingLeft: 22, margin: 0 }}>
                {l.extendedExercises.homework.tasks.map((t, i) => (
                  <li key={i} style={{ marginBottom: 8, fontSize: 14, lineHeight: 1.6 }}>{t}</li>
                ))}
              </ol>
            )}
            {l.extendedExercises.homework.reviewInNextLesson && (
              <p style={{ marginTop: 14, padding: 12, background: '#FFF8E1', borderRadius: 8, fontSize: 13, color: '#5A4A1F' }}>
                👩‍🏫 <strong>Next lesson:</strong> {l.extendedExercises.homework.reviewInNextLesson}
              </p>
            )}
          </div>
        )}

        {/* Wrap-up */}
        <div className="lesson-section">
          <div className="section-title">
            <div className="section-icon">W</div> Teacher&apos;s Wrap-up
          </div>
          <div className="wrapup-box">
            <p>{l.wrapup}</p>
          </div>
        </div>

        {/* Takeaways */}
        {l.takeaways && l.takeaways.length > 0 && (
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
        )}

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
