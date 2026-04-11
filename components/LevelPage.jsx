'use client';

import Link from 'next/link';

const LEVEL_META = {
  confidence: {
    name: 'Confidence & Essentials',
    tag: 'A1 – A2',
    color: '#2AAAE2',
    intro: 'Welcome. This is your starting ground. Simple sentences, core vocabulary and slow, clear British audio. Take your time — confidence is built one lesson at a time.'
  },
  rise: {
    name: 'Rise',
    tag: 'B1 – B2',
    color: '#1C8FBF',
    intro: 'You already have the basics. Now we raise the bar — real business scenarios, natural pace, modals and phrasal verbs to sound confident in the workplace.'
  },
  apex: {
    name: 'Apex',
    tag: 'C1 – C2',
    color: '#0F6E99',
    intro: 'This is your space to master nuance. Sophisticated vocabulary, formal register and complex ideas. Lessons here are designed for discussion, debate and precision.'
  }
};

export default function LevelPage({ course, theme, clientId, levelId }) {
  const c = theme?.colors || {};
  const level = LEVEL_META[levelId];
  const tracks = course.tracks || [];

  if (!level) return null;

  return (
    <>
      <style jsx>{`
        .lvl-hero {
          background: linear-gradient(135deg, ${c.dark || '#32373C'} 0%, ${c.navy || '#1B2736'} 100%);
          color: #fff;
          padding: 56px 24px 72px;
          position: relative;
          overflow: hidden;
        }
        .lvl-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 85% 20%, rgba(42,170,226,0.18), transparent 50%);
          pointer-events: none;
        }
        .lvl-hero-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .lvl-back {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 20px;
          transition: color 0.2s;
        }
        .lvl-back:hover {
          color: #fff;
        }
        .lvl-tag {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(42,170,226,0.2);
          color: ${level.color};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          margin-bottom: 14px;
          border: 1px solid rgba(42,170,226,0.35);
        }
        .lvl-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 14px;
        }
        .lvl-intro {
          font-size: clamp(14px, 1.5vw, 16px);
          opacity: 0.8;
          max-width: 720px;
          line-height: 1.7;
          font-weight: 300;
        }
        .lvl-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 24px;
        }
        .lvl-section-label {
          font-size: 11px;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: ${level.color};
          font-weight: 700;
          margin-bottom: 10px;
        }
        .lvl-section h2 {
          font-size: clamp(22px, 2.5vw, 30px);
          color: ${c.dark || '#32373C'};
          margin: 0 0 28px;
          font-weight: 700;
        }
        .tracks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 22px;
        }
        .track-card {
          display: block;
          background: #fff;
          border: 1px solid ${c.grayLight || '#E4E9EF'};
          border-radius: 12px;
          padding: 26px 24px;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          position: relative;
        }
        .track-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 32px rgba(27,39,54,0.08);
          border-color: ${level.color};
        }
        .track-card.locked {
          opacity: 0.55;
          cursor: not-allowed;
          pointer-events: none;
        }
        .track-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: ${c.accentLight || '#E6F5FC'};
          color: ${level.color};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .track-name {
          font-size: 17px;
          font-weight: 700;
          color: ${c.dark || '#32373C'};
          margin: 0 0 8px;
        }
        .track-desc {
          color: ${c.gray || '#6B7A8F'};
          font-size: 13px;
          line-height: 1.55;
          margin: 0 0 16px;
        }
        .track-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px solid ${c.grayLight || '#E4E9EF'};
        }
        .track-count {
          font-size: 12px;
          color: ${c.gray || '#6B7A8F'};
          font-weight: 500;
        }
        .track-count strong {
          color: ${level.color};
        }
        .track-cta {
          font-size: 13px;
          color: ${level.color};
          font-weight: 600;
        }
        .track-status {
          font-size: 11px;
          color: ${c.gray || '#6B7A8F'};
          font-style: italic;
        }
      `}</style>

      <section className="lvl-hero">
        <div className="lvl-hero-inner">
          <Link href={`/${clientId}`} className="lvl-back">← Back to levels</Link>
          <span className="lvl-tag">{level.tag}</span>
          <h1 className="lvl-title">{level.name}</h1>
          <p className="lvl-intro">{level.intro}</p>
        </div>
      </section>

      <section className="lvl-section">
        <div className="lvl-section-label">Learning tracks</div>
        <h2>Choose your track</h2>
        <div className="tracks-grid">
          {tracks.map((track) => {
            const count = (course.lessons || []).filter(
              (l) => l.level === levelId && l.track === track.id
            ).length;
            const ready = count > 0;

            return (
              <Link
                key={track.id}
                href={ready ? `/${clientId}/level/${levelId}/track/${track.id}` : '#'}
                className={`track-card${ready ? '' : ' locked'}`}
              >
                <div className="track-icon">{track.icon || 'A'}</div>
                <h3 className="track-name">{track.name}</h3>
                <p className="track-desc">{track.description}</p>
                <div className="track-footer">
                  {ready ? (
                    <>
                      <span className="track-count">
                        <strong>{count}</strong> lessons
                      </span>
                      <span className="track-cta">Open →</span>
                    </>
                  ) : (
                    <span className="track-status">Coming soon</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
