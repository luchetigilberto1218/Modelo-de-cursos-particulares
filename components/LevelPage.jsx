'use client';

import Link from 'next/link';
import { useState } from 'react';

const LEVEL_META = {
  confidence: { name: 'Confidence', tag: 'A0 – A1', color: '#7FD4F5' },
  essentials: { name: 'Essentials', tag: 'A1 – A2', color: '#2AAAE2' },
  rise: { name: 'Rise', tag: 'B1 – B2', color: '#1C8FBF' },
  apex: { name: 'Apex', tag: 'C1 – C2', color: '#0F6E99' }
};

const ADDITIONAL_TRACK_IDS = ['general-business', 'uk-england'];

function TrackCard({ track, levelId, clientId, color, ready }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: 10,
    padding: 'clamp(20px, 4vw, 36px) clamp(16px, 3vw, 24px) clamp(18px, 4vw, 32px)',
    borderRadius: 18,
    background: '#fff',
    textDecoration: 'none',
    color: '#1d1d1f',
    minHeight: 150,
    border: '1px solid #d2d2d7',
    boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
    transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
    transition: 'transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s',
    opacity: ready ? 1 : 0.3,
    pointerEvents: ready ? 'auto' : 'none',
    cursor: ready ? 'pointer' : 'default',
  };

  return (
    <Link
      href={ready ? `/${clientId}/level/${levelId}/track/${track.id}` : '#'}
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: 'clamp(15px, 3vw, 20px)', fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.25, color: '#1d1d1f' }}>
        {track.name}
      </span>
      {ready ? (
        <span style={{ fontSize: 15, fontWeight: 400, color, display: 'flex', alignItems: 'center', gap: hovered ? 9 : 5, transition: 'gap 0.3s', marginTop: 2 }}>
          Open
        </span>
      ) : (
        <span style={{ fontSize: 13, color: '#86868b' }}>Coming soon</span>
      )}
    </Link>
  );
}

export default function LevelPage({ course, theme, clientId, levelId }) {
  const logos = theme?.logos || {};
  const level = LEVEL_META[levelId];
  const tracks = course.tracks || [];

  if (!level) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f7',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1080,
        margin: '0 auto',
        padding: '20px 20px',
      }}>
        <Link href={`/${clientId}`} style={{ fontSize: 14, color: level.color, textDecoration: 'none', fontWeight: 500 }}>
          ← Levels
        </Link>
        {logos.client && (
          <img
            src={logos.client}
            alt="Czarnikow"
            style={{ height: 24, objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </header>

      <section style={{ textAlign: 'center', padding: 'clamp(32px, 6vw, 56px) 20px clamp(24px, 5vw, 40px)', maxWidth: 600, margin: '0 auto' }}>
        <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 500, color: level.color, marginBottom: 10 }}>
          {level.tag}
        </span>
        <h1 style={{ fontSize: 'clamp(34px, 5vw, 48px)', fontWeight: 700, letterSpacing: -1.2, lineHeight: 1.08, margin: '0 0 10px', color: '#1d1d1f' }}>
          {level.name}
        </h1>
        <p style={{ fontSize: 19, color: '#86868b', margin: 0 }}>Choose your track</p>
      </section>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 12,
        maxWidth: 1080,
        margin: '0 auto',
        padding: '24px 20px 48px',
      }}>
        {tracks.filter(t => !ADDITIONAL_TRACK_IDS.includes(t.id)).map((track) => {
          const count = (course.lessons || []).filter(
            (l) => l.level === levelId && l.track === track.id
          ).length;
          return (
            <TrackCard
              key={track.id}
              track={track}
              levelId={levelId}
              clientId={clientId}
              color={level.color}
              ready={count > 0}
            />
          );
        })}
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 20px 80px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#86868b', letterSpacing: -0.3, margin: '0 0 16px', textAlign: 'center' }}>
          Additional Tracks
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          {tracks.filter(t => ADDITIONAL_TRACK_IDS.includes(t.id)).map((track) => {
            const count = (course.lessons || []).filter(
              (l) => l.level === levelId && l.track === track.id
            ).length;
            return (
              <div key={track.id} style={{ width: 240 }}>
                <TrackCard
                  track={track}
                  levelId={levelId}
                  clientId={clientId}
                  color={level.color}
                  ready={count > 0}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
