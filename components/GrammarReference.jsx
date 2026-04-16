'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const LEVEL_ORDER = ['confidence', 'essentials', 'rise', 'apex'];
const LEVEL_LABELS = {
  confidence: { name: 'Confidence', tag: 'A0 – A1' },
  essentials: { name: 'Essentials', tag: 'A1 – A2' },
  rise: { name: 'Rise', tag: 'B1 – B2' },
  apex: { name: 'Apex', tag: 'C1 – C2' },
};

const PAGE_BG = '#f5f5f7';
const CARD_BG = '#ffffff';
const TEXT = '#1d1d1f';
const MUTED = '#86868b';
const BORDER = '#e8e8ed';

export default function GrammarReference({ course, clientId }) {
  const [query, setQuery] = useState('');

  const tracksById = useMemo(() => {
    const map = {};
    (course.tracks || []).forEach((t) => { map[t.id] = t; });
    return map;
  }, [course.tracks]);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byLevel = {};
    for (const lesson of course.lessons) {
      if (!lesson.grammar) continue;
      if (q && !lesson.grammar.toLowerCase().includes(q) && !lesson.title.toLowerCase().includes(q)) continue;
      const level = lesson.level || 'essentials';
      if (!byLevel[level]) byLevel[level] = {};
      const track = lesson.track || 'general';
      if (!byLevel[level][track]) byLevel[level][track] = [];
      byLevel[level][track].push(lesson);
    }
    // sort lessons inside each track by num
    for (const lvl of Object.keys(byLevel)) {
      for (const tr of Object.keys(byLevel[lvl])) {
        byLevel[lvl][tr].sort((a, b) => a.num - b.num);
      }
    }
    return byLevel;
  }, [course.lessons, query]);

  const levelsPresent = LEVEL_ORDER.filter((l) => grouped[l]);

  return (
    <div style={{
      minHeight: '100vh',
      background: PAGE_BG,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      color: TEXT,
    }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <Link href={`/${clientId}`} style={{ color: MUTED, textDecoration: 'none', fontSize: 14 }}>
            ← Back to Home
          </Link>
          <Link href={`/${clientId}/search`} style={{ color: '#0071e3', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            Search lessons →
          </Link>
        </div>

        <header style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: MUTED, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 8px' }}>
            Reference
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 44px)', fontWeight: 700, letterSpacing: -1, margin: '0 0 10px' }}>
            Grammar Reference
          </h1>
          <p style={{ fontSize: 17, color: MUTED, margin: 0 }}>
            All grammar points across the programme, by level and track.
          </p>
        </header>

        <div style={{ marginBottom: 28 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter grammar points…"
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: 16,
              borderRadius: 12,
              border: `1px solid ${BORDER}`,
              background: CARD_BG,
              color: TEXT,
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            }}
          />
        </div>

        {levelsPresent.length === 0 && (
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 40, textAlign: 'center', color: MUTED }}>
            No grammar points match “{query}”.
          </div>
        )}

        {levelsPresent.map((levelId) => {
          const meta = LEVEL_LABELS[levelId] || { name: levelId, tag: '' };
          const tracks = grouped[levelId];
          const trackIds = Object.keys(tracks).sort((a, b) => {
            const oa = (course.tracks || []).findIndex((t) => t.id === a);
            const ob = (course.tracks || []).findIndex((t) => t.id === b);
            return (oa === -1 ? 999 : oa) - (ob === -1 ? 999 : ob);
          });

          return (
            <section key={levelId} style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
                <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.4, margin: 0 }}>{meta.name}</h2>
                <span style={{ fontSize: 12, fontWeight: 600, color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  {meta.tag}
                </span>
              </div>

              {trackIds.map((trackId) => {
                const track = tracksById[trackId];
                const lessons = tracks[trackId];
                return (
                  <div key={trackId} style={{
                    background: CARD_BG,
                    borderRadius: 16,
                    border: `1px solid ${BORDER}`,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    marginBottom: 14,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      padding: '14px 22px',
                      borderBottom: `1px solid ${BORDER}`,
                      background: '#fafafa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 0.6,
                        color: '#0071e3',
                        background: '#e8f1fc',
                        padding: '3px 8px',
                        borderRadius: 6,
                      }}>
                        {(track?.icon) || trackId.slice(0, 2).toUpperCase()}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>
                        {track?.name || trackId}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 12, color: MUTED }}>
                        {lessons.length} lesson{lessons.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {lessons.map((lesson) => (
                        <li key={lesson.num} style={{ borderBottom: `1px solid ${BORDER}` }}>
                          <Link
                            href={`/${clientId}/lesson/${lesson.num}`}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '64px 1fr auto',
                              gap: 16,
                              padding: '14px 22px',
                              alignItems: 'center',
                              textDecoration: 'none',
                              color: TEXT,
                            }}
                          >
                            <span style={{ fontSize: 13, fontWeight: 700, color: MUTED, letterSpacing: 0.5 }}>
                              #{String(lesson.num).padStart(3, '0')}
                            </span>
                            <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>
                                {lesson.grammar}
                              </span>
                              <span style={{ fontSize: 13, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {lesson.title}
                              </span>
                            </span>
                            <span style={{ fontSize: 13, color: '#0071e3' }}>Open →</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </div>
  );
}
