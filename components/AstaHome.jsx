'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useIdentity, useDoneMap } from './bakerhughes/progress';
import AudioPlayer from './AudioPlayer';

/*
  ASTA — home do programa.

  Ordem da página (a mesma lógica do Baker Hughes, com as peças da ASTA):
    1. hero com os dois logos
    2. os números da empresa
    3. a história — com botão de tradução, como em todo o material
    4. as seis áreas de atuação
    5. as trilhas compartilhadas, compactas, atrás de um botão
    6. a trilha personalizada de quem está logado
    7. o painel da turma — só para RH, apresentador e coordenação
*/

function trackHref(clientId, track) {
  return `/${clientId}/level/${track.level || 'essentials'}/track/${track.id}`;
}

export default function AstaHome({ course, theme, clientId, student, role, lockedTracks = [] }) {
  const c = theme?.colors || {};
  const p = {
    navy: c.navy || '#0E2350',
    navyLight: c.navyLight || '#1B3C8F',
    accent: c.accent || '#AC784A',
    accentHover: c.accentHover || '#96663B',
    accentLight: c.accentLight || '#F4EAE0',
    copper: c.teal || '#C59D7E',
    red: c.red || '#CB142D',
    text: c.text || '#1F1D1A',
    gray: c.gray || '#6B6660',
    grayLight: c.grayLight || '#E3E1DC',
    offWhite: c.offWhite || '#F7F6F3',
  };
  const school = theme?.logos?.school;
  const clientLogo = theme?.logos?.clientWhite || theme?.logos?.client;

  const story = course?.story || {};
  const areas = course?.areas || [];
  const roster = course?.roster || [];
  const allTracks = course?.tracks || [];
  const personal = allTracks.filter((t) => t.owner);
  const shared = allTracks.filter((t) => !t.owner);
  const lessonsOf = (trackId) => (course?.lessons || [])
    .filter((l) => l.track === trackId)
    .sort((a, b) => (a.trackOrder || a.num) - (b.trackOrder || b.num));

  // Painel da turma: quem vê o material inteiro também vê quem já enviou os
  // temas e quem ainda não. Aluno nunca vê esta seção.
  const fullView = ['hr', 'teacher', 'coordinator'].includes(role);

  return (
    <div style={{
      minHeight: '100vh',
      background: p.offWhite,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      WebkitFontSmoothing: 'antialiased',
      color: p.text,
    }}>
      {/* ── HERO ── */}
      <header style={{ position: 'relative', background: `linear-gradient(135deg, ${p.navy} 0%, ${p.navyLight} 100%)`, color: '#fff', overflow: 'hidden' }}>
        {theme?.heroImage && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${theme.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }} />
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${p.accent}, ${p.red})` }} />

        <div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto', padding: '20px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {school && <img src={school} alt="Alumni" style={{ height: 26, width: 'auto' }} />}
              <span style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.25)' }} />
              {clientLogo
                ? <img src={clientLogo} alt="ASTA" style={{ height: 20, width: 'auto' }} />
                : <span style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: 0.3 }}>ASTA</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {student && <span style={{ color: 'rgba(255,255,255,0.62)', fontSize: 13 }}>{student}</span>}
              <Link href={`/${clientId}/search`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>Buscar lições</Link>
            </div>
          </div>

          <div style={{ padding: '34px 0 38px', maxWidth: 720 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: p.copper, margin: '0 0 12px' }}>
              English Programme — by Alumni
            </p>
            <h1 style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', fontWeight: 800, letterSpacing: -1.3, lineHeight: 1.05, margin: '0 0 12px' }}>
              ASTA English Programme
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.5, color: 'rgba(255,255,255,0.76)', margin: 0, maxWidth: 600 }}>
              {theme?.tagline || 'O cobre que move a energia do mundo — agora também em inglês.'}
            </p>
          </div>
        </div>
      </header>

      {/* ── OS NÚMEROS ── */}
      {story.facts?.length > 0 && (
        <section style={{ background: '#fff', borderBottom: `1px solid ${p.grayLight}` }}>
          <div style={{ maxWidth: 1040, margin: '0 auto', padding: '22px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20 }}>
            {story.facts.map((f, i) => (
              <div key={i}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.1, textTransform: 'uppercase', color: p.gray, marginBottom: 5 }}>{f.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.6, color: p.accent, lineHeight: 1.1 }}>{f.value}</div>
                {f.note && <div style={{ fontSize: 12, color: p.gray, marginTop: 3, lineHeight: 1.45 }}>{f.note}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 1. A HISTÓRIA ── */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(36px, 5vw, 56px) 32px 0' }}>
        <SectionKicker c={p}>{story.kicker || 'Comece por aqui'}</SectionKicker>
        <h2 style={{ fontSize: 'clamp(23px, 3vw, 33px)', fontWeight: 800, letterSpacing: -0.7, margin: '0 0 20px', color: p.navy, lineHeight: 1.15 }}>
          {story.title || 'Conheça e aprenda com a história da ASTA'}
        </h2>
        <div style={{ background: '#fff', borderRadius: 14, padding: 'clamp(22px, 3vw, 34px)', border: `1px solid ${p.grayLight}`, boxShadow: '0 2px 20px rgba(14,35,80,0.05)' }}>
          <StoryBlock story={story} c={p} />
          <Link href={trackHref(clientId, { id: 'foundations', level: 'essentials' })} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 22,
            padding: '12px 24px', borderRadius: 999, background: p.accent, color: '#fff',
            fontWeight: 700, fontSize: 14.5, textDecoration: 'none',
          }}>
            Começar pela trilha ASTA &amp; the Copper Industry →
          </Link>
        </div>
      </section>

      {/* ── 2. AS SEIS ÁREAS ── */}
      {areas.length > 0 && (
        <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(38px, 5vw, 56px) 32px 0' }}>
          <SectionKicker c={p}>Vá direto para a sua área</SectionKicker>
          <h2 style={{ fontSize: 'clamp(22px, 2.7vw, 30px)', fontWeight: 800, letterSpacing: -0.6, margin: '0 0 8px', color: p.navy }}>
            As seis áreas de atuação
          </h2>
          <p style={{ fontSize: 15, color: p.gray, margin: '0 0 20px', maxWidth: 660, lineHeight: 1.55 }}>
            Cada área tem o seu mundo — e o seu vocabulário em inglês. Vale espiar a sua, e as outras também.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
            {areas.map((a) => <AreaCard key={a.id} area={a} clientId={clientId} c={p} />)}
          </div>
        </section>
      )}

      {/* ── 3. AS TRILHAS COMPARTILHADAS ── */}
      {shared.length > 0 && (
        <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(38px, 5vw, 56px) 32px 0' }}>
          <SharedTracks tracks={shared} clientId={clientId} c={p} />
        </section>
      )}

      {/* ── 4. TRILHAS PESSOAIS TRAVADAS — só para visitante ── */}
      {personal.length === 0 && lockedTracks.length > 0 && (
        <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(40px, 5vw, 60px) 32px 0' }}>
          <LockedTracks tracks={lockedTracks} c={p} />
        </section>
      )}

      {/* ── 5. A TRILHA DE QUEM ESTÁ LOGADO ── */}
      {personal.length > 0 && (
        <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(40px, 5vw, 60px) 32px 0' }}>
          {personal.length > 1 && (
            <>
              <SectionKicker c={p}>Desenhado pessoa a pessoa</SectionKicker>
              <h2 style={{ fontSize: 'clamp(22px, 2.7vw, 30px)', fontWeight: 800, letterSpacing: -0.6, margin: '0 0 8px', color: p.navy }}>
                As trilhas personalizadas
              </h2>
              <p style={{ fontSize: 15, color: p.gray, margin: '0 0 20px', maxWidth: 660, lineHeight: 1.55 }}>
                Montadas a partir dos temas que cada participante escolheu. Cada aluno enxerga só a sua; nesta conta você vê todas.
              </p>
            </>
          )}
          <div style={{ display: 'grid', gap: 18 }}>
            {personal.map((t) => (
              <MyTrackCard key={t.id} track={t} lessons={lessonsOf(t.id)} clientId={clientId} student={personal.length > 1 ? null : student} c={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── 6. O PAINEL DA TURMA — RH, apresentador e coordenação ── */}
      {fullView && roster.length > 0 && (
        <section style={{ maxWidth: 1040, margin: '0 auto', padding: 'clamp(40px, 5vw, 60px) 32px 0' }}>
          <RosterPanel roster={roster} tracks={allTracks} clientId={clientId} c={p} role={role} />
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background: p.navy, color: 'rgba(255,255,255,0.7)', padding: '34px 32px', marginTop: 'clamp(48px, 7vw, 80px)' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {school && <img src={school} alt="Alumni" style={{ height: 24 }} />}
            {clientLogo && <><span style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.22)' }} /><img src={clientLogo} alt="ASTA" style={{ height: 17 }} /></>}
            <span style={{ fontSize: 13 }}>Fluency applied to business</span>
          </div>
          <Link href={`/${clientId}/search`} style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: 13 }}>Buscar lições</Link>
        </div>
      </footer>
    </div>
  );
}

/* ── peças ── */

function SectionKicker({ c, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <span style={{ height: 2, width: 24, background: c.accent }} />
      <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: c.accent, margin: 0 }}>{children}</p>
    </div>
  );
}

/* A história abre em inglês com dois parágrafos, revela o resto, e tem o botão
   de tradução — o mesmo gesto que existe dentro de cada lição. */
function StoryBlock({ story, c, voiceType = 'gb-male' }) {
  const [open, setOpen] = useState(false);
  const [pt, setPt] = useState(false);
  const texto = pt ? (story.pt || []) : (story.en || []);
  const visible = open ? texto : texto.slice(0, 2);
  // A voz acompanha o idioma que está na tela: em português o AudioPlayer já
  // troca para a voz neural pt-BR sozinho, então basta passar o texto certo.
  const vozPar = pt ? 'pt-br' : voiceType;
  return (
    <div>
      {visible.map((par, i) => (
        <div key={i} style={{ margin: i < visible.length - 1 ? '0 0 16px' : 0 }}>
          <p style={{ fontSize: 16, lineHeight: 1.72, color: pt ? c.gray : '#2E3A45', fontStyle: pt ? 'italic' : 'normal', margin: 0 }}>{par}</p>
          {/* Um botão por parágrafo: a história é o primeiro texto longo que a
              turma lê, e boa parte dela precisa ouvir junto para acompanhar. */}
          <div style={{ marginTop: 7 }}>
            <AudioPlayer text={par} rate={0.92} label="Ouvir" small voiceType={vozPar} preferServer />
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', marginTop: 16 }}>
        <AudioPlayer text={texto.join(' ')} rate={0.92} label={pt ? 'Ouvir tudo em português' : 'Ouvir a história inteira'} small voiceType={vozPar} preferServer />
        {!open && texto.length > 2 && (
          <button onClick={() => setOpen(true)}
            style={{ background: 'none', border: 'none', padding: 0, color: c.accent, fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>
            Continuar lendo a história ↓
          </button>
        )}
        {story.pt?.length > 0 && (
          <button onClick={() => setPt((v) => !v)}
            style={{ padding: '7px 15px', borderRadius: 999, border: `1px solid ${c.grayLight}`, background: pt ? c.accentLight : '#fff', color: c.navy, fontWeight: 700, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>
            {pt ? 'Ver em inglês' : '🇧🇷 Ver tradução'}
          </button>
        )}
      </div>
    </div>
  );
}

/* Card de área: leva direto para a trilha daquela área. `similar` mostra o que
   foi fundido ali dentro, para ninguém procurar uma sétima trilha. */
function AreaCard({ area, clientId, c }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={`/${clientId}/level/essentials/track/${area.track}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', padding: '18px 20px', borderRadius: 12, background: '#fff',
        border: `1px solid ${hover ? c.accent : c.grayLight}`, textDecoration: 'none', color: c.navy,
        boxShadow: hover ? '0 10px 26px rgba(14,35,80,0.10)' : '0 1px 3px rgba(14,35,80,0.04)',
        transform: hover ? 'translateY(-3px)' : 'none', transition: 'all 0.25s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 5 }}>
        <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.25 }}>{area.name}</span>
        {area.short && (
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.7, padding: '3px 8px', borderRadius: 4, background: c.navy, color: '#fff', whiteSpace: 'nowrap' }}>{area.short}</span>
        )}
      </div>
      {area.pt && <div style={{ fontSize: 12.5, color: c.accent, fontWeight: 600, marginBottom: 7 }}>{area.pt}</div>}
      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: c.gray, margin: 0 }}>{area.description}</p>
      {area.similar?.length > 0 && (
        <div style={{ marginTop: 10, fontSize: 11.5, color: c.gray, lineHeight: 1.5 }}>
          <strong style={{ color: c.navy }}>Inclui:</strong> {area.similar.join(' · ')}
        </div>
      )}
    </Link>
  );
}

function SharedTracks({ tracks, clientId, c }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <SectionKicker c={c}>Para todo o time</SectionKicker>
      <h2 style={{ fontSize: 'clamp(22px, 2.7vw, 30px)', fontWeight: 800, letterSpacing: -0.6, margin: '0 0 8px', color: c.navy }}>
        As trilhas do programa
      </h2>
      <p style={{ fontSize: 15, color: c.gray, margin: '0 0 18px', maxWidth: 660, lineHeight: 1.55 }}>
        A história da empresa, as seis áreas e o inglês do dia a dia. Estude na ordem que fizer sentido para o seu trabalho.
      </p>

      <button onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, width: '100%',
          padding: '16px 22px', borderRadius: 12, background: open ? c.accentLight : '#fff',
          border: `1px solid ${open ? c.accent : c.grayLight}`, cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: '0 1px 3px rgba(14,35,80,0.04)', textAlign: 'left',
        }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 16.5, fontWeight: 800, color: c.navy, letterSpacing: -0.2 }}>Ver as {tracks.length} trilhas</span>
          <span style={{ fontSize: 13.5, color: c.gray }}>{open ? 'toque para fechar' : 'compartilhadas com toda a equipe'}</span>
        </span>
        <span style={{ color: c.accent, fontWeight: 800, fontSize: 18, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>⌄</span>
      </button>

      {open && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10, marginTop: 12 }}>
          {tracks.map((t, i) => <CompactTrackCard key={t.id} track={t} index={i} clientId={clientId} c={c} />)}
        </div>
      )}
    </div>
  );
}

function CompactTrackCard({ track, index, clientId, c }) {
  const [hover, setHover] = useState(false);
  const active = track.status === 'active';
  const num = String(index + 1).padStart(2, '0');
  const inner = (
    <div
      onMouseEnter={() => active && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: '100%', background: '#fff', borderRadius: 10, padding: '13px 15px',
        border: `1px solid ${hover ? c.accent : c.grayLight}`,
        boxShadow: hover ? '0 8px 22px rgba(14,35,80,0.10)' : '0 1px 2px rgba(14,35,80,0.03)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.2s',
        opacity: active ? 1 : 0.65,
        display: 'flex', alignItems: 'flex-start', gap: 11,
      }}
    >
      <span style={{ flex: '0 0 auto', fontSize: 15, fontWeight: 800, color: active ? c.accent : '#C4BFB8', fontVariantNumeric: 'tabular-nums', lineHeight: 1.4 }}>{num}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700, letterSpacing: -0.15, color: c.navy, lineHeight: 1.32 }}>{track.name}</span>
        {track.levelLabel && <span style={{ display: 'block', fontSize: 11, color: c.gray, marginTop: 3 }}>{track.levelLabel}</span>}
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

function LockedTracks({ tracks, c }) {
  return (
    <div>
      <SectionKicker c={c}>Desenhado pessoa a pessoa</SectionKicker>
      <h2 style={{ fontSize: 'clamp(22px, 2.7vw, 30px)', fontWeight: 800, letterSpacing: -0.6, margin: '0 0 8px', color: c.navy }}>
        E uma trilha só sua
      </h2>
      <p style={{ fontSize: 15, color: c.gray, margin: '0 0 18px', maxWidth: 680, lineHeight: 1.55 }}>
        Além das trilhas do programa, cada participante recebe uma trilha montada a partir dos
        temas que ele mesmo escolhe. É conteúdo exclusivo de cada pessoa, e por isso fica fechado aqui.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, maxWidth: tracks.length === 1 ? 560 : '100%' }}>
        {tracks.map((t) => (
          <div key={t.key} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', border: `1px dashed ${c.grayLight}`, display: 'flex', alignItems: 'flex-start', gap: 13 }}>
            <span style={{ flex: '0 0 auto', fontSize: 17, lineHeight: 1.2 }} aria-hidden="true">🔒</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: 1.1, textTransform: 'uppercase', color: c.gray, marginBottom: 5 }}>Trilha personalizada</span>
              <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700, letterSpacing: -0.2, color: c.navy, lineHeight: 1.35 }}>{t.label}</span>
              <span style={{ display: 'block', fontSize: 12.5, color: c.gray, marginTop: 6, lineHeight: 1.5 }}>Exclusiva do participante — o conteúdo não abre neste acesso.</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Trilha personalizada com "continue de onde parou". O ponto de retomada vem do
   progresso gravado e, na falta dele, do localStorage da própria lição. */
function MyTrackCard({ track, lessons, clientId, student, c }) {
  const [last, setLast] = useState(null);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`bh:last:${clientId}:${track.id}`);
      if (raw) setLast(JSON.parse(raw));
    } catch { /* sem localStorage, mostra a lição 1 */ }
  }, [clientId, track.id]);

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
  const allDone = lessons.length > 0 && doneCount === lessons.length;
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;
  const firstName = (student || '').split(' ')[0];
  const topics = [...new Set(lessons.map((l) => l.topic).filter(Boolean))];

  return (
    <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${c.grayLight}`, boxShadow: '0 14px 44px rgba(14,35,80,0.10)', background: '#fff' }}>
      <div style={{ background: `linear-gradient(135deg, ${c.navy}, ${c.navyLight})`, color: '#fff', padding: 'clamp(24px, 3.4vw, 34px) clamp(22px, 3.4vw, 38px)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${c.accent}, ${c.red})` }} />
        <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: c.copper, margin: '0 0 10px' }}>
          {firstName ? `Feita para você, ${firstName}` : 'Trilha personalizada'}
        </p>
        <h2 style={{ fontSize: 'clamp(22px, 2.9vw, 30px)', fontWeight: 800, letterSpacing: -0.7, margin: '0 0 10px', lineHeight: 1.12 }}>{track.name}</h2>
        {track.description && (
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.76)', margin: 0, maxWidth: 640 }}>{track.description}</p>
        )}
      </div>

      <div style={{ padding: 'clamp(20px, 3vw, 28px) clamp(22px, 3.4vw, 38px)' }}>
        {target && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: topics.length ? 20 : 0 }}>
            <div style={{ flex: '1 1 250px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: c.accent, marginBottom: 5 }}>
                {allDone ? 'Trilha concluída · revise quando quiser' : resume ? 'Continue de onde parou' : 'Comece por aqui'}
              </div>
              <div style={{ fontSize: 17.5, fontWeight: 700, color: c.navy, letterSpacing: -0.3, lineHeight: 1.3 }}>
                Lição {target.order || 1} · {target.title}
              </div>
              {doneCount > 0 ? (
                <div style={{ marginTop: 9, maxWidth: 320 }}>
                  <div style={{ fontSize: 12.5, color: c.gray, marginBottom: 6 }}>
                    <strong style={{ color: c.navy }}>{doneCount} de {lessons.length}</strong> {doneCount === 1 ? 'concluída' : 'concluídas'} · {pct}%
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: c.grayLight, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${c.accent}, ${c.copper})`, transition: 'width 0.4s' }} />
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 13, color: c.gray, marginTop: 4 }}>{lessons.length} lições · estudo no seu ritmo</div>
              )}
            </div>
            <Link href={`/${clientId}/lesson/${target.num}`} style={{ padding: '12px 24px', borderRadius: 999, background: c.accent, color: '#fff', fontWeight: 700, fontSize: 14.5, textDecoration: 'none' }}>
              {allDone ? 'Revisar →' : resume ? 'Retomar →' : 'Começar →'}
            </Link>
            <Link href={`/${clientId}/level/${track.level || 'essentials'}/track/${track.id}`} style={{ padding: '12px 20px', borderRadius: 999, background: '#fff', color: c.navy, fontWeight: 700, fontSize: 14, textDecoration: 'none', border: `1px solid ${c.grayLight}` }}>
              Ver todas as lições
            </Link>
          </div>
        )}
        {topics.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: c.gray, marginBottom: 9 }}>Os tópicos desta trilha</div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {topics.map((t, i) => (
                <span key={i} style={{ padding: '5px 12px', borderRadius: 999, background: c.accentLight, color: c.navy, fontSize: 12.5, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Painel da turma — RH, apresentador e coordenação.
   Quem já enviou os temas aparece com a trilha e o link. Quem ainda não enviou
   aparece em tom opaco, com o aviso: o nome fica na lista para o RH saber de
   quem cobrar, e nada mais. */
function RosterPanel({ roster, tracks, clientId, c, role }) {
  const comTrilha = roster.filter((p) => p.track);
  const noAguardo = roster.filter((p) => !p.track);
  const trackById = new Map(tracks.map((t) => [t.id, t]));

  return (
    <div>
      <SectionKicker c={c}>{role === 'hr' ? 'Visão RH' : 'Visão de quem conduz'}</SectionKicker>
      <h2 style={{ fontSize: 'clamp(22px, 2.7vw, 30px)', fontWeight: 800, letterSpacing: -0.6, margin: '0 0 8px', color: c.navy }}>
        A turma da ASTA
      </h2>
      <p style={{ fontSize: 15, color: c.gray, margin: '0 0 20px', maxWidth: 680, lineHeight: 1.55 }}>
        {roster.length} participantes. {comTrilha.length} já enviaram os temas e têm trilha personalizada no ar;
        {' '}{noAguardo.length} ainda estão no aguardo do envio dos itens.
      </p>

      <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${c.grayLight}`, overflow: 'hidden' }}>
        {comTrilha.map((p) => {
          const t = trackById.get(p.track);
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 20px', borderBottom: `1px solid ${c.grayLight}`, flexWrap: 'wrap' }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: c.accent, flex: '0 0 auto' }} />
              <span style={{ flex: '1 1 220px', minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: c.navy, letterSpacing: -0.2 }}>{p.name}</span>
                <span style={{ display: 'block', fontSize: 12.5, color: c.gray, marginTop: 2 }}>
                  {p.level ? `${p.level} · ` : ''}{t?.name || p.track}
                </span>
              </span>
              {t && (
                <Link href={`/${clientId}/level/${t.level || 'essentials'}/track/${t.id}`}
                  style={{ padding: '7px 15px', borderRadius: 999, background: c.accentLight, color: c.navy, fontWeight: 700, fontSize: 12.5, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Ver a trilha →
                </Link>
              )}
            </div>
          );
        })}

        {noAguardo.map((p, i) => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '15px 20px',
            borderBottom: i < noAguardo.length - 1 ? `1px solid ${c.grayLight}` : 'none',
            background: '#FBFAF8', opacity: 0.55,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, border: `1.5px solid ${c.gray}`, flex: '0 0 auto' }} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: c.gray, letterSpacing: -0.2 }}>{p.name}</span>
              <span style={{ display: 'block', fontSize: 12.5, color: c.gray, marginTop: 2, fontStyle: 'italic' }}>
                No aguardo do envio dos itens
              </span>
            </span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12.5, color: c.gray, margin: '12px 0 0', lineHeight: 1.55, maxWidth: 680 }}>
        Assim que uma pessoa envia os temas dela, a trilha personalizada é montada e o nome sobe para a lista de cima.
      </p>
    </div>
  );
}
