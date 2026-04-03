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
};

function getModuleVoice(lessonNum) {
  const moduleIndex = Math.floor((lessonNum - 1) / 8);
  return VOICE_CYCLE[moduleIndex % VOICE_CYCLE.length];
}

export default function LessonView({ lesson, lessonIndex, totalLessons, clientId }) {
  const l = lesson;
  const prevNum = lessonIndex > 0 ? lessonIndex : null;
  const nextNum = lessonIndex < totalLessons - 1 ? lessonIndex + 2 : null;
  const voiceType = getModuleVoice(l.num);

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
          <span className="lesson-focus" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.1)', marginLeft: 8, fontSize: 11 }}>
            Voice: {VOICE_LABELS[voiceType]}
          </span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 800, margin: '0 auto', padding: '16px 24px' }}>
        {prevNum ? (
          <Link href={`/${clientId}/lesson/${prevNum}`} className="btn btn-outline">← Previous Lesson</Link>
        ) : <span />}
        {nextNum ? (
          <Link href={`/${clientId}/lesson/${nextNum}`} className="btn btn-outline">Next Lesson →</Link>
        ) : <span />}
      </div>

      {/* Lesson body */}
      <div className="lesson-body">

        {/* Introduction */}
        {l.intro && (
          <div className="lesson-section">
            <div className="section-title">
              <div className="section-icon">I</div> Introduction
            </div>
            <div className="intro-box">
              <p dangerouslySetInnerHTML={{ __html: l.intro }} />
              <div style={{ marginTop: 12 }}>
                <AudioPlayer text={stripHtml(l.intro)} rate={0.8} label="Listen" voiceType={voiceType} />
              </div>
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

        {/* Grammar Point */}
        <div className="lesson-section">
          <div className="section-title">
            <div className="section-icon">G</div> Grammar Point
          </div>
          <div className="grammar-box" dangerouslySetInnerHTML={{ __html: l.grammarDetail }} />
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
                <span className="exercise-num">{i + 1}</span>
                <span className="exercise-title">{ex.title}</span>
                {audioText && (
                  <span style={{ marginLeft: 8 }}>
                    <AudioPlayer text={audioText} rate={0.85} label="Listen" small voiceType={voiceType} />
                  </span>
                )}
                <div className="exercise-content" dangerouslySetInnerHTML={{ __html: ex.content }} />
              </div>
            );
          })}
        </div>

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

        {/* Bottom nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--gray-light)' }}>
          {prevNum ? (
            <Link href={`/${clientId}/lesson/${prevNum}`} className="btn btn-outline">← Previous Lesson</Link>
          ) : <span />}
          <Link href={`/${clientId}`} className="btn btn-outline">All Lessons</Link>
          {nextNum ? (
            <Link href={`/${clientId}/lesson/${nextNum}`} className="btn btn-primary">Next Lesson →</Link>
          ) : <span />}
        </div>
      </div>
    </>
  );
}
