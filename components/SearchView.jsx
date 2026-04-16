'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const PAGE_BG = '#f5f5f7';
const CARD_BG = '#ffffff';
const TEXT = '#1d1d1f';
const MUTED = '#86868b';
const BORDER = '#e8e8ed';

const LEVEL_LABELS = {
  confidence: 'Confidence',
  essentials: 'Essentials',
  rise: 'Rise',
  apex: 'Apex',
};

// Relevance buckets (lower = higher priority)
const BUCKETS = [
  { key: 'title', label: 'Title matches' },
  { key: 'grammar', label: 'Grammar matches' },
  { key: 'vocab', label: 'Vocabulary matches' },
  { key: 'takeaway', label: 'Takeaway & focus matches' },
];

function makeSnippet(text, q, len = 140) {
  if (!text) return '';
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return text.slice(0, len) + (text.length > len ? '…' : '');
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + q.length + 80);
  const snippet = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  return snippet;
}

function Highlight({ text, q }) {
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#fff4b8', padding: '0 2px', borderRadius: 3 }}>{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function SearchView({ course, clientId }) {
  const [query, setQuery] = useState('');

  const tracksById = useMemo(() => {
    const map = {};
    (course.tracks || []).forEach((t) => { map[t.id] = t; });
    return map;
  }, [course.tracks]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const buckets = { title: [], grammar: [], vocab: [], takeaway: [] };
    if (q.length < 2) return buckets;

    for (const lesson of course.lessons) {
      const title = (lesson.title || '').toLowerCase();
      const grammar = (lesson.grammar || '').toLowerCase();
      const focus = (lesson.focus || '').toLowerCase();

      if (title.includes(q)) {
        buckets.title.push({ lesson, field: 'title', snippet: lesson.title });
        continue;
      }
      if (grammar.includes(q)) {
        buckets.grammar.push({ lesson, field: 'grammar', snippet: lesson.grammar });
        continue;
      }
      let vocabHit = null;
      if (Array.isArray(lesson.vocab)) {
        for (const v of lesson.vocab) {
          const en = (v.en || '').toLowerCase();
          const pt = (v.pt || '').toLowerCase();
          const ex = (v.example || '').toLowerCase();
          if (en.includes(q) || pt.includes(q) || ex.includes(q)) {
            const src = en.includes(q) ? v.en : pt.includes(q) ? v.pt : v.example;
            vocabHit = { en: v.en, pt: v.pt, snippet: makeSnippet(src, q) };
            break;
          }
        }
      }
      if (vocabHit) {
        buckets.vocab.push({ lesson, field: 'vocab', vocab: vocabHit });
        continue;
      }
      if (focus.includes(q)) {
        buckets.takeaway.push({ lesson, field: 'focus', snippet: lesson.focus });
        continue;
      }
      if (Array.isArray(lesson.takeaways)) {
        const hit = lesson.takeaways.find((t) => (t || '').toLowerCase().includes(q));
        if (hit) {
          buckets.takeaway.push({ lesson, field: 'takeaway', snippet: makeSnippet(hit, q) });
          continue;
        }
      }
    }
    return buckets;
  }, [course.lessons, query]);

  const totalCount = BUCKETS.reduce((n, b) => n + (results[b.key]?.length || 0), 0);
  const q = query.trim().toLowerCase();

  return (
    <div style={{
      minHeight: '100vh',
      background: PAGE_BG,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      color: TEXT,
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <Link href={`/${clientId}`} style={{ color: MUTED, textDecoration: 'none', fontSize: 14 }}>
            ← Back to Home
          </Link>
          <Link href={`/${clientId}/grammar`} style={{ color: '#0071e3', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            Grammar reference →
          </Link>
        </div>

        <header style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: MUTED, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 8px' }}>
            Search
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 44px)', fontWeight: 700, letterSpacing: -1, margin: '0 0 10px' }}>
            Find a lesson
          </h1>
          <p style={{ fontSize: 17, color: MUTED, margin: 0 }}>
            Search titles, grammar, vocabulary and takeaways.
          </p>
        </header>

        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type at least 2 characters…"
            autoFocus
            style={{
              width: '100%',
              padding: '16px 20px',
              fontSize: 17,
              borderRadius: 14,
              border: `1px solid ${BORDER}`,
              background: CARD_BG,
              color: TEXT,
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            }}
          />
          {q.length >= 2 && (
            <p style={{ color: MUTED, fontSize: 13, margin: '10px 4px 0' }}>
              {totalCount} result{totalCount === 1 ? '' : 's'} for “{query.trim()}”
            </p>
          )}
        </div>

        {q.length < 2 && (
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 40, textAlign: 'center', color: MUTED }}>
            Start typing to search across {course.lessons.length} lessons.
          </div>
        )}

        {q.length >= 2 && totalCount === 0 && (
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 40, textAlign: 'center', color: MUTED }}>
            No lessons match your search.
          </div>
        )}

        {BUCKETS.map((bucket) => {
          const items = results[bucket.key];
          if (!items || items.length === 0) return null;
          return (
            <section key={bucket.key} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: MUTED, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 12px' }}>
                {bucket.label} · {items.length}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item, i) => {
                  const { lesson } = item;
                  const track = tracksById[lesson.track];
                  return (
                    <Link
                      key={`${bucket.key}-${lesson.num}-${i}`}
                      href={`/${clientId}/lesson/${lesson.num}`}
                      style={{
                        display: 'block',
                        background: CARD_BG,
                        borderRadius: 14,
                        border: `1px solid ${BORDER}`,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        padding: '16px 20px',
                        textDecoration: 'none',
                        color: TEXT,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: MUTED, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700 }}>#{String(lesson.num).padStart(3, '0')}</span>
                        <span>·</span>
                        <span>{LEVEL_LABELS[lesson.level] || lesson.level}</span>
                        <span>·</span>
                        <span>{track?.name || lesson.track}</span>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.2, marginBottom: 4 }}>
                        {bucket.key === 'title' ? <Highlight text={lesson.title} q={q} /> : lesson.title}
                      </div>
                      {bucket.key === 'grammar' && (
                        <div style={{ fontSize: 14, color: '#424245' }}>
                          Grammar: <Highlight text={lesson.grammar || ''} q={q} />
                        </div>
                      )}
                      {bucket.key === 'vocab' && item.vocab && (
                        <div style={{ fontSize: 14, color: '#424245' }}>
                          <strong>{item.vocab.en}</strong> — {item.vocab.pt}
                          <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>
                            <Highlight text={item.vocab.snippet} q={q} />
                          </div>
                        </div>
                      )}
                      {bucket.key === 'takeaway' && (
                        <div style={{ fontSize: 14, color: '#424245' }}>
                          <Highlight text={item.snippet} q={q} />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
