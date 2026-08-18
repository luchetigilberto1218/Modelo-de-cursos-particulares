'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useIdentity, useDoneMap } from '../bakerhughes/progress';
import AluExplica from './AluExplica';

/*
  Home do material assíncrono da FAAP.

  Três ambientes, na ordem em que o aluno deve percorrê-los:
   1. "A casa" — a Fundação e o mundo da educação;
   2. "O seu trabalho" — comercial e atendimento;
   3. "Fora do expediente" — Pop Culture e Mind & Body, com a mesma mecânica de
      exercício, só que em fundo escuro. A ideia é a de mudar de pavilhão numa
      feira: outro ambiente, mesmas regras, ninguém se perde.
*/

const EXPLICA = [
  { title: 'Bem-vindo ao seu inglês na FAAP.', text: 'Este material é seu, para estudar na hora que der. Não é aula: é a fonte que você abre quando precisa resolver alguma coisa em inglês no trabalho.' },
  { title: 'As instruções estão em português.', text: 'Tudo o que pede uma ação está na sua língua. O que está em inglês sempre tem um botão de tradução do lado — e todo áudio tem transcript.' },
  { title: 'Comece pela FAAP.', text: 'As duas primeiras trilhas contam a Fundação e o mundo da educação em inglês. É o vocabulário que aparece em toda conversa com quem vem de fora.' },
  { title: 'Depois vá para a sua trilha.', text: 'Comercial para quem recebe coordenadores e escolas; Atendimento para quem recebe aluno e família. Você pode olhar as duas.' },
  { title: 'E tem a área livre.', text: 'Pop Culture e Mind & Body são para o inglês fora do expediente — séries, música, academia, saúde. Mesmo formato, assunto seu.' },
  { title: 'Cada exercício se corrige sozinho.', text: 'Clique em Corrigir e a resposta aparece na hora, com explicação. Errar aqui é de graça — é para isso que o material existe.' },
];

export default function FaapHome({ course, theme, clientId, student, role }) {
  const c = theme?.colors || {};
  const navy = c.navy || '#0B2E63';
  const navyLight = c.navyLight || '#14418C';
  const accent = c.accent || '#1753D9';
  const teal = c.teal || '#CB142D';
  const gray = c.gray || '#5F6B85';
  const grayLight = c.grayLight || '#E3E8F0';
  const offWhite = c.offWhite || '#F5F7FB';
  const text = c.text || '#1E293B';
  const school = theme?.logos?.school;

  const tracks = course.tracks || [];
  const lessons = course.lessons || [];
  const groupOf = (id) => tracks.find((t) => t.id === id)?.group;
  const byGroup = (g) => tracks.filter((t) => (t.group || 'casa') === g);

  const identity = useIdentity(clientId);
  const doneMap = useDoneMap(identity?.student, clientId);
  const doneTotal = lessons.filter((l) => doneMap[l.num]).length;

  const firstName = (student || '').split(' ')[0];

  return (
    <div style={{ minHeight: '100vh', background: offWhite, color: text, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", WebkitFontSmoothing: 'antialiased' }}>

      {/* Chrome */}
      <div style={{ background: navy, color: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {school && <img src={school} alt="Alumni" style={{ height: 24 }} />}
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>×</span>
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.4 }}>FAAP</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {student && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{student}</span>}
            <LogoutLink gray="rgba(255,255,255,0.55)" />
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', background: navy, color: '#fff', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${theme?.heroImage || '/faapatendimento/img/fachada.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center 40%', opacity: 0.22 }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${navy}EE, ${navyLight}CC)` }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${accent}, ${teal})` }} />
        <div style={{ position: 'relative', maxWidth: 1000, margin: '0 auto', padding: '54px 24px 46px' }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 800, letterSpacing: 1.6, textTransform: 'uppercase', color: accent }}>
            Material de estudo · Time FAAP
          </p>
          <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, letterSpacing: -1, lineHeight: 1.08, maxWidth: 720 }}>
            {firstName ? `Olá, ${firstName}. ` : ''}O inglês da FAAP, no seu ritmo.
          </h1>
          <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: 620 }}>
            {theme?.tagline || 'Uma fonte de consulta e de prática sobre a Fundação, o seu trabalho e o mundo lá fora — sem professor, sem horário, sem prova.'}
          </p>
          <div style={{ marginTop: 22, display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13.5, color: 'rgba(255,255,255,0.72)' }}>
            <span><strong style={{ color: '#fff' }}>{lessons.length}</strong> lições</span>
            <span><strong style={{ color: '#fff' }}>{tracks.length}</strong> trilhas</span>
            {doneTotal > 0 && <span><strong style={{ color: accent }}>{doneTotal}</strong> concluídas por você</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '30px 24px 70px' }}>

        <AluExplica c={c} steps={EXPLICA} student={student} />

        <Group
          kicker="Comece por aqui"
          title="A nossa casa, em inglês"
          lead="A Fundação, o campus e o mundo da educação. É daqui que sai o vocabulário que você usa em qualquer conversa com quem chega de fora."
          tracks={byGroup('casa')} {...{ c, clientId, lessons, doneMap }}
        />

        <Group
          kicker="A sua trilha"
          title="O inglês do seu dia a dia de trabalho"
          lead="Duas trilhas paralelas: receber e conquistar escolas e coordenadores, e receber e acolher aluno e família. Você pode percorrer as duas."
          tracks={byGroup('trabalho')} {...{ c, clientId, lessons, doneMap }}
        />

        <DarkGroup
          kicker="Fora do expediente"
          title="A área livre"
          lead="Mesmos exercícios, mesma mecânica — assunto seu. É como atravessar para outro pavilhão da mesma feira: muda o cenário, não muda a regra do jogo."
          tracks={byGroup('livre')} {...{ c, clientId, lessons, doneMap }}
        />

        <div style={{ marginTop: 40, padding: '20px 22px', borderRadius: 14, background: '#fff', border: `1px solid ${grayLight}`, fontSize: 13.5, color: gray, lineHeight: 1.6 }}>
          Este material é de consulta livre: volte quantas vezes quiser, em qualquer ordem. O seu progresso fica gravado neste navegador —
          se trocar de aparelho, as lições concluídas recomeçam do zero, mas o conteúdo é o mesmo.
        </div>
      </div>
    </div>
  );
}

/* ── grupos de trilhas ── */

function Group({ kicker, title, lead, tracks, c, clientId, lessons, doneMap }) {
  const navy = c.navy || '#0B2E63';
  const accent = c.accent || '#1753D9';
  const gray = c.gray || '#5F6B85';
  if (!tracks.length) return null;
  return (
    <section style={{ marginTop: 40 }}>
      <p style={{ margin: '0 0 8px', fontSize: 11.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: accent }}>{kicker}</p>
      <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(21px, 3vw, 27px)', fontWeight: 800, letterSpacing: -0.5, color: navy }}>{title}</h2>
      <p style={{ margin: '0 0 20px', fontSize: 14.5, lineHeight: 1.6, color: gray, maxWidth: 640 }}>{lead}</p>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {tracks.map((t) => <TrackCard key={t.id} track={t} c={c} clientId={clientId} lessons={lessons} doneMap={doneMap} />)}
      </div>
    </section>
  );
}

function DarkGroup({ kicker, title, lead, tracks, c, clientId, lessons, doneMap }) {
  const navy = c.navy || '#0B2E63';
  const accent = c.accent || '#1753D9';
  if (!tracks.length) return null;
  return (
    <section style={{ marginTop: 46, background: `linear-gradient(140deg, ${c.dark || '#081C3E'}, ${navy})`, borderRadius: 20, padding: '30px 26px 32px', color: '#fff' }}>
      <p style={{ margin: '0 0 8px', fontSize: 11.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: accent }}>{kicker}</p>
      <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(21px, 3vw, 27px)', fontWeight: 800, letterSpacing: -0.5 }}>{title}</h2>
      <p style={{ margin: '0 0 20px', fontSize: 14.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', maxWidth: 640 }}>{lead}</p>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {tracks.map((t) => <TrackCard key={t.id} track={t} c={c} clientId={clientId} lessons={lessons} doneMap={doneMap} dark />)}
      </div>
    </section>
  );
}

function TrackCard({ track, c, clientId, lessons, doneMap, dark }) {
  const navy = c.navy || '#0B2E63';
  const accent = c.accent || '#1753D9';
  const gray = c.gray || '#5F6B85';
  const grayLight = c.grayLight || '#E3E8F0';

  const mine = lessons.filter((l) => l.track === track.id);
  const done = mine.filter((l) => doneMap[l.num]).length;
  const pct = mine.length ? Math.round((done / mine.length) * 100) : 0;
  const href = `/${clientId}/level/${track.level || 'essentials'}/track/${track.id}`;

  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#fff', border: `1px solid ${dark ? 'rgba(255,255,255,0.14)' : grayLight}`, borderRadius: 16, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 132, background: track.image ? `url(${track.image}) center/cover` : `linear-gradient(135deg, ${navy}, ${accent})`, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(11,46,99,0.1), rgba(11,46,99,0.55))` }} />
          <span style={{ position: 'absolute', left: 14, bottom: 12, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', color: '#fff', background: 'rgba(0,0,0,0.28)', padding: '4px 10px', borderRadius: 999 }}>
            {mine.length} {mine.length === 1 ? 'lição' : 'lições'}
          </span>
        </div>
        <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 7px', fontSize: 16.5, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.3, color: dark ? '#fff' : navy }}>{track.name}</h3>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: dark ? 'rgba(255,255,255,0.68)' : gray, flex: 1 }}>{track.description}</p>
          <div style={{ marginTop: 14 }}>
            <div style={{ height: 5, borderRadius: 999, background: dark ? 'rgba(255,255,255,0.14)' : grayLight, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: accent, borderRadius: 999, transition: 'width 0.4s' }} />
            </div>
            <div style={{ marginTop: 7, display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: dark ? 'rgba(255,255,255,0.6)' : gray }}>
              <span>{done > 0 ? `${done} de ${mine.length} concluídas` : 'ainda não começou'}</span>
              <span style={{ color: accent, fontWeight: 700 }}>abrir →</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function LogoutLink({ gray }) {
  const [busy, setBusy] = useState(false);
  return (
    <button type="button" disabled={busy}
      onClick={async () => { setBusy(true); try { await fetch('/api/auth', { method: 'DELETE' }); } catch {} window.location.href = '/login'; }}
      style={{ background: 'transparent', border: 'none', color: gray, fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer', padding: 0 }}>
      sair
    </button>
  );
}
