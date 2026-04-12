'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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

function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mql.matches);

    function onChange(e) {
      setIsMobile(e.matches);
    }

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
}

function LessonCard({ lesson, clientId, color, mobile }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/${clientId}/lesson/${lesson.num}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: mobile ? 4 : 8,
        padding: mobile ? '16px 10px 14px' : '28px 20px 24px',
        borderRadius: mobile ? 14 : 20,
        background: '#fff',
        textDecoration: 'none',
        color: '#1d1d1f',
        minHeight: mobile ? 100 : 140,
        border: '1px solid #d2d2d7',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: mobile ? 11 : 13, fontWeight: 600, color, letterSpacing: 0.5 }}>
        {String(lesson.trackOrder || lesson.num).padStart(2, '0')}
      </span>
      <span style={{ fontSize: mobile ? 13 : 16, fontWeight: 700, letterSpacing: -0.2, lineHeight: 1.25, color: '#1d1d1f' }}>
        {lesson.title}
      </span>
      <span style={{
        fontSize: mobile ? 12 : 14,
        fontWeight: 400,
        color,
        marginTop: 2,
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
      }}>
        Open
      </span>
    </Link>
  );
}

export default function TrackPage({ course, theme, clientId, levelId, trackId }) {
  const logos = theme?.logos || {};
  const color = LEVEL_COLOR[levelId] || '#2AAAE2';
  const track = (course.tracks || []).find((t) => t.id === trackId);
  const lessons = (course.lessons || []).filter(
    (l) => l.level === levelId && l.track === trackId
  );
  const mobile = useIsMobile();

  if (!track) return null;

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
        padding: mobile ? '14px 16px' : '24px 40px',
        gap: 8,
      }}>
        <Link
          href={`/${clientId}/level/${levelId}`}
          style={{
            fontSize: mobile ? 13 : 15,
            color,
            textDecoration: 'none',
            fontWeight: 500,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          ← {LEVEL_NAME[levelId]}
        </Link>
        {logos.client && (
          <img
            src={logos.client}
            alt="Czarnikow"
            style={{ height: mobile ? 20 : 26, objectFit: 'contain', flexShrink: 0 }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </header>

      <section style={{
        textAlign: 'center',
        padding: mobile ? '28px 16px 24px' : '56px 40px 40px',
        maxWidth: 600,
        margin: '0 auto',
      }}>
        <span style={{ display: 'inline-block', fontSize: mobile ? 11 : 13, fontWeight: 500, color, marginBottom: mobile ? 6 : 10 }}>
          {LEVEL_NAME[levelId]}
        </span>
        <h1 style={{
          fontSize: mobile ? 'clamp(26px, 7vw, 34px)' : 'clamp(34px, 5vw, 48px)',
          fontWeight: 700,
          letterSpacing: -1.2,
          lineHeight: 1.08,
          margin: '0 0 10px',
          color: '#1d1d1f',
        }}>
          {track.name}
        </h1>
        <p style={{ fontSize: mobile ? 15 : 19, color: '#86868b', margin: 0 }}>
          {lessons.length} lesson{lessons.length === 1 ? '' : 's'}
        </p>
      </section>

      {lessons.length === 0 ? (
        <div style={{
          maxWidth: 500,
          margin: '0 auto',
          padding: mobile ? '32px 16px' : '48px 24px',
          textAlign: 'center',
          color: '#86868b',
          background: '#fff',
          borderRadius: mobile ? 14 : 20,
          border: '1px solid #e8e8ed',
          marginLeft: mobile ? 16 : 40,
          marginRight: mobile ? 16 : 40,
          fontSize: mobile ? 14 : 16,
        }}>
          This track is being prepared. Check back soon.
        </div>
      ) : (
        <section style={{
          display: 'grid',
          gridTemplateColumns: mobile
            ? 'repeat(2, 1fr)'
            : 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: mobile ? 10 : 14,
          maxWidth: 1080,
          margin: '0 auto',
          padding: mobile ? '20px 16px 60px' : '32px 40px 100px',
        }}>
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.num}
              lesson={lesson}
              clientId={clientId}
              color={color}
              mobile={mobile}
            />
          ))}
        </section>
      )}
    </div>
  );
}
