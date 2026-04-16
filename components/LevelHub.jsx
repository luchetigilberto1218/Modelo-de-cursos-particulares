'use client';

import Link from 'next/link';
import { useState } from 'react';
// Grammar & Search quick links are rendered in the header and footer.
import AudioPlayer from './AudioPlayer';

const HISTORY_PARAGRAPHS = [
  "Czarnikow was founded in London in 1861 by Caesar Czarnikow, a young Polish sugar broker who saw an opportunity in the growing British market. From a small office in the City, he began trading sugar from the Caribbean and built trust with refiners across Europe.",
  "Over the following decades, Czarnikow became one of the most respected names in the global sugar trade. The company expanded into new markets, opened offices in different continents, and survived wars, crises and the constant changes of international commerce.",
  "Today, Czarnikow is much more than a sugar broker. It is a smart supply chain partner, helping clients source products, manage financial risk, handle logistics and make better decisions with data and insight.",
  "The group now operates from 13 offices around the world, with teams in Europe, the Americas, Asia and Africa. Czarnikow works with agriculture, food, energy and manufacturing clients, connecting producers and buyers across more than 90 countries.",
  "After more than 160 years, the company keeps the same core idea it started with: trust, expertise and long-term relationships. That is why Czarnikow is still here — and still growing."
];

const FULL_HISTORY = HISTORY_PARAGRAPHS.join(' ');

const LEVELS = [
  { id: 'confidence', name: 'Confidence', tag: 'A0 – A1', accent: '#7FD4F5' },
  { id: 'essentials', name: 'Essentials', tag: 'A1 – A2', accent: '#2AAAE2' },
  { id: 'rise', name: 'Rise', tag: 'B1 – B2', accent: '#1C8FBF' },
  { id: 'apex', name: 'Apex', tag: 'C1 – C2', accent: '#0F6E99' }
];

function LevelCard({ level, clientId }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/${clientId}/level/${level.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 12,
        padding: 'clamp(28px, 5vw, 48px) clamp(20px, 4vw, 32px) clamp(24px, 5vw, 44px)',
        borderRadius: 20,
        background: '#fff',
        textDecoration: 'none',
        color: '#1d1d1f',
        minHeight: 200,
        border: '1px solid #d2d2d7',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: 12, fontWeight: 600, color: '#86868b', letterSpacing: 0.8, textTransform: 'uppercase' }}>
        {level.tag}
      </span>
      <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.8, lineHeight: 1.15, whiteSpace: 'pre-line', color: '#1d1d1f' }}>
        {level.name}
      </span>
      <span style={{
        fontSize: 17,
        fontWeight: 400,
        color: level.accent,
        display: 'flex',
        alignItems: 'center',
        gap: hovered ? 10 : 6,
        transition: 'gap 0.3s',
        marginTop: 4,
      }}>
        Enter
      </span>
    </Link>
  );
}

export default function LevelHub({ course, theme, clientId }) {
  const logos = theme?.logos || {};

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
        padding: '24px 40px',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: '#1d1d1f', letterSpacing: -0.2 }}>
          English Programme
        </span>
        <nav style={{ display: 'flex', gap: 20, fontSize: 14 }}>
          <Link href={`/${clientId}/grammar`} style={{ color: '#0071e3', textDecoration: 'none', fontWeight: 500 }}>
            Grammar
          </Link>
          <Link href={`/${clientId}/search`} style={{ color: '#0071e3', textDecoration: 'none', fontWeight: 500 }}>
            Search
          </Link>
        </nav>
      </header>

      <section style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 64px) 24px clamp(32px, 6vw, 48px)', maxWidth: 680, margin: '0 auto' }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#86868b', marginBottom: 12 }}>Alumni · Czarnikow</p>
        <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 52px)', fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.06, margin: '0 0 14px', color: '#1d1d1f' }}>
          Czarnikow English Programme
        </h1>
        <p style={{ fontSize: 19, color: '#86868b', lineHeight: 1.4, margin: 0 }}>
          Choose your level and start learning.
        </p>
      </section>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        maxWidth: 1080,
        margin: '0 auto',
        padding: '0 24px 60px',
      }}>
        {LEVELS.map((level, i) => (
          <div
            key={level.id}
            style={level.id === 'apex' ? { gridColumn: '2' } : {}}
          >
            <LevelCard level={level} clientId={clientId} />
          </div>
        ))}
      </section>

      <hr style={{ maxWidth: 1080, margin: '0 auto', border: 'none', borderTop: '1px solid #d2d2d7' }} />

      <section style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(40px, 8vw, 72px) 24px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#86868b', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Bem-vindos</p>
        <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, letterSpacing: -0.6, margin: '0 0 28px', color: '#1d1d1f' }}>
          Plataforma de Estudos
        </h2>
        <div style={{ background: '#fff', borderRadius: 20, padding: '36px 40px', color: '#424245', fontSize: 16, lineHeight: 1.7, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #e8e8ed' }}>
          <p style={{ margin: '0 0 14px' }}>Olá, seja muito bem-vindo(a).</p>
          <p style={{ margin: '0 0 14px' }}>Este é o seu ambiente de estudos: o espaço onde você e seu professor acessam o conteúdo que será trabalhado antes e durante cada aula. Fique também à vontade para explorar os materiais sempre que quiser, no seu ritmo.</p>
          <p style={{ margin: '0 0 14px' }}><strong style={{ color: '#1d1d1f' }}>1. Escolha o seu nível.</strong> Os materiais estão organizados em quatro níveis — <strong style={{ color: '#1d1d1f' }}>Confidence</strong>, <strong style={{ color: '#1d1d1f' }}>Essentials</strong>, <strong style={{ color: '#1d1d1f' }}>Rise</strong> e <strong style={{ color: '#1d1d1f' }}>Apex</strong>. Utilize a trilha correspondente ao seu nível.</p>
          <p style={{ margin: '0 0 14px' }}><strong style={{ color: '#1d1d1f' }}>2. Siga a trilha do seu departamento.</strong> Cada trilha corresponde a uma área de atuação da Czarnikow — <strong>RH</strong>, <strong>Trade &amp; Finance</strong>, <strong>Supply Chain</strong>, <strong>Logistics</strong>, <strong>Accounting</strong>, <strong>Fiscal &amp; Taxes</strong> e <strong>Information Technology</strong>. Utilize a trilha do seu departamento: o vocabulário, os exemplos e os exercícios foram pensados para a sua rotina de trabalho.</p>
          <p style={{ margin: '0 0 14px' }}><strong style={{ color: '#1d1d1f' }}>3. Faça as lições em ordem.</strong> Dentro de cada trilha, as lições foram desenhadas de forma progressiva — cada uma prepara o terreno para a seguinte. Avance lição por lição, na sequência, para consolidar o aprendizado.</p>
          <p style={{ margin: '0 0 14px' }}><strong style={{ color: '#1d1d1f' }}>Trilhas complementares.</strong> As trilhas <em>General Business</em> e <em>UK &amp; England</em> não correspondem a departamentos, mas são um convite para você enriquecer a sua experiência com contexto profissional e cultural. Explore quando quiser.</p>
          <p style={{ margin: 0 }}><strong style={{ color: '#1d1d1f' }}>Boa jornada.</strong> Estamos aqui para apoiar o seu desenvolvimento — aproveite cada aula.</p>
        </div>
      </section>

      <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px clamp(40px, 8vw, 72px)' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#86868b', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>About Czarnikow</p>
        <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, letterSpacing: -0.6, margin: '0 0 28px', color: '#1d1d1f' }}>
          From 1861 to today
        </h2>
        <div style={{ background: '#fff', borderRadius: 20, padding: '36px 40px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #e8e8ed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1d1d1f' }}>The Czarnikow story</h3>
            <AudioPlayer text={FULL_HISTORY} rate={0.9} label="Listen" voiceType="james" />
          </div>
          <div style={{ color: '#424245', fontSize: 15, lineHeight: 1.8 }}>
            {HISTORY_PARAGRAPHS.map((p, i) => <p key={i} style={{ margin: i < HISTORY_PARAGRAPHS.length - 1 ? '0 0 14px' : 0 }}>{p}</p>)}
          </div>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '40px 40px 56px', color: '#86868b', fontSize: 13 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 12 }}>
          <Link href={`/${clientId}/grammar`} style={{ color: '#0071e3', textDecoration: 'none' }}>Grammar reference</Link>
          <span style={{ color: '#d2d2d7' }}>·</span>
          <Link href={`/${clientId}/search`} style={{ color: '#0071e3', textDecoration: 'none' }}>Search lessons</Link>
        </div>
        Alumni · Fluência aplicada ao negócio
      </footer>
    </div>
  );
}
