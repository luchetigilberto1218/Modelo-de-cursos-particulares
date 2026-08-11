'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useIdentity, useDoneMap } from './progress';

export default function BakerHughesTrack({ course, theme, clientId, trackId, student }) {
  const c = theme?.colors || {};
  const navy = c.navy || '#062E2B';
  const navyLight = c.navyLight || '#0E4A44';
  const accent = c.accent || '#00B04F';
  const teal = c.teal || '#009CA6';
  const gray = c.gray || '#5F7570';
  const grayLight = c.grayLight || '#E2E9E7';
  const offWhite = c.offWhite || '#F5F8F7';
  const school = theme?.logos?.school;

  const track = (course.tracks || []).find(t => t.id === trackId) || {};
  const lessons = (course.lessons || [])
    .filter(l => l.track === trackId)
    .sort((a, b) => (a.trackOrder || a.num) - (b.trackOrder || b.num));

  // Lições concluídas: acendem verde com ✓ e alimentam o contador do topo.
  // Enquanto a identidade não carrega, `doneMap` é {} e a tela é a de sempre.
  const identity = useIdentity();
  const doneMap = useDoneMap(identity?.student);
  const doneCount = lessons.filter((l) => doneMap[l.num]).length;
  const nextNum = (lessons.find((l) => !doneMap[l.num]) || {}).num;
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: offWhite, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: c.text || '#20302D', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ background: navy, color: '#fff' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href={`/${clientId}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            {school && <img src={school} alt="Alumni" style={{ height: 24 }} />}
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>Baker Hughes</span>
          </Link>
          <Link href={`/${clientId}`} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>← Home</Link>
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${navy}, ${navyLight})`, color: '#fff', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${teal})` }} />
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '34px 24px 32px' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: accent, margin: '0 0 12px' }}>Learning track</p>
          {track.status === 'inactive' && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.28)', margin: '0 0 12px' }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.6)' }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                Trilha inativa{track.inactiveSince ? ` desde ${track.inactiveSince}` : ''} · material preservado
              </span>
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: -0.6, margin: '0 0 10px' }}>{track.name}</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', margin: 0, maxWidth: 620, lineHeight: 1.5 }}>{track.description}</p>
          <p style={{ fontSize: 13, color: accent, fontWeight: 700, margin: '14px 0 0' }}>{lessons.length} {lessons.length === 1 ? 'lição' : 'lições'} · estudo no seu ritmo</p>
          {doneCount > 0 && (
            <div style={{ marginTop: 16, maxWidth: 420 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 7 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>
                  {doneCount} de {lessons.length} {doneCount === 1 ? 'concluída' : 'concluídas'}
                </span>
                <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)' }}>{pct}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.16)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${accent}, ${teal})`, transition: 'width 0.4s' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px 70px', display: 'grid', gap: 12 }}>
        {groupByTopic(lessons).map((group, gi) => (
          <div key={gi} style={{ display: 'grid', gap: 12 }}>
            {group.topic && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: gi === 0 ? '0 0 2px' : '20px 0 2px' }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: accent, whiteSpace: 'nowrap' }}>
                  Tópico {gi + 1} · {group.topic}
                </span>
                <span style={{ height: 1, flex: 1, background: grayLight }} />
                <span style={{ fontSize: 12, color: gray, whiteSpace: 'nowrap' }}>{group.items.length} lições</span>
              </div>
            )}
            {group.items.map((l) => (
              <LessonRow key={l.num} lesson={l} clientId={clientId} index={lessons.indexOf(l)} c={c}
                done={!!doneMap[l.num]} isNext={l.num === nextNum && doneCount > 0} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Agrupa as lições por `topic` mantendo a ordem. Trilha sem topic vira um
   único grupo sem cabeçalho — as 9 trilhas antigas seguem exatamente iguais. */
function groupByTopic(lessons) {
  if (!lessons.some((l) => l.topic)) return [{ topic: null, items: lessons }];
  const groups = [];
  for (const l of lessons) {
    const last = groups[groups.length - 1];
    if (last && last.topic === (l.topic || null)) last.items.push(l);
    else groups.push({ topic: l.topic || null, items: [l] });
  }
  return groups;
}

/* Uma lição na lista. `done` acende a linha em verde com ✓ (fica assim nos
   próximos acessos, porque a conclusão é gravada); `isNext` destaca a primeira
   ainda não feita. Sem progresso, a linha é exatamente a de antes. */
function LessonRow({ lesson, clientId, index, c, done = false, isNext = false }) {
  const [hover, setHover] = useState(false);
  const navy = c.navy || '#062E2B';
  const accent = c.accent || '#00B04F';
  const gray = c.gray || '#5F7570';
  const grayLight = c.grayLight || '#E2E9E7';

  const border = hover ? accent : done ? '#34C759' : isNext ? accent : grayLight;
  const borderWidth = done || isNext ? 2 : 1;

  return (
    <Link href={`/${clientId}/lesson/${lesson.num}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: `${18 - (borderWidth - 1)}px ${20 - (borderWidth - 1)}px`, background: done ? '#F2FBF5' : '#fff', borderRadius: 14, textDecoration: 'none', color: 'inherit',
        border: `${borderWidth}px solid ${border}`, boxShadow: hover ? '0 10px 30px rgba(6,46,43,0.10)' : '0 1px 3px rgba(6,46,43,0.04)',
        transform: hover ? 'translateX(4px)' : 'none', transition: 'all 0.25s' }}>
      <div style={{ flex: '0 0 46px', height: 46, borderRadius: 12, background: done ? '#34C759' : (c.accentLight || '#E4F7EC'), color: done ? '#fff' : navy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: done ? 21 : 18 }}>
        {done ? '✓' : String(lesson.trackOrder || index + 1).padStart(2, '0')}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: navy, letterSpacing: -0.2 }}>{lesson.title}</div>
        <div style={{ fontSize: 13.5, color: gray, marginTop: 2 }}>{lesson.focus}</div>
        {(done || isNext) && (
          <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 6, color: done ? '#248A3D' : accent }}>
            {done ? '✓ Concluída' : 'Continue aqui →'}
          </div>
        )}
      </div>
      <span style={{ color: accent, fontWeight: 800, fontSize: 18 }}>{hover ? '→' : '›'}</span>
    </Link>
  );
}
