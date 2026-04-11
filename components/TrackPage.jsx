'use client';

import Link from 'next/link';

const LEVEL_COLOR = {
  confidence: '#2AAAE2',
  rise: '#1C8FBF',
  apex: '#0F6E99'
};

const LEVEL_NAME = {
  confidence: 'Confidence & Essentials',
  rise: 'Rise',
  apex: 'Apex'
};

export default function TrackPage({ course, theme, clientId, levelId, trackId }) {
  const c = theme?.colors || {};
  const color = LEVEL_COLOR[levelId] || c.accent || '#2AAAE2';
  const track = (course.tracks || []).find((t) => t.id === trackId);
  const lessons = (course.lessons || []).filter(
    (l) => l.level === levelId && l.track === trackId
  );

  if (!track) return null;

  return (
    <>
      <style jsx>{`
        .trk-hero {
          background: linear-gradient(135deg, ${c.dark || '#32373C'} 0%, ${c.navy || '#1B2736'} 100%);
          color: #fff;
          padding: 48px 24px 64px;
          position: relative;
          overflow: hidden;
        }
        .trk-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 85% 20%, rgba(42,170,226,0.16), transparent 55%);
          pointer-events: none;
        }
        .trk-hero-inner {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .trk-back {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 13px;
          margin-bottom: 18px;
          display: inline-block;
          transition: color 0.2s;
        }
        .trk-back:hover {
          color: #fff;
        }
        .trk-meta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .trk-level-badge {
          padding: 4px 11px;
          border-radius: 999px;
          background: rgba(42,170,226,0.2);
          color: ${color};
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          border: 1px solid rgba(42,170,226,0.35);
        }
        .trk-title {
          font-size: clamp(28px, 4.5vw, 42px);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 12px;
        }
        .trk-desc {
          opacity: 0.78;
          max-width: 680px;
          line-height: 1.65;
          font-size: 15px;
          font-weight: 300;
        }
        .trk-section {
          max-width: 1000px;
          margin: 0 auto;
          padding: 56px 24px;
        }
        .trk-section-label {
          font-size: 11px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: ${color};
          font-weight: 700;
          margin-bottom: 10px;
        }
        .trk-section h2 {
          font-size: clamp(20px, 2.4vw, 26px);
          color: ${c.dark || '#32373C'};
          margin: 0 0 24px;
          font-weight: 700;
        }
        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .lesson-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 22px;
          background: #fff;
          border: 1px solid ${c.grayLight || '#E4E9EF'};
          border-radius: 10px;
          text-decoration: none;
          color: inherit;
          transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
        }
        .lesson-row:hover {
          transform: translateX(4px);
          border-color: ${color};
          box-shadow: 0 8px 22px rgba(27,39,54,0.06);
        }
        .lesson-num {
          flex: 0 0 42px;
          height: 42px;
          border-radius: 10px;
          background: ${c.accentLight || '#E6F5FC'};
          color: ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        .lesson-body {
          flex: 1;
          min-width: 0;
        }
        .lesson-title {
          font-size: 15px;
          font-weight: 600;
          color: ${c.dark || '#32373C'};
          margin: 0 0 3px;
        }
        .lesson-focus {
          font-size: 12px;
          color: ${c.gray || '#6B7A8F'};
        }
        .lesson-character {
          font-size: 11px;
          color: ${color};
          font-weight: 600;
          padding: 4px 10px;
          background: ${c.accentLight || '#E6F5FC'};
          border-radius: 999px;
          white-space: nowrap;
        }
        .lesson-arrow {
          color: ${color};
          font-size: 18px;
          font-weight: 600;
        }
        .empty-state {
          padding: 48px 24px;
          text-align: center;
          color: ${c.gray || '#6B7A8F'};
          background: ${c.offWhite || '#F9FAFB'};
          border-radius: 12px;
          border: 1px dashed ${c.grayLight || '#E4E9EF'};
        }
      `}</style>

      <section className="trk-hero">
        <div className="trk-hero-inner">
          <Link href={`/${clientId}/level/${levelId}`} className="trk-back">← Back to {LEVEL_NAME[levelId]}</Link>
          <div className="trk-meta">
            <span className="trk-level-badge">{LEVEL_NAME[levelId]}</span>
          </div>
          <h1 className="trk-title">{track.name}</h1>
          <p className="trk-desc">{track.description}</p>
        </div>
      </section>

      <section className="trk-section">
        <div className="trk-section-label">Lessons</div>
        <h2>{lessons.length} lesson{lessons.length === 1 ? '' : 's'} in this track</h2>
        {lessons.length === 0 ? (
          <div className="empty-state">
            This track is being prepared. Check back soon.
          </div>
        ) : (
          <div className="lessons-list">
            {lessons.map((lesson) => (
              <Link
                key={lesson.num}
                href={`/${clientId}/lesson/${lesson.num}`}
                className="lesson-row"
              >
                <div className="lesson-num">{String(lesson.trackOrder || lesson.num).padStart(2, '0')}</div>
                <div className="lesson-body">
                  <div className="lesson-title">{lesson.title}</div>
                  <div className="lesson-focus">{lesson.focus}</div>
                </div>
                {lesson.characterName && (
                  <span className="lesson-character">🎙 {lesson.characterName}</span>
                )}
                <span className="lesson-arrow">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
