'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useIdentity, useDoneMap } from './bakerhughes/progress';

/*
  Baker Hughes — home do programa.

  Ordem da página (definida com o cliente):
    1. hero curto
    2. a história da empresa — porta de entrada
    3. business lines
    4. as 9 trilhas compartilhadas, compactas, atrás de um botão
    5. a trilha personalizada do aluno — o destaque final
*/

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
  // Trilha com `owner` é pessoal e fecha a página; as sem owner são as
  // compartilhadas, que ficam agrupadas atrás de um botão.
  const personal = allTracks.filter((t) => t.owner);
  const shared = allTracks.filter((t) => !t.owner);
  const lessonsOf = (trackId) => (course?.lessons || [])
    .filter((l) => l.track === trackId)
    .sort((a, b) => (a.trackOrder || a.num) - (b.trackOrder || b.num));

  const palette = { navy, navyLight, accent, accentLight, teal, text, gray, grayLight, offWhite };

  return (
    <div style={{
      minHeight: '100vh',
      background: offWhite,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      color: text,
    }}>
      {/* ── HERO — curto ── */}
      <header style={{ position: 'relative', background: `linear-gradient(135deg, ${navy} 0%, ${navyLight} 100%)`, color: '#fff', overflow: 'hidden' }}>
        {theme?.heroImage && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${theme.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${teal})` }} />

        <div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto', padding: '20px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {school && <img src={school} alt="Alumni" style={{ height: 26, width: 'auto' }} />}
              <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.25)' }} />
              <span style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: 0.3 }}>Baker Hughes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {student && <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{student}</span>}
              <Link href={`/${clientId}/search`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>Search lessons</Link>
            </div>
          </div>

          <div style={{ padding: '34px 0 38px', maxWidth: 700 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: accent, margin: '0 0 12px' }}>
              English Programme — by Alumni
            </p>
            <h1 style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.05, margin: '0 0 12px' }}>
              Baker Hughes English Programme
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.5, color: 'rgba(255,255,255,0.78)', margin: 0, maxWidth: 580 }}>
              {theme?.tagline || 'Rewriting the energy equation — in English.'}
            </p>
          </div>
        </div>
      </header>

      {/* ── 1. A HISTÓRIA — a porta de entrada ── */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(36px, 5vw, 56px) 32px 0' }}>
        <SectionKicker accent={accent}>Comece por aqui</SectionKicker>
        <h2 style={{ fontSize: 'clamp(23px, 3vw, 33px)', fontWeight: 800, letterSpacing: -0.7, margin: '0 0 20px', color: navy, lineHeight: 1.15 }}>
          Conheça e aprenda com a história da Baker Hughes
        </h2>
        <div style={{ background: '#fff', borderRadius: 14, padding: 'clamp(22px, 3vw, 34px)', border: `1px solid ${grayLight}`, boxShadow: '0 2px 20px rgba(6,46,43,0.05)' }}>
          <StoryBlock story={STORY} c={palette} />
          <Link href={trackHref(clientId, 'foundations')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 22,
            padding: '12px 24px', borderRadius: 999, background: accent, color: '#fff',
            fontWeight: 700, fontSize: 14.5, textDecoration: 'none',
          }}>
            Começar pela trilha Foundations →
          </Link>
        </div>
      </section>

      {/* ── 2. BUSINESS LINES ── */}
      {lines.length > 0 && (
        <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(38px, 5vw, 56px) 32px 0' }}>
          <SectionKicker accent={accent}>Jump straight to your area</SectionKicker>
          <h2 style={{ fontSize: 'clamp(22px, 2.7vw, 30px)', fontWeight: 800, letterSpacing: -0.6, margin: '0 0 8px', color: navy }}>
            The business lines
          </h2>
          <p style={{ fontSize: 15, color: gray, margin: '0 0 20px', maxWidth: 640, lineHeight: 1.55 }}>
            Cada área de negócio tem o seu mundo — e o seu vocabulário em inglês. Vale espiar a sua, e as outras também.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
            {lines.map((bl) => (
              <BusinessLineButton key={bl.id} bl={bl} clientId={clientId} navy={navy} accent={accent} grayLight={grayLight} gray={gray} />
            ))}
          </div>
        </section>
      )}

      {/* ── 3. AS TRILHAS COMPARTILHADAS — compactas, atrás de um botão ── */}
      {shared.length > 0 && (
        <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(38px, 5vw, 56px) 32px 0' }}>
          <SharedTracks tracks={shared} clientId={clientId} c={palette} />
        </section>
      )}

      {/* ── 4. A TRILHA DO ALUNO — o destaque final ── */}
      {personal.length > 0 && (
        <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(40px, 5vw, 60px) 32px 0' }}>
          {personal.map((t) => (
            <MyTrackCard key={t.id} track={t} lessons={lessonsOf(t.id)} clientId={clientId} student={student} c={palette} />
          ))}
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background: navy, color: 'rgba(255,255,255,0.7)', padding: '34px 32px', marginTop: 'clamp(48px, 7vw, 80px)' }}>
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

/* ── peças ── */

function SectionKicker({ accent, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <span style={{ height: 2, width: 24, background: accent }} />
      <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: accent, margin: 0 }}>{children}</p>
    </div>
  );
}

/* A história abre com dois parágrafos e revela o resto — a página começa
   leve, mas o texto continua todo lá para quem quiser ler. */
function StoryBlock({ story, c }) {
  const [open, setOpen] = useState(false);
  const visible = open ? story : story.slice(0, 2);
  return (
    <div>
      {visible.map((p, i) => (
        <p key={i} style={{ fontSize: 16, lineHeight: 1.72, color: '#33443F', margin: i < visible.length - 1 ? '0 0 14px' : 0 }}>{p}</p>
      ))}
      {!open && (
        <button onClick={() => setOpen(true)}
          style={{ marginTop: 12, background: 'none', border: 'none', padding: 0, color: c.accent, fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>
          Continuar lendo a história ↓
        </button>
      )}
    </div>
  );
}

/* As 9 trilhas compartilhadas: fechadas por padrão, num grid compacto que
   cabe na tela sem rolar muito. */
function SharedTracks({ tracks, clientId, c }) {
  const [open, setOpen] = useState(false);
  const { navy, accent, accentLight, gray, grayLight } = c;

  return (
    <div>
      <SectionKicker accent={accent}>Para todo o time</SectionKicker>
      <h2 style={{ fontSize: 'clamp(22px, 2.7vw, 30px)', fontWeight: 800, letterSpacing: -0.6, margin: '0 0 8px', color: navy }}>
        As trilhas do programa
      </h2>
      <p style={{ fontSize: 15, color: gray, margin: '0 0 18px', maxWidth: 640, lineHeight: 1.55 }}>
        Nove trilhas abertas a todos, de Foundations a Global Teams. Estude na ordem que fizer sentido para o seu dia.
      </p>

      <button onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, width: '100%',
          padding: '16px 22px', borderRadius: 12, background: open ? accentLight : '#fff',
          border: `1px solid ${open ? accent : grayLight}`, cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: '0 1px 3px rgba(6,46,43,0.04)', textAlign: 'left',
        }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 16.5, fontWeight: 800, color: navy, letterSpacing: -0.2 }}>Ver as {tracks.length} trilhas</span>
          <span style={{ fontSize: 13.5, color: gray }}>{open ? 'toque para fechar' : 'compartilhadas com toda a equipe'}</span>
        </span>
        <span style={{ color: accent, fontWeight: 800, fontSize: 18, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>⌄</span>
      </button>

      {open && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(206px, 1fr))', gap: 10, marginTop: 12 }}>
          {tracks.map((t, i) => (
            <CompactTrackCard key={t.id} track={t} index={i} clientId={clientId} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}

/* Card de trilha enxuto: número, nome e status. A descrição completa vive
   dentro da própria trilha — aqui o que importa é achar a sua rápido. */
function CompactTrackCard({ track, index, clientId, c }) {
  const [hover, setHover] = useState(false);
  const { navy, accent, accentLight, gray, grayLight } = c;
  const active = track.status === 'active';
  const num = String(index + 1).padStart(2, '0');

  const inner = (
    <div
      onMouseEnter={() => active && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: '100%', background: '#fff', borderRadius: 10, padding: '13px 15px',
        border: `1px solid ${hover ? accent : grayLight}`,
        boxShadow: hover ? '0 8px 22px rgba(6,46,43,0.10)' : '0 1px 2px rgba(6,46,43,0.03)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.2s',
        opacity: active ? 1 : 0.65,
        display: 'flex', alignItems: 'flex-start', gap: 11,
      }}
    >
      <span style={{ flex: '0 0 auto', fontSize: 15, fontWeight: 800, color: active ? accent : '#B9C4C1', fontVariantNumeric: 'tabular-nums', lineHeight: 1.4 }}>{num}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700, letterSpacing: -0.15, color: navy, lineHeight: 1.32 }}>{track.name}</span>
        {!active && <span style={{ display: 'block', fontSize: 11, color: gray, marginTop: 3 }}>Coming soon</span>}
      </span>
    </div>
  );

  if (!active) return <div>{inner}</div>;
  return (
    <Link href={`/${clientId}/level/${track.level || 'essentials'}/track/${track.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      {inner}
    </Link>
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
        display: 'block', padding: '17px 19px', borderRadius: 10, background: '#fff',
        border: `1px solid ${hover ? accent : grayLight}`, textDecoration: 'none', color: navy,
        boxShadow: hover ? '0 10px 26px rgba(6,46,43,0.10)' : '0 1px 3px rgba(6,46,43,0.04)',
        transform: hover ? 'translateY(-3px)' : 'none', transition: 'all 0.25s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 15.5, fontWeight: 800, letterSpacing: -0.2 }}>{bl.name}</span>
        {bl.short && bl.short !== bl.name && (
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, padding: '3px 8px', borderRadius: 4, background: navy, color: '#fff' }}>{bl.short}</span>
        )}
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.5, color: gray, margin: 0 }}>{bl.description}</p>
    </Link>
  );
}

/* Trilha personalizada do aluno — fecha a página, com "continue de onde parou".
   O ponto de retomada vem do localStorage gravado pela própria lição, então
   funciona sem back-end e é privado ao navegador de quem estuda.

   Trilha com `status: "inactive"` continua visível e navegável, mas em tom
   arquivado: sem CTA de retomar e com o aviso de trilha pausada. Nada é
   apagado — voltar o status para "active" no course.json restaura tudo. */
function MyTrackCard({ track, lessons, clientId, student, c }) {
  const { navy, navyLight, accent, accentLight, teal, gray, grayLight } = c;
  const inactive = track.status === 'inactive';
  const [last, setLast] = useState(null);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`bh:last:${clientId}:${track.id}`);
      if (raw) setLast(JSON.parse(raw));
    } catch { /* sem localStorage, mostra a lição 1 */ }
  }, [clientId, track.id]);

  // Progresso gravado: manda mais que o "última lição aberta" do localStorage.
  // Com lições concluídas, o botão aponta para a primeira que ainda falta —
  // terminar a lição 1 leva a lição 2, que é o que se espera.
  const identity = useIdentity();
  const doneMap = useDoneMap(identity?.student);
  const doneCount = lessons.filter((l) => doneMap[l.num]).length;
  const nextUndone = lessons.find((l) => !doneMap[l.num]) || null;

  const first = lessons[0];
  const lastOpened = last && lessons.find((l) => l.num === last.num) ? last : null;
  const fromProgress = doneCount > 0 && nextUndone
    ? { num: nextUndone.num, title: nextUndone.title, order: nextUndone.trackOrder || lessons.indexOf(nextUndone) + 1 }
    : null;
  const resume = fromProgress || lastOpened;
  const target = resume || (first ? { num: first.num, title: first.title, order: 1 } : null);
  const allDoneTrack = lessons.length > 0 && doneCount === lessons.length;
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;
  const firstName = (student || '').split(' ')[0];
  const topics = [...new Set(lessons.map((l) => l.topic).filter(Boolean))];

  return (
    <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${grayLight}`, boxShadow: inactive ? '0 6px 22px rgba(6,46,43,0.06)' : '0 14px 44px rgba(6,46,43,0.10)', background: '#fff', opacity: inactive ? 0.94 : 1 }}>
      <div style={{ background: inactive ? 'linear-gradient(135deg, #48524F, #6B7570)' : `linear-gradient(135deg, ${navy}, ${navyLight})`, color: '#fff', padding: 'clamp(24px, 3.4vw, 34px) clamp(22px, 3.4vw, 38px)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: inactive ? 'rgba(255,255,255,0.28)' : `linear-gradient(90deg, ${accent}, ${teal})` }} />
        <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: inactive ? 'rgba(255,255,255,0.72)' : accent, margin: '0 0 10px' }}>
          {inactive
            ? `Trilha inativa${track.inactiveSince ? ` · desde ${track.inactiveSince}` : ''}`
            : (firstName ? `Feita para você, ${firstName}` : 'Trilha personalizada')}
        </p>
        <h2 style={{ fontSize: 'clamp(23px, 3vw, 32px)', fontWeight: 800, letterSpacing: -0.7, margin: '0 0 10px', lineHeight: 1.12 }}>{track.name}</h2>
        {track.description && (
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.76)', margin: 0, maxWidth: 620 }}>{track.description}</p>
        )}
      </div>

      <div style={{ padding: 'clamp(20px, 3vw, 28px) clamp(22px, 3.4vw, 38px)' }}>
        {inactive && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', padding: '14px 18px', borderRadius: 12, background: '#F1F4F3', border: '1px solid #DDE4E2', marginBottom: topics.length || target ? 20 : 0 }}>
            <div style={{ flex: '1 1 260px' }}>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#3D4744', marginBottom: 3 }}>Trilha pausada</div>
              <div style={{ fontSize: 13, color: gray, lineHeight: 1.5 }}>
                {track.inactiveNote || 'O material segue disponível para consulta, mas a trilha não está em andamento.'}
              </div>
            </div>
            <Link href={`/${clientId}/level/${track.level || 'essentials'}/track/${track.id}`} style={{ padding: '10px 20px', borderRadius: 999, background: '#fff', color: '#3D4744', fontWeight: 700, fontSize: 13.5, textDecoration: 'none', border: '1px solid #C9D3D0' }}>
              Ver o material →
            </Link>
          </div>
        )}
        {!inactive && target && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: topics.length ? 20 : 0 }}>
            <div style={{ flex: '1 1 250px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: accent, marginBottom: 5 }}>
                {allDoneTrack ? 'Trilha concluída · revise quando quiser' : resume ? 'Continue de onde parou' : 'Comece por aqui'}
              </div>
              <div style={{ fontSize: 17.5, fontWeight: 700, color: navy, letterSpacing: -0.3, lineHeight: 1.3 }}>
                Lição {target.order || 1} · {target.title}
              </div>
              {doneCount > 0 ? (
                <div style={{ marginTop: 9, maxWidth: 320 }}>
                  <div style={{ fontSize: 12.5, color: gray, marginBottom: 6 }}>
                    <strong style={{ color: navy }}>{doneCount} de {lessons.length}</strong> {doneCount === 1 ? 'concluída' : 'concluídas'} · {pct}%
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: grayLight, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${accent}, ${teal})`, transition: 'width 0.4s' }} />
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 13, color: gray, marginTop: 4 }}>{lessons.length} lições · estudo no seu ritmo</div>
              )}
            </div>
            <Link href={`/${clientId}/lesson/${target.num}`} style={{ padding: '12px 24px', borderRadius: 999, background: accent, color: '#fff', fontWeight: 700, fontSize: 14.5, textDecoration: 'none' }}>
              {allDoneTrack ? 'Revisar →' : resume ? 'Retomar →' : 'Começar →'}
            </Link>
            <Link href={`/${clientId}/level/${track.level || 'essentials'}/track/${track.id}`} style={{ padding: '12px 20px', borderRadius: 999, background: '#fff', color: navy, fontWeight: 700, fontSize: 14, textDecoration: 'none', border: `1px solid ${grayLight}` }}>
              Ver todas as lições
            </Link>
          </div>
        )}
        {topics.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: gray, marginBottom: 9 }}>Os tópicos desta trilha</div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {topics.map((t, i) => (
                <span key={i} style={{ padding: '5px 12px', borderRadius: 999, background: accentLight, color: navy, fontSize: 12.5, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
