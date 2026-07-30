'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const STORY = [
  "Baker Hughes is an energy technology company — it builds the technology that helps the world find, produce and move energy, and increasingly produce it in a cleaner way.",
  "The company you know today was born in 2017, when Baker Hughes joined with the oil & gas business of GE. But the real story is much older: the two original companies, Baker and Hughes, started more than a hundred years ago, around 1907 — in the early days of the oil industry in the United States.",
  "Howard Hughes Sr. and R.C. Baker were inventors before they were businessmen. Their drilling tools changed how the world reached oil deep underground. Over a century later, that same engineering spirit drives the company's work in the energy transition — hydrogen, carbon capture and cleaner gas.",
  "Today Baker Hughes works in over 120 countries, with headquarters in Houston and around 55,000 employees. Its purpose is simple to say and big to deliver: \"we take energy forward\" — making it safer, cleaner and more efficient.",
];

function trackHref(clientId, trackId) {
  return `/${clientId}/level/essentials/track/${trackId}`;
}

export default function BakerHughesHome({ course, theme, clientId, student, role }) {
  const c = theme?.colors || {};
  const navy = c.navy || '#062E2B';
  const navyLight = c.navyLight || '#0E4A44';
  const accent = c.accent || '#00B04F';
  const accentLight = c.accentLight || '#E4F7EC';
  const teal = c.teal || '#009CA6';
  const text = c.text || '#20302D';
  const gray = c.gray || '#5F7570';
  const grayLight = c.grayLight || '#E2E9E7';
  const offWhite = c.offWhite || '#F5F8F7';
  const school = theme?.logos?.school;

  const lines = course?.businessLines || [];
  const allTracks = course?.tracks || [];
  // Trilha pessoal (com `owner`) vem destacada no topo; as compartilhadas
  // seguem na grade de sempre.
  const personal = allTracks.filter((t) => t.owner);
  const tracks = allTracks.filter((t) => !t.owner);
  const lessonsOf = (trackId) => (course?.lessons || [])
    .filter((l) => l.track === trackId)
    .sort((a, b) => (a.trackOrder || a.num) - (b.trackOrder || b.num));

  return (
    <div style={{
      minHeight: '100vh',
      background: offWhite,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      color: text,
    }}>
      {/* ── HEADER / HERO ── */}
      <header style={{ position: 'relative', background: `linear-gradient(135deg, ${navy} 0%, ${navyLight} 100%)`, color: '#fff', overflow: 'hidden' }}>
        {theme?.heroImage && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${theme.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${teal})` }} />

        <div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto', padding: '22px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {school && <img src={school} alt="Alumni" style={{ height: 28, width: 'auto' }} />}
              <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.25)' }} />
              <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.3 }}>Baker Hughes</span>
            </div>
            <Link href={`/${clientId}/search`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>Search lessons</Link>
          </div>

          <div style={{ padding: '58px 0 60px', maxWidth: 740 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: accent, margin: '0 0 16px' }}>
              English Programme — by Alumni
            </p>
            <h1 style={{ fontSize: 'clamp(36px, 5.4vw, 58px)', fontWeight: 800, letterSpacing: -1.6, lineHeight: 1.02, margin: '0 0 18px' }}>
              Baker Hughes<br />English Programme
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.5, color: 'rgba(255,255,255,0.8)', margin: '0 0 12px', maxWidth: 620 }}>
              {theme?.tagline || 'Rewriting the energy equation — in English.'}
            </p>
            <p style={{ fontSize: 16.5, lineHeight: 1.55, color: 'rgba(255,255,255,0.68)', margin: 0, maxWidth: 620 }}>
              Um programa no seu ritmo, feito para o seu dia a dia na Baker Hughes.
            </p>
          </div>
        </div>
      </header>

      {/* ── 0. SUA TRILHA (personalizada) ── */}
      {personal.length > 0 && (
        <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(36px, 5vw, 56px) 32px 0' }}>
          {personal.map((t) => (
            <MyTrackCard key={t.id} track={t} lessons={lessonsOf(t.id)} clientId={clientId} student={student}
              navy={navy} navyLight={navyLight} accent={accent} accentLight={accentLight} gray={gray} grayLight={grayLight} teal={teal} />
          ))}
        </section>
      )}

      {/* ── 1. COMPANY STORY (first) ── */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(48px, 7vw, 76px) 32px 8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <span style={{ height: 2, width: 26, background: accent }} />
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: accent, margin: 0 }}>Start here — the company</p>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.6vw, 40px)', fontWeight: 800, letterSpacing: -0.8, margin: '0 0 12px', color: navy }}>
            From 1907 to today
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: gray, margin: '0 0 26px', maxWidth: 620 }}>
            Antes de qualquer lição, conheça a empresa onde você trabalha. Mais de cem anos de história, dois inventores teimosos e um propósito que move a energia do mundo — vale a pena saber.
          </p>
          <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px, 4vw, 44px)', border: `1px solid ${grayLight}`, boxShadow: '0 2px 20px rgba(6,46,43,0.05)' }}>
            {STORY.map((p, i) => (
              <p key={i} style={{ fontSize: 16.5, lineHeight: 1.75, color: '#33443F', margin: i < STORY.length - 1 ? '0 0 15px' : '0 0 26px' }}>{p}</p>
            ))}
            <Link href={trackHref(clientId, 'foundations')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 26px', borderRadius: 6, background: accent, color: '#fff',
              fontWeight: 700, fontSize: 15, textDecoration: 'none', letterSpacing: 0.2,
            }}>
              Começar pela trilha Foundations →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. BUSINESS LINES (then) ── */}
      {lines.length > 0 && (
        <div style={{ background: '#EBF1F0', borderTop: '1px solid #DEE8E6', borderBottom: '1px solid #DEE8E6', margin: 'clamp(40px, 6vw, 64px) 0 0' }}>
        <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(48px, 6vw, 68px) 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <span style={{ height: 2, width: 26, background: accent }} />
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: accent, margin: 0 }}>Jump straight to your area</p>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, letterSpacing: -0.6, margin: '0 0 12px', color: navy }}>
            The business lines
          </h2>
          <p style={{ fontSize: 16, color: gray, margin: '0 0 24px', maxWidth: 660, lineHeight: 1.55 }}>
            A Baker Hughes se organiza em <strong style={{ color: navy }}>business lines</strong> — as grandes áreas de negócio da empresa. Cada uma tem seu próprio mundo (e seu próprio vocabulário em inglês). Vale a pena dar uma espiadinha na sua — e nas outras também.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {lines.map((bl) => (
              <BusinessLineButton key={bl.id} bl={bl} clientId={clientId} navy={navy} accent={accent} grayLight={grayLight} gray={gray} />
            ))}
          </div>
        </section>
        </div>
      )}

      {/* ── 3. TRACKS ── */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(48px, 6vw, 68px) 32px clamp(64px, 8vw, 96px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <span style={{ height: 2, width: 26, background: accent }} />
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: accent, margin: 0 }}>The learning tracks</p>
        </div>
        <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, letterSpacing: -0.6, margin: '0 0 8px', color: navy }}>
          Choose a track
        </h2>
        <p style={{ fontSize: 16, color: gray, margin: '0 0 30px', maxWidth: 640, lineHeight: 1.55 }}>
          Begin with <strong style={{ color: navy }}>Foundations</strong> — the language of the company and the industry. The remaining tracks follow.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {tracks.map((t, i) => (
            <TrackCard key={t.id} track={t} index={i} clientId={clientId} accent={accent} navy={navy} gray={gray} grayLight={grayLight} accentLight={accentLight} />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: navy, color: 'rgba(255,255,255,0.7)', padding: '38px 32px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {school && <img src={school} alt="Alumni" style={{ height: 24 }} />}
            <span style={{ fontSize: 13 }}>Fluency applied to business</span>
          </div>
          <Link href={`/${clientId}/search`} style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: 13 }}>Search lessons</Link>
        </div>
      </footer>
    </div>
  );
}

/* Trilha personalizada do aluno — abre a home com "onde você parou".
   O ponto de retomada vem do localStorage gravado pela própria lição, então
   funciona sem back-end e é privado ao navegador de quem estuda. */
function MyTrackCard({ track, lessons, clientId, student, navy, navyLight, accent, accentLight, gray, grayLight, teal }) {
  const [last, setLast] = useState(null);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`bh:last:${clientId}:${track.id}`);
      if (raw) setLast(JSON.parse(raw));
    } catch { /* sem localStorage, mostra a lição 1 */ }
  }, [clientId, track.id]);

  const first = lessons[0];
  const resume = last && lessons.find((l) => l.num === last.num) ? last : null;
  const target = resume || (first ? { num: first.num, title: first.title, order: 1 } : null);
  const firstName = (student || '').split(' ')[0];
  const topics = [...new Set(lessons.map((l) => l.topic).filter(Boolean))];

  return (
    <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${grayLight}`, boxShadow: '0 12px 40px rgba(6,46,43,0.08)', background: '#fff' }}>
      <div style={{ background: `linear-gradient(135deg, ${navy}, ${navyLight})`, color: '#fff', padding: 'clamp(26px, 4vw, 36px) clamp(24px, 4vw, 40px)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${teal})` }} />
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: accent, margin: '0 0 12px' }}>
          {firstName ? `Sua trilha, ${firstName}` : 'Trilha personalizada'}
        </p>
        <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', fontWeight: 800, letterSpacing: -0.7, margin: '0 0 10px', lineHeight: 1.1 }}>{track.name}</h2>
        {track.description && (
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.78)', margin: 0, maxWidth: 640 }}>{track.description}</p>
        )}
      </div>

      <div style={{ padding: 'clamp(22px, 3vw, 30px) clamp(24px, 4vw, 40px)' }}>
        {target && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', marginBottom: topics.length ? 22 : 0 }}>
            <div style={{ flex: '1 1 260px' }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: accent, marginBottom: 5 }}>
                {resume ? 'Continue de onde parou' : 'Comece por aqui'}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: navy, letterSpacing: -0.3, lineHeight: 1.3 }}>
                Lição {target.order || 1} · {target.title}
              </div>
              <div style={{ fontSize: 13.5, color: gray, marginTop: 4 }}>{lessons.length} lições no total · estudo no seu ritmo</div>
            </div>
            <Link href={`/${clientId}/lesson/${target.num}`} style={{ padding: '13px 26px', borderRadius: 999, background: accent, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              {resume ? 'Retomar →' : 'Começar →'}
            </Link>
            <Link href={`/${clientId}/level/${track.level || 'essentials'}/track/${track.id}`} style={{ padding: '13px 22px', borderRadius: 999, background: '#fff', color: navy, fontWeight: 700, fontSize: 14.5, textDecoration: 'none', border: `1px solid ${grayLight}` }}>
              Ver todas as lições
            </Link>
          </div>
        )}
        {topics.length > 0 && (
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: gray, marginBottom: 10 }}>Os tópicos desta trilha</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {topics.map((t, i) => (
                <span key={i} style={{ padding: '6px 13px', borderRadius: 999, background: accentLight, color: navy, fontSize: 13, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BusinessLineButton({ bl, clientId, navy, accent, grayLight, gray }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={`/${clientId}/lesson/${bl.lesson || 1}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', padding: '20px 22px', borderRadius: 10, background: '#fff',
        border: `1px solid ${hover ? accent : grayLight}`, textDecoration: 'none', color: navy,
        boxShadow: hover ? '0 12px 32px rgba(6,46,43,0.10)' : '0 1px 3px rgba(6,46,43,0.04)',
        transform: hover ? 'translateY(-3px)' : 'none', transition: 'all 0.25s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: -0.2 }}>{bl.name}</span>
        {bl.short && bl.short !== bl.name && (
          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, padding: '3px 9px', borderRadius: 4, background: navy, color: '#fff' }}>{bl.short}</span>
        )}
      </div>
      <p style={{ fontSize: 13.5, lineHeight: 1.5, color: gray, margin: 0 }}>{bl.description}</p>
    </Link>
  );
}

function TrackCard({ track, index, clientId, accent, navy, gray, grayLight, accentLight }) {
  const [hover, setHover] = useState(false);
  const active = track.status === 'active';
  const num = String(index + 1).padStart(2, '0');

  const inner = (
    <div
      onMouseEnter={() => active && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', height: '100%', background: '#fff', borderRadius: 12, padding: '24px 22px 20px',
        border: `1px solid ${hover ? accent : grayLight}`,
        boxShadow: hover ? '0 14px 40px rgba(6,46,43,0.12)' : '0 1px 3px rgba(6,46,43,0.04)',
        transform: hover ? 'translateY(-5px)' : 'none',
        transition: 'transform 0.35s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.35s, border-color 0.25s',
        opacity: active ? 1 : 0.7,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: active ? accent : '#B9C4C1', fontVariantNumeric: 'tabular-nums' }}>{num}</span>
        {active ? (
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4, background: accentLight, color: navy }}>Available</span>
        ) : (
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4, background: '#EEF1F0', color: gray }}>Coming soon</span>
        )}
      </div>
      <h3 style={{ fontSize: 17.5, fontWeight: 700, letterSpacing: -0.3, margin: '0 0 8px', color: navy, lineHeight: 1.25 }}>{track.name}</h3>
      <p style={{ fontSize: 13.5, lineHeight: 1.5, color: gray, margin: 0 }}>{track.description}</p>
      {active && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, fontSize: 14, fontWeight: 700, color: accent }}>
          Enter {hover ? '→' : '›'}
        </span>
      )}
    </div>
  );

  if (!active) return <div style={{ height: '100%' }}>{inner}</div>;
  return <Link href={trackHref(clientId, track.id)} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>{inner}</Link>;
}
